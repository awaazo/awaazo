using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Backend.Tests;


[Collection("Sequential")]
public class AuthTests : IAsyncLifetime
{
    private readonly AuthService _authService;
    private readonly User _user;
    private readonly AppDbContext _dbContext;

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

        // Auth Service used for testing
        _authService = new AuthService(_dbContext);

        // User used for Testing
        _user = new()
        {
            Id = Guid.NewGuid(),
            Password = "XXXXXXXX123",
            Email = "XXXXXXXX123@email.com",
            DateOfBirth = DateTime.Now
        };
    }

    // TEST Service

    [Fact]
    public async void RegisterAsync_NewUser_Test()
    {
        await Task.Delay(TimeSpan.FromSeconds(5));
        // ARRANGE
        string email = _user.Email!;
        string password = _user.Password!;
        DateTime dateOfBirth = _user.DateOfBirth!;
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        RegisterRequest registerRequest = new()
        {
            Email = email,
            Password = password,
            DateOfBirth = dateOfBirth
        };

        // ACT
        User? createdUser = _authService.RegisterAsync(registerRequest).Result;

        // ASSERT
        Assert.NotNull(createdUser);
        Assert.IsType<User>(createdUser);
        Assert.Equal(email, createdUser!.Email);
        Assert.Equal(passwordHash, createdUser.Password);
        Assert.Equal(dateOfBirth, createdUser.DateOfBirth);
        Assert.IsType<Guid>(createdUser.Id);
        Assert.IsType<DateTime>(createdUser.CreatedAt);
        Assert.IsType<DateTime>(createdUser.UpdatedAt);
    }

    [Fact]
    public async void RegisterAsync_ExistingUser_Test()
    {
        await Task.Delay(TimeSpan.FromSeconds(5));
        // ARRANGE
        string email = _user.Email!;
        string password = _user.Password!;
        DateTime dateOfBirth = _user.DateOfBirth!;
        RegisterRequest registerRequest = new()
        {
            Email = email,
            Password = password,
            DateOfBirth = dateOfBirth
        };

        // ACT
        User? createdUser = _authService.RegisterAsync(registerRequest).Result;

        // ASSERT
        Assert.Null(createdUser);
    }

    [Fact]
    public void Test3()
    {
        // ARRANGE

        // ACT

        // ASSERT
        Assert.True(true);
    }

    public async Task InitializeAsync()
    {
        User? user = await _dbContext.Users!.FirstOrDefaultAsync(u => u.Email == _user.Email);
        if(user is not null)
        {
            _dbContext.Users!.Remove(user);
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task DisposeAsync()
    {
        User? user = await _dbContext.Users!.FirstOrDefaultAsync(u => u.Email == _user.Email);
        if (user is not null)
        {
            _dbContext.Users!.Remove(user);
            await _dbContext.SaveChangesAsync();
        }
    }


    // Test Helpers

}