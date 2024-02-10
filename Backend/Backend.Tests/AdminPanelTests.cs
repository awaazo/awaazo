namespace Backend.Tests;

[Collection("Sequential")]
public class AdminPanelTests : IAsyncLifetime
{
    private readonly Mock<Microsoft.Extensions.Logging.ILogger<AuthController>> _IloggerMock;
    /// <summary>
    /// Initializes a new instance of the AuthTests class.
    /// </summary>
    public AdminPanelTests()
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
    public async void GetAllUsers_ReturnsAllUsers()
    {
        // ARRANGE

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        Mock<DbSet<User>> users = new[]
        {
            GenerateRandomUser()
        }.AsQueryable().BuildMockDbSet();
        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

        // Service
        AdminPanelService adminService = new(dbContextMock.Object, config, new EmailService(config));

        // Exception
        Exception? exception = null;
        User[]? result = null;
        // ACT
        try
        {
            result = await adminService.GetAllUsers();
        }
        catch (Exception ex)
        {
            exception = ex;
        }

        // ASSERT
        Assert.Null(exception);
        Assert.NotNull(result);
        Assert.True(result.Length == 1);
    }
    
    [Fact]
    public async void BanUser_InvalidUserID_ReturnsException()
    {
        // ARRANGE

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        Mock<DbSet<User>> users = new[]
        {
            GenerateRandomUser()
        }.AsQueryable().BuildMockDbSet();
        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

        // Service
        AdminPanelService adminService = new(dbContextMock.Object, config, new EmailService(config));

        // Exception
        Exception exception = new();
        User[]? result = null;
        
        User admin = GenerateRandomUser();
        admin.IsAdmin = true;
        
        // ACT
        try
        {
            await adminService.BanUser(admin, Guid.NewGuid());
        }
        catch (InvalidDataException ex)
        {
            exception = ex;
        }

        // ASSERT
        Assert.NotNull(exception);
        Assert.IsType<InvalidDataException>(exception);
    }
    
    [Fact]
    public async void BanUser_Valid_ReturnsOk()
    {
        // ARRANGE

        // Mock
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        Guid userId = Guid.NewGuid();
        User userToban = GenerateRandomUser(userId);
        Mock<DbSet<User>> users = new[]
        {
            userToban
        }.AsQueryable().BuildMockDbSet();
        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

        // Service
        AdminPanelService adminService = new(dbContextMock.Object, config, new EmailService(config));

        // Exception
        Exception? exception = null;
        User[]? result = null;
        
        User admin = GenerateRandomUser();
        admin.IsAdmin = true;
        
        // ACT
        try
        {
            await adminService.BanUser(admin, userId);
        }
        catch (InvalidDataException ex)
        {
            exception = ex;
        }

        // ASSERT
        Assert.Null(exception);
        Assert.NotNull(userToban.DeletedAt);
        Assert.Equal(admin.Id, userToban.DeletedBy);
    } 
    #endregion
    
    private User GenerateRandomUser(Guid? guid = null) {
        return new User() {
            Id = guid ?? Guid.NewGuid(),
            Email = "XXXXXXXXXXXXXXXXX",
            Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
            Username = "XXXXXXXXXXXXXXXXX",
            DateOfBirth = DateTime.Now,
            Gender = User.GenderEnum.Other
        };
    }
}