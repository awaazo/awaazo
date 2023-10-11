using AutoMapper;
using Backend.Controllers;
using Backend.Controllers.Requests;
using Backend.Helper;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Moq;
using System.Runtime.CompilerServices;

namespace Backend.Tests;

/// <summary>
/// Tests the AuthService class.
/// </summary>
[Collection("Sequential")]
public class AuthTests : IAsyncLifetime
{
    private readonly AuthService _authService;
    private readonly User _user;
    private readonly string _userPassword;
    private readonly AppDbContext _dbContext;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the AuthTests class.
    /// </summary>
    public AuthTests()
    {
        // Connection Type depends on whether we are running in a container or not
        string connectionType = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true" ? "DockerConnection" : "DefaultConnection";
        // Get the connection string from appsettings.json
        string? connectionString = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build()
            .GetConnectionString(connectionType);

        // Create a new instance of the AppDbContext class
        _dbContext = new(connectionString!);

        // Create a new Mapper instance with the required Configuration
        MapperConfiguration mapperConfiguration = new(
            config =>
            {
                config.AddProfile(new AutoMapperProfile());
            });
        _mapper = new Mapper(mapperConfiguration);

        // Auth Service used for testing
        _authService = new AuthService(_dbContext,_mapper);

        // Password used for Testing
        _userPassword = "XXXXXXXXXXX123";

        // User used for Testing
        _user = new()
        {
            Id = Guid.NewGuid(),
            Password = BCrypt.Net.BCrypt.HashPassword(_userPassword),
            Email = "XXXXXXXX123@email.com",
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Other,
            Username = "XXXXXXXX"
        };
    }

    public async Task InitializeAsync()
    {
        await RemoveUserAsync();
    }

    public async Task DisposeAsync()
    {
        await RemoveUserAsync();
    }


    // TEST Service

    /// <summary>
    /// Tests the RegisterAsync method. Given a RegisterRequest object, it should create a new user in the database.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void RegisterAsync_NewUser_Test()
    {
        // ARRANGE
        await RemoveUserAsync();
        RegisterRequest registerRequest = new()
        {
            Email = _user.Email,
            Password = _userPassword,
            DateOfBirth = _user.DateOfBirth,
            Gender = _user.Gender.ToString(),
            Username = _user.Username,
        };

        // ACT
        User? createdUser = _authService.RegisterAsync(registerRequest).Result;
        bool passwordMatch = BCrypt.Net.BCrypt.Verify(_userPassword, createdUser!.Password);

        // ASSERT
        Assert.NotNull(createdUser);
        Assert.IsType<User>(createdUser);
        Assert.Equal(_user.Email, createdUser!.Email);
        Assert.True(passwordMatch);
        Assert.Equal(_user.DateOfBirth, createdUser.DateOfBirth);
        Assert.IsType<Guid>(createdUser.Id);
        Assert.IsType<DateTime>(createdUser.CreatedAt);
        Assert.IsType<DateTime>(createdUser.UpdatedAt);

        // CLEANUP
        await RemoveUserAsync();
    }

    /// <summary>
    /// Tests the RegisterAsync method. Given that the user already exists, the registration should fail.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void RegisterAsync_ExistingUser_Test()
    {
        // ARRANGE
        await CreateUserAsync();
        RegisterRequest registerRequest = new()
        {
            Email = _user.Email,
            Password = _userPassword,
            DateOfBirth = _user.DateOfBirth,
            Gender = _user.Gender.ToString(),
            Username = _user.Username,
        };

        // ACT
        User? createdUser = _authService.RegisterAsync(registerRequest).Result;

        // ASSERT
        Assert.Null(createdUser);

        // CLEANUP
        await RemoveUserAsync();
    }

    /// <summary>
    /// Tests the LoginAsync method. Given a LoginRequest object, it should return a User object with the correct information.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void LoginAsync_ValidCredentials_Test()
    {
        // ARRANGE
        await CreateUserAsync();
        LoginRequest loginRequest = new()
        {
            Email = _user.Email,
            Password = _userPassword
        };

        // ACT
        User? loggedInUser = await _authService.LoginAsync(loginRequest);
        bool passwordMatch = BCrypt.Net.BCrypt.Verify(_userPassword, loggedInUser!.Password);

        // ASSERT
        Assert.NotNull(loggedInUser);
        Assert.IsType<User>(loggedInUser);
        Assert.Equal(_user.Email, loggedInUser!.Email);
        Assert.True(passwordMatch);
        Assert.Equal(_user.DateOfBirth, loggedInUser.DateOfBirth);
        Assert.IsType<Guid>(loggedInUser.Id);
        Assert.IsType<DateTime>(loggedInUser.CreatedAt);
        Assert.IsType<DateTime>(loggedInUser.UpdatedAt);

        // CLEANUP
        await RemoveUserAsync();
    }

    /// <summary>
    /// Tests the LoginAsync method. Given a LoginRequest object, it should return null if the email or password is invalid.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void LoginAsync_InvalidEmail_Test()
    {
        // ARRANGE
        await CreateUserAsync();
        LoginRequest loginRequest = new()
        {
            Email = _user.Email+"123",
            Password = _userPassword
        };

        // ACT
        User? loggedInUser = await _authService.LoginAsync(loginRequest);

        // ASSERT
        Assert.Null(loggedInUser);

        // CLEANUP
        await RemoveUserAsync();
    } 

    /// <summary>
    /// Tests the LoginAsync method. Given a LoginRequest object, it should return null if the email or password is invalid.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void LoginAsync_InvalidPassword_Test()
    {
        // ARRANGE
        await CreateUserAsync();
        LoginRequest loginRequest = new()
        {
            Email = _user.Email,
            Password = _userPassword+"123"
        };

        // ACT
        User? loggedInUser = await _authService.LoginAsync(loginRequest);

        // ASSERT
        Assert.Null(loggedInUser);

        // CLEANUP
        await RemoveUserAsync();
    } 

    // TEST Controller

    /// <summary>
    /// Tests the Login method. Given a LoginRequest object, it should return a OkObjectResult if the user is valid.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void Login_ValidUser_ReturnsOkObjectResult()
    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();

        // Setup Mocks
        authServiceMock.Setup(svc => svc.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(_user);
        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object);

        // Create the Request
        LoginRequest loginRequest = new()
        {
            Email= _user.Email,
            Password= _userPassword
        };

        // ACT
        IActionResult actionResult = await authController.Login(loginRequest);

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    /// <summary>
    /// Tests the Login method. Given a LoginRequest object, it should return a BadRequestObjectResult if the user is invalid.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void Login_InvalidUser_ReturnsBadRequestObjectResult()
    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();

        // Setup Mocks
        authServiceMock.Setup(svc => svc.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(null as User);
        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object);

        // Create the Request
        LoginRequest loginRequest = new()
        {
            Email= _user.Email,
            Password= _userPassword
        };

        // ACT
        IActionResult actionResult = await authController.Login(loginRequest);

        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    /// <summary>
    /// Tests the Register method. Given a RegisterRequest object, it should return a OkObjectResult if the user is valid.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void Register_NewUser_ReturnsOkObjectResult()
    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();

        // Setup Mocks
        authServiceMock.Setup(svc => svc.RegisterAsync(It.IsAny<RegisterRequest>())).ReturnsAsync(_user);
        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object);

        // Create the Request
        RegisterRequest registerRequest = new()
        {
            Email = _user.Email,
            Password = _userPassword,
            DateOfBirth = _user.DateOfBirth,
            Gender = _user.Gender.ToString(),
            Username = _user.Username
        };

        // ACT
        IActionResult actionResult = await authController.Register(registerRequest);

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    /// <summary>
    /// Tests the Register method. Given a RegisterRequest object, it should return a BadRequestObjectResult if the user is invalid.
    /// </summary>
    /// <returns></returns>
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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object);

        // Create the Request
        RegisterRequest registerRequest = new()
        {
            Email = _user.Email,
            Password = _userPassword,
            DateOfBirth = _user.DateOfBirth,
            Gender = _user.Gender.ToString(),
            Username = _user.Username
        };

        // ACT
        IActionResult actionResult = await authController.Register(registerRequest);

        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    /// <summary>
    /// Tests the Me method. Given a valid user, it should return a OkObjectResult.
    /// </summary>
    /// <returns></returns>
    [Fact]
    public async void Me_ValidUser_ReturnsOkObjectResult()
    {
        // ARRANGE

        // Mocks
        Mock<IAuthService> authServiceMock = new();
        Mock<IConfiguration> configurationMock = new();

        // Setup Mocks
        authServiceMock.Setup(svc => svc.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(_user);
        authServiceMock.Setup(svc => svc.GenerateToken(It.IsAny<Guid>(), It.IsAny<IConfiguration>(), It.IsAny<TimeSpan>())).Returns("Token String");

        // Create Controller
        AuthController authController = new(configurationMock.Object, authServiceMock.Object);

        // ACT
        IActionResult actionResult = await authController.Me();

        // ASSERT
        Assert.IsType<OkObjectResult>(actionResult);
    }

    /// <summary>
    /// Tests the Me method. Given an invalid user, it should return a BadRequestObjectResult.
    /// </summary>
    /// <returns></returns>
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
        AuthController authController = new(configurationMock.Object, authServiceMock.Object);

        // ACT
        IActionResult actionResult = await authController.Me();

        // ASSERT
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }


    // Test Helpers
    
    /// <summary>
    /// Creates a new test user in the database.
    /// </summary>
    /// <returns></returns>
    private async Task CreateUserAsync()
    {
        await _dbContext.Users!.AddAsync(_user);
        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Removes the test user from the database.
    /// </summary>
    /// <returns></returns>
    private async Task RemoveUserAsync()
    {
        User? user = await _dbContext.Users!.FirstOrDefaultAsync(u => u.Email == _user.Email);
        if (user is not null)
        {
            _dbContext.Users!.Remove(user);
            await _dbContext.SaveChangesAsync();
        }
    }

}