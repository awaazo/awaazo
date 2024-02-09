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

        // VERY SKETCH. Could accidently send real emails if we are not careful
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

        // VERY SKETCH. Could accidently send real emails if we are not careful
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
        var loginRequest = CreateLoginRequest();
        loginRequest.Email += "Invalid";
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
        var loginRequest = CreateLoginRequest();
        loginRequest.Password += "Invalid";
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
        var loginRequest = CreateLoginRequest();
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
        var registerRequest = CreateRegisterRequest();
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
        string newUsername = USERNAME + "1";
        string newEmail = EMAIL + "1";

        var registerRequest = CreateRegisterRequest();
        registerRequest.Email = newEmail;
        registerRequest.Username = newUsername;
        registerRequest.Gender = "NotAValidGender";

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

        var registerRequest = CreateRegisterRequest();
        registerRequest.Email = newEmail;
        registerRequest.Username = newUsername;

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
        var googleRequest = CreateGoogleRequest();

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
        User? user = null;
        var googleRequest = CreateGoogleRequest();
        googleRequest.Email = "XXXXXXXXXXXXXXXXXNewUser@gmail";
        googleRequest.Name = "XXXXXXXXXXXXXXXXXNew";

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
        _authServiceMock.Setup(svc => svc.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(new User());

        // Create the Request
        var loginRequest = CreateLoginRequest();

        // Need to have a default httpContext
        AuthController authController = CreateDefaultHttpAuthController();

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

        // Create the Request
        LoginRequest loginRequest = CreateLoginRequest();

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
        _authServiceMock.Setup(svc => svc.RegisterAsync(It.IsAny<RegisterRequest>())).ReturnsAsync(new User());

        // Create the Request
        var registerRequest = CreateRegisterRequest();

        // Need to have a default httpContext controller
        AuthController authController = CreateDefaultHttpAuthController();

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
        

        // Create the Request
        var registerRequest = CreateRegisterRequest();

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
        _authServiceMock.Setup(svc => svc.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(new User());

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
        _authServiceMock.Setup(svc => svc.GoogleSSOAsync(It.IsAny<GoogleRequest>())).ReturnsAsync(new User());
        _authServiceMock.Setup(svc => svc.ValidateGoogleTokenAsync(It.IsAny<string>())).ReturnsAsync(true);

        // Create the Request
        var googleRequest = CreateGoogleRequest();

        // Need to have a default httpContext
        AuthController authController = CreateDefaultHttpAuthController();

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

        // Create the Request
        GoogleRequest googleRequest = CreateGoogleRequest();

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

    #region Private Methods
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
        _authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        _dbContextMock.SetupGet(db => db.Users).Returns(_user.Object);
        _dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);

        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

        _httpContextMock.Setup(ctx => ctx.Request).Returns(_httpRequestMock.Object);
        _httpRequestMock.Setup(t => t.IsHttps).Returns(true);
        _httpRequestMock.Setup(t => t.Host).Returns(new HostString(DOMAIN, 1443));       
    }

    private AuthController CreateDefaultHttpAuthController()
    {
        return new AuthController(_config, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }
    
    private LoginRequest CreateLoginRequest()
    {
        return new LoginRequest()
        {
            Email = EMAIL,
            Password = PASSWORD
        };
    }

    private RegisterRequest CreateRegisterRequest()
    {
        return new RegisterRequest()
        {
            Email = EMAIL,
            Password = PASSWORD,
            Username = USERNAME,
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Male.ToString()
        };
    }

    private GoogleRequest CreateGoogleRequest()
    {
        return new GoogleRequest()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Sub = "XXXXXXXXXXXXXXXXX",
            Name = "XXXXXXXXXXXXXXXXX",
            Avatar = "XXXXXXXXXXXXXXXXX",
            Token = "XXXXXXXXXXXXXXXXXX"
        };
    }

    #endregion
}