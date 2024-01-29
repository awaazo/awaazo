using Backend.Controllers;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using Assert = Xunit.Assert;

namespace Backend.Tests;

/// <summary>
/// Tests the AuthService and AuthController classes.
/// </summary>
[Collection("Sequential")]
public class AuthTests
{

    private Mock<AppDbContext> _dbContextMock;
    private Mock<IAuthService> _authServiceMock;
    private Mock<HttpContext> _httpContextMock;
    private Mock<DbSet<User>> _user;
    private Mock<ILogger<AuthController>> _loggerMock;
    private Mock<HttpRequest> _httpRequestMock;
    private Mock<IMapper> _mapperMock;

    private AuthController _authController;
    private AuthService _authService;
    private EmailService _emailService;
    private const string DOMAIN = "TestDomain";
    private IConfiguration _config;

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
        // VERY SKETCH
        _emailService = new(_config);
        _authService = new(_dbContextMock.Object, _mapperMock.Object, _config, _emailService);
        _authController = new(_config, _authService, _loggerMock.Object) 
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
        // VERY SKETCH
        _emailService = new(_config);
        _authService = new(_dbContextMock.Object, _mapperMock.Object, _config, _emailService);
        _authController = new(_config, _authService, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }
        };

        MockBasicUtilities();
    }

    #region Test Service

    [Fact]
    public void GenerateToken_NullKey_ReturnsException()
    {
        // ARRANGE
        // So as to not mutate global state
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
        }

        // ASSERT
        Assert.Fail("Method did not throw exception");
    }

    [Fact]
    public void GenerateToken_NullIssuer_ReturnsException()
    {
        // ARRANGE
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
        }

        // ASSERT
        Assert.Fail("Method did not throw exception");
    }

    [Fact]
    public void GenerateToken_NullAudience_ReturnsException()

    {
        // ARRANGE
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
        // toDO: Make sure that the password AND userName ARE IN the DB!!!
        // Request
        LoginRequest loginRequest = new()

        {
            Email = "XXXXXXXXXXXXXXXXX",
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
        Assert.IsType<User>(user);
        Assert.NotNull(user);
        Assert.Equal("XXXXXXXXXXXXXXXXX", user!.Email);
        Assert.Equal("XXXXXXXXXXXXXXXXX", user.Username);
    }

    [Fact]
    public async void RegisterAsync_ExistingEmail_ReturnsNull()
    {
        // ARRANGE

        // Request
        //toDo: Make the email ALREADY Exist in the db!!!!
        RegisterRequest registerRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX",
            Username = "XXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = "Male"

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

        RegisterRequest registerRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX1",
            Password = "XXXXXXXXXXXXXXXXX",
            Username = "XXXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = "NoValidGender"
        };
        User? user = null;

        //mapperMock.Setup(m => m.Map<User>(It.IsAny<RegisterRequest>())).Returns(new User()
        //{
        //    Id = Guid.NewGuid(),
        //    Email = "XXXXXXXXXXXXXXXXX1",
        //    Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
        //    Username = "XXXXXXXXXXXXXXXXX",
        //    DateOfBirth = DateTime.Now,
        //    Gender = User.GenderEnum.None,
        //    CreatedAt = DateTime.Now
        //});

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
        Assert.Equal("XXXXXXXXXXXXXXXXX1", user!.Email);
        Assert.Equal(User.GenderEnum.None, user.Gender);
    }

    [Fact]
    public async void RegisterAsync_ValidUser_ReturnsUser()

    {
        // ARRANGE       

        // Request
        RegisterRequest registerRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX1",
            Password = "XXXXXXXXXXXXXXXXX",
            Username = "XXXXXXXXXXXXXXXXX11",
            DateOfBirth = DateTime.Now,
            Gender = "Male"
        };
        User? user = null;


        //mapperMock.Setup(m => m.Map<User>(It.IsAny<RegisterRequest>())).Returns(new User()
        //{
        //    Id = Guid.NewGuid(),
        //    Email = "XXXXXXXXXXXXXXXXX1",
        //    Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
        //    Username = "XXXXXXXXXXXXXXXXX",
        //    DateOfBirth = DateTime.Now,
        //    Gender = User.GenderEnum.Male,
        //    CreatedAt = DateTime.Now
        //});

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
        Assert.Equal("XXXXXXXXXXXXXXXXX1", user!.Email);
        Assert.Equal(User.GenderEnum.Male, user.Gender);
    }

    [Fact]
    public async void IdentifyUserAsync_IdentifiedUser_ReturnsUser()
    {
        // ARRANGE      

        // Request
        //Mock<HttpContext> httpContextMock = new();
        //httpContextMock.SetupGet(hc => hc.User.Identity).Returns(new ClaimsIdentity(claims));
        User? user = null;

        // ACT
        try
        {
            user = await _authService.IdentifyUserAsync(_authController.HttpContext);
        }
        catch(Exception ex) 
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }
        
        // ASSERT
        Assert.IsType<User>(user);
        Assert.NotNull(user);
        Assert.Equal("XXXXXXXXXXXXXXXXX", user!.Email);
        Assert.Equal(User.GenderEnum.Male, user.Gender);
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

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        Mock<DbSet<User>> users = new[]
        {
            new User()
            {
                Id = Guid.NewGuid(),
                Email = "XXXXXXXXXXXXXXXXX",
                Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                Username = "XXXXXXXXXXXXXXXXX",
                DateOfBirth = DateTime.Now,
                Gender = User.GenderEnum.Other
            }
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);

        // Request
        GoogleRequest googleRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Sub = "XXXXXXXXXXXXXXXXX",
            Name = "XXXXXXXXXXXXXXXXX",
            Avatar = "XXXXXXXXXXXXXXXXX",
            Token = "XXXXXXXXXXXXXXXXXX"
        };

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object, config, new EmailService(config));

        // ACT

        var user = await authService.GoogleSSOAsync(googleRequest);


        // ASSERT
        Assert.IsType<User>(user);
        Assert.NotNull(user);

        Assert.Equal("XXXXXXXXXXXXXXXXX", user!.Email);
        Assert.Equal("XXXXXXXXXXXXXXXXX", user.Username);
    }

    [Fact]
    public async void GoogleSSOAsync_NewUser_ReturnsUser()
    {
        // ARRANGE

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        Mock<DbSet<User>> users = new[]
        {
            new User()
            {

                Id = Guid.NewGuid(),

                Email = "XXXXXXXXXXXXXXXXXNewUser1",
                Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                Username = "C",
                DateOfBirth = DateTime.Now,
                DisplayName= "XXXXXXXXXXXXXXXXXNew",
                Avatar= "XXXXXXXXXXXXXXXXX",
                Gender = User.GenderEnum.Other

            }
        }.AsQueryable().BuildMockDbSet();
        Mock<DbSet<Playlist>> playlists = new[]{
            new Playlist(){}
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);

        // Request

        GoogleRequest googleRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXXNewUser@gmail",
            Sub = "XXXXXXXXXXXXXXXXX",
            Name = "XXXXXXXXXXXXXXXXXNew",
            Avatar = "XXXXXXXXXXXXXXXXX"
        };


        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object, config, new EmailService(config));

        // ACT

        var user = await authService.GoogleSSOAsync(googleRequest);


        // ASSERT
        Assert.IsType<User>(user);
        Assert.NotNull(user);

        Assert.Equal("XXXXXXXXXXXXXXXXXNewUser@gmail", user!.Email);
        Assert.Equal("XXXXXXXXXXXXXXXXXNewUser", user.Username);
    }

    #endregion

    #region Test Controller

    [Fact]
    public async void Login_ValidUser_ReturnsOkObjectResult()
    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();
        var httpContext = new DefaultHttpContext();

        // Setup Mocks
        authServiceMock.Setup(svc => svc.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(new User());
        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");


        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            }
        };


        // Create the Request
        LoginRequest loginRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX"
        };

        // ACT
        IActionResult actionResult = await authController.Login(loginRequest);

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]
    public async void Login_InvalidUser_ReturnsBadRequestObjectResult()

    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();
        var httpContext = new DefaultHttpContext();

        // Setup Mocks

        authServiceMock.Setup(svc => svc.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(null as User);

        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            }
        };

        // Create the Request
        LoginRequest loginRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX"
        };

        // ACT
        IActionResult actionResult = await authController.Login(loginRequest);

        // ASSERT

        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    [Fact]
    public async void Register_NewUser_ReturnsOkObjectResult()
    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();
        HttpContext httpContext = new DefaultHttpContext();

        // Setup Mocks
        authServiceMock.Setup(svc => svc.RegisterAsync(It.IsAny<RegisterRequest>())).ReturnsAsync(new User());
        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            }
        };

        // Create the Request
        RegisterRequest registerRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = "Male",
            Username = "XXXXXXXXXXXXXXXXX"
        };

        // ACT
        IActionResult actionResult = await authController.Register(registerRequest);

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]
    public async void Register_InvalidUser_ReturnsBadRequestObjectResult()
    {
        // ARRANGE


        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();

        // Setup Mocks

        authServiceMock.Setup(svc => svc.RegisterAsync(It.IsAny<RegisterRequest>())).ReturnsAsync(null as User);

        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _loggerMock.Object);

        // Create the Request

        RegisterRequest registerRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = "Male",
            Username = "XXXXXXXXXXXXXXXXX"
        };

        // ACT
        IActionResult actionResult = await authController.Register(registerRequest);


        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    [Fact]

    public async void Me_ValidUser_ReturnsOkObjectResult()

    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();
        HttpContext httpContext = new DefaultHttpContext();
        httpContext.Request.Path = "/auth/me";
        httpContext.Request.Host = new HostString("localhost:5000");
        // Setup Mocks

        authServiceMock.Setup(svc => svc.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(new User());

        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            }
        };


        // ACT
        IActionResult actionResult = await authController.Me();

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]

    public async void Me_InvalidUser_ReturnsBadRequestObjectResult()

    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();

        // Setup Mocks

        authServiceMock.Setup(svc => svc.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(null as User);
        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _loggerMock.Object);

        // ACT
        IActionResult actionResult = await authController.Me();

        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    [Fact]
    public async void GoogleSSO_ValidUser_ReturnsOkObjectResult()
    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();
        var httpContext = new DefaultHttpContext();

        // Setup Mocks
        authServiceMock.Setup(svc => svc.GoogleSSOAsync(It.IsAny<GoogleRequest>())).ReturnsAsync(new User());
        authServiceMock.Setup(svc => svc.ValidateGoogleTokenAsync(It.IsAny<string>())).ReturnsAsync(true);
        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            }
        };

        // Create the Request

        GoogleRequest googleRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Name = "XXXXXXXXXXXXXX",
            Sub = "XXXXXXXXXXXXXXXXX",
            Avatar = "XXXXXXXXXXXXXXXXX",
            Token = "XXXXXXXXXXXXXXXXXX"
        };

        // ACT
        IActionResult actionResult = await authController.GoogleSSO(googleRequest);

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    [Fact]
    public async void GoogleSSO_InvalidUser_ReturnsBadRequestObjectResult()
    {

        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();

        // Setup Mocks

        authServiceMock.Setup(svc => svc.GoogleSSOAsync(It.IsAny<GoogleRequest>())).ReturnsAsync(null as User);

        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _loggerMock.Object);


        // Create the Request
        GoogleRequest googleRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Name = "XXXXXXXXXXXXXXXXX",
            Sub = "XXXXXXXXXXXXXXXXX",
            Avatar = "XXXXXXXXXXXXXXXXX"
        };

        // ACT
        IActionResult actionResult = await authController.GoogleSSO(googleRequest);


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
                    Email = "XXXXXXXXXXXXXXXXX",
                    Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                    Username = "XXXXXXXXXXXXXXXXX",
                    DateOfBirth = DateTime.Now,
                    Gender = Models.User.GenderEnum.Male
                }
            }.AsQueryable().BuildMockDbSet();
        var notification = new[]
        {
                new Notification()
                {
                    Id = Guid.NewGuid(),
                    User = _user.Object.First(),
                    UserId = userGuid,
                    IsRead = false,
                    Type = Notification.NotificationType.None
                }
            }.AsQueryable().BuildMockDbSet();

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        _dbContextMock.SetupGet(db => db.Users).Returns(_user.Object);
        _dbContextMock.SetupGet(db => db.Notifications).Returns(notification.Object);
        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

        _httpContextMock.Setup(ctx => ctx.Request).Returns(_httpRequestMock.Object);
        _httpRequestMock.Setup(t => t.IsHttps).Returns(true);
        _httpRequestMock.Setup(t => t.Host).Returns(new HostString(DOMAIN, 1443));

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(_user.Object.First()));
    }
}