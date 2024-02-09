
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
    public async Task GetAgeRangeInfoAsync_EpisodeExistsAndNoData_ThrowsException(){
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

}
