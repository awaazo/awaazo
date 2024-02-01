using Backend.Controllers;
using Backend.Controllers.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Assert = Xunit.Assert;

namespace Backend.Tests;

/// <summary>
/// Tests the AuthService and AuthController classes.
/// </summary>
[Collection("Sequential")]
public class AuthTests
{
    #region variables and initializers
    
    private Mock<AppDbContext> _dbContextMock;
    private Mock<HttpContext> _httpContextMock;
    private Mock<IAuthService> _authServiceMock;
    private Mock<DbSet<User>> _user;
    private Mock<ILogger<AuthController>> _loggerMock;
    private Mock<HttpRequest> _httpRequestMock;
    private Mock<IMapper> _mapperMock;

    private AuthController _authController;
    private AuthService _authService;
    private EmailService _emailService;
    private const string DOMAIN = "TestDomain";
    private IConfiguration _config;

    private const string USERNAME = "username";
    private const string EMAIL = "test@email.com";
    private const string PASSWORD = "password";

    /// <summary>
    /// Initializes a new instance of the AuthTests class.
    /// </summary>
    public AuthTests()
    {
        // Config
        _config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        // Prevent Null objects in case of no test running
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _httpContextMock = new();
        _httpRequestMock = new();
        _loggerMock = new();
        _mapperMock = new();
        _authServiceMock = new();
        // VERY SKETCH
        _emailService = new(_config);
        _authService = new(_dbContextMock.Object, _mapperMock.Object, _config, _emailService);
        _authController = new(_config, _authServiceMock.Object, _loggerMock.Object) 
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }
        };

        MockBasicUtilities();
    }

    [TestInitialize]
    public void Initialize()
    {
        // Re-initilize every test

        // Config
        _config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();
        

        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _httpContextMock = new();
        _httpRequestMock = new();
        _loggerMock = new();
        _mapperMock = new();
        _authServiceMock = new();
        // VERY SKETCH
        _emailService = new(_config);
        _authService = new(_dbContextMock.Object, _mapperMock.Object, _config, _emailService);
        _authController = new(_config, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }
        };

        MockBasicUtilities();
    }

    #endregion

    #region Test Service

    [Fact]
    public void GenerateToken_NullKey_ReturnsException()
    {
        // ARRANGE
        // So as to not mutate global state
        // Set Key to null
        var testConfig = _config;
        testConfig["Jwt:Key"] = null;

        // ACT
        try
        {
            _authService.GenerateToken(Guid.NewGuid(), testConfig, new TimeSpan());
        }
        catch (Exception ex)
        {
            Assert.Equal("Key is null", ex.Message);
            return;
        }

        // ASSERT
        Assert.Fail("Method did not throw exception");
    }

    [Fact]
    public void GenerateToken_NullIssuer_ReturnsException()
    {
        // ARRANGE
        // So as to not mutate global state
        // Set the Issuer to null
        var testConfig = _config;
        testConfig["Jwt:Issuer"] = null;

        // ACT
        try
        {
            _authService.GenerateToken(Guid.NewGuid(), testConfig, new TimeSpan());
        }
        catch (Exception ex)
        {
            Assert.Equal("Issuer is null", ex.Message);
            return;
        }

        // ASSERT
        Assert.Fail("Method did not throw exception");
    }

    [Fact]
    public void GenerateToken_NullAudience_ReturnsException()

    {
        // ARRANGE
        // So as to not mutate global state
        // Set the Audience to null
        var testConfig = _config;
        testConfig["Jwt:Audience"] = null;

        // ACT
        try
        {
            _authService.GenerateToken(Guid.NewGuid(), testConfig, new TimeSpan());
        }
        catch (Exception ex)
        {
            Assert.Equal("Audience is null", ex.Message);
            return;
        }

        // ASSERT
        Assert.Fail("Method did not throw exception");
    }

    [Fact]
    public void GenerateToken_ValidConfig_ReturnsTokenString()

    {
        // ARRANGE
        string token = "";

        // ACT
        try
        {
            token = _authService.GenerateToken(Guid.NewGuid(), _config, new TimeSpan());
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<string>(token);
        Assert.NotEmpty(token);
    }

    [Fact]
    public async void LoginAsync_InvalidEmail_ReturnsNull()
    {
        // ARRANGE

        // toDO: Make sure that the userName is not in the DB!!!
        // Request
        LoginRequest loginRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX1",
            Password = "XXXXXXXXXXXXXXXXX"
        };
        User? user = null;

        // ACT
        try
        {
            user = await _authService.LoginAsync(loginRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.Null(user);
    }

    [Fact]
    public async void LoginAsync_InvalidPassword_ReturnsNull()
    {
        // ARRANGE
        
        // toDO: Make sure that the password is not in the DB!!!
        // Request
        LoginRequest loginRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX1"
        };
        User? user = null;

        // ACT
        try
        {
            user = await _authService.LoginAsync(loginRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.Null(user);
    }

    [Fact]
    public async void LoginAsync_ValidCredentials_ReturnsUser()

    {
        // ARRANGE
        // Request
        LoginRequest loginRequest = new()
        {
            Email = EMAIL,
            Password = PASSWORD
        };
        User? user = null;

        // ACT
        try
        {
            user = await _authService.LoginAsync(loginRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<User>(user);
        Assert.NotNull(user);
        Assert.Equal(EMAIL, user.Email);
        Assert.Equal(USERNAME, user.Username);
    }

    [Fact]
    public async void RegisterAsync_ExistingEmail_ReturnsNull()
    {
        // ARRANGE

        // Request
        RegisterRequest registerRequest = new()
        {
            Email = EMAIL,
            Password = PASSWORD,
            Username = USERNAME,
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Male.ToString()
        };
        User? user = null;

        // ACT
        try
        {
            user = await _authService.RegisterAsync(registerRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.Null(user);
    }

    [Fact]

    public async void RegisterAsync_InvalidGender_ReturnsUserWithNoneGender()
    {
        // ARRANGE

        // Request
        string newUsername = USERNAME + "1";
        string newEmail = EMAIL + "1";
        RegisterRequest registerRequest = new()
        {
            Email = newEmail,
            Password = PASSWORD,
            Username = newUsername,
            DateOfBirth = DateTime.Now,
            Gender = "NotAValidGender"
        };
        User? user = null;

        _mapperMock.Setup(m => m.Map<User>(It.IsAny<RegisterRequest>())).Returns(new User()
        {
            Id = Guid.NewGuid(),
            Email = newEmail,
            Password = BCrypt.Net.BCrypt.HashPassword(PASSWORD),
            Username = newUsername,
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.None,
            CreatedAt = DateTime.Now
        });

        // ACT

        try
        {
            user = await _authService.RegisterAsync(registerRequest);
        }
        catch(Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }       

        // ASSERT
        Assert.IsType<User>(user);
        Assert.NotNull(user);
        Assert.Equal(newEmail, user!.Email);
        Assert.Equal(User.GenderEnum.None, user.Gender);
    }

    [Fact]
    public async void RegisterAsync_ValidUser_ReturnsUser()
    {
        // ARRANGE       

        string newUsername = USERNAME + "1";
        string newEmail = EMAIL + "1";
        RegisterRequest registerRequest = new()
        {
            Email = newEmail,
            Password = PASSWORD,
            Username = newUsername,
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Male.ToString()
        };
        User? user = null;


        _mapperMock.Setup(m => m.Map<User>(It.IsAny<RegisterRequest>())).Returns(new User()
        {
            Id = Guid.NewGuid(),
            Email = newEmail,
            Password = BCrypt.Net.BCrypt.HashPassword(PASSWORD),
            Username = newUsername,
            DateOfBirth = registerRequest.DateOfBirth,
            Gender = User.GenderEnum.Male,
            CreatedAt = DateTime.Now
        });

        // ACT
        try
        {
            user = await _authService.RegisterAsync(registerRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }
        
        // ASSERT
        Assert.IsType<User>(user);
        Assert.NotNull(user);
        Assert.Equal(newEmail, user.Email);
        Assert.Equal(User.GenderEnum.Male, user.Gender);
    }

    [Fact]
    public async void IdentifyUserAsync_IdentifiedUser_ReturnsUser()
    {
        // ARRANGE      
        User? retrievedUser = null;
        User storedUser = _user.Object.FirstOrDefault()!;
        var guid = storedUser.Id;
        Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, guid.ToString()) };

        // Request
        _httpContextMock.SetupGet(hc => hc.User.Identity).Returns(new ClaimsIdentity(claims));

        // ACT
        try
        {
            retrievedUser = await _authService.IdentifyUserAsync(_authController.HttpContext);
        }
        catch(Exception ex) 
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }
        
        // ASSERT
        Assert.IsType<User>(retrievedUser);
        Assert.NotNull(retrievedUser);
        Assert.Equal(storedUser.Email, retrievedUser.Email);
        Assert.Equal(User.GenderEnum.Male, retrievedUser.Gender);
    }

    [Fact]
    public async void IdentifyUserAsync_UnidentifiedUser_ReturnsNull()
    {
        // ARRANGE
        User? user = null;
        Guid guid = Guid.NewGuid();
        Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, guid.ToString()) };

        // Request
        Mock<HttpContext> httpContextMock = new();
        httpContextMock.SetupGet(hc => hc.User.Identity).Returns(new ClaimsIdentity(claims));

        // ACT
        try
        {
            user = await _authService.IdentifyUserAsync(httpContextMock.Object);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }      

        // ASSERT
        Assert.Null(user);
    }

    [Fact]
    public async void IdentifyUserAsync_NoUserId_ReturnsNull()
    {
        // ARRANGE
        User? user = null;
        // Guid has to be not valid
        Guid guid = Guid.NewGuid();
        Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, guid.ToString() + "1234NotValid") };      

        // Request
        Mock<HttpContext> httpContextMock = new();
        httpContextMock.SetupGet(hc => hc.User.Identity).Returns(new ClaimsIdentity(claims));

        // ACT
        try
        {
            user = await _authService.IdentifyUserAsync(httpContextMock.Object);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.Null(user);
    }

    [Fact]
    public async void GoogleSSOAsync_ExistingUser_ReturnsUser()
    {
        // ARRANGE

        User? user = null;
        // Request
        GoogleRequest googleRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Sub = "XXXXXXXXXXXXXXXXX",
            Name = "XXXXXXXXXXXXXXXXX",
            Avatar = "XXXXXXXXXXXXXXXXX",
            Token = "XXXXXXXXXXXXXXXXXX"
        };


        // ACT
        try
        {
            user = await _authService.GoogleSSOAsync(googleRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }
        
        // ASSERT
        Assert.NotNull(user);
        Assert.IsType<User>(user);
        Assert.Equal("XXXXXXXXXXXXXXXXX", user!.Email);
        Assert.Equal("XXXXXXXXXXXXXXXXX", user.Username);
    }

    [Fact]
    public async void GoogleSSOAsync_NewUser_ReturnsUser()
    {
        // ARRANGE
        // Request
        GoogleRequest googleRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXXNewUser@gmail",
            Sub = "XXXXXXXXXXXXXXXXX",
            Name = "XXXXXXXXXXXXXXXXXNew",
            Avatar = "XXXXXXXXXXXXXXXXX"
        };
        User? user = null;

        // ACT
        try 
        {
            user = await _authService.GoogleSSOAsync(googleRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }
       
        // ASSERT
        Assert.NotNull(user);
        Assert.IsType<User>(user);
        Assert.Equal("XXXXXXXXXXXXXXXXXNewUser@gmail", user!.Email);
        Assert.Equal("XXXXXXXXXXXXXXXXXNewUser", user.Username);
    }

    #endregion

    #region Test Controller

    [Fact]
    public async void Login_ValidUser_ReturnsOkObjectResult()
    {
        // ARRANGE
        IActionResult actionResult = null;
        var httpContext = new DefaultHttpContext();
        _authServiceMock.Setup(svc => svc.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(new User());
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create the Request
        LoginRequest loginRequest = new()
        {
            Email = EMAIL,
            Password = PASSWORD
        };

        // Need to have a default httpContext
        AuthController authController = new(_config, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            }
        };

        // ACT
        try
        {
            actionResult = await authController.Login(loginRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]
    public async void Login_InvalidUser_ReturnsBadRequestObjectResult()

    {
        // ARRANGE
        IActionResult? actionResult = null;

        _authServiceMock.Setup(svc => svc.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(null as User);
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create the Request
        LoginRequest loginRequest = new()
        {
            Email = EMAIL,
            Password = PASSWORD
        };

        // ACT
        try
        {
            actionResult = await _authController.Login(loginRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    [Fact]
    public async void Register_NewUser_ReturnsOkObjectResult()
    {
        // ARRANGE
        IActionResult? actionResult = null;
        var httpContext = new DefaultHttpContext();
        _authServiceMock.Setup(svc => svc.RegisterAsync(It.IsAny<RegisterRequest>())).ReturnsAsync(new User());
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        RegisterRequest registerRequest = new()
        {
            Email = EMAIL,
            Password = PASSWORD,
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Male.ToString(),
            Username = USERNAME
        };

        // Need to have a default httpContext
        AuthController authController = new(_config, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            }
        };

        // ACT
        try
        {
            actionResult = await authController.Register(registerRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]
    public async void Register_InvalidUser_ReturnsBadRequestObjectResult()
    {
        // ARRANGE
        IActionResult? actionResult = null;
        _authServiceMock.Setup(svc => svc.RegisterAsync(It.IsAny<RegisterRequest>())).ReturnsAsync(null as User);
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");


        // Create the Request

        RegisterRequest registerRequest = new()
        {
            Email = EMAIL,
            Password = PASSWORD,
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Male.ToString(),
            Username = USERNAME
        };

        // ACT
        try
        {
            actionResult = await _authController.Register(registerRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    [Fact]

    public async void Me_ValidUser_ReturnsOkObjectResult()

    {
        // ARRANGE
        IActionResult? actionResult = null;
        _httpContextMock.Object.Request.Path = "/auth/me";
        _httpContextMock.Object.Request.Host = new HostString("localhost:5000");
        // Setup Mocks

        _authServiceMock.Setup(svc => svc.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(new User());
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // ACT
        try
        {
            actionResult = await _authController.Me();
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]

    public async void Me_InvalidUser_ReturnsBadRequestObjectResult()

    {
        // ARRANGE
        IActionResult? actionResult = null;
        _authServiceMock.Setup(svc => svc.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(null as User);
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // ACT
        try
        {
            actionResult = await _authController.Me();
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    [Fact]
    public async void GoogleSSO_ValidUser_ReturnsOkObjectResult()
    {
        // ARRANGE
        IActionResult? actionResult = null;
        var httpContext = new DefaultHttpContext();
        _authServiceMock.Setup(svc => svc.GoogleSSOAsync(It.IsAny<GoogleRequest>())).ReturnsAsync(new User());
        _authServiceMock.Setup(svc => svc.ValidateGoogleTokenAsync(It.IsAny<string>())).ReturnsAsync(true);
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");
        // Create the Request

        GoogleRequest googleRequest = new()
        {
            Email = EMAIL,
            Name = USERNAME,
            Sub = "id",
            Avatar = "test.img",
            Token = "Token String"
        };

        // Need to have a default httpContext
        AuthController authController = new(_config, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            }
        };

        // ACT
        try
        {
            actionResult = await authController.GoogleSSO(googleRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]
    public async void GoogleSSO_InvalidUser_ReturnsBadRequestObjectResult()
    {

        // ARRANGE
        IActionResult? actionResult = null;
        _authServiceMock.Setup(svc => svc.GoogleSSOAsync(It.IsAny<GoogleRequest>())).ReturnsAsync(null as User);
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create the Request
        GoogleRequest googleRequest = new()
        {
            Email = EMAIL,
            Name = USERNAME,
            Sub = "id",
            Avatar = "test.img"
        };

        // ACT
        try
        {
            actionResult = await _authController.GoogleSSO(googleRequest);
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    #endregion


    private void MockBasicUtilities()
    {
        var userGuid = Guid.NewGuid();
        _user = new[]
        {
            new User()
            {
                Id = userGuid,
                Email = EMAIL,
                Password = BCrypt.Net.BCrypt.HashPassword(PASSWORD),
                Username = USERNAME,
                DateOfBirth = DateTime.Now,
                Gender = Models.User.GenderEnum.Male
            }
        }.AsQueryable().BuildMockDbSet();

        Mock<DbSet<Playlist>> playlists = new[]{
            new Playlist(){}
        }.AsQueryable().BuildMockDbSet();

        _mapperMock.Setup(m => m.Map<User>(It.IsAny<RegisterRequest>())).Returns(_user.Object.FirstOrDefault()!);

        _dbContextMock.SetupGet(db => db.Users).Returns(_user.Object);
        _dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);

        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

        _httpContextMock.Setup(ctx => ctx.Request).Returns(_httpRequestMock.Object);
        _httpRequestMock.Setup(t => t.IsHttps).Returns(true);
        _httpRequestMock.Setup(t => t.Host).Returns(new HostString(DOMAIN, 1443));       
    }
}