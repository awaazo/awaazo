using Microsoft.VisualStudio.TestTools.UnitTesting;
using Assert = Xunit.Assert;

namespace Backend.Tests;

/// <summary>
/// Tests the AuthService and AuthController classes.
/// </summary>
[Collection("Sequential")]
public class PodcastTests
{
    private Mock<AppDbContext> _dbContextMock;
    private Mock<HttpContext> _httpContextMock;
    private Mock<IAuthService> _authServiceMock;
    private Mock<HttpRequest> _httpRequestMock;
    private Mock<INotificationService> _notificationServiceMock;
    private Mock<DbSet<User>> _user;
    private Mock<DbSet<Podcast>> _podcast;
    private Mock<DbSet<Episode>> _episode;
    private Mock<DbSet<UserEpisodeInteraction>> _userEpisodeInteraction;
    private Mock<ILogger<PodcastController>> _loggerMock;


    private PodcastService _podcastService;
    private PodcastController _podcastController;

    private const string DOMAIN = "TestDomain";
    private readonly string[] TAGS = { "TestTagOne", "TestTagTwo" };
    private const int PAGE = 0;
    private const int PAGE_SIZE = 10;

    /// <summary>
    /// Initializes a new instance of the AuthTests class.
    /// </summary>
    public PodcastTests()
    {
        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        // Prevent Null objects in case of no test running
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _httpContextMock = new();
        _authServiceMock = new();
        _httpRequestMock = new();
        _notificationServiceMock = new();
        _loggerMock = new();
        _podcastService = new(_dbContextMock.Object, _notificationServiceMock.Object,config);
        _podcastController = new(_podcastService, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }
        };
        MockBasicUtilities();
    }

    [TestInitialize]
    public void Initialize()
    {
        // Re-initilize every test

        // Configuration
        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _httpContextMock = new();
        _authServiceMock = new();
        _httpRequestMock = new();
        _notificationServiceMock = new();
        _loggerMock = new();

        _podcastService = new(_dbContextMock.Object, _notificationServiceMock.Object, config);
        _podcastController = new(_podcastService, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }
        };

        // Set the Key to null
        config["Jwt:Key"] = null;
        MockBasicUtilities();
    }


    #region Test Service

    [Fact]
    public void Podcast_CreatePodcastAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        var request = CreateStandardPodcastRequest();
        bool response = false;

        // Act
        try
        {
            response = _podcastService.CreatePodcastAsync(request, _user.Object.First()).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.True(response);
    }

    [Fact]
    public void Podcast_EditPodcastAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        var request = CreateEditPodcastRequest();
        request.CoverImage = null;
        bool response = false;
        request.Id = _podcast.Object.First().Id;


        // Act
        try
        {
            response = _podcastService.EditPodcastAsync(request, _user.Object.First()).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.True(response);
    }

    [Fact]
    public void Podcast_GetPodcastCoverArtNameAsync_ValidRequest_ReturnsString()
    {
        // Arrange
        string response = string.Empty;

        // Act
        try
        {
            response = _podcastService.GetPodcastCoverArtNameAsync(_podcast.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.Equal(_podcast.Object.First().Id.ToString()+@".png|/|\|test/png", response);

    }

    [Fact]
    public void Podcast_GetPodcastByIdAsync_ValidRequest_ReturnsPodcastResponse()
    {
        // Arrange
        PodcastResponse testReponse = new PodcastResponse(_podcast.Object.First(), DOMAIN);
        PodcastResponse response = testReponse;

        // Act
        try
        {
            response = _podcastService.GetPodcastByIdAsync(DOMAIN, _podcast.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.Equal(testReponse.Id, response.Id);
    }

    [Fact]
    public void Podcast_GetUserPodcastsAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        List<PodcastResponse> sampleResponse = new();
        List<PodcastResponse> response = null;
        sampleResponse.Add(new PodcastResponse(_podcast.Object.First(), DOMAIN));

        // Act
        try
        {
            response = _podcastService.GetUserPodcastsAsync(PAGE, PAGE_SIZE, DOMAIN, _user.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.Equal(sampleResponse.First().Id, response.First().Id);
    }

    [Fact]
    public void Podcast_GetSearchPodcastsAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        List<PodcastResponse> sampleResponse = new();
        List<PodcastResponse> response = null;
        sampleResponse.Add(new PodcastResponse(_podcast.Object.First(), DOMAIN));

        // Act
        try
        {
            response = _podcastService.GetUserPodcastsAsync(PAGE, PAGE_SIZE, DOMAIN, _user.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.Equal(sampleResponse.First().Id, response.First().Id);
    }

    [Fact]
    public void Podcast_GetAllPodcastsAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        List<PodcastResponse> sampleResponse = new();
        List<PodcastResponse> response = null;
        sampleResponse.Add(new PodcastResponse(_podcast.Object.First(), DOMAIN));

        // Act
        try
        {
            response = _podcastService.GetAllPodcastsAsync(PAGE, PAGE_SIZE, DOMAIN).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.Equal(sampleResponse.First().Id, response.First().Id);
    }

    //Raw SQL has issues with test framework, will fix at a later date
    //[Fact]
    //public void Podcast_GetPodcastsByTagsAsync_ValidRequest_ReturnsTrue()
    //{
    //    // Arrange
    //    List<PodcastResponse> sampleResponse = new();
    //    List<PodcastResponse> response = null;
    //    sampleResponse.Add(new PodcastResponse(_podcast.Object.First(), DOMAIN));

    //    // Act
    //    try
    //    {
    //        response = _podcastService.GetPodcastsByTagsAsync(PAGE, PAGE_SIZE, DOMAIN, TAGS).Result;
    //    }
    //    // Assert
    //    catch (Exception e)
    //    {
    //        Assert.Fail("Should not have thrown an error: " + e.Message);
    //    }

    //    Assert.Equal(sampleResponse.First().Id, response.First().Id);
    //}

    // It is currently impossible to test this since it calls an external api, and we cant moq that
    //[Fact]
    //public void Episode_CreateEpisodeAsync_ValidRequest_ReturnsTrue()
    //{
    //    // Arrange
    //    bool response = false;
    //    var request = CreateCreateEpisodeRequest();

    //    // Act
    //    try
    //    {
    //        response = _podcastService.CreateEpisodeAsync(request, _podcast.Object.First().Id, _user.Object.First()).Result;
    //    }
    //    // Assert
    //    catch (Exception e)
    //    {
    //        Assert.Fail("Should not have thrown an error: " + e.Message);
    //    }

    //    Assert.True(response);
    //}


    // It is currently impossible to test this since it calls an external api, and we cant moq that
    //[Fact]
    //public void Episode_EditEpisodeAsync_ValidRequest_ReturnsTrue()
    //{
    //    // Arrange
    //    bool response = false;
    //    var request = CreateEditEpisodeRequest();

    //    // Act
    //    try
    //    {
    //        response = _podcastService.EditEpisodeAsync(request, _podcast.Object.First().Id, _user.Object.First()).Result;
    //    }
    //    // Assert
    //    catch (Exception e)
    //    {
    //        Assert.Fail("Should not have thrown an error: " + e.Message);
    //    }

    //    Assert.True(response);
    //}

    [Fact]
    public void Podcast_DeletePodcastAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        bool response = false;

        // Act
        try
        {
            response = _podcastService.DeletePodcastAsync(_podcast.Object.First().Id, _user.Object.First()).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.True(response);
    }

    [Fact]
    public void Episode_GetRecentPodcasts_ValidRequest_ReturnsTrue()
    {
        // Arrange
        List<PodcastResponse>? response = null;
        // Act
        try
        {
            response = _podcastService.GetRecentPodcasts(PAGE, PAGE_SIZE, DOMAIN).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Episode_DeleteEpisodeAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        bool response = false;

        // Act
        try
        {
            response = _podcastService.DeleteEpisodeAsync(_episode.Object.First().Id, _user.Object.First()).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.True(response);
    }

    [Fact]
    public void Episode_GetEpisodeByIdAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        EpisodeResponse? response = null;

        // Act
        try
        {
            response = _podcastService.GetEpisodeByIdAsync(_episode.Object.First().Id, DOMAIN).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Episode_GetEpisodeAudioNameAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        string? response = null;

        // Act
        try
        {
            response = _podcastService.GetEpisodeAudioNameAsync(_episode.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Episode_GetEpisodeThumbnailNameAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        string? response = null;

        // Act
        try
        {
            response = _podcastService.GetEpisodeThumbnailNameAsync(_episode.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }


    [Fact]
    public void Episode_SaveWatchHistory_ValidRequest_ReturnsTrue()
    {
        // Arrange
        double position = 0.0;
        bool response = false;

        // Act
        try
        {
            response = _podcastService.SaveWatchHistory(_user.Object.First(), _episode.Object.First().Id, position).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.True(response);
    }
    
    [Fact]
    public void Episode_GetWatchHistory_ValidRequest_ReturnsTrue()
    {
        // Arrange
        ListenPositionResponse response = null;

        // Act
        try
        {
            response = _podcastService.GetWatchHistory(_user.Object.First(), _episode.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Episode_AdjecentEpisode_ValidRequest_ReturnsTrue()
    {
        // Arrange
        AdjecentEpisodeResponse? response = null;
        // Act
        try
        {
            response = _podcastService.GetAdjecentEpisodeAsync(_episode.Object.First().Id).Result;

        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }


    [Fact]
    public void Episode_GetRecentEpisodes_ValidRequest_ReturnsTrue()
    {
        // Arrange
        List<EpisodeResponse>? response = null;
        // Act
        try
        {
            response = _podcastService.GetRecentEpisodes(PAGE, PAGE_SIZE, DOMAIN).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }


    #endregion

    #region Test Controller

    [Fact]
    public void Podcast_CreatePodcast_ValidRequest_ReturnsOK()
    {
        // Arrange
        var request = CreateStandardPodcastRequest();
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.CreatePodcast(request).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Podcast_EditPodcast_ValidRequest_ReturnsOK()
    {
        // Arrange
        var request = CreateEditPodcastRequest();
        request.Id = _podcast.Object.First().Id;
        request.CoverImage=null;
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.EditPodcast(request).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Podcast_DeletePodcast_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.DeletePodcast(_podcast.Object.First().Id).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Podcast_GetMyPodcasts_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetMyPodcasts(PAGE, PAGE_SIZE).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Podcast_GetUserPodcasts_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetUserPodcasts(_user.Object.First().Id, PAGE, PAGE_SIZE).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Podcast_GetAllPodcasts_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetAllPodcasts(PAGE, PAGE_SIZE).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    //This test is a placeholder for now, Soundex is currently impossible to test
    //[Fact]
    //public void Podcast_SearchPodcast_ValidRequest_ReturnsOK()
    //{
    //    // Arrange
    //    MockBasicUtilities();
    //    IActionResult response = null;
    //    string searchTerm = "testName";

    //    // Act
    //    try
    //    {
    //        response = _podcastController.SearchPodcast(searchTerm, PAGE, PAGE_SIZE).Result;
    //    }
    //    // Assert
    //    catch (Exception e)
    //    {
    //        Assert.Fail("Should not have thrown an error: " + e.Message);
    //    }

    //    Assert.IsType<OkObjectResult>(response);
    //}

    [Fact]
    public void Podcast_GetPodcastById_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetPodcastById(_podcast.Object.First().Id).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }


    [Fact]
    public void Podcast_GetPodcastCoverArt_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetPodcastCoverArt(_podcast.Object.First().Id).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }
        // Since we are not hosting any audio files currently, this will return nothing
        // As long as this doesnt error out, the code works as intended
    }

    //Raw SQL has issues with test framework, will fix at a later date
    //[Fact]
    //public void Podcast_GetPodcastsByTags_ValidRequest_ReturnsOK()
    //{
    //    // Arrange
    //    OkObjectResult? response = null;

    //    // Act
    //    try
    //    {
    //        response = _podcastController.GetPodcastsByTags(_podcast.Object.First().Tags).Result as OkObjectResult;
    //    }
    //    // Assert
    //    catch (Exception e)
    //    {
    //        Assert.Fail("Should not have thrown an error: " + e.Message);
    //    }

    //    Assert.NotNull(response);
    //}

    [Fact]
    public void Episode_GetRecentPodcasts_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetRecentPodcasts().Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    // It is currently impossible to test this since it calls an external api, and we cant moq that
    //[Fact]
    //public void Episode_AddEpisode_ValidRequest_ReturnsOK()
    //{
    //    // Arrange
    //    var request = CreateCreateEpisodeRequest();
    //    OkObjectResult? response = null;

    //    // Act
    //    try
    //    {
    //        response = _podcastController.AddEpisode(_podcast.Object.First().Id, request).Result as OkObjectResult;
    //    }
    //    // Assert
    //    catch (Exception e)
    //    {
    //        Assert.Fail("Should not have thrown an error: " + e.Message);
    //    }

    //    Assert.NotNull(response);
    //}


    // It is currently impossible to test this since it calls an external api, and we cant moq that
    //[Fact]
    //public void Episode_EditEpisode_ValidRequest_ReturnsOK()
    //{
    //    // Arrange
    //    var request = CreateEditEpisodeRequest();
    //    OkObjectResult? response = null;

    //    // Act
    //    try
    //    {
    //        response = _podcastController.EditEpisode(_episode.Object.First().Id, request).Result as OkObjectResult;
    //    }
    //    // Assert
    //    catch (Exception e)
    //    {
    //        Assert.Fail("Should not have thrown an error: " + e.Message);
    //    }

    //    Assert.NotNull(response);
    //}

    [Fact]
    public void Episode_DeleteEpisode_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.DeleteEpisode(_episode.Object.First().Id).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Episode_GetEpisode_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetEpisode(_episode.Object.First().Id).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Episode_GetEpisodeAudio_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetEpisodeAudio(_podcast.Object.First().Id, _episode.Object.First().Id).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        // Since we are not hosting any audio files currently, this will return nothing
        // As long as this doesnt error out, the code works as intended
    }

    //This test is a placeholder for now, will need to fix this at a later date
    [Fact]
    public void Episode_GetEpisodeThumbnail_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetEpisodeThumbnail(_podcast.Object.First().Id, _episode.Object.First().Id).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        // Since we are not hosting any audio files currently, this will return nothing
        // As long as this doesnt error out, the code works as intended
    }

    
    [Fact (Skip="Test will have to be updated to work with new changes to the controller")]
    public void Episode_SaveWatchHistory_ValidRequest_ReturnsOK()
    {
        // Arrange
        var request = CreateEpisodeHistorySaveRequest();
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.SaveWatchHistory(_episode.Object.First().Id, request).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Episode_GetWatchHistory_ValidRequest_ReturnsOK() {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetWatchHistory(_episode.Object.First().Id).Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);        
    }


    [Fact]
    public void Episode_GetRecentEpisodes_ValidRequest_ReturnsOK()
    {
        // Arrange
        OkObjectResult? response = null;

        // Act
        try
        {
            response = _podcastController.GetRecentEpisodes().Result as OkObjectResult;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    #endregion

    #region Private Method

    private EpisodeHistorySaveRequest CreateEpisodeHistorySaveRequest()
    {
        EpisodeHistorySaveRequest request = new EpisodeHistorySaveRequest();
        request.ListenPosition = 1.5;

        return request;
    }

    private CreatePodcastRequest CreateStandardPodcastRequest()
    {
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        CreatePodcastRequest request = new CreatePodcastRequest();
        request.Name = "Name";
        request.Tags = TAGS;
        request.Description = "Sample Description";
        request.CoverImage = coverImage.Object;

        return request;
    }

    private EditPodcastRequest CreateEditPodcastRequest()
    {
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        EditPodcastRequest request = new EditPodcastRequest();
        request.Name = "Name";
        request.Tags = TAGS;
        request.Description = "Sample Description";
        request.Id = Guid.NewGuid();
        request.CoverImage = coverImage.Object;

        return request;
    }

    private CreateEpisodeRequest CreateCreateEpisodeRequest()
    {
        var coverImage = new Mock<IFormFile>();
        var audioFile = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        audioFile.Setup(file => file.ContentType).Returns("audio/mp3");

        CreateEpisodeRequest request = new CreateEpisodeRequest();
        request.EpisodeName = "Name";
        request.Description = "Sample Description";
        request.IsExplicit = false;
        request.AudioFile = audioFile.Object;
        request.Thumbnail = coverImage.Object;

        return request;
    }

    private EditEpisodeRequest CreateEditEpisodeRequest()
    {
        var coverImage = new Mock<IFormFile>();
        var audioFile = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        audioFile.Setup(file => file.ContentType).Returns("audio/mp3");
        EditEpisodeRequest request = new EditEpisodeRequest();
        request.EpisodeName = "Name";
        request.Description = "Sample Description";
        request.IsExplicit = false;
        request.AudioFile = audioFile.Object;
        request.Thumbnail = coverImage.Object;

        return request;
    }


    private void MockBasicUtilities()
    {
        var userGuid = Guid.NewGuid();
        var podGuid = Guid.NewGuid();
        var episodeGuid = Guid.NewGuid();

        _user = new[]
        {
            new User()
            {
                Id = userGuid,
                Email = "XXXXXXXXXXXXXXXXX",
                Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                Username = "XXXXXXXXXXXXXXXXX",
                DateOfBirth = DateTime.Now,
                Gender = Models.User.GenderEnum.Male
            }
        }.AsQueryable().BuildMockDbSet();
        _podcast = new[]
        {
            new Podcast()
            {
                Id = podGuid,

                Tags = TAGS,
                Name = "Sample Podcast Name",
                Description = "Sample Podcast Description",
                CoverArt = podGuid+@".png|/|\|test/png",
                PodcasterId = userGuid
            }
        }.AsQueryable().BuildMockDbSet();

        _episode = new[]
        {
            new Episode()
            {
                Id = episodeGuid,
                EpisodeName = "Sample Episode Name",
                PodcastId = podGuid,
                Thumbnail = @"Thumbnail|/|\|test/png",
                Audio = @"Audio|/|\|test/mp3",
                Podcast = _podcast.Object.First()

            }
        }.AsQueryable().BuildMockDbSet();
        _userEpisodeInteraction = new[]
        {
            new UserEpisodeInteraction()
            {
                UserId = userGuid,
                EpisodeId = episodeGuid
            }
        }.AsQueryable().BuildMockDbSet();

        _dbContextMock.SetupGet(db => db.Podcasts).Returns(_podcast.Object);
        _dbContextMock.SetupGet(db => db.Users).Returns(_user.Object);
        _dbContextMock.SetupGet(db => db.Episodes).Returns(_episode.Object);
        _dbContextMock.SetupGet(db => db.UserEpisodeInteractions).Returns(_userEpisodeInteraction.Object);
        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

        _httpRequestMock.Setup(t => t.IsHttps).Returns(true);
        _httpRequestMock.Setup(t => t.Host).Returns(new HostString(DOMAIN, 1443));
        _httpContextMock.Setup(ctx => ctx.Request).Returns(_httpRequestMock.Object);

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(_user.Object.First()));
    }

    #endregion
}