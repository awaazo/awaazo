using AutoMapper;
using Backend.Controllers;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualBasic;
using MockQueryable.Moq;
using Moq;
using System.Security.Claims;

namespace Backend.Tests;

/// <summary>
/// Tests the AuthService and AuthController classes.
/// </summary>
[Collection("Sequential")]
public class AuthTests : IAsyncLifetime
{
    private Mock<Microsoft.Extensions.Logging.ILogger> _IloggerMock;
    /// <summary>
    /// Initializes a new instance of the AuthTests class.
    /// </summary>
    public AuthTests()
    {
        _IloggerMock = new();
    }

    public Task InitializeAsync()

    {
        return Task.CompletedTask;
    }

    public Task DisposeAsync()
    {
        return Task.CompletedTask;
    }

    #region Test Service

    [Fact]
    public void GenerateToken_NullKey_ReturnsException()
    {
        // ARRANGE

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        // Set the Key to null
        config["Jwt:Key"] = null;

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // Exception
        object exception = new();

        // ACT
        try
        {
            string token = authService.GenerateToken(Guid.NewGuid(), config, new TimeSpan());
        }
        catch (Exception ex)
        {
            exception = ex;
        }

        // ASSERT
        Assert.IsType<Exception>(exception);
        Assert.Equal("Key is null", (exception as Exception)!.Message);

    }

    [Fact]
    public void GenerateToken_NullIssuer_ReturnsException()
    {
        // ARRANGE

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        // Set the Issuer to null
        config["Jwt:Issuer"] = null;

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // Exception
        object exception = new();

        // ACT
        try
        {
            string token = authService.GenerateToken(Guid.NewGuid(), config, new TimeSpan());
        }
        catch (Exception ex)
        {
            exception = ex;
        }

        // ASSERT
        Assert.IsType<Exception>(exception);
        Assert.Equal("Issuer is null", (exception as Exception)!.Message);
    }

    [Fact]
    public void GenerateToken_NullAudience_ReturnsException()

    {
        // ARRANGE

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();


        // Set the Audience to null
        config["Jwt:Audience"] = null;


        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // Exception
        object exception = new();

        // ACT
        try
        {
            string token = authService.GenerateToken(Guid.NewGuid(), config, new TimeSpan());
        }
        catch (Exception ex)
        {
            exception = ex;
        }

        // ASSERT
        Assert.IsType<Exception>(exception);

        Assert.Equal("Audience is null", (exception as Exception)!.Message);
    }

    [Fact]
    public void GenerateToken_ValidConfig_ReturnsTokenString()

    {
        // ARRANGE

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();


        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT
        var token = authService.GenerateToken(Guid.NewGuid(), config, new TimeSpan());

        // ASSERT
        Assert.IsType<string>(token);
        Assert.NotEmpty(token);
    }

    [Fact]
    public async void LoginAsync_InvalidEmail_ReturnsNull()
    {
        // ARRANGE

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
        LoginRequest loginRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX1",
            Password = "XXXXXXXXXXXXXXXXX"
        };

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT
        var user = await authService.LoginAsync(loginRequest);

        // ASSERT
        Assert.Null(user);
    }

    [Fact]
    public async void LoginAsync_InvalidPassword_ReturnsNull()
    {
        // ARRANGE

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
        LoginRequest loginRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX1"
        };


        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT

        var user = await authService.LoginAsync(loginRequest);

        // ASSERT
        Assert.Null(user);
    }

    [Fact]
    public async void LoginAsync_ValidCredentials_ReturnsUser()

    {
        // ARRANGE

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
        LoginRequest loginRequest = new()

        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX"
        };

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT
        var user = await authService.LoginAsync(loginRequest);

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
        RegisterRequest registerRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX",
            Password = "XXXXXXXXXXXXXXXXX",
            Username = "XXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = "Male"

        };

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT

        var user = await authService.RegisterAsync(registerRequest);


        // ASSERT
        Assert.Null(user);
    }

    [Fact]

    public async void RegisterAsync_InvalidGender_ReturnsUserWithNoneGender()

    {
        // ARRANGE

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

        Mock<DbSet<Playlist>> playlists = new[]{
            new Playlist(){}
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);

        // Request

        RegisterRequest registerRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX1",
            Password = "XXXXXXXXXXXXXXXXX",
            Username = "XXXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = "NoValidGender"
        };

        mapperMock.Setup(m => m.Map<User>(It.IsAny<RegisterRequest>())).Returns(new User()
        {
            Id = Guid.NewGuid(),
            Email = "XXXXXXXXXXXXXXXXX1",
            Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
            Username = "XXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.None,
            CreatedAt = DateTime.Now
        });


        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT
        var user = await authService.RegisterAsync(registerRequest);

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

        Mock<DbSet<Playlist>> playlists = new[]{
            new Playlist(){}
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);

        // Request

        RegisterRequest registerRequest = new()
        {
            Email = "XXXXXXXXXXXXXXXXX1",
            Password = "XXXXXXXXXXXXXXXXX",
            Username = "XXXXXXXXXXXXXXXXX11",
            DateOfBirth = DateTime.Now,
            Gender = "Male"
        };


        mapperMock.Setup(m => m.Map<User>(It.IsAny<RegisterRequest>())).Returns(new User()
        {
            Id = Guid.NewGuid(),
            Email = "XXXXXXXXXXXXXXXXX1",
            Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
            Username = "XXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Male,
            CreatedAt = DateTime.Now
        });


        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT
        var user = await authService.RegisterAsync(registerRequest);

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

        Guid guid = Guid.NewGuid();
        Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, guid.ToString()) };

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        Mock<DbSet<User>> users = new[]
        {
            new User()
            {
                Id = guid,
                Email = "XXXXXXXXXXXXXXXXX",
                Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                Username = "XXXXXXXXXXXXXXXXX",
                DateOfBirth = DateTime.Now,
                Gender = User.GenderEnum.Male
            }
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);

        // Request
        Mock<HttpContext> httpContextMock = new();
        httpContextMock.SetupGet(hc => hc.User.Identity).Returns(new ClaimsIdentity(claims));

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT
        var user = await authService.IdentifyUserAsync(httpContextMock.Object);


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

        Guid guid = Guid.NewGuid();
        Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, guid.ToString()) };


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

                Gender = User.GenderEnum.Male

            }
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);

        // Request

        Mock<HttpContext> httpContextMock = new();
        httpContextMock.SetupGet(hc => hc.User.Identity).Returns(new ClaimsIdentity(claims));

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT
        var user = await authService.IdentifyUserAsync(httpContextMock.Object);

        // ASSERT
        Assert.Null(user);
    }

    [Fact]
    public async void IdentifyUserAsync_NoUserId_ReturnsNull()
    {
        // ARRANGE

        Guid guid = Guid.NewGuid();
        Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, guid.ToString() + "1234NotValid") };

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        Mock<DbSet<User>> users = new[]
        {
            new User()
            {
                Id = guid,
                Email = "XXXXXXXXXXXXXXXXX",
                Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                Username = "XXXXXXXXXXXXXXXXX",
                DateOfBirth = DateTime.Now,
                Gender = User.GenderEnum.Male
            }
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);

        // Request
        Mock<HttpContext> httpContextMock = new();
        httpContextMock.SetupGet(hc => hc.User.Identity).Returns(new ClaimsIdentity(claims));

        // Service
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

        // ACT
        var user = await authService.IdentifyUserAsync(httpContextMock.Object);

        // ASSERT
        Assert.Null(user);
    }

    [Fact]
    public async void GoogleSSOAsync_ExistingUser_ReturnsUser()
    {
        // ARRANGE

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
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

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
        AuthService authService = new(dbContextMock.Object, mapperMock.Object);

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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _IloggerMock.Object)
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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _IloggerMock.Object)
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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _IloggerMock.Object)
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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _IloggerMock.Object);

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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _IloggerMock.Object)
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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _IloggerMock.Object);

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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _IloggerMock.Object)
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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object, _IloggerMock.Object);


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

}