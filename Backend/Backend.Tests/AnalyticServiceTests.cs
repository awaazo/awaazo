namespace Backend.Tests;

/// <summary>
/// Suite of tests for the AnalyticService
/// </summary>
public class AnalyticServiceTests
{
    private Mock<AppDbContext> _dbContextMock;
    private readonly AnalyticService _analyticService;

    public AnalyticServiceTests()
    {
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _analyticService = new AnalyticService(_dbContextMock.Object);
    }

    #region Fixtures

    /// <summary>
    /// Creates a mock DbSet with the given data.
    /// </summary>
    /// <typeparam name="T">The type of the entities in the DbSet.</typeparam>
    /// <param name="data">The data to be used as the source for the DbSet.</param>
    /// <returns>A mock DbSet with the given data.</returns>
    private static DbSet<T> CreateMockDbSet<T>(T[] data) where T : class
    {
        return data.AsQueryable().BuildMockDbSet().Object;
    }

    #endregion Fixtures

    #region Audience Age Tests

    // GetAverageAudienceAgeAsync

    [Fact]
    public async Task GetAverageAudienceAgeAsync_PodcastExistsAndData_ReturnsAverageAge()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(1990, 1, 1) }, Episode = episodes[0] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(1995, 12, 1) }, Episode = episodes[1] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(2000, 1, 11) }, Episode = episodes[2] }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        uint expectedAverageAge = (uint)Math.Round(userEpisodeInteractions.Select(uei => DateTime.Now.Year - uei.User.DateOfBirth.Year).Average());

        // Act
        uint averageAge = await _analyticService.GetAverageAudienceAgeAsync(podcastId, user);

        // Assert
        Assert.Equal(averageAge, expectedAverageAge);
    }

    [Fact]
    public async Task GetAverageAudienceAgeAsync_PodcastExistsAndNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAverageAudienceAgeAsync(podcastId, user));
        Assert.Equal("No audience data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetAverageAudienceAgeAsync_EpisodeExistsAndData_ReturnsAverageAge()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(1990, 1, 1) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(1995, 12, 1) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(2000, 1, 11) }, Episode = episode, EpisodeId = episodeId}
        };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        uint expectedAverageAge = (uint)Math.Round(userEpisodeInteractions.Select(uei => DateTime.Now.Year - uei.User.DateOfBirth.Year).Average());

        // Act
        uint averageAge = await _analyticService.GetAverageAudienceAgeAsync(episodeId, user);

        // Assert
        Assert.Equal(averageAge, expectedAverageAge);
    }

    [Fact]
    public async Task GetAverageAudienceAgeAsync_EpisodeExistsAndNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAverageAudienceAgeAsync(episodeId, user));
        Assert.Equal("No audience data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetAverageAudienceAgeAsync_EpisodeAndPodcastDoesNotExist_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAverageAudienceAgeAsync(episodeId, user));
        Assert.Equal("Podcast or Episode does not exist for the given ID.", exception.Message);
    }

    // GetAgeRangeInfoAsync

    [Fact]
    public async Task GetAgeRangeInfoAsync_PodcastExistsAndData_ReturnsAgeRangeResponse()
    {
        // Arrange
        uint min = 20;
        uint max = 30;

        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-25, 1, 1) }, Episode = episodes[0] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-(int)min, 12, 1) }, Episode = episodes[1] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-(int)max, 1, 11) }, Episode = episodes[2] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-10, 1, 11) }, Episode = episodes[2] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-40, 1, 11) }, Episode = episodes[2] }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        AgeRangeResponse expectedAgeRangeResponse = new()
        {
            Min = min,
            Max = max,
            Average = (uint)Math.Round(userEpisodeInteractions.Where(uei => DateTime.Now.Year - uei.User.DateOfBirth.Year >= min && DateTime.Now.Year - uei.User.DateOfBirth.Year <= max).Select(uei => DateTime.Now.Year - uei.User.DateOfBirth.Year).Average()),
            Count = 3,
            Percentage = (double)3 / 5 * 100
        };

        // Act
        AgeRangeResponse ageRangeResponse = await _analyticService.GetAgeRangeInfoAsync(podcastId, min, max, user);

        // Assert
        Assert.Equal(ageRangeResponse.Min, expectedAgeRangeResponse.Min);
        Assert.Equal(ageRangeResponse.Max, expectedAgeRangeResponse.Max);
        Assert.Equal(ageRangeResponse.Average, expectedAgeRangeResponse.Average);
        Assert.Equal(ageRangeResponse.Count, expectedAgeRangeResponse.Count);
        Assert.Equal(ageRangeResponse.Percentage, expectedAgeRangeResponse.Percentage);
    }

    [Fact]
    public async Task GetAgeRangeInfoAsync_PodcastExistsAndNoData_ThrowsException()
    {
        // Arrange
        uint min = 20;
        uint max = 30;

        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAgeRangeInfoAsync(podcastId, min, max, user));
        Assert.Equal("No audience data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetAgeRangeInfoAsync_EpisodeExistsAndData_ReturnsAgeRangeResponse()
    {
        // Arrange
        uint min = 20;
        uint max = 30;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-25, 1, 1) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-(int)min, 12, 1) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-(int)max, 1, 11) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-10, 1, 11) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-40, 1, 11) }, Episode = episode, EpisodeId = episodeId}
        };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        AgeRangeResponse expectedAgeRangeResponse = new()
        {
            Min = min,
            Max = max,
            Average = (uint)Math.Round(userEpisodeInteractions.Where(uei => DateTime.Now.Year - uei.User.DateOfBirth.Year >= min && DateTime.Now.Year - uei.User.DateOfBirth.Year <= max).Select(uei => DateTime.Now.Year - uei.User.DateOfBirth.Year).Average()),
            Count = 3,
            Percentage = (double)3 / 5 * 100
        };

        // Act
        AgeRangeResponse ageRangeResponse = await _analyticService.GetAgeRangeInfoAsync(episodeId, min, max, user);

        // Assert
        Assert.Equal(ageRangeResponse.Min, expectedAgeRangeResponse.Min);
        Assert.Equal(ageRangeResponse.Max, expectedAgeRangeResponse.Max);
        Assert.Equal(ageRangeResponse.Average, expectedAgeRangeResponse.Average);
        Assert.Equal(ageRangeResponse.Count, expectedAgeRangeResponse.Count);
        Assert.Equal(ageRangeResponse.Percentage, expectedAgeRangeResponse.Percentage);
    }

    [Fact]
    public async Task GetAgeRangeInfoAsync_EpisodeExistsAndNoData_ThrowsException()
    {
        // Arrange
        uint min = 20;
        uint max = 30;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAgeRangeInfoAsync(episodeId, min, max, user));
        Assert.Equal("No audience data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetAgeRangeInfoAsync_EpisodeAndPodcastDoesNotExist_ThrowsException()
    {
        // Arrange
        uint min = 20;
        uint max = 30;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAgeRangeInfoAsync(episodeId, min, max, user));
        Assert.Equal("Podcast or Episode does not exist for the given ID.", exception.Message);
    }

    [Fact]
    public async Task GetAgeRangeInfoAsync_MinGreaterThanMax_ThrowsException()
    {
        // Arrange
        uint min = 30;
        uint max = 20;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAgeRangeInfoAsync(episodeId, min, max, user));
        Assert.Equal("Minimum age cannot be greater than maximum age.", exception.Message);
    }

    // GetAgeRangeDistributionInfoAsync

    [Fact]
    public async Task GetAgeRangeDistributionInfoAsync_PodcastExistsAndData_ReturnsAgeRangeResponseList()
    {
        // Arrange
        uint ageInterval = 10;

        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-25, 1, 1) }, Episode = episodes[0] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-30, 12, 1) }, Episode = episodes[1] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-35, 1, 11) }, Episode = episodes[2] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-33, 1, 11) }, Episode = episodes[2] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-10, 1, 11) }, Episode = episodes[2] },
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-40, 1, 11) }, Episode = episodes[2] }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<AgeRangeResponse> expectedAgeRangeResponses = new()
        {
            new AgeRangeResponse { Min = 30, Max = 35, Average = 33, Count = 3, Percentage = (double)3 / 6 * 100 },
            new AgeRangeResponse { Min = 10, Max = 10, Average = 10, Count = 1, Percentage = (double)1 / 6 * 100 },
            new AgeRangeResponse { Min = 25, Max = 25, Average = 25, Count = 1, Percentage = (double)1 / 6 * 100 },
            new AgeRangeResponse { Min = 40, Max = 40, Average = 40, Count = 1, Percentage = (double)1 / 6 * 100 }
        };

        // Act
        List<AgeRangeResponse> ageRangeResponses = await _analyticService.GetAgeRangeDistributionInfoAsync(podcastId, ageInterval, user);

        // Assert
        foreach (var ageRangeResponse in ageRangeResponses)
        {
            var expectedAgeRangeResponse = expectedAgeRangeResponses.FirstOrDefault(e => e.Min == ageRangeResponse.Min);
            Assert.NotNull(expectedAgeRangeResponse);
            Assert.Equal(ageRangeResponse.Max, expectedAgeRangeResponse.Max);
            Assert.Equal(ageRangeResponse.Average, expectedAgeRangeResponse.Average);
            Assert.Equal(ageRangeResponse.Count, expectedAgeRangeResponse.Count);
            Assert.Equal(ageRangeResponse.Percentage, expectedAgeRangeResponse.Percentage);
        }

    }

    [Fact]
    public async Task GetAgeRangeDistributionInfoAsync_PodcastExistsAndNoData_ThrowsException()
    {
        // Arrange
        uint ageInterval = 10;

        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAgeRangeDistributionInfoAsync(podcastId, ageInterval, user));
        Assert.Equal("No audience data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetAgeRangeDistributionInfoAsync_EpisodeExistsAndData_ReturnsAgeRangeResponseList()
    {
        // Arrange
        uint ageInterval = 10;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-25, 1, 1) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-30, 12, 1) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-35, 1, 11) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-33, 1, 11) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-10, 1, 11) }, Episode = episode, EpisodeId = episodeId},
            new UserEpisodeInteraction { User = new User { DateOfBirth = new DateTime(DateTime.Now.Year-40, 1, 11) }, Episode = episode, EpisodeId = episodeId}
        };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<AgeRangeResponse> expectedAgeRangeResponses = new()
        {
            new AgeRangeResponse { Min = 30, Max = 35, Average = 33, Count = 3, Percentage = (double)3 / 6 * 100 },
            new AgeRangeResponse { Min = 10, Max = 10, Average = 10, Count = 1, Percentage = (double)1 / 6 * 100 },
            new AgeRangeResponse { Min = 25, Max = 25, Average = 25, Count = 1, Percentage = (double)1 / 6 * 100 },
            new AgeRangeResponse { Min = 40, Max = 40, Average = 40, Count = 1, Percentage = (double)1 / 6 * 100 }
        };

        // Act
        List<AgeRangeResponse> ageRangeResponses = await _analyticService.GetAgeRangeDistributionInfoAsync(episodeId, ageInterval, user);

        // Assert
        foreach (var ageRangeResponse in ageRangeResponses)
        {
            var expectedAgeRangeResponse = expectedAgeRangeResponses.FirstOrDefault(e => e.Min == ageRangeResponse.Min);
            Assert.NotNull(expectedAgeRangeResponse);
            Assert.Equal(ageRangeResponse.Max, expectedAgeRangeResponse.Max);
            Assert.Equal(ageRangeResponse.Average, expectedAgeRangeResponse.Average);
            Assert.Equal(ageRangeResponse.Count, expectedAgeRangeResponse.Count);
            Assert.Equal(ageRangeResponse.Percentage, expectedAgeRangeResponse.Percentage);
        }
    }

    [Fact]
    public async Task GetAgeRangeDistributionInfoAsync_EpisodeExistsAndNoData_ThrowsException()
    {
        // Arrange
        uint ageInterval = 10;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAgeRangeDistributionInfoAsync(episodeId, ageInterval, user));
        Assert.Equal("No audience data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetAgeRangeDistributionInfoAsync_EpisodeAndPodcastDoesNotExist_ThrowsException()
    {
        // Arrange
        uint ageInterval = 10;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAgeRangeDistributionInfoAsync(episodeId, ageInterval, user));
        Assert.Equal("Podcast or Episode does not exist for the given ID.", exception.Message);
    }

    [Fact]
    public async Task GetAgeRangeDistributionInfoAsync_AgeIntervalIs0_ThrowsException()
    {
        // Arrange
        uint ageInterval = 0;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAgeRangeDistributionInfoAsync(episodeId, ageInterval, user));
        Assert.Equal("Age interval cannot be 0.", exception.Message);
    }

    #endregion Audience Age Tests

    #region Watch Time Tests

    // GetAverageWatchTimeAsync

    [Fact]
    public async Task GetAverageWatchTimeAsync_PodcastExistsAndData_ReturnsAverageWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId, Duration = 100 },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId, Duration = 200 },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId, Duration = 300 }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 },
            new UserEpisodeInteraction { User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(100), Clicks = 10 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(150), Clicks = 15 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        double expectedAverageWatchTime = userEpisodeInteractions.Select(uei => uei.TotalListenTime.TotalSeconds).Sum() / userEpisodeInteractions.Select(uei => uei.Clicks).Sum();
        TimeSpan expectedAverageWatchTimeSpan = TimeSpan.FromSeconds((double)expectedAverageWatchTime);

        // Act
        TimeSpan averageWatchTime = await _analyticService.GetAverageWatchTimeAsync(podcastId, user);

        // Assert
        Assert.Equal(averageWatchTime, expectedAverageWatchTimeSpan);
    }

    [Fact]
    public async Task GetAverageWatchTimeAsync_PodcastExistsAndNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAverageWatchTimeAsync(podcastId, user));
        Assert.Equal("No audience data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetAverageWatchTimeAsync_EpisodeExistsAndData_ReturnsAverageWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id }, Duration = 100 };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 }
        };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        double expectedAverageWatchTime = userEpisodeInteractions.Where(uei => uei.EpisodeId == episodeId).Select(uei => uei.TotalListenTime.TotalSeconds).Sum() / userEpisodeInteractions.Where(uei => uei.EpisodeId == episodeId).Select(uei => uei.Clicks).Sum();
        TimeSpan expectedAverageWatchTimeSpan = TimeSpan.FromSeconds((double)expectedAverageWatchTime);

        // Act
        TimeSpan averageWatchTime = await _analyticService.GetAverageWatchTimeAsync(episodeId, user);

        // Assert
        Assert.Equal(averageWatchTime, expectedAverageWatchTimeSpan);
    }

    [Fact]
    public async Task GetAverageWatchTimeAsync_EpisodeExistsAndNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAverageWatchTimeAsync(episodeId, user));
        Assert.Equal("No audience data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetAverageWatchTimeAsync_EpisodeAndPodcastDoesNotExist_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetAverageWatchTimeAsync(episodeId, user));
        Assert.Equal("Podcast or Episode does not exist for the given ID.", exception.Message);
    }

    // GetTotalWatchTimeAsync

    [Fact]
    public async Task GetTotalWatchTimeAsync_PodcastExistsAndData_ReturnsTotalWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId, Duration = 100 },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId, Duration = 200 },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId, Duration = 300 }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 },
            new UserEpisodeInteraction { User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(100), Clicks = 10 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(150), Clicks = 15 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        TimeSpan expectedTotalWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Select(uei => uei.TotalListenTime.TotalSeconds).Sum());

        // Act
        TimeSpan totalWatchTime = await _analyticService.GetTotalWatchTimeAsync(podcastId, user);

        // Assert
        Assert.Equal(totalWatchTime, expectedTotalWatchTime);
    }

    [Fact]
    public async Task GetTotalWatchTimeAsync_PodcastExistsAndNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTotalWatchTimeAsync(podcastId, user));
        Assert.Equal("No audience data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetTotalWatchTimeAsync_EpisodeExistsAndData_ReturnsTotalWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id }, Duration = 100 };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 }
        };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        TimeSpan expectedTotalWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Where(uei => uei.EpisodeId == episodeId).Select(uei => uei.TotalListenTime.TotalSeconds).Sum());

        // Act
        TimeSpan totalWatchTime = await _analyticService.GetTotalWatchTimeAsync(episodeId, user);

        // Assert
        Assert.Equal(totalWatchTime, expectedTotalWatchTime);
    }

    [Fact]
    public async Task GetTotalWatchTimeAsync_EpisodeExistsAndNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTotalWatchTimeAsync(episodeId, user));
        Assert.Equal("No audience data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetTotalWatchTimeAsync_EpisodeAndPodcastDoesNotExist_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTotalWatchTimeAsync(episodeId, user));
        Assert.Equal("Podcast or Episode does not exist for the given ID.", exception.Message);
    }

    // GetWatchTimeRangeInfoAsync

    [Fact]
    public async Task GetWatchTimeRangeInfoAsync_PodcastExistsAndData_ReturnsWatchTimeRangeResponse()
    {
        // Arrange
        TimeSpan min = TimeSpan.FromSeconds(100);
        TimeSpan max = TimeSpan.FromSeconds(200);

        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 },
            new UserEpisodeInteraction { User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(100), Clicks = 10 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(150), Clicks = 15 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(200), Clicks = 20 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(250), Clicks = 25 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        int totalClicks = userEpisodeInteractions.Select(uei => uei.Clicks).Sum();
        TimeSpan totalWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Select(uei => uei.TotalListenTime.TotalSeconds).Sum());

        WatchTimeRangeResponse expectedWatchTimeRangeResponse = new()
        {
            MinWatchTime = min,
            MaxWatchTime = max,
            AverageWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.TotalListenTime.TotalSeconds).Sum()) / userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Count(),
            TotalWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.TotalListenTime.TotalSeconds).Sum()),
            TotalClicks = userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.Clicks).Sum(),
            AverageClicks = (double)userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.Clicks).Sum() / userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Count(),
            ClicksPercentage = (double)userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.Clicks).Sum() / totalClicks * 100,
            WatchTimePercentage = (double)userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.TotalListenTime.TotalSeconds).Sum() / totalWatchTime.TotalSeconds * 100
        };

        // Act
        WatchTimeRangeResponse watchTimeRangeResponse = await _analyticService.GetWatchTimeRangeInfoAsync(podcastId, user, min, max);

        // Assert
        Assert.Equal(watchTimeRangeResponse.MinWatchTime, expectedWatchTimeRangeResponse.MinWatchTime);
        Assert.Equal(watchTimeRangeResponse.MaxWatchTime, expectedWatchTimeRangeResponse.MaxWatchTime);
        Assert.Equal(watchTimeRangeResponse.AverageWatchTime, expectedWatchTimeRangeResponse.AverageWatchTime);
        Assert.Equal(watchTimeRangeResponse.TotalWatchTime, expectedWatchTimeRangeResponse.TotalWatchTime);
        Assert.Equal(watchTimeRangeResponse.TotalClicks, expectedWatchTimeRangeResponse.TotalClicks);
        Assert.Equal(watchTimeRangeResponse.AverageClicks, expectedWatchTimeRangeResponse.AverageClicks);
        Assert.Equal(watchTimeRangeResponse.ClicksPercentage, expectedWatchTimeRangeResponse.ClicksPercentage);
        Assert.Equal(watchTimeRangeResponse.WatchTimePercentage, expectedWatchTimeRangeResponse.WatchTimePercentage);
    }

    [Fact]
    public async Task GetWatchTimeRangeInfoAsync_PodcastExistsAndNoData_ThrowsException()
    {
        // Arrange
        TimeSpan min = TimeSpan.FromSeconds(100);
        TimeSpan max = TimeSpan.FromSeconds(200);

        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetWatchTimeRangeInfoAsync(podcastId, user, min, max));
        Assert.Equal("No audience data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetWatchTimeRangeInfoAsync_EpisodeExistsAndData_ReturnsWatchTimeRangeResponse()
    {
        // Arrange
        TimeSpan min = TimeSpan.FromSeconds(100);
        TimeSpan max = TimeSpan.FromSeconds(200);

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 },
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(100), Clicks = 10 },
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(150), Clicks = 15 },
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(200), Clicks = 20 },
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(250), Clicks = 25 }
        };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        int totalClicks = userEpisodeInteractions.Select(uei => uei.Clicks).Sum();
        TimeSpan totalWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Select(uei => uei.TotalListenTime.TotalSeconds).Sum());

        WatchTimeRangeResponse expectedWatchTimeRangeResponse = new()
        {
            MinWatchTime = min,
            MaxWatchTime = max,
            AverageWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.TotalListenTime.TotalSeconds).Sum()) / userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Count(),
            TotalWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.TotalListenTime.TotalSeconds).Sum()),
            TotalClicks = userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.Clicks).Sum(),
            AverageClicks = (double)userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.Clicks).Sum() / userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Count(),
            ClicksPercentage = (double)userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.Clicks).Sum() / totalClicks * 100,
            WatchTimePercentage = (double)userEpisodeInteractions.Where(uei => uei.TotalListenTime >= min && uei.TotalListenTime <= max).Select(uei => uei.TotalListenTime.TotalSeconds).Sum() / totalWatchTime.TotalSeconds * 100
        };

        // Act
        WatchTimeRangeResponse watchTimeRangeResponse = await _analyticService.GetWatchTimeRangeInfoAsync(episodeId, user, min, max);

        // Assert
        Assert.Equal(watchTimeRangeResponse.MinWatchTime, expectedWatchTimeRangeResponse.MinWatchTime);
        Assert.Equal(watchTimeRangeResponse.MaxWatchTime, expectedWatchTimeRangeResponse.MaxWatchTime);
        Assert.Equal(watchTimeRangeResponse.AverageWatchTime, expectedWatchTimeRangeResponse.AverageWatchTime);
        Assert.Equal(watchTimeRangeResponse.TotalWatchTime, expectedWatchTimeRangeResponse.TotalWatchTime);
        Assert.Equal(watchTimeRangeResponse.TotalClicks, expectedWatchTimeRangeResponse.TotalClicks);
        Assert.Equal(watchTimeRangeResponse.AverageClicks, expectedWatchTimeRangeResponse.AverageClicks);
        Assert.Equal(watchTimeRangeResponse.ClicksPercentage, expectedWatchTimeRangeResponse.ClicksPercentage);
        Assert.Equal(watchTimeRangeResponse.WatchTimePercentage, expectedWatchTimeRangeResponse.WatchTimePercentage);
    }

    [Fact]
    public async Task GetWatchTimeRangeInfoAsync_EpisodeExistsAndNoData_ThrowsException()
    {
        // Arrange
        TimeSpan min = TimeSpan.FromSeconds(100);
        TimeSpan max = TimeSpan.FromSeconds(200);

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetWatchTimeRangeInfoAsync(episodeId, user, min, max));
        Assert.Equal("No audience data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetWatchTimeRangeInfoAsync_EpisodeAndPodcastDoesNotExist_ThrowsException()
    {
        // Arrange
        TimeSpan min = TimeSpan.FromSeconds(100);
        TimeSpan max = TimeSpan.FromSeconds(200);

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetWatchTimeRangeInfoAsync(episodeId, user, min, max));
        Assert.Equal("Podcast or Episode does not exist for the given ID.", exception.Message);
    }

    [Fact]
    public async Task GetWatchTimeRangeInfoAsync_MinIsGreaterThanMax_ThrowsException()
    {
        // Arrange
        TimeSpan min = TimeSpan.FromSeconds(200);
        TimeSpan max = TimeSpan.FromSeconds(100);

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetWatchTimeRangeInfoAsync(episodeId, user, min, max));
        Assert.Equal("Minimum time cannot be greater than maximum time.", exception.Message);
    }

    // GetWatchTimeDistributionInfoAsync

    [Fact]
    public async Task GetWatchTimeDistributionInfoAsync_PodcastExistsAndData_ReturnsWatchTimeDistributionResponse()
    {
        // Arrange
        uint timeInterval = 100;

        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 },
            new UserEpisodeInteraction { User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(100), Clicks = 10 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(150), Clicks = 15 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(200), Clicks = 20 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(250), Clicks = 25 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<WatchTimeRangeResponse> expectedWatchTimeResponses = new()
        {
            new WatchTimeRangeResponse { MinWatchTime = TimeSpan.FromSeconds(50) , MaxWatchTime = TimeSpan.FromSeconds(50) , AverageWatchTime = TimeSpan.FromSeconds(50) , TotalWatchTime = TimeSpan.FromSeconds(50) , TotalClicks = 5 , AverageClicks = 5 , ClicksPercentage = (double)5 / 75 * 100 , WatchTimePercentage = (double)50 / 750 * 100 },
            new WatchTimeRangeResponse { MinWatchTime = TimeSpan.FromSeconds(100) , MaxWatchTime = TimeSpan.FromSeconds(150), AverageWatchTime = TimeSpan.FromSeconds(125) , TotalWatchTime = TimeSpan.FromSeconds(250) , TotalClicks = 25 , AverageClicks = 12.5 , ClicksPercentage = (double)25 / 75 * 100 , WatchTimePercentage = (double)250 / 750 * 100 },
            new WatchTimeRangeResponse { MinWatchTime = TimeSpan.FromSeconds(200) , MaxWatchTime = TimeSpan.FromSeconds(250) , AverageWatchTime = TimeSpan.FromSeconds(225) , TotalWatchTime = TimeSpan.FromSeconds(450) , TotalClicks = 45 , AverageClicks = 22.5 , ClicksPercentage = (double)45 / 75 * 100 , WatchTimePercentage = (double)450 / 750 * 100 },
        };

        // Act
        List<WatchTimeRangeResponse> watchTimeResponses = await _analyticService.GetWatchTimeDistributionInfoAsync(podcastId, user, timeInterval, false);

        // Assert
        foreach (var watchTimeResponse in watchTimeResponses)
        {
            var expectedWatchTimeResponse = expectedWatchTimeResponses.FirstOrDefault(e => e.MinWatchTime == watchTimeResponse.MinWatchTime);
            Assert.NotNull(expectedWatchTimeResponse);
            Assert.Equal(watchTimeResponse.MaxWatchTime, expectedWatchTimeResponse.MaxWatchTime);
            Assert.Equal(watchTimeResponse.AverageWatchTime, expectedWatchTimeResponse.AverageWatchTime);
            Assert.Equal(watchTimeResponse.TotalWatchTime, expectedWatchTimeResponse.TotalWatchTime);
            Assert.Equal(watchTimeResponse.TotalClicks, expectedWatchTimeResponse.TotalClicks);
            Assert.Equal(string.Format("{0:0.##}", watchTimeResponse.AverageClicks), string.Format("{0:0.##}", expectedWatchTimeResponse.AverageClicks));
            Assert.Equal(string.Format("{0:0.##}", watchTimeResponse.ClicksPercentage), string.Format("{0:0.##}", expectedWatchTimeResponse.ClicksPercentage));
            Assert.Equal(string.Format("{0:0.##}", watchTimeResponse.WatchTimePercentage), string.Format("{0:0.##}", expectedWatchTimeResponse.WatchTimePercentage));
            Assert.Equal(watchTimeResponse.MinWatchTime, expectedWatchTimeResponse.MinWatchTime);
        }
    }

    [Fact]
    public async Task GetWatchTimeDistributionInfoAsync_PodcastExistsAndNoData_ThrowsException()
    {
        // Arrange
        uint timeInterval = 100;

        User user = new() { Id = Guid.NewGuid() };

        Guid podcastId = Guid.NewGuid();

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId },
            new Episode { Id = Guid.NewGuid(), Podcast = podcast, PodcastId = podcastId }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetWatchTimeDistributionInfoAsync(podcastId, user, timeInterval, false));
        Assert.Equal("No audience data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetWatchTimeDistributionInfoAsync_EpisodeExistsAndData_ReturnsWatchTimeDistributionResponse()
    {
        // Arrange
        uint timeInterval = 100;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 },
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(100), Clicks = 10 },
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(150), Clicks = 15 },
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(200), Clicks = 20 },
            new UserEpisodeInteraction { User = user, Episode = episode, EpisodeId = episodeId, TotalListenTime = TimeSpan.FromSeconds(250), Clicks = 25 }
        };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<WatchTimeRangeResponse> expectedWatchTimeResponses = new()
        {
            new WatchTimeRangeResponse { MinWatchTime = TimeSpan.FromSeconds(50) , MaxWatchTime = TimeSpan.FromSeconds(50) , AverageWatchTime = TimeSpan.FromSeconds(50) , TotalWatchTime = TimeSpan.FromSeconds(50) , TotalClicks = 5 , AverageClicks = 5 , ClicksPercentage = (double)5 / 75 * 100 , WatchTimePercentage = (double)50 / 750 * 100 },
            new WatchTimeRangeResponse { MinWatchTime = TimeSpan.FromSeconds(100) , MaxWatchTime = TimeSpan.FromSeconds(150), AverageWatchTime = TimeSpan.FromSeconds(125) , TotalWatchTime = TimeSpan.FromSeconds(250) , TotalClicks = 25 , AverageClicks = 12.5 , ClicksPercentage = (double)25 / 75 * 100 , WatchTimePercentage = (double)250 / 750 * 100 },
            new WatchTimeRangeResponse { MinWatchTime = TimeSpan.FromSeconds(200) , MaxWatchTime = TimeSpan.FromSeconds(250) , AverageWatchTime = TimeSpan.FromSeconds(225) , TotalWatchTime = TimeSpan.FromSeconds(450) , TotalClicks = 45 , AverageClicks = 22.5 , ClicksPercentage = (double)45 / 75 * 100 , WatchTimePercentage = (double)450 / 750 * 100 },
        };

        // Act
        List<WatchTimeRangeResponse> watchTimeResponses = await _analyticService.GetWatchTimeDistributionInfoAsync(episodeId, user, timeInterval, false);

        // Assert
        foreach (var watchTimeResponse in watchTimeResponses)
        {
            var expectedWatchTimeResponse = expectedWatchTimeResponses.FirstOrDefault(e => e.MinWatchTime == watchTimeResponse.MinWatchTime);
            Assert.NotNull(expectedWatchTimeResponse);
            Assert.Equal(watchTimeResponse.MaxWatchTime, expectedWatchTimeResponse.MaxWatchTime);
            Assert.Equal(watchTimeResponse.AverageWatchTime, expectedWatchTimeResponse.AverageWatchTime);
            Assert.Equal(watchTimeResponse.TotalWatchTime, expectedWatchTimeResponse.TotalWatchTime);
            Assert.Equal(watchTimeResponse.TotalClicks, expectedWatchTimeResponse.TotalClicks);
            Assert.Equal(string.Format("{0:0.##}", watchTimeResponse.AverageClicks), string.Format("{0:0.##}", expectedWatchTimeResponse.AverageClicks));
            Assert.Equal(string.Format("{0:0.##}", watchTimeResponse.ClicksPercentage), string.Format("{0:0.##}", expectedWatchTimeResponse.ClicksPercentage));
            Assert.Equal(string.Format("{0:0.##}", watchTimeResponse.WatchTimePercentage), string.Format("{0:0.##}", expectedWatchTimeResponse.WatchTimePercentage));
            Assert.Equal(watchTimeResponse.MinWatchTime, expectedWatchTimeResponse.MinWatchTime);
        }
    }

    [Fact]
    public async Task GetWatchTimeDistributionInfoAsync_EpisodeExistsAndNoData_ThrowsException()
    {
        // Arrange
        uint timeInterval = 100;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetWatchTimeDistributionInfoAsync(episodeId, user, timeInterval, false));
        Assert.Equal("No audience data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetWatchTimeDistributionInfoAsync_EpisodeAndPodcastDoesNotExist_ThrowsException()
    {
        // Arrange
        uint timeInterval = 100;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetWatchTimeDistributionInfoAsync(episodeId, user, timeInterval, false));
        Assert.Equal("Podcast or Episode does not exist for the given ID.", exception.Message);
    }

    [Fact]
    public async Task GetWatchTimeDistributionInfoAsync_InvalidTimeInterval_ThrowsException()
    {
        // Arrange
        uint timeInterval = 0;

        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetWatchTimeDistributionInfoAsync(episodeId, user, timeInterval, false));
        Assert.Equal("Time interval cannot be 0.", exception.Message);
    }

    #endregion Watch Time Tests

}