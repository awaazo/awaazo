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

    #region User Interaction Tests

    // GetUserEngagementMetricsAsync

    [Fact]
    public async Task GetUserEngagementMetricsAsync_PodcastExistsAndData_ReturnsUserEngagementMetricsResponse()
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
            new UserEpisodeInteraction { User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(50), Clicks = 5 },
            new UserEpisodeInteraction { User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(100), Clicks = 10 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(150), Clicks = 15 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(200), Clicks = 20 },
            new UserEpisodeInteraction { User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(250), Clicks = 25 }
        };

        List<Comment> comments = new()
        {
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, Text = "Comment 1" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, Text = "Comment 2" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 3" }
        };

        List<EpisodeLike> episodeLikes = new()
        {
            new EpisodeLike { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(comments.ToArray()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(episodeLikes.ToArray()));


        UserEngagementMetricsResponse expectedUserEngagementMetricsResponse = new()
        {
            TotalWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds)),
            TotalClicks = userEpisodeInteractions.Sum(uei => uei.Clicks),
            TotalComments = comments.Count,
            TotalLikes = episodeLikes.Count,
            TotalListeners = userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count(),
            AverageWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds)) / userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count(),
            AverageClicks = userEpisodeInteractions.Sum(uei => uei.Clicks) / userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count(),
            CommentsPercentage = (double)comments.Count / userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count() * 100,
            LikesPercentage = (double)episodeLikes.Count / userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count() * 100
        };

        // Act
        UserEngagementMetricsResponse userEngagementMetricsResponse = await _analyticService.GetUserEngagementMetricsAsync(podcastId, user);

        // Assert
        Assert.Equal(userEngagementMetricsResponse.TotalWatchTime, expectedUserEngagementMetricsResponse.TotalWatchTime);
        Assert.Equal(userEngagementMetricsResponse.TotalClicks, expectedUserEngagementMetricsResponse.TotalClicks);
        Assert.Equal(userEngagementMetricsResponse.TotalComments, expectedUserEngagementMetricsResponse.TotalComments);
        Assert.Equal(userEngagementMetricsResponse.TotalLikes, expectedUserEngagementMetricsResponse.TotalLikes);
        Assert.Equal(userEngagementMetricsResponse.TotalListeners, expectedUserEngagementMetricsResponse.TotalListeners);
        Assert.Equal(userEngagementMetricsResponse.AverageWatchTime, expectedUserEngagementMetricsResponse.AverageWatchTime);
        Assert.Equal(userEngagementMetricsResponse.AverageClicks, expectedUserEngagementMetricsResponse.AverageClicks);
        Assert.Equal(userEngagementMetricsResponse.CommentsPercentage, expectedUserEngagementMetricsResponse.CommentsPercentage);
        Assert.Equal(userEngagementMetricsResponse.LikesPercentage, expectedUserEngagementMetricsResponse.LikesPercentage);
    }

    [Fact]
    public async Task GetUserEngagementMetricsAsync_PodcastExistsAndNoData_ReturnsUserEngagementMetricsResponse()
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

        List<Comment> comments = new() { };

        List<EpisodeLike> episodeLikes = new() { };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(comments.ToArray()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(episodeLikes.ToArray()));

        UserEngagementMetricsResponse expectedUserEngagementMetricsResponse = new()
        {
            TotalWatchTime = TimeSpan.FromSeconds(0),
            TotalClicks = 0,
            TotalComments = 0,
            TotalLikes = 0,
            TotalListeners = 0,
            AverageWatchTime = TimeSpan.FromSeconds(0),
            AverageClicks = 0,
            CommentsPercentage = 0,
            LikesPercentage = 0
        };

        // Act
        UserEngagementMetricsResponse userEngagementMetricsResponse = await _analyticService.GetUserEngagementMetricsAsync(podcastId, user);

        // Assert
        Assert.Equal(userEngagementMetricsResponse.TotalWatchTime, expectedUserEngagementMetricsResponse.TotalWatchTime);
        Assert.Equal(userEngagementMetricsResponse.TotalClicks, expectedUserEngagementMetricsResponse.TotalClicks);
        Assert.Equal(userEngagementMetricsResponse.TotalComments, expectedUserEngagementMetricsResponse.TotalComments);
        Assert.Equal(userEngagementMetricsResponse.TotalLikes, expectedUserEngagementMetricsResponse.TotalLikes);
        Assert.Equal(userEngagementMetricsResponse.TotalListeners, expectedUserEngagementMetricsResponse.TotalListeners);
        Assert.Equal(userEngagementMetricsResponse.AverageWatchTime, expectedUserEngagementMetricsResponse.AverageWatchTime);
        Assert.Equal(userEngagementMetricsResponse.AverageClicks, expectedUserEngagementMetricsResponse.AverageClicks);
        Assert.Equal(userEngagementMetricsResponse.CommentsPercentage, expectedUserEngagementMetricsResponse.CommentsPercentage);
        Assert.Equal(userEngagementMetricsResponse.LikesPercentage, expectedUserEngagementMetricsResponse.LikesPercentage);
    }

    [Fact]
    public async Task GetUserEngagementMetricsAsync_EpisodeExistsAndData_ReturnsUserEngagementMetricsResponse()
    {
        // Arrange
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

        List<Comment> comments = new()
        {
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episode, EpisodeId = episodeId, Text = "Comment 1" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episode, EpisodeId = episodeId, Text = "Comment 2" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episode, EpisodeId = episodeId, Text = "Comment 3" }
        };

        List<EpisodeLike> episodeLikes = new()
        {
            new EpisodeLike { UserId = user.Id, Episode = episode, EpisodeId = episodeId },
            new EpisodeLike { UserId = user.Id, Episode = episode, EpisodeId = episodeId },
            new EpisodeLike { UserId = user.Id, Episode = episode, EpisodeId = episodeId }
        };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(comments.ToArray()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(episodeLikes.ToArray()));

        UserEngagementMetricsResponse expectedUserEngagementMetricsResponse = new()
        {
            TotalWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds)),
            TotalClicks = userEpisodeInteractions.Sum(uei => uei.Clicks),
            TotalComments = comments.Count,
            TotalLikes = episodeLikes.Count,
            TotalListeners = userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count(),
            AverageWatchTime = TimeSpan.FromSeconds(userEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds)) / userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count(),
            AverageClicks = userEpisodeInteractions.Sum(uei => uei.Clicks) / userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count(),
            CommentsPercentage = (double)comments.Count / userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count() * 100,
            LikesPercentage = (double)episodeLikes.Count / userEpisodeInteractions.Select(uei => uei.UserId).Distinct().Count() * 100
        };

        // Act
        UserEngagementMetricsResponse userEngagementMetricsResponse = await _analyticService.GetUserEngagementMetricsAsync(episodeId, user);

        // Assert
        Assert.Equal(userEngagementMetricsResponse.TotalWatchTime, expectedUserEngagementMetricsResponse.TotalWatchTime);
        Assert.Equal(userEngagementMetricsResponse.TotalClicks, expectedUserEngagementMetricsResponse.TotalClicks);
        Assert.Equal(userEngagementMetricsResponse.TotalComments, expectedUserEngagementMetricsResponse.TotalComments);
        Assert.Equal(userEngagementMetricsResponse.TotalLikes, expectedUserEngagementMetricsResponse.TotalLikes);
        Assert.Equal(userEngagementMetricsResponse.TotalListeners, expectedUserEngagementMetricsResponse.TotalListeners);
        Assert.Equal(userEngagementMetricsResponse.AverageWatchTime, expectedUserEngagementMetricsResponse.AverageWatchTime);
        Assert.Equal(userEngagementMetricsResponse.AverageClicks, expectedUserEngagementMetricsResponse.AverageClicks);
        Assert.Equal(userEngagementMetricsResponse.CommentsPercentage, expectedUserEngagementMetricsResponse.CommentsPercentage);
        Assert.Equal(userEngagementMetricsResponse.LikesPercentage, expectedUserEngagementMetricsResponse.LikesPercentage);
    }

    [Fact]
    public async Task GetUserEngagementMetricsAsync_EpisodeExistsAndNoData_ReturnsUserEngagementMetricsResponse()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        Episode episode = new() { Id = episodeId, Podcast = new Podcast { PodcasterId = user.Id } };

        List<UserEpisodeInteraction> userEpisodeInteractions = new() { };

        List<Comment> comments = new() { };

        List<EpisodeLike> episodeLikes = new() { };

        Podcast podcast = new() { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(new[] { episode }));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(comments.ToArray()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(episodeLikes.ToArray()));

        UserEngagementMetricsResponse expectedUserEngagementMetricsResponse = new()
        {
            TotalWatchTime = TimeSpan.FromSeconds(0),
            TotalClicks = 0,
            TotalComments = 0,
            TotalLikes = 0,
            TotalListeners = 0,
            AverageWatchTime = TimeSpan.FromSeconds(0),
            AverageClicks = 0,
            CommentsPercentage = 0,
            LikesPercentage = 0
        };

        // Act
        UserEngagementMetricsResponse userEngagementMetricsResponse = await _analyticService.GetUserEngagementMetricsAsync(episodeId, user);

        // Assert
        Assert.Equal(userEngagementMetricsResponse.TotalWatchTime, expectedUserEngagementMetricsResponse.TotalWatchTime);
        Assert.Equal(userEngagementMetricsResponse.TotalClicks, expectedUserEngagementMetricsResponse.TotalClicks);
        Assert.Equal(userEngagementMetricsResponse.TotalComments, expectedUserEngagementMetricsResponse.TotalComments);
        Assert.Equal(userEngagementMetricsResponse.TotalLikes, expectedUserEngagementMetricsResponse.TotalLikes);
        Assert.Equal(userEngagementMetricsResponse.TotalListeners, expectedUserEngagementMetricsResponse.TotalListeners);
        Assert.Equal(userEngagementMetricsResponse.AverageWatchTime, expectedUserEngagementMetricsResponse.AverageWatchTime);
        Assert.Equal(userEngagementMetricsResponse.AverageClicks, expectedUserEngagementMetricsResponse.AverageClicks);
        Assert.Equal(userEngagementMetricsResponse.CommentsPercentage, expectedUserEngagementMetricsResponse.CommentsPercentage);
        Assert.Equal(userEngagementMetricsResponse.LikesPercentage, expectedUserEngagementMetricsResponse.LikesPercentage);
    }

    [Fact]
    public async Task GetUserEngagementMetricsAsync_EpisodeAndPodcastDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };

        Guid episodeId = Guid.NewGuid();

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetUserEngagementMetricsAsync(episodeId, user));
        Assert.Equal("Podcast or Episode does not exist for the given ID.", exception.Message);
    }

    // GetTopCommentedPodcastsAsync

    [Fact]
    public async Task GetTopCommentedPodcastsAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        bool getLessCommented = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(Array.Empty<Comment>()));

        // Act
        List<PodcastResponse> topCommentedPodcastResponses = await _analyticService.GetTopCommentedPodcastsAsync(count, getLessCommented, user, domainUrl);

        // Assert
        Assert.Empty(topCommentedPodcastResponses);
    }

    [Fact]
    public async Task GetTopCommentedPodcastsAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        bool getLessCommented = false;
        string domainUrl = "http://localhost:5000";
        int count = -5;

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopCommentedPodcastsAsync(count, getLessCommented, user, domainUrl));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopCommentedPodcastsAsync_Data_ReturnsTopCommentedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        bool getLessCommented = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<Comment> comments = new()
        {
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, Text = "Comment 1" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, Text = "Comment 2" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, Text = "Comment 3" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, Text = "Comment 4" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, Text = "Comment 5" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, Text = "Comment 6" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, Text = "Comment 7" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, Text = "Comment 8" }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(comments.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(Array.Empty<EpisodeLike>()));

        List<PodcastResponse> expectedTopCommentedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[2].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[0].Id}
        };

        // Act
        List<PodcastResponse> topCommentedPodcastResponses = await _analyticService.GetTopCommentedPodcastsAsync(count, getLessCommented, user, domainUrl);

        // Assert
        for (int i = 0; i < topCommentedPodcastResponses.Count; i++)
        {
            Assert.Equal(topCommentedPodcastResponses[i].Id, expectedTopCommentedPodcastResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopCommentedPodcastsAsync_Data_ReturnsLessCommentedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        bool getLessCommented = true;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<Comment> comments = new()
        {
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, Text = "Comment 1" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, Text = "Comment 2" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, Text = "Comment 3" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, Text = "Comment 4" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, Text = "Comment 5" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, Text = "Comment 6" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, Text = "Comment 7" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, Text = "Comment 8" }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(comments.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(Array.Empty<EpisodeLike>()));
        _dbContextMock.Setup(db => db.PodcastFollows).Returns(CreateMockDbSet(Array.Empty<PodcastFollow>()));

        List<PodcastResponse> expectedTopCommentedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[0].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[2].Id}
        };

        // Act
        List<PodcastResponse> topCommentedPodcastResponses = await _analyticService.GetTopCommentedPodcastsAsync(count, getLessCommented, user, domainUrl);

        // Assert
        for (int i = 0; i < topCommentedPodcastResponses.Count; i++)
        {
            Assert.Equal(topCommentedPodcastResponses[i].Id, expectedTopCommentedPodcastResponses[i].Id);
        }
    }

    // GetTopCommentedEpisodesAsync

    [Fact]
    public async Task GetTopCommentedEpisodesAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessCommented = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(Array.Empty<Comment>()));

        // Act
        List<EpisodeResponse> topCommentedEpisodeResponses = await _analyticService.GetTopCommentedEpisodesAsync(podcastId, count, getLessCommented, user, domainUrl);

        // Assert
        Assert.Empty(topCommentedEpisodeResponses);
    }

    [Fact]
    public async Task GetTopCommentedEpisodesAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessCommented = false;
        string domainUrl = "http://localhost:5000";
        int count = -5;

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopCommentedEpisodesAsync(podcastId, count, getLessCommented, user, domainUrl));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopCommentedEpisodesAsync_Data_ReturnsTopCommentedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessCommented = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<Comment> comments = new()
        {
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, Text = "Comment 1" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, Text = "Comment 2" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, Text = "Comment 3" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, Text = "Comment 4" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, Text = "Comment 5" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 6" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 7" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 8" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 9" },
        };

        episodes[0].Comments.Add(comments[0]);
        episodes[0].Comments.Add(comments[1]);
        episodes[1].Comments.Add(comments[2]);
        episodes[1].Comments.Add(comments[3]);
        episodes[1].Comments.Add(comments[4]);
        episodes[2].Comments.Add(comments[5]);
        episodes[2].Comments.Add(comments[6]);
        episodes[2].Comments.Add(comments[7]);
        episodes[2].Comments.Add(comments[8]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(comments.ToArray()));

        List<EpisodeResponse> expectedTopCommentedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[2].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[0].Id}
        };

        // Act
        List<EpisodeResponse> topCommentedEpisodeResponses = await _analyticService.GetTopCommentedEpisodesAsync(podcastId, count, getLessCommented, user, domainUrl);

        // Assert
        for (int i = 0; i < topCommentedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topCommentedEpisodeResponses[i].Id, expectedTopCommentedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopCommentedEpisodesAsync_Data_ReturnsLessCommentedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessCommented = true;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<Comment> comments = new()
        {
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, Text = "Comment 1" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[0], EpisodeId = episodes[0].Id, Text = "Comment 2" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, Text = "Comment 3" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, Text = "Comment 4" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[1], EpisodeId = episodes[1].Id, Text = "Comment 5" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 6" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 7" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 8" },
            new Comment { Id = Guid.NewGuid(), User = user, Episode = episodes[2], EpisodeId = episodes[2].Id, Text = "Comment 9" },
        };

        episodes[0].Comments.Add(comments[0]);
        episodes[0].Comments.Add(comments[1]);
        episodes[1].Comments.Add(comments[2]);
        episodes[1].Comments.Add(comments[3]);
        episodes[1].Comments.Add(comments[4]);
        episodes[2].Comments.Add(comments[5]);
        episodes[2].Comments.Add(comments[6]);
        episodes[2].Comments.Add(comments[7]);
        episodes[2].Comments.Add(comments[8]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(comments.ToArray()));

        List<EpisodeResponse> expectedTopCommentedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[0].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[2].Id}
        };

        // Act
        List<EpisodeResponse> topCommentedEpisodeResponses = await _analyticService.GetTopCommentedEpisodesAsync(podcastId, count, getLessCommented, user, domainUrl);

        // Assert
        for (int i = 0; i < topCommentedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topCommentedEpisodeResponses[i].Id, expectedTopCommentedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopCommentedEpisodesAsync_PodcastDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessCommented = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.Comments).Returns(CreateMockDbSet(Array.Empty<Comment>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopCommentedEpisodesAsync(podcastId, count, getLessCommented, user, domainUrl));
        Assert.Equal("Podcast does not exist for the given ID.", exception.Message);
    }

    // GetTopLikedPodcastsAsync

    [Fact]
    public async Task GetTopLikedPodcastsAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        bool getLessLiked = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(Array.Empty<EpisodeLike>()));

        // Act
        List<PodcastResponse> topLikedPodcastResponses = await _analyticService.GetTopLikedPodcastsAsync(count, getLessLiked, user, domainUrl);

        // Assert
        Assert.Empty(topLikedPodcastResponses);
    }

    [Fact]
    public async Task GetTopLikedPodcastsAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        bool getLessLiked = false;
        string domainUrl = "http://localhost:5000";
        int count = -5;

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopLikedPodcastsAsync(count, getLessLiked, user, domainUrl));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopLikedPodcastsAsync_Data_ReturnsTopLikedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        bool getLessLiked = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<EpisodeLike> episodeLikes = new()
        {
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(episodeLikes.ToArray()));

        List<PodcastResponse> expectedTopLikedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[2].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[0].Id}
        };

        // Act
        List<PodcastResponse> topLikedPodcastResponses = await _analyticService.GetTopLikedPodcastsAsync(count, getLessLiked, user, domainUrl);

        // Assert
        for (int i = 0; i < topLikedPodcastResponses.Count; i++)
        {
            Assert.Equal(topLikedPodcastResponses[i].Id, expectedTopLikedPodcastResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopLikedPodcastsAsync_Data_ReturnsLessLikedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        bool getLessLiked = true;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<EpisodeLike> episodeLikes = new()
        {
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(episodeLikes.ToArray()));

        List<PodcastResponse> expectedTopLikedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[0].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[2].Id}
        };

        // Act
        List<PodcastResponse> topLikedPodcastResponses = await _analyticService.GetTopLikedPodcastsAsync(count, getLessLiked, user, domainUrl);

        // Assert
        for (int i = 0; i < topLikedPodcastResponses.Count; i++)
        {
            Assert.Equal(topLikedPodcastResponses[i].Id, expectedTopLikedPodcastResponses[i].Id);
        }
    }

    // GetTopLikedEpisodesAsync

    [Fact]
    public async Task GetTopLikedEpisodesAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessLiked = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(Array.Empty<EpisodeLike>()));

        // Act
        List<EpisodeResponse> topLikedEpisodeResponses = await _analyticService.GetTopLikedEpisodesAsync(podcastId, count, getLessLiked, user, domainUrl);

        // Assert
        Assert.Empty(topLikedEpisodeResponses);
    }

    [Fact]
    public async Task GetTopLikedEpisodesAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessLiked = false;
        string domainUrl = "http://localhost:5000";
        int count = -5;

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopLikedEpisodesAsync(podcastId, count, getLessLiked, user, domainUrl));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopLikedEpisodesAsync_Data_ReturnsTopLikedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessLiked = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<EpisodeLike> episodeLikes = new()
        {
            new EpisodeLike { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id }
        };

        episodes[0].Likes.Add(episodeLikes[0]);
        episodes[0].Likes.Add(episodeLikes[1]);
        episodes[1].Likes.Add(episodeLikes[2]);
        episodes[1].Likes.Add(episodeLikes[3]);
        episodes[1].Likes.Add(episodeLikes[4]);
        episodes[2].Likes.Add(episodeLikes[5]);
        episodes[2].Likes.Add(episodeLikes[6]);
        episodes[2].Likes.Add(episodeLikes[7]);
        episodes[2].Likes.Add(episodeLikes[8]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(episodeLikes.ToArray()));

        List<EpisodeResponse> expectedTopLikedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[2].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[0].Id}
        };

        // Act
        List<EpisodeResponse> topLikedEpisodeResponses = await _analyticService.GetTopLikedEpisodesAsync(podcastId, count, getLessLiked, user, domainUrl);

        // Assert
        for (int i = 0; i < topLikedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topLikedEpisodeResponses[i].Id, expectedTopLikedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopLikedEpisodesAsync_Data_ReturnsLessLikedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessLiked = true;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<EpisodeLike> episodeLikes = new()
        {
            new EpisodeLike { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id },
            new EpisodeLike { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id }
        };

        episodes[0].Likes.Add(episodeLikes[0]);
        episodes[0].Likes.Add(episodeLikes[1]);
        episodes[1].Likes.Add(episodeLikes[2]);
        episodes[1].Likes.Add(episodeLikes[3]);
        episodes[1].Likes.Add(episodeLikes[4]);
        episodes[2].Likes.Add(episodeLikes[5]);
        episodes[2].Likes.Add(episodeLikes[6]);
        episodes[2].Likes.Add(episodeLikes[7]);
        episodes[2].Likes.Add(episodeLikes[8]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(episodeLikes.ToArray()));

        List<EpisodeResponse> expectedTopLikedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[0].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[2].Id}
        };

        // Act
        List<EpisodeResponse> topLikedEpisodeResponses = await _analyticService.GetTopLikedEpisodesAsync(podcastId, count, getLessLiked, user, domainUrl);

        // Assert
        for (int i = 0; i < topLikedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topLikedEpisodeResponses[i].Id, expectedTopLikedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopLikedEpisodesAsync_PodcastDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessLiked = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.EpisodeLikes).Returns(CreateMockDbSet(Array.Empty<EpisodeLike>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopLikedEpisodesAsync(podcastId, count, getLessLiked, user, domainUrl));
        Assert.Equal("Podcast does not exist for the given ID.", exception.Message);
    }

    // GetTopClickedPodcastsAsync

    [Fact]
    public async Task GetTopClickedPodcastsAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        bool getLessClicked = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act
        List<PodcastResponse> topClickedPodcastResponses = await _analyticService.GetTopClickedPodcastsAsync(count, getLessClicked, user, domainUrl);

        // Assert
        Assert.Empty(topClickedPodcastResponses);
    }

    [Fact]
    public async Task GetTopClickedPodcastsAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = -5;
        bool getLessClicked = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopClickedPodcastsAsync(count, getLessClicked, user, domainUrl));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopClickedPodcastsAsync_Data_ReturnsTopClickedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        bool getLessClicked = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, Clicks = 3 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<PodcastResponse> expectedTopClickedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[0].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[2].Id}
        };

        // Act
        List<PodcastResponse> topClickedPodcastResponses = await _analyticService.GetTopClickedPodcastsAsync(count, getLessClicked, user, domainUrl);

        // Assert
        for (int i = 0; i < topClickedPodcastResponses.Count; i++)
        {
            Assert.Equal(topClickedPodcastResponses[i].Id, expectedTopClickedPodcastResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopClickedPodcastsAsync_Data_ReturnsLessClickedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        bool getLessClicked = true;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, Clicks = 3 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<PodcastResponse> expectedTopClickedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[2].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[0].Id}
        };

        // Act
        List<PodcastResponse> topClickedPodcastResponses = await _analyticService.GetTopClickedPodcastsAsync(count, getLessClicked, user, domainUrl);

        // Assert
        for (int i = 0; i < topClickedPodcastResponses.Count; i++)
        {
            Assert.Equal(topClickedPodcastResponses[i].Id, expectedTopClickedPodcastResponses[i].Id);
        }
    }

    // GetTopClickedEpisodesAsync

    [Fact]
    public async Task GetTopClickedEpisodesAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessClicked = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act
        List<EpisodeResponse> topClickedEpisodeResponses = await _analyticService.GetTopClickedEpisodesAsync(podcastId, count, getLessClicked, user, domainUrl);

        // Assert
        Assert.Empty(topClickedEpisodeResponses);
    }

    [Fact]
    public async Task GetTopClickedEpisodesAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessClicked = false;
        string domainUrl = "http://localhost:5000";
        int count = -5;

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopClickedEpisodesAsync(podcastId, count, getLessClicked, user, domainUrl));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopClickedEpisodeAsync_Data_ReturnsTopClickedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessClicked = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id, Clicks = 3 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id, Clicks = 4 },
        };

        episodes[0].UserEpisodeInteractions.Add(userEpisodeInteractions[1]);
        episodes[1].UserEpisodeInteractions.Add(userEpisodeInteractions[0]);
        episodes[2].UserEpisodeInteractions.Add(userEpisodeInteractions[2]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<EpisodeResponse> expectedTopClickedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[0].Id},
            new EpisodeResponse { Id = episodes[2].Id},
            new EpisodeResponse { Id = episodes[1].Id}
        };

        // Act
        List<EpisodeResponse> topClickedEpisodeResponses = await _analyticService.GetTopClickedEpisodesAsync(podcastId, count, getLessClicked, user, domainUrl);

        // Assert
        for (int i = 0; i < topClickedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topClickedEpisodeResponses[i].Id, expectedTopClickedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopClickedEpisodeAsync_Data_ReturnsLessClickedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessClicked = true;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };
        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id, Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id, Clicks = 3 }
        };

        episodes[0].UserEpisodeInteractions.Add(userEpisodeInteractions[0]);
        episodes[1].UserEpisodeInteractions.Add(userEpisodeInteractions[1]);
        episodes[2].UserEpisodeInteractions.Add(userEpisodeInteractions[2]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<EpisodeResponse> expectedTopClickedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[2].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[0].Id}
        };

        // Act
        List<EpisodeResponse> topClickedEpisodeResponses = await _analyticService.GetTopClickedEpisodesAsync(podcastId, count, getLessClicked, user, domainUrl);

        // Assert
        for (int i = 0; i < topClickedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topClickedEpisodeResponses[i].Id, expectedTopClickedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopClickedEpisodeAsync_PodcastDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessClicked = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopClickedEpisodesAsync(podcastId, count, getLessClicked, user, domainUrl));
        Assert.Equal("Podcast does not exist for the given ID.", exception.Message);
    }

    // GetTopWatchedPodcastsAsync

    [Fact]
    public async Task GetTopWatchedPodcastsAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        bool getLessWatched = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act
        List<PodcastResponse> topWatchedPodcastResponses = await _analyticService.GetTopWatchedPodcastsAsync(count, getLessWatched, user, domainUrl);

        // Assert
        Assert.Empty(topWatchedPodcastResponses);
    }

    [Fact]
    public async Task GetTopWatchedPodcastsAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = -5;
        bool getLessWatched = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopWatchedPodcastsAsync(count, getLessWatched, user, domainUrl));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopWatchedPodcastsAsync_Data_ReturnsTopWatchedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        bool getLessWatched = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, TotalListenTime = TimeSpan.FromSeconds(5) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, TotalListenTime = TimeSpan.FromSeconds(4) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, TotalListenTime = TimeSpan.FromSeconds(3) }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<PodcastResponse> expectedTopWatchedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[0].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[2].Id}
        };

        // Act
        List<PodcastResponse> topWatchedPodcastResponses = await _analyticService.GetTopWatchedPodcastsAsync(count, getLessWatched, user, domainUrl);

        // Assert
        for (int i = 0; i < topWatchedPodcastResponses.Count; i++)
        {
            Assert.Equal(topWatchedPodcastResponses[i].Id, expectedTopWatchedPodcastResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopWatchedPodcastsAsync_Data_ReturnsLessWatchedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        bool getLessWatched = true;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, TotalListenTime = TimeSpan.FromSeconds(5) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, TotalListenTime = TimeSpan.FromSeconds(4) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, TotalListenTime = TimeSpan.FromSeconds(3) }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<PodcastResponse> expectedTopWatchedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[2].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[0].Id}
        };

        // Act
        List<PodcastResponse> topWatchedPodcastResponses = await _analyticService.GetTopWatchedPodcastsAsync(count, getLessWatched, user, domainUrl);

        // Assert
        for (int i = 0; i < topWatchedPodcastResponses.Count; i++)
        {
            Assert.Equal(topWatchedPodcastResponses[i].Id, expectedTopWatchedPodcastResponses[i].Id);
        }
    }

    // GetTopWatchedEpisodesAsync

    [Fact]
    public async Task GetTopWatchedEpisodesAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act
        List<EpisodeResponse> topWatchedEpisodeResponses = await _analyticService.GetTopWatchedEpisodesAsync(podcastId, count, getLessWatched, user, domainUrl);

        // Assert
        Assert.Empty(topWatchedEpisodeResponses);
    }

    [Fact]
    public async Task GetTopWatchedEpisodesAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = false;
        string domainUrl = "http://localhost:5000";
        int count = -5;

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopWatchedEpisodesAsync(podcastId, count, getLessWatched, user, domainUrl));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopWatchedEpisodesAsync_Data_ReturnsTopWatchedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(3) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(4) },
        };

        episodes[0].UserEpisodeInteractions.Add(userEpisodeInteractions[1]);
        episodes[1].UserEpisodeInteractions.Add(userEpisodeInteractions[2]);
        episodes[2].UserEpisodeInteractions.Add(userEpisodeInteractions[0]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<EpisodeResponse> expectedTopWatchedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[0].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[2].Id}
        };

        // Act
        List<EpisodeResponse> topWatchedEpisodeResponses = await _analyticService.GetTopWatchedEpisodesAsync(podcastId, count, getLessWatched, user, domainUrl);

        // Assert
        for (int i = 0; i < topWatchedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topWatchedEpisodeResponses[i].Id, expectedTopWatchedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopWatchedEpisodesAsync_Data_ReturnsLessWatchedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = true;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(4) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(3) }
        };

        episodes[0].UserEpisodeInteractions.Add(userEpisodeInteractions[0]);
        episodes[1].UserEpisodeInteractions.Add(userEpisodeInteractions[1]);
        episodes[2].UserEpisodeInteractions.Add(userEpisodeInteractions[2]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<EpisodeResponse> expectedTopWatchedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[2].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[0].Id}
        };

        // Act
        List<EpisodeResponse> topWatchedEpisodeResponses = await _analyticService.GetTopWatchedEpisodesAsync(podcastId, count, getLessWatched, user, domainUrl);

        // Assert
        for (int i = 0; i < topWatchedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topWatchedEpisodeResponses[i].Id, expectedTopWatchedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopWatchedEpisodesAsync_PodcastDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopWatchedEpisodesAsync(podcastId, count, getLessWatched, user, domainUrl));
        Assert.Equal("Podcast does not exist for the given ID.", exception.Message);
    }

    #endregion User Interaction Tests

    // GetUserAverageWatchTimeAsync

    [Fact]
    public async Task GetUserAverageWatchTimeAsync_PodcastNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetUserAverageWatchTimeAsync(podcastId, user));
        Assert.Equal("No data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetUserAverageWatchTimeAsync_EpisodeNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetUserAverageWatchTimeAsync(epsiodeId, user));
        Assert.Equal("No data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetUserAverageWatchTimeAsync_UserNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetUserAverageWatchTimeAsync(null, user));
        Assert.Equal("No data available for the given user.", exception.Message);
    }

    [Fact]
    public async Task GetUserAverageWatchTimeAsync_PodcastWithData_ReturnsAverageWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5), Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(4), Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(3), Clicks = 3 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act
        TimeSpan averageWatchTime = await _analyticService.GetUserAverageWatchTimeAsync(podcastId, user);

        // Assert
        Assert.Equal(TimeSpan.FromSeconds(1), averageWatchTime);
    }

    [Fact]
    public async Task GetUserAverageWatchTimeAsync_EpisodeWithData_ReturnsAverageWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5), Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(4), Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(3), Clicks = 3 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act
        TimeSpan averageWatchTime = await _analyticService.GetUserAverageWatchTimeAsync(epsiodeId, user);

        // Assert
        Assert.Equal(TimeSpan.FromSeconds(1), averageWatchTime);
    }

    [Fact]
    public async Task GetUserAverageWatchTimeAsync_UserWithData_ReturnsAverageWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5), Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(4), Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(3), Clicks = 3 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act
        TimeSpan averageWatchTime = await _analyticService.GetUserAverageWatchTimeAsync(null, user);

        // Assert
        Assert.Equal(TimeSpan.FromSeconds(1), averageWatchTime);
    }

    // GetUserTotalWatchTimeAsync

    [Fact]
    public async Task GetUserTotalWatchTimeAsync_PodcastNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetUserTotalWatchTimeAsync(podcastId, user));
        Assert.Equal("No data available for the given podcast.", exception.Message);
    }

    [Fact]
    public async Task GetUserTotalWatchTimeAsync_EpisodeNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetUserTotalWatchTimeAsync(epsiodeId, user));
        Assert.Equal("No data available for the given episode.", exception.Message);
    }

    [Fact]
    public async Task GetUserTotalWatchTimeAsync_UserNoData_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetUserTotalWatchTimeAsync(null, user));
        Assert.Equal("No data available for the given user.", exception.Message);
    }

    [Fact]
    public async Task GetUserTotalWatchTimeAsync_PodcastWithData_ReturnsTotalWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5), Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(4), Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(3), Clicks = 3 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act
        TimeSpan totalWatchTime = await _analyticService.GetUserTotalWatchTimeAsync(podcastId, user);

        // Assert
        Assert.Equal(TimeSpan.FromSeconds(12), totalWatchTime);
    }

    [Fact]
    public async Task GetUserTotalWatchTimeAsync_EpisodeWithData_ReturnsTotalWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5), Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(4), Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(3), Clicks = 3 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act
        TimeSpan totalWatchTime = await _analyticService.GetUserTotalWatchTimeAsync(epsiodeId, user);

        // Assert
        Assert.Equal(TimeSpan.FromSeconds(12), totalWatchTime);
    }

    [Fact]
    public async Task GetUserTotalWatchTimeAsync_UserWithData_ReturnsTotalWatchTime()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        Guid epsiodeId = Guid.NewGuid();

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = podcastId, PodcasterId = Guid.NewGuid() }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = epsiodeId, PodcastId = podcastId, Podcast = podcasts[0] }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5), Clicks = 5 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(4), Clicks = 4 },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(3), Clicks = 3 }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        // Act
        TimeSpan totalWatchTime = await _analyticService.GetUserTotalWatchTimeAsync(null, user);

        // Assert
        Assert.Equal(TimeSpan.FromSeconds(12), totalWatchTime);
    }

    // GetTopWatchedPodcastsByUserAsync

    [Fact]
    public async Task GetTopWatchedPodcastsByUserAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 0;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        bool getLessWatched = false;

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopWatchedPodcastsByUserAsync(count, getLessWatched, user, domainUrl, 0, 10));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopWatchedPodcastsByUserAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        bool getLessWatched = false;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act
        List<PodcastResponse> topWatchedPodcastResponses = await _analyticService.GetTopWatchedPodcastsByUserAsync(count, getLessWatched, user, domainUrl, 0, 10);

        // Assert
        Assert.Empty(topWatchedPodcastResponses);
    }

    [Fact]
    public async Task GetTopWatchedPodcastsByUserAsync_Data_ReturnsTopWatchedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        bool getLessWatched = false;

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, TotalListenTime = TimeSpan.FromSeconds(5) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, TotalListenTime = TimeSpan.FromSeconds(3) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, TotalListenTime = TimeSpan.FromSeconds(4) }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<PodcastResponse> expectedTopWatchedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[0].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[2].Id}
        };

        // Act
        List<PodcastResponse> topWatchedPodcastResponses = await _analyticService.GetTopWatchedPodcastsByUserAsync(count, getLessWatched, user, domainUrl, 0, 10);

        // Assert
        for (int i = 0; i < topWatchedPodcastResponses.Count; i++)
        {
            Assert.Equal(topWatchedPodcastResponses[i].Id, expectedTopWatchedPodcastResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopWatchedPodcastsByUserAsync_Data_ReturnsLessWatchedPodcasts()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        int count = 5;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        bool getLessWatched = true;

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = Guid.NewGuid() }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[0], PodcastId = podcasts[0].Id }, EpisodeId = podcasts[0].Id, TotalListenTime = TimeSpan.FromSeconds(5) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[2], PodcastId = podcasts[2].Id }, EpisodeId = podcasts[2].Id, TotalListenTime = TimeSpan.FromSeconds(3) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = new Episode { Podcast = podcasts[1], PodcastId = podcasts[1].Id }, EpisodeId = podcasts[1].Id, TotalListenTime = TimeSpan.FromSeconds(4) }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<PodcastResponse> expectedTopWatchedPodcastResponses = new()
        {
            new PodcastResponse { Id = podcasts[2].Id},
            new PodcastResponse { Id = podcasts[1].Id},
            new PodcastResponse { Id = podcasts[0].Id}
        };

        // Act
        List<PodcastResponse> topWatchedPodcastResponses = await _analyticService.GetTopWatchedPodcastsByUserAsync(count, getLessWatched, user, domainUrl, 0, 10);

        // Assert
        for (int i = 0; i < topWatchedPodcastResponses.Count; i++)
        {
            Assert.Equal(topWatchedPodcastResponses[i].Id, expectedTopWatchedPodcastResponses[i].Id);
        }
    }

    // GetTopWatchedEpisodesByUserAsync

    [Fact]
    public async Task GetTopWatchedEpisodesByUserAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = false;
        string domainUrl = "http://localhost:5000";
        int count = 5;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { new Podcast { Id = podcastId, PodcasterId = user.Id } }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act
        List<EpisodeResponse> topWatchedEpisodeResponses = await _analyticService.GetTopWatchedEpisodesByUserAsync(count, getLessWatched, user, domainUrl, 0, 10);

        // Assert
        Assert.Empty(topWatchedEpisodeResponses);
    }

    [Fact]
    public async Task GetTopWatchedEpisodesByUserAsync_NegativeCount_ThrowsException()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = false;
        string domainUrl = "http://localhost:5000";
        int count = -5;

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _analyticService.GetTopWatchedEpisodesByUserAsync(count, getLessWatched, user, domainUrl, 0, 10));
        Assert.Equal("Count cannot be less than or equal to 0.", exception.Message);
    }

    [Fact]
    public async Task GetTopWatchedEpisodesByUserAsync_Data_ReturnsTopWatchedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = false;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(3) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(4) }
        };

        episodes[0].UserEpisodeInteractions.Add(userEpisodeInteractions[1]);
        episodes[1].UserEpisodeInteractions.Add(userEpisodeInteractions[2]);
        episodes[2].UserEpisodeInteractions.Add(userEpisodeInteractions[0]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<EpisodeResponse> expectedTopWatchedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[0].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[2].Id}
        };

        // Act
        List<EpisodeResponse> topWatchedEpisodeResponses = await _analyticService.GetTopWatchedEpisodesByUserAsync(count, getLessWatched, user, domainUrl, 0, 10);

        // Assert
        for (int i = 0; i < topWatchedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topWatchedEpisodeResponses[i].Id, expectedTopWatchedEpisodeResponses[i].Id);
        }
    }

    [Fact]
    public async Task GetTopWatchedEpisodesByUserAsync_Data_ReturnsLessWatchedEpisodes()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        Guid podcastId = Guid.NewGuid();
        bool getLessWatched = true;
        string domainUrl = "XXXXXXXXXXXXXXXXXXXXX";
        int count = 5;

        Podcast podcast = new() { Id = podcastId, PodcasterId = user.Id };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcastId, Podcast = podcast },
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(4) },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(3) }
        };

        episodes[0].UserEpisodeInteractions.Add(userEpisodeInteractions[0]);
        episodes[1].UserEpisodeInteractions.Add(userEpisodeInteractions[1]);
        episodes[2].UserEpisodeInteractions.Add(userEpisodeInteractions[2]);

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(new[] { podcast }));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<EpisodeResponse> expectedTopWatchedEpisodeResponses = new()
        {
            new EpisodeResponse { Id = episodes[2].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[0].Id}
        };

        // Act
        List<EpisodeResponse> topWatchedEpisodeResponses = await _analyticService.GetTopWatchedEpisodesByUserAsync(count, getLessWatched, user, domainUrl, 0, 10);

        // Assert
        for (int i = 0; i < topWatchedEpisodeResponses.Count; i++)
        {
            Assert.Equal(topWatchedEpisodeResponses[i].Id, expectedTopWatchedEpisodeResponses[i].Id);
        }
    }


    // GetUserListeningHistoryAsync

    [Fact]
    public async Task GetUserListeningHistoryAsync_NoData_ReturnsEmptyList()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        string domainUrl = "http://localhost:5000";
        int skip = 0;
        int take = 10;

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(Array.Empty<Podcast>()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(Array.Empty<Episode>()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(Array.Empty<UserEpisodeInteraction>()));

        // Act
        List<EpisodeResponse> userListeningHistoryResponses = await _analyticService.GetUserListeningHistoryAsync(user, domainUrl, skip, take);

        // Assert
        Assert.Empty(userListeningHistoryResponses);
    }

    [Fact]
    public async Task GetUserListeningHistoryAsync_Data_ReturnsUserListeningHistory()
    {
        // Arrange
        User user = new() { Id = Guid.NewGuid() };
        string domainUrl = "http://localhost:5000";
        int skip = 0;
        int take = 10;

        List<Podcast> podcasts = new()
        {
            new Podcast { Id = Guid.NewGuid(), PodcasterId = user.Id },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = user.Id },
            new Podcast { Id = Guid.NewGuid(), PodcasterId = user.Id }
        };

        List<Episode> episodes = new()
        {
            new Episode { Id = Guid.NewGuid(), PodcastId = podcasts[0].Id, Podcast = podcasts[0] },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcasts[1].Id, Podcast = podcasts[1] },
            new Episode { Id = Guid.NewGuid(), PodcastId = podcasts[2].Id, Podcast = podcasts[2] }
        };

        List<UserEpisodeInteraction> userEpisodeInteractions = new()
        {
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[0], EpisodeId = episodes[0].Id, TotalListenTime = TimeSpan.FromSeconds(5), DateListened = DateTime.Now },
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[2], EpisodeId = episodes[2].Id, TotalListenTime = TimeSpan.FromSeconds(3), DateListened = DateTime.Now - TimeSpan.FromDays(2)},
            new UserEpisodeInteraction { UserId = user.Id, Episode = episodes[1], EpisodeId = episodes[1].Id, TotalListenTime = TimeSpan.FromSeconds(4), DateListened = DateTime.Now - TimeSpan.FromDays(1) }
        };

        _dbContextMock.Setup(db => db.Podcasts).Returns(CreateMockDbSet(podcasts.ToArray()));
        _dbContextMock.Setup(db => db.Episodes).Returns(CreateMockDbSet(episodes.ToArray()));
        _dbContextMock.Setup(db => db.UserEpisodeInteractions).Returns(CreateMockDbSet(userEpisodeInteractions.ToArray()));

        List<EpisodeResponse> expectedUserListeningHistoryResponses = new()
        {
            new EpisodeResponse { Id = episodes[0].Id},
            new EpisodeResponse { Id = episodes[1].Id},
            new EpisodeResponse { Id = episodes[2].Id}
        };

        // Act
        List<EpisodeResponse> userListeningHistoryResponses = await _analyticService.GetUserListeningHistoryAsync(user, domainUrl, skip, take);

        // Assert
        for (int i = 0; i < userListeningHistoryResponses.Count; i++)
        {
            Assert.Equal(userListeningHistoryResponses[i].Id, expectedUserListeningHistoryResponses[i].Id);
        }
    }

}