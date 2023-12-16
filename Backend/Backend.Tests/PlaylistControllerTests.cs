namespace Backend.Tests;

public class PlaylistControllerTests
{
    private readonly Mock<IPlaylistService> _playlistServiceMock;
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly Mock<ILogger> _loggerMock;
    private readonly Mock<HttpContext> _httpContextMock;
    private readonly PlaylistController _playlistController;

    public PlaylistControllerTests()
    {
        _playlistServiceMock = new Mock<IPlaylistService>();
        _authServiceMock = new Mock<IAuthService>();
        _loggerMock = new Mock<ILogger>();

        // Setup HttpContext mock
        _httpContextMock = new Mock<HttpContext>();
        _httpContextMock.Setup(context => context.Request.IsHttps).Returns(true);
        _httpContextMock.Setup(context => context.Request.Host).Returns(new HostString("example.com"));

        _playlistController = new PlaylistController(_playlistServiceMock.Object, _authServiceMock.Object, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }
        };
    }

    #region Create Playlist Tests

    [Fact]
    public async Task CreatePlaylist_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var request = new CreatePlaylistRequest();
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.CreatePlaylistAsync(request, user)).ReturnsAsync(true);

        // Act
        var result = await _playlistController.CreatePlaylist(request);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Playlist created.", (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task CreatePlaylist_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var request = new CreatePlaylistRequest();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.CreatePlaylist(request);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task CreatePlaylist_ServiceError_ReturnsOkResultWithErrorMessage()
    {
        // Arrange
        var request = new CreatePlaylistRequest();
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.CreatePlaylistAsync(request, user)).ReturnsAsync(false);

        // Act
        var result = await _playlistController.CreatePlaylist(request);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Failed to create playlist.", (result as OkObjectResult)?.Value);
    }

    #endregion Create Playlist Tests

    #region Edit Playlist Tests

    [Fact]
    public async Task EditPlaylist_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var request = new EditPlaylistRequest();
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.EditPlaylistAsync(playlistId, request, user)).ReturnsAsync(true);

        // Act
        var result = await _playlistController.EditPlaylist(playlistId, request);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Playlist updated.", (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task EditPlaylist_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var request = new EditPlaylistRequest();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.EditPlaylist(playlistId, request);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task EditPlaylist_ServiceError_ReturnsOkResultWithErrorMessage()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var request = new EditPlaylistRequest();
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.EditPlaylistAsync(playlistId, request, user)).ReturnsAsync(false);

        // Act
        var result = await _playlistController.EditPlaylist(playlistId, request);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Failed to update playlist.", (result as OkObjectResult)?.Value);
    }

    #endregion Edit Playlist Tests

    #region Add Episode To Playlist Tests

    [Fact]
    public async Task AddEpisodesToPlaylist_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new Guid[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.AddEpisodesToPlaylistAsync(playlistId, episodeIds, user)).ReturnsAsync(true);

        // Act
        var result = await _playlistController.AddEpisodesToPlaylist(playlistId, episodeIds);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Episode(s) added.", (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task AddEpisodesToPlaylist_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new Guid[] { Guid.NewGuid(), Guid.NewGuid() };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.AddEpisodesToPlaylist(playlistId, episodeIds);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task AddEpisodesToPlaylist_ServiceError_ReturnsOkResultWithErrorMessage()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new Guid[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.AddEpisodesToPlaylistAsync(playlistId, episodeIds, user)).ReturnsAsync(false);

        // Act
        var result = await _playlistController.AddEpisodesToPlaylist(playlistId, episodeIds);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Failed to add episode(s).", (result as OkObjectResult)?.Value);
    }

    #endregion Add Episode To Playlist Tests

    #region  Remove Episode From Playlist Tests

    [Fact]
    public async Task RemoveEpisodesFromPlaylist_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new Guid[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.RemoveEpisodesFromPlaylistAsync(playlistId, episodeIds, user)).ReturnsAsync(true);

        // Act
        var result = await _playlistController.RemoveEpisodesFromPlaylist(playlistId, episodeIds);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Episode(s) Removed.", (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task RemoveEpisodesFromPlaylist_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new Guid[] { Guid.NewGuid(), Guid.NewGuid() };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.RemoveEpisodesFromPlaylist(playlistId, episodeIds);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task RemoveEpisodesFromPlaylist_ServiceError_ReturnsOkResultWithErrorMessage()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new Guid[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.RemoveEpisodesFromPlaylistAsync(playlistId, episodeIds, user)).ReturnsAsync(false);

        // Act
        var result = await _playlistController.RemoveEpisodesFromPlaylist(playlistId, episodeIds);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Failed to remove episode(s).", (result as OkObjectResult)?.Value);
    }

    #endregion Remove Episode From Playlist Tests

    #region Delete Playlist Tests

    [Fact]
    public async Task DeletePlaylist_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.DeletePlaylistAsync(playlistId, user)).ReturnsAsync(true);

        // Act
        var result = await _playlistController.DeletePlaylist(playlistId);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Playlist Removed.", (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task DeletePlaylist_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.DeletePlaylist(playlistId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task DeletePlaylist_ServiceError_ReturnsOkResultWithErrorMessage()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.DeletePlaylistAsync(playlistId, user)).ReturnsAsync(false);

        // Act
        var result = await _playlistController.DeletePlaylist(playlistId);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Failed to remove playlist.", (result as OkObjectResult)?.Value);
    }

    #endregion Delete Playlist Tests

    #region Get My Playlists Tests

    [Fact]
    public async Task GetMyPlaylists_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var page = 1;
        var pageSize = 10;
        var domainUrl = "https://example.com";
        var user = new User { Id = Guid.NewGuid() };
        var playlists = new List<Playlist> { new() { User = user }, new() { User = user } };
        var playlistResponses = new List<PlaylistInfoResponse> { new(playlists[0], domainUrl), new(playlists[1], domainUrl) };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetUserPlaylistsAsync(user.Id, user, page, pageSize, It.IsAny<string>())).ReturnsAsync(playlistResponses);
        
        // Act
        var result = await _playlistController.GetMyPlaylists(page, pageSize);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal(playlistResponses, (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task GetMyPlaylists_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var page = 1;
        var pageSize = 10;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.GetMyPlaylists(page, pageSize);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task GetMyPlaylists_ServiceError_ReturnsBadRequestResult()
    {
        // Arrange
        var page = 1;
        var pageSize = 10;
        var user = new User { Id = Guid.NewGuid() };
        var errorMessage = "An error occurred while retrieving playlists.";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetUserPlaylistsAsync(user.Id, user, page, pageSize, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));
        
        // Act
        var result = await _playlistController.GetMyPlaylists(page, pageSize);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, (result as BadRequestObjectResult)?.Value);
    }

    #endregion Get My Playlists Tests

    #region Get User Playlists Tests

    [Fact]
    public async Task GetUserPlaylists_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var page = 1;
        var pageSize = 10;
        var user = new User() { Id = Guid.NewGuid() };
        var playlists = new List<Playlist>();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetUserPlaylistsAsync(userId, user, page, pageSize, It.IsAny<string>())).ReturnsAsync(new List<PlaylistInfoResponse>());
        
        // Act
        var result = await _playlistController.GetUserPlaylists(userId, page, pageSize);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal(playlists, (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task GetUserPlaylists_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var page = 1;
        var pageSize = 10;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.GetUserPlaylists(userId, page, pageSize);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task GetUserPlaylists_ServiceError_ReturnsBadRequestResult()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var page = 1;
        var pageSize = 10;
        var user = new User();
        var errorMessage = "Failed to get user playlists.";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetUserPlaylistsAsync(userId, user, page, pageSize, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _playlistController.GetUserPlaylists(userId, page, pageSize);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, (result as BadRequestObjectResult)?.Value);
    }

    #endregion Get User Playlists Tests

    #region Get All Playlists Tests

    [Fact]
    public async Task GetAllPlaylists_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var page = 1;
        var pageSize = 10;
        var user = new User();
        var playlists = new List<Playlist>();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetAllPlaylistsAsync(user, page, pageSize, It.IsAny<string>())).ReturnsAsync(new List<PlaylistInfoResponse>());

        // Act
        var result = await _playlistController.GetAllPlaylists(page, pageSize);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal(playlists, (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task GetAllPlaylists_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var page = 1;
        var pageSize = 10;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.GetAllPlaylists(page, pageSize);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task GetAllPlaylists_ServiceError_ReturnsBadRequestResult()
    {
        // Arrange
        var page = 1;
        var pageSize = 10;
        var user = new User();
        var errorMessage = "An error occurred.";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetAllPlaylistsAsync(user, page, pageSize, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _playlistController.GetAllPlaylists(page, pageSize);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, (result as BadRequestObjectResult)?.Value);
    }

    #endregion Get All Playlists Tests

    #region Search Playlists Tests

    [Fact]
    public async Task SearchPlaylists_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var searchTerm = "test";
        var page = 1;
        var pageSize = 10;
        var domainUrl = "https://example.com";
        var user = new User { Id = Guid.NewGuid() };
        var playlists = new List<Playlist> { new() { User = user }, new() { User = user } };
        var playlistResponses = new List<PlaylistInfoResponse> { new(playlists[0], domainUrl), new(playlists[1], domainUrl) };

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.SearchPlaylistsAsync(searchTerm, user, page, pageSize, It.IsAny<string>())).ReturnsAsync(playlistResponses);

        // Act
        var result = await _playlistController.SearchPlaylists(searchTerm, page, pageSize);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.IsType<List<PlaylistInfoResponse>>((result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task SearchPlaylists_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var searchTerm = "test";
        var page = 1;
        var pageSize = 10;

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.SearchPlaylists(searchTerm, page, pageSize);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task SearchPlaylists_ServiceError_ReturnsBadRequestResult()
    {
        // Arrange
        var searchTerm = "test";
        var page = 1;
        var pageSize = 10;
        var user = new User();
        var errorMessage = "Failed to search playlists.";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.SearchPlaylistsAsync(searchTerm, user, page, pageSize, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _playlistController.SearchPlaylists(searchTerm, page, pageSize);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, (result as BadRequestObjectResult)?.Value);
    }
    
    #endregion Search Playlists Tests
    
    #region Get Playlist Tests

    [Fact]
    public async Task GetPlaylist_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var user = new User();
        var domainUrl = "https://example.com";
        var expectedPlaylist = new Playlist(){ User = user};
        var expectedPlaylistResponse = new PlaylistResponse(expectedPlaylist, domainUrl);

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetPlaylistEpisodesAsync(playlistId, user, It.IsAny<string>())).ReturnsAsync(expectedPlaylistResponse);

        // Act
        var result = await _playlistController.GetPlaylist(playlistId);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedPlaylistResponse, (result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task GetPlaylist_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.GetPlaylist(playlistId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task GetPlaylist_ServiceError_ReturnsBadRequestResult()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var user = new User();
        var errorMessage = "Failed to get playlist episodes.";

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetPlaylistEpisodesAsync(playlistId, user, It.IsAny<string>())).ThrowsAsync(new Exception(errorMessage));

        // Act
        var result = await _playlistController.GetPlaylist(playlistId);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(errorMessage, (result as BadRequestObjectResult)?.Value);
    }

    #endregion Get Playlist Tests

    #region Get Liked Episodes Playlist Tests

    [Fact]
    public async Task GetLikedEpisodesPlaylist_ValidRequest_ReturnsOkResult()
    {
        // Arrange
        var user = new User();
        var domainUrl = "https://example.com";
        var expectedPlaylist = new Playlist(){ User = user};
        var expectedPlaylistResponse = new PlaylistResponse(expectedPlaylist, domainUrl);

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetLikedEpisodesPlaylist(user, It.IsAny<string>())).ReturnsAsync(expectedPlaylistResponse);

        // Act
        var result = await _playlistController.GetLikedEpisodesPlaylist();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.IsType<PlaylistResponse>((result as OkObjectResult)?.Value);
    }

    [Fact]
    public async Task GetLikedEpisodesPlaylist_UserNotFound_ReturnsNotFoundResult()
    {
        // Arrange
        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync((User?)null);

        // Act
        var result = await _playlistController.GetLikedEpisodesPlaylist();

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("User does not exist.", (result as NotFoundObjectResult)?.Value);
    }

    [Fact]
    public async Task GetLikedEpisodesPlaylist_ServiceError_ReturnsBadRequestResult()
    {
        // Arrange
        var user = new User();

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).ReturnsAsync(user);
        _playlistServiceMock.Setup(service => service.GetLikedEpisodesPlaylist(user, It.IsAny<string>())).ThrowsAsync(new Exception("Service error"));

        // Act
        var result = await _playlistController.GetLikedEpisodesPlaylist();

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Service error", (result as BadRequestObjectResult)?.Value);
    }

    #endregion Get Liked Episodes Playlist Tests
}