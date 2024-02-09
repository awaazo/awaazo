using Backend.Controllers.Responses;

namespace Backend.Tests;

/// <summary>
/// Suite of tests for the AnalyticController
/// </summary>
public class AnalyticControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly Mock<IAnalyticService> _analyticServiceMock;
    private readonly Mock<ILogger<AnalyticController>> _loggerMock;
    private readonly Mock<HttpContext> _httpContextMock;
    private readonly AnalyticController _analyticController;

    public AnalyticControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _analyticServiceMock = new Mock<IAnalyticService>();
        _loggerMock = new Mock<ILogger<AnalyticController>>();

        // Setup the HttpContext mock
        _httpContextMock = new Mock<HttpContext>();
        _httpContextMock.Setup(context=>context.Request.IsHttps).Returns(true);
        _httpContextMock.Setup(context=>context.Request.Host).Returns(new HostString("example.com"));

        _analyticController = new AnalyticController(_analyticServiceMock.Object, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = _httpContextMock.Object
            }
        };
    }

    #region Audience Age

    [Fact]
    public async Task GetAverageAudienceAge_ReturnsOkResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service=> service.GetAverageAudienceAgeAsync(podcastOrEpisodeId, user)).ReturnsAsync((uint)30);

        // Act
        var result = await _analyticController.GetAverageAudienceAge(podcastOrEpisodeId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var age = Assert.IsType<uint>(okResult.Value);
        Assert.Equal((uint)30, age);
    }

    [Fact]
    public async Task GetAverageAudienceAge_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetAverageAudienceAge(podcastOrEpisodeId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetAverageAudienceAge_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetAverageAudienceAgeAsync(podcastOrEpisodeId, user)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetAverageAudienceAge(podcastOrEpisodeId);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetAgeRangeInfo_ReturnsOkResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        uint min = 20;
        uint max = 40;
        User user = new ();
        AgeRangeResponse ageRangeResponse = new(
            new List<UserEpisodeInteraction>{
                new (){ User = new (){ DateOfBirth = new DateTime(1990, 1, 1) } },
                new (){ User = new (){ DateOfBirth = new DateTime(1995, 1, 1) } },
        }, 30);

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetAgeRangeInfoAsync(podcastOrEpisodeId, min, max, user)).ReturnsAsync(ageRangeResponse);

        // Act
        var result = await _analyticController.GetAgeRangeInfo(podcastOrEpisodeId, min, max);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var ageRange = Assert.IsType<AgeRangeResponse>(okResult.Value);
        Assert.Equal(ageRangeResponse, ageRange);
    }

    [Fact]
    public async Task GetAgeRangeInfo_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        uint min = 20;
        uint max = 40;
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetAgeRangeInfo(podcastOrEpisodeId, min, max);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetAgeRangeInfo_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        uint min = 20;
        uint max = 40;
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetAgeRangeInfoAsync(podcastOrEpisodeId, min, max, user)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetAgeRangeInfo(podcastOrEpisodeId, min, max);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetAgeRangeDistributionInfo_ReturnsOkResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        uint ageInterval = 10;
        User user = new();
        
        List<AgeRangeResponse> ageRangeResponses = new()
        {
            new(
            new List<UserEpisodeInteraction>{
                new() { User = new User { DateOfBirth = new DateTime(1990, 1, 1) } },
                new() { User = new User { DateOfBirth = new DateTime(1995, 1, 1) } }
            },
            30
        )
        };
        
        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetAgeRangeDistributionInfoAsync(podcastOrEpisodeId, ageInterval, user)).ReturnsAsync(ageRangeResponses);

        // Act
        var result = await _analyticController.GetAgeRangeDistributionInfo(podcastOrEpisodeId, ageInterval);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var ageRanges = Assert.IsType<List<AgeRangeResponse>>(okResult.Value);
        Assert.Equal(ageRangeResponses, ageRanges);
    }

    [Fact]
    public async Task GetAgeRangeDistributionInfo_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        uint ageInterval = 10;
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetAgeRangeDistributionInfo(podcastOrEpisodeId, ageInterval);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetAgeRangeDistributionInfo_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        uint ageInterval = 10;
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetAgeRangeDistributionInfoAsync(podcastOrEpisodeId, ageInterval, user)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetAgeRangeDistributionInfo(podcastOrEpisodeId, ageInterval);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    #endregion Audience Age
}
