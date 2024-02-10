using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using Assert = Xunit.Assert;

namespace Backend.Tests;

[Collection("Sequential")]
public class AdminPanelTests
{
    private IConfiguration _config;
    private Mock<AppDbContext> _dbContextMock;
    private AdminPanelService _adminService;
    private const string USERNAME = "username";
    private const string EMAIL = "test@email.com";
    private const string PASSWORD = "password";

    /// <summary>
    /// Initializes a new instance of the AuthTests class.
    /// </summary>
    public AdminPanelTests()
    {
        // Config
        _config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        //Mock
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        MockBasicUtilities();
        _adminService = new(_dbContextMock.Object, _config);
    }

    [TestInitialize]
    public void Initialize()
    {
        // Re-initilize every test
        // Config
        _config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        //Mock
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _adminService = new(_dbContextMock.Object, _config);
    }

    #region Test Service

    [Fact]
    public async void GetAllUsers_ReturnsAllUsers()
    {
        // ARRANGE
        // Mock     
        Mock<DbSet<User>> users = new[]
        {
            GenerateStandardUser()
        }.AsQueryable().BuildMockDbSet();
        _dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        User[]? result = null;
        
        // ACT
        try
        {
            result = await _adminService.GetAllUsers();
        }
        catch (Exception ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.NotNull(result);
        Assert.True(result.Length == 1);
    }
    
    [Fact]
    public async void BanUser_InvalidUserID_ReturnsException()
    {
        // ARRANGE
        // Mock
        Mock<DbSet<User>> users = new[]
        {
            GenerateStandardUser()
        }.AsQueryable().BuildMockDbSet();
        _dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        User[]? result = null;

        User admin = GenerateStandardUser();
        admin.IsAdmin = true;
        
        // ACT
        try
        {
            await _adminService.BanUser(admin, Guid.NewGuid());
        }
        catch (InvalidDataException ex)
        {
            Assert.IsType<InvalidDataException>(ex);
            return;
        }

        Assert.Fail("Test did not throw an exception");
    }
    
    [Fact]
    public async void BanUser_Valid_ReturnsOk()
    {
        // ARRANGE
        // Mock
        Guid userId = Guid.NewGuid();
        User userToBan = GenerateStandardUser(userId);
        Mock<DbSet<User>> users = new[]
        {
            userToBan
        }.AsQueryable().BuildMockDbSet();
        _dbContextMock.SetupGet(db => db.Users).Returns(users.Object);

        // Exception    
        User admin = GenerateStandardUser();
        admin.IsAdmin = true;
        
        // ACT
        try
        {
            await _adminService.BanUser(admin, userId);
        }
        catch (InvalidDataException ex)
        {
            Assert.Fail("Method threw exception with this error message: " + ex.Message);
        }

        // ASSERT
        Assert.NotNull(userToBan.DeletedAt);
        Assert.Equal(admin.Id, userToBan.DeletedBy);
    } 
    #endregion
    
    private User GenerateStandardUser(Guid? guid = null) {
        return new User() {
            Id = guid ?? Guid.NewGuid(),
            Email = EMAIL,
            Password = BCrypt.Net.BCrypt.HashPassword(PASSWORD),
            Username = USERNAME,
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Other
        };
    }

    //This is just used since we need to have a userDB created, or the admin controller will complain
    private void MockBasicUtilities()
    {
        Mock<DbSet<User>> users = new[]
        {
            GenerateStandardUser()
        }.AsQueryable().BuildMockDbSet();
        _dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
    }
}