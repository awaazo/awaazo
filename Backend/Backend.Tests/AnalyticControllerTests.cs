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
        _httpContextMock.Setup(context => context.Request.IsHttps).Returns(true);
        _httpContextMock.Setup(context => context.Request.Host).Returns(new HostString("example.com"));

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
        _analyticServiceMock.Setup(service => service.GetAverageAudienceAgeAsync(podcastOrEpisodeId, user)).ReturnsAsync((uint)30);

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
        User user = new();
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

    #region Watch Time

    [Fact]
    public async Task GetAverageWatchTime_ReturnsOkResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetAverageWatchTimeAsync(podcastOrEpisodeId, user)).ReturnsAsync(TimeSpan.FromMinutes(30));

        // Act
        var result = await _analyticController.GetAverageWatchTime(podcastOrEpisodeId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var watchTime = Assert.IsType<TimeSpan>(okResult.Value);
        Assert.Equal(TimeSpan.FromMinutes(30), watchTime);
    }

    [Fact]
    public async Task GetAverageWatchTime_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetAverageWatchTime(podcastOrEpisodeId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetAverageWatchTime_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetAverageWatchTimeAsync(podcastOrEpisodeId, user)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetAverageWatchTime(podcastOrEpisodeId);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetTotalWatchTime_ReturnsOkResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTotalWatchTimeAsync(podcastOrEpisodeId, user)).ReturnsAsync(TimeSpan.FromMinutes(30));

        // Act
        var result = await _analyticController.GetTotalWatchTime(podcastOrEpisodeId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var watchTime = Assert.IsType<TimeSpan>(okResult.Value);
        Assert.Equal(TimeSpan.FromMinutes(30), watchTime);
    }

    [Fact]
    public async Task GetTotalWatchTime_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetTotalWatchTime(podcastOrEpisodeId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetTotalWatchTime_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTotalWatchTimeAsync(podcastOrEpisodeId, user)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetTotalWatchTime(podcastOrEpisodeId);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetWatchTimeRangeInfo_ReturnsOkResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        TimeSpan minWatchTime = TimeSpan.FromMinutes(10);
        TimeSpan maxWatchTime = TimeSpan.FromMinutes(40);
        WatchTimeRangeResponse watchTimeRangeResponse = new()
        {
            MinWatchTime = minWatchTime,
            MaxWatchTime = maxWatchTime
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetWatchTimeRangeInfoAsync(podcastOrEpisodeId, user, minWatchTime, maxWatchTime)).ReturnsAsync(watchTimeRangeResponse);

        // Act
        var result = await _analyticController.GetWatchTimeRangeInfo(podcastOrEpisodeId, (int) minWatchTime.TotalMinutes,(int) maxWatchTime.TotalMinutes);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var watchTimeRange = Assert.IsType<WatchTimeRangeResponse>(okResult.Value);
        Assert.Equal(watchTimeRangeResponse, watchTimeRange);
    }

    [Fact]
    public async Task GetWatchTimeRangeInfo_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User? user = null;
        TimeSpan minWatchTime = TimeSpan.FromMinutes(10);
        TimeSpan maxWatchTime = TimeSpan.FromMinutes(40);

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetWatchTimeRangeInfo(podcastOrEpisodeId,(int) minWatchTime.TotalMinutes, (int)maxWatchTime.TotalMinutes);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetWatchTimeRangeInfo_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        TimeSpan minWatchTime = TimeSpan.FromMinutes(10);
        TimeSpan maxWatchTime = TimeSpan.FromMinutes(40);
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetWatchTimeRangeInfoAsync(podcastOrEpisodeId, user, minWatchTime, maxWatchTime)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetWatchTimeRangeInfo(podcastOrEpisodeId, (int)minWatchTime.TotalMinutes, (int)maxWatchTime.TotalMinutes);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetWatchTimeDistribution_ReturnsOkResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        uint timeInterval = 10;
        bool intervalIsInMinutes = true;
        List<WatchTimeRangeResponse> watchTimeRangeResponses = new()
        {
            new()
            {
                MinWatchTime = TimeSpan.FromMinutes(10),
                MaxWatchTime = TimeSpan.FromMinutes(20),
                TotalWatchTime = TimeSpan.FromMinutes(30),
            }
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetWatchTimeDistributionInfoAsync(podcastOrEpisodeId, user, timeInterval, intervalIsInMinutes)).ReturnsAsync(watchTimeRangeResponses);

        // Act
        var result = await _analyticController.GetWatchTimeDistribution(podcastOrEpisodeId, timeInterval, intervalIsInMinutes);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var watchTimeRanges = Assert.IsType<List<WatchTimeRangeResponse>>(okResult.Value);
        Assert.Equal(watchTimeRangeResponses, watchTimeRanges);
    }

    [Fact]
    public async Task GetWatchTimeDistribution_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User? user = null;
        uint timeInterval = 10;
        bool intervalIsInMinutes = true;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetWatchTimeDistribution(podcastOrEpisodeId, timeInterval, intervalIsInMinutes);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetWatchTimeDistribution_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        uint timeInterval = 10;
        bool intervalIsInMinutes = true;
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetWatchTimeDistributionInfoAsync(podcastOrEpisodeId, user, timeInterval, intervalIsInMinutes)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetWatchTimeDistribution(podcastOrEpisodeId, timeInterval, intervalIsInMinutes);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    #endregion Watch Time

    #region User Engagement Metrics 

    [Fact]
    public async Task GetUserEngagementMetrics_ReturnsOkResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        UserEngagementMetricsResponse userEngagementMetricsResponse = new()
        {
            TotalComments = 10,
            TotalLikes = 20,
            TotalClicks = 30,
            TotalWatchTime = TimeSpan.FromMinutes(40)
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetUserEngagementMetricsAsync(podcastOrEpisodeId, user)).ReturnsAsync(userEngagementMetricsResponse);

        // Act
        var result = await _analyticController.GetUserEngagementMetrics(podcastOrEpisodeId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var userEngagementMetrics = Assert.IsType<UserEngagementMetricsResponse>(okResult.Value);
        Assert.Equal(userEngagementMetricsResponse, userEngagementMetrics);
    }

    [Fact]
    public async Task GetUserEngagementMetrics_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetUserEngagementMetrics(podcastOrEpisodeId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetUserEngagementMetrics_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastOrEpisodeId = Guid.NewGuid();
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetUserEngagementMetricsAsync(podcastOrEpisodeId, user)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetUserEngagementMetrics(podcastOrEpisodeId);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }


    [Fact]
    public async Task GetTopCommented_ReturnsOkResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessCommented = false;
        User user = new();
        List<EpisodeResponse> episodeResponses = new()
        {
            new(),
            new()
        };
        List<PodcastResponse> podcastResponses = new()
        {
            new(),
            new()
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopCommentedEpisodesAsync(podcastId, count, getLessCommented, user, It.IsAny<string>())).ReturnsAsync(episodeResponses);
        _analyticServiceMock.Setup(service => service.GetTopCommentedPodcastsAsync(count, getLessCommented, user, It.IsAny<string>())).ReturnsAsync(podcastResponses);

        // Act
        var result1 = await _analyticController.GetTopCommented(podcastId, count, getLessCommented);
        var result2 = await _analyticController.GetTopCommented(null, count, getLessCommented);

        // Assert
        var okResult1 = Assert.IsType<OkObjectResult>(result1);
        var episodes = Assert.IsType<List<EpisodeResponse>>(okResult1.Value);
        Assert.Equal(episodeResponses, episodes);

        var okResult2 = Assert.IsType<OkObjectResult>(result2);
        var podcasts = Assert.IsType<List<PodcastResponse>>(okResult2.Value);
        Assert.Equal(podcastResponses, podcasts);
    }

    [Fact]
    public async Task GetTopCommented_ReturnsNotFoundResult()
    {
        // Arrange
        int count = 10;
        bool getLessCommented = false;
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetTopCommented(Guid.NewGuid(), count, getLessCommented);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetTopCommented_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessCommented = false;
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopCommentedEpisodesAsync(podcastId, count, getLessCommented, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));
        _analyticServiceMock.Setup(service => service.GetTopCommentedPodcastsAsync(count, getLessCommented, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result1 = await _analyticController.GetTopCommented(podcastId, count, getLessCommented);
        var result2 = await _analyticController.GetTopCommented(null, count, getLessCommented);

        // Assert
        var badRequestResult1 = Assert.IsType<BadRequestObjectResult>(result1);
        Assert.Equal(errorMessage, badRequestResult1.Value);

        var badRequestResult2 = Assert.IsType<BadRequestObjectResult>(result2);
        Assert.Equal(errorMessage, badRequestResult2.Value);
    }

    [Fact]
    public async Task GetTopLiked_ReturnsOkResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessLiked = false;
        User user = new();
        List<EpisodeResponse> episodeResponses = new()
        {
            new(),
            new()
        };
        List<PodcastResponse> podcastResponses = new()
        {
            new(),
            new()
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopLikedEpisodesAsync(podcastId, count, getLessLiked, user, It.IsAny<string>())).ReturnsAsync(episodeResponses);
        _analyticServiceMock.Setup(service => service.GetTopLikedPodcastsAsync(count, getLessLiked, user, It.IsAny<string>())).ReturnsAsync(podcastResponses);

        // Act
        var result1 = await _analyticController.GetTopLiked(podcastId, count, getLessLiked);
        var result2 = await _analyticController.GetTopLiked(null, count, getLessLiked);

        // Assert
        var okResult1 = Assert.IsType<OkObjectResult>(result1);
        var episodes = Assert.IsType<List<EpisodeResponse>>(okResult1.Value);
        Assert.Equal(episodeResponses, episodes);

        var okResult2 = Assert.IsType<OkObjectResult>(result2);
        var podcasts = Assert.IsType<List<PodcastResponse>>(okResult2.Value);
        Assert.Equal(podcastResponses, podcasts);
    }

    [Fact]
    public async Task GetTopLiked_ReturnsNotFoundResult()
    {
        // Arrange
        int count = 10;
        bool getLessLiked = false;
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetTopLiked(Guid.NewGuid(), count, getLessLiked);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetTopLiked_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessLiked = false;
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopLikedEpisodesAsync(podcastId, count, getLessLiked, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));
        _analyticServiceMock.Setup(service => service.GetTopLikedPodcastsAsync(count, getLessLiked, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result1 = await _analyticController.GetTopLiked(podcastId, count, getLessLiked);
        var result2 = await _analyticController.GetTopLiked(null, count, getLessLiked);

        // Assert
        var badRequestResult1 = Assert.IsType<BadRequestObjectResult>(result1);
        Assert.Equal(errorMessage, badRequestResult1.Value);

        var badRequestResult2 = Assert.IsType<BadRequestObjectResult>(result2);
        Assert.Equal(errorMessage, badRequestResult2.Value);
    }

    [Fact]
    public async Task GetTopClicked_ReturnsOkResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessClicked = false;
        User user = new();
        List<EpisodeResponse> episodeResponses = new()
        {
            new(),
            new()
        };
        List<PodcastResponse> podcastResponses = new()
        {
            new(),
            new()
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopClickedEpisodesAsync(podcastId, count, getLessClicked, user, It.IsAny<string>())).ReturnsAsync(episodeResponses);
        _analyticServiceMock.Setup(service => service.GetTopClickedPodcastsAsync(count, getLessClicked, user, It.IsAny<string>())).ReturnsAsync(podcastResponses);

        // Act
        var result1 = await _analyticController.GetTopClicked(podcastId, count, getLessClicked);
        var result2 = await _analyticController.GetTopClicked(null, count, getLessClicked);

        // Assert
        var okResult1 = Assert.IsType<OkObjectResult>(result1);
        var episodes = Assert.IsType<List<EpisodeResponse>>(okResult1.Value);
        Assert.Equal(episodeResponses, episodes);

        var okResult2 = Assert.IsType<OkObjectResult>(result2);
        var podcasts = Assert.IsType<List<PodcastResponse>>(okResult2.Value);
        Assert.Equal(podcastResponses, podcasts);
    }

    [Fact]
    public async Task GetTopClicked_ReturnsNotFoundResult()
    {
        // Arrange
        int count = 10;
        bool getLessClicked = false;
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetTopClicked(Guid.NewGuid(), count, getLessClicked);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetTopClicked_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessClicked = false;
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopClickedEpisodesAsync(podcastId, count, getLessClicked, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));
        _analyticServiceMock.Setup(service => service.GetTopClickedPodcastsAsync(count, getLessClicked, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result1 = await _analyticController.GetTopClicked(podcastId, count, getLessClicked);
        var result2 = await _analyticController.GetTopClicked(null, count, getLessClicked);

        // Assert
        var badRequestResult1 = Assert.IsType<BadRequestObjectResult>(result1);
        Assert.Equal(errorMessage, badRequestResult1.Value);

        var badRequestResult2 = Assert.IsType<BadRequestObjectResult>(result2);
        Assert.Equal(errorMessage, badRequestResult2.Value);
    }

    [Fact]
    public async Task GetTopWatched_ReturnsOkResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessWatched = false;
        User user = new();
        List<EpisodeResponse> episodeResponses = new()
        {
            new(),
            new()
        };
        List<PodcastResponse> podcastResponses = new()
        {
            new(),
            new()
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopWatchedEpisodesAsync(podcastId, count, getLessWatched, user, It.IsAny<string>())).ReturnsAsync(episodeResponses);
        _analyticServiceMock.Setup(service => service.GetTopWatchedPodcastsAsync(count, getLessWatched, user, It.IsAny<string>())).ReturnsAsync(podcastResponses);

        // Act
        var result1 = await _analyticController.GetTopWatched(podcastId, count, getLessWatched);
        var result2 = await _analyticController.GetTopWatched(null, count, getLessWatched);

        // Assert
        var okResult1 = Assert.IsType<OkObjectResult>(result1);
        var episodes = Assert.IsType<List<EpisodeResponse>>(okResult1.Value);
        Assert.Equal(episodeResponses, episodes);

        var okResult2 = Assert.IsType<OkObjectResult>(result2);
        var podcasts = Assert.IsType<List<PodcastResponse>>(okResult2.Value);
        Assert.Equal(podcastResponses, podcasts);
    }

    [Fact]
    public async Task GetTopWatched_ReturnsNotFoundResult()
    {
        // Arrange
        int count = 10;
        bool getLessWatched = false;
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetTopWatched(Guid.NewGuid(), count, getLessWatched);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetTopWatched_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessWatched = false;
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopWatchedEpisodesAsync(podcastId, count, getLessWatched, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));
        _analyticServiceMock.Setup(service => service.GetTopWatchedPodcastsAsync(count, getLessWatched, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result1 = await _analyticController.GetTopWatched(podcastId, count, getLessWatched);
        var result2 = await _analyticController.GetTopWatched(null, count, getLessWatched);

        // Assert
        var badRequestResult1 = Assert.IsType<BadRequestObjectResult>(result1);
        Assert.Equal(errorMessage, badRequestResult1.Value);

        var badRequestResult2 = Assert.IsType<BadRequestObjectResult>(result2);
        Assert.Equal(errorMessage, badRequestResult2.Value);
    }

    #endregion User Engagement Metrics

    [Fact]
    public async Task GetUserAverageWatchTime_ReturnsOkResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        User user = new();
        TimeSpan averageWatchTime = TimeSpan.FromMinutes(30);

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetUserAverageWatchTimeAsync(podcastId, user)).ReturnsAsync(averageWatchTime);

        // Act
        var result = await _analyticController.GetUserAverageWatchTime(podcastId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var watchTime = Assert.IsType<TimeSpan>(okResult.Value);
        Assert.Equal(averageWatchTime, watchTime);
    }

    [Fact]
    public async Task GetUserAverageWatchTime_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetUserAverageWatchTime(podcastId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetUserAverageWatchTime_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetUserAverageWatchTimeAsync(podcastId, user)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetUserAverageWatchTime(podcastId);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetUserTotalWatchTime_ReturnsOkResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        User user = new();
        TimeSpan totalWatchTime = TimeSpan.FromMinutes(30);

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetUserTotalWatchTimeAsync(podcastId, user)).ReturnsAsync(totalWatchTime);

        // Act
        var result = await _analyticController.GetUserTotalWatchTime(podcastId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var watchTime = Assert.IsType<TimeSpan>(okResult.Value);
        Assert.Equal(totalWatchTime, watchTime);
    }

    [Fact]
    public async Task GetUserTotalWatchTime_ReturnsNotFoundResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetUserTotalWatchTime(podcastId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetUserTotalWatchTime_ReturnsBadRequestResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetUserTotalWatchTimeAsync(podcastId, user)).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetUserTotalWatchTime(podcastId);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetTopWatchedByUser_ReturnsOkResult()
    {
        // Arrange
        Guid podcastId = Guid.NewGuid();
        int count = 10;
        bool getLessWatched = false;
        User user = new();
        List<EpisodeResponse> episodeResponses = new()
        {
            new(),
            new()
        };
        List<PodcastResponse> podcastResponses = new()
        {
            new(),
            new()
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopWatchedEpisodesByUserAsync(count, getLessWatched, user, It.IsAny<string>(),It.IsAny<int>(), It.IsAny<int>())).ReturnsAsync(episodeResponses);
        _analyticServiceMock.Setup(service => service.GetTopWatchedPodcastsByUserAsync(count, getLessWatched, user, It.IsAny<string>(),It.IsAny<int>(), It.IsAny<int>())).ReturnsAsync(podcastResponses);

        // Act
        var result1 = await _analyticController.GetTopWatched(true, count, getLessWatched,1,10);
        var result2 = await _analyticController.GetTopWatched(false, count, getLessWatched,1,10);

        // Assert
        var okResult1 = Assert.IsType<OkObjectResult>(result1);
        var episodes = Assert.IsType<List<EpisodeResponse>>(okResult1.Value);
        Assert.Equal(episodeResponses, episodes);

        var okResult2 = Assert.IsType<OkObjectResult>(result2);
        var podcasts = Assert.IsType<List<PodcastResponse>>(okResult2.Value);
        Assert.Equal(podcastResponses, podcasts);
    }

    

    [Fact]
    public async Task GetListeningHistory_ReturnsOkResult()
    {
        // Arrange
        User user = new();
        List<EpisodeResponse> listeningHistoryResponses = new()
        {
            new(),
            new()
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetUserListeningHistoryAsync(It.IsAny<User>(),It.IsAny<string>(),It.IsAny<int>(),It.IsAny<int>())).ReturnsAsync(listeningHistoryResponses);

        // Act
        var result = await _analyticController.GetListeningHistory(0,10);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var listeningHistory = Assert.IsType<List<EpisodeResponse>>(okResult.Value);
        Assert.Equal(listeningHistoryResponses, listeningHistory);
    }

    [Fact]
    public async Task GetListeningHistory_ReturnsNotFoundResult()
    {
        // Arrange
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetListeningHistory(0,10);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetListeningHistory_ReturnsBadRequestResult()
    {
        // Arrange
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetUserListeningHistoryAsync(It.IsAny<User>(),It.IsAny<string>(),It.IsAny<int>(),It.IsAny<int>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetListeningHistory(0,10);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetTopGenre_ReturnsOkResult()
    {
        // Arrange
        User user = new();
        GenreUserEngagementResponse genreResponses = new()
        {
            Genre = "Genre",
            WatchTime = TimeSpan.FromMinutes(30)
        };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopGenreByUserAsync(It.IsAny<User>())).ReturnsAsync(genreResponses);

        // Act
        var result = await _analyticController.GetTopGenre();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var genre = Assert.IsType<GenreUserEngagementResponse>(okResult.Value);
        Assert.Equal(genreResponses, genre);
    }

    [Fact]
    public async Task GetTopGenre_ReturnsNotFoundResult()
    {
        // Arrange
        User? user = null;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);

        // Act
        var result = await _analyticController.GetTopGenre();

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", notFoundResult.Value);
    }

    [Fact]
    public async Task GetTopGenre_ReturnsBadRequestResult()
    {
        // Arrange
        User user = new();
        string errorMessage = "Error Message";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _analyticServiceMock.Setup(service => service.GetTopGenreByUserAsync(It.IsAny<User>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _analyticController.GetTopGenre();

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, badRequestResult.Value);
    }
}
