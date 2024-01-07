namespace Backend.Tests;

public class PlaylistServiceTests
{
    private readonly Mock<AppDbContext> _dbContextMock;
    private readonly PlaylistService _playlistService;

    public PlaylistServiceTests()
    {
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _playlistService = new PlaylistService(_dbContextMock.Object);
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

    #region Create Playlist Tests

    [Fact]
    public async Task CreatePlaylistAsync_PlaylistDoesNotExist_CreatesPlaylistAndEpisodes()
    {
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        // Arrange
        var request = new CreatePlaylistRequest
        {
            Name = "New Playlist Name",
            Description = "New Playlist Description",
            Privacy = "Public",
            EpisodeIds = new List<Guid> { Guid.NewGuid(), Guid.NewGuid() }.ToArray(),
            CoverArt = coverImage.Object

        };
        var user = new User
        {
            Id = Guid.NewGuid()
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(Array.Empty<Playlist>()));
        _dbContextMock.Setup(db => db.Episodes)
            .Returns(CreateMockDbSet(new[] { new Episode { Id = request.EpisodeIds[0] }, new Episode { Id = request.EpisodeIds[1] } }));
        _dbContextMock.Setup(db => db.PlaylistEpisodes.AddRangeAsync(It.IsAny<IEnumerable<PlaylistEpisode>>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _playlistService.CreatePlaylistAsync(request, user);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task CreatePlaylistAsync_PlaylistExists_ThrowsException()
    {
        // Arrange
        var request = new CreatePlaylistRequest
        {
            Name = "Existing Playlist Name",
            Description = "New Playlist Description",
            Privacy = "Public",
            EpisodeIds = new List<Guid> { Guid.NewGuid(), Guid.NewGuid() }.ToArray()
        };
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var existingPlaylist = new Playlist
        {
            Name = request.Name,
            UserId = user.Id
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { existingPlaylist }));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _playlistService.CreatePlaylistAsync(request, user));
        Assert.Equal("Playlist with the same name already exists.", exception.Message);
    }

    [Fact]
    public async Task CreatePlaylistAsync_EpisodeDoesNotExist_ThrowsException()
    {
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        // Arrange
        var request = new CreatePlaylistRequest
        {
            Name = "New Playlist Name",
            Description = "New Playlist Description",
            Privacy = "Public",
            EpisodeIds = new List<Guid> { Guid.NewGuid(), Guid.NewGuid() }.ToArray(),
            CoverArt = coverImage.Object
        };
        var user = new User
        {
            Id = Guid.NewGuid()
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(Array.Empty<Playlist>()));
        _dbContextMock.Setup(db => db.Episodes)
            .Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _playlistService.CreatePlaylistAsync(request, user));
        Assert.Equal("One or more episodes do not exist in the database.", exception.Message);
    }

    #endregion Create Playlist Tests

    #region Edit Playlist Tests

    [Fact]
    public async Task EditPlaylistAsync_PlaylistExists_ReturnsTrue()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var request = new EditPlaylistRequest
        {
            Name = "New Playlist Name",
            Description = "New Playlist Description",
            Privacy = "Public"
        };
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var playlist = new Playlist
        {
            Id = playlistId,
            UserId = user.Id,
            IsHandledByUser = true
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));
        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _playlistService.EditPlaylistAsync(playlistId, request, user);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task EditPlaylistAsync_PlaylistDoesNotExist_ThrowsException()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var request = new EditPlaylistRequest
        {
            Name = "New Playlist Name",
            Description = "New Playlist Description",
            Privacy = "Public"
        };
        var user = new User
        {
            Id = Guid.NewGuid()
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(Array.Empty<Playlist>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _playlistService.EditPlaylistAsync(playlistId, request, user));
        Assert.Equal("Playlist does not exist.", exception.Message);
    }

    #endregion Edit Playlist Tests

    #region Delete Playlist Tests

    [Fact]
    public async Task DeletePlaylistAsync_PlaylistExists_ReturnsTrue()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var playlist = new Playlist
        {
            Id = playlistId,
            UserId = user.Id,
            IsHandledByUser = true,
            CoverArt = playlistId + @".png|/|\|test/png"
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));
        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _playlistService.DeletePlaylistAsync(playlistId, user);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task DeletePlaylistAsync_PlaylistDoesNotExist_ThrowsException()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var user = new User
        {
            Id = Guid.NewGuid()
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(Array.Empty<Playlist>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _playlistService.DeletePlaylistAsync(playlistId, user));
        Assert.Equal("Playlist does not exist for the given ID.", exception.Message);
    }

    #endregion Delete Playlist Tests

    #region Add Episodes To Playlist Tests

    [Fact]
    public async Task AddEpisodesToPlaylistAsync_PlaylistExistsAndEpisodesExist_ReturnsTrue()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var playlist = new Playlist
        {
            Id = playlistId,
            UserId = user.Id,
            IsHandledByUser = true
        };
        var episodes = episodeIds.Select(episodeId => new Episode
        {
            Id = episodeId
        }).ToArray();

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));
        _dbContextMock.Setup(db => db.Episodes)
            .Returns(CreateMockDbSet(episodes));
        _dbContextMock.Setup(db => db.PlaylistEpisodes)
            .Returns(CreateMockDbSet(Array.Empty<PlaylistEpisode>()));
        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _playlistService.AddEpisodesToPlaylistAsync(playlistId, episodeIds, user);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task AddEpisodesToPlaylistAsync_PlaylistDoesNotExist_ThrowsException()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User
        {
            Id = Guid.NewGuid()
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(Array.Empty<Playlist>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _playlistService.AddEpisodesToPlaylistAsync(playlistId, episodeIds, user));
        Assert.Equal("Playlist does not exist.", exception.Message);
    }

    [Fact]
    public async Task AddEpisodesToPlaylistAsync_EpisodeDoesNotExist_ThrowsException()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var playlist = new Playlist
        {
            Id = playlistId,
            UserId = user.Id,
            IsHandledByUser = true
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));
        _dbContextMock.Setup(db => db.Episodes)
            .Returns(CreateMockDbSet(Array.Empty<Episode>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _playlistService.AddEpisodesToPlaylistAsync(playlistId, episodeIds, user));
        Assert.Equal("One or more episodes do not exist in the database.", exception.Message);
    }

    [Fact]
    public async Task AddEpisodesToPlaylistAsync_EpisodeAlreadyInPlaylist_DoesNotAddToPlaylist()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var playlist = new Playlist
        {
            Id = playlistId,
            UserId = user.Id,
            IsHandledByUser = true
        };
        var episodes = episodeIds.Select(episodeId => new Episode
        {
            Id = episodeId
        }).ToArray();
        var playlistEpisodes = episodeIds.Select(episodeId => new PlaylistEpisode
        {
            EpisodeId = episodeId,
            PlaylistId = playlistId
        }).ToArray();

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));
        _dbContextMock.Setup(db => db.Episodes)
            .Returns(CreateMockDbSet(episodes));
        _dbContextMock.Setup(db => db.PlaylistEpisodes)
            .Returns(CreateMockDbSet(playlistEpisodes));

        // Act
        var result = await _playlistService.AddEpisodesToPlaylistAsync(playlistId, episodeIds, user);

        // Assert
        Assert.False(result);
    }

    #endregion Add Episodes To Playlist Tests

    #region Remove Episodes From Playlist Tests

    [Fact]
    public async Task RemoveEpisodesFromPlaylistAsync_PlaylistExistsAndEpisodesExist_ReturnsTrue()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var playlist = new Playlist
        {
            Id = playlistId,
            UserId = user.Id,
            IsHandledByUser = true
        };
        var playlistEpisodes = episodeIds.Select(episodeId => new PlaylistEpisode
        {
            PlaylistId = playlistId,
            EpisodeId = episodeId
        }).ToArray();

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));
        _dbContextMock.Setup(db => db.PlaylistEpisodes)
            .Returns(CreateMockDbSet(playlistEpisodes));
        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        // Act
        var result = await _playlistService.RemoveEpisodesFromPlaylistAsync(playlistId, episodeIds, user);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task RemoveEpisodesFromPlaylistAsync_PlaylistDoesNotExist_ThrowsException()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User
        {
            Id = Guid.NewGuid()
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(Array.Empty<Playlist>()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _playlistService.RemoveEpisodesFromPlaylistAsync(playlistId, episodeIds, user));
        Assert.Equal("Playlist does not exist for the given ID.", exception.Message);
    }

    [Fact]
    public async Task RemoveEpisodesFromPlaylistAsync_PlaylistExistsAndEpisodesDoNotExist_ReturnsFalse()
    {
        // Arrange
        var playlistId = Guid.NewGuid();
        var episodeIds = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var playlist = new Playlist
        {
            Id = playlistId,
            UserId = user.Id,
            IsHandledByUser = true
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));
        _dbContextMock.Setup(db => db.PlaylistEpisodes)
            .Returns(CreateMockDbSet(Array.Empty<PlaylistEpisode>()));

        // Act
        var result = await _playlistService.RemoveEpisodesFromPlaylistAsync(playlistId, episodeIds, user);

        // Assert
        Assert.False(result);
    }

    #endregion Remove Episodes From Playlist Tests

    #region Get Liked Episodes Playlist Tests

    [Fact]
    public async Task GetLikedEpisodesPlaylist_ReturnsPlaylistResponse()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var podcastGuid = Guid.NewGuid();
        var podcast = new Podcast
        {
            Id = podcastGuid,
            Name = "test",
        };

        var domainUrl = "https://example.com";

        var playlistId = Guid.NewGuid();

        var episode = new Episode
        {
            Id = Guid.NewGuid(),
            Podcast = podcast,
            PodcastId = podcastGuid
            
        };

        var playlist = new Playlist
        {
            Id = Guid.NewGuid(),
            Name = "Liked Episodes",
            UserId = user.Id,
            IsHandledByUser = false,
            User = user,
            PlaylistEpisodes = {
                new PlaylistEpisode()
                {
                    PlaylistId = playlistId,
                    Episode = episode
                }
            }
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));

        // Act
        var result = await _playlistService.GetLikedEpisodesPlaylist(user, domainUrl);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(playlist.Id, result.Id);
        Assert.Equal(playlist.Name, result.Name);
        Assert.Equal(user.Id, result.User.Id);
        Assert.Single(result.PlaylistEpisodes);
        Assert.Equal(episode.Id, result.PlaylistEpisodes[0].Id);
    }

    #endregion Get Liked Episodes Playlist Tests

    #region Get Playlist Episodes Tests

    [Fact]
    public async Task GetPlaylistEpisodesAsync_PlaylistExists_ReturnsPlaylistResponse()
    {
        // Arrange
        var playlistId = Guid.NewGuid();

        var user = new User
        {
            Id = Guid.NewGuid()
        };

        var domainUrl = "https://example.com";

        var podcastGuid = Guid.NewGuid();
        var podcast = new Podcast
        {
            Id = podcastGuid,
            Name = "test",
        };


        var playlist = new Playlist
        {
            Id = playlistId,
            UserId = user.Id,
            Privacy = Playlist.PrivacyEnum.Public,
            User = user,
            PlaylistEpisodes =
            {
            new PlaylistEpisode
            {
                PlaylistId = playlistId,
                Episode = new Episode()
                {
                    Podcast = podcast,
                    PodcastId = podcastGuid
                },
                
                
            }
        }
        };

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(new[] { playlist }));

        // Act
        var result = await _playlistService.GetPlaylistEpisodesAsync(playlistId, user, domainUrl);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(playlistId, result.Id);
        Assert.Equal(user.Id, result.User.Id);
        Assert.NotEmpty(result.PlaylistEpisodes);
        Assert.NotNull(result.PlaylistEpisodes[0]);
    }

    #endregion Get Playlist Episodes Tests

    #region Get User Playlists Tests

    [Fact]
    public async Task GetUserPlaylistsAsync_ReturnsUserPlaylists()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId
        };
        var page = 0;
        var pageSize = 10;
        var domainUrl = "https://example.com";
        var playlists = new List<Playlist>
        {
            new() {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Public Playlist 1",
                Privacy = Playlist.PrivacyEnum.Public,
                User = user
            },
            new() {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Private Playlist 2",
                Privacy = Playlist.PrivacyEnum.Private,
                User = user
            },
        }.ToArray();

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(playlists));

        var expectedResponse = playlists.Select(p => new PlaylistInfoResponse(p, domainUrl)).ToList();

        // Act
        var result = await _playlistService.GetUserPlaylistsAsync(userId, user, page, pageSize, domainUrl);

        // Assert
        Assert.Equal(expectedResponse.Count, result.Count);
        for (int i = 0; i < expectedResponse.Count; i++)
        {
            Assert.Equal(expectedResponse[i].Id, result[i].Id);
            Assert.Equal(expectedResponse[i].Name, result[i].Name);
        }
    }

    #endregion Get User Playlists Tests

    #region Get All Playlists Tests

    [Fact]
    public async Task GetAllPlaylistsAsync_ReturnsPlaylists()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var page = 0;
        var pageSize = 10;
        var domainUrl = "https://example.com";
        var playlists = new List<Playlist>
        {
            new ()
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Name = "Public Playlist 1",
                Privacy = Playlist.PrivacyEnum.Public,
                User = new User(),
            },
            new ()
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Name = "Public Playlist 2",
                Privacy = Playlist.PrivacyEnum.Public,
                User = new User(),
            },
            new ()
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Name = "Public Playlist 3",
                Privacy = Playlist.PrivacyEnum.Public,
                User = new User(),
            }
        }.ToArray();

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(playlists));

        var expectedResponse = playlists.Select(p => new PlaylistInfoResponse(p, domainUrl)).ToList();

        // Act
        var result = await _playlistService.GetAllPlaylistsAsync(user, page, pageSize, domainUrl);

        // Assert
        Assert.Equal(expectedResponse.Count, result.Count);
        for (int i = 0; i < expectedResponse.Count; i++)
        {
            Assert.Equal(expectedResponse[i].Id, result[i].Id);
            Assert.Equal(expectedResponse[i].Name, result[i].Name);
        }
    }

    #endregion Get All Playlists Tests

    #region Search Playlists Tests

    [Fact (Skip = "Soundex is not implemented in the project. Will be eventually replaced with a different sound similarity algorithm.")]
    public async Task SearchPlaylistsAsync_ReturnsMatchingPlaylists()
    {
        // Arrange
        var searchTerm = "search term";
        var user = new User
        {
            Id = Guid.NewGuid()
        };
        var page = 0;
        var pageSize = 10;
        var domainUrl = "https://example.com";

        var playlists = new List<Playlist>
        {
            new() {
                Id = Guid.NewGuid(),
                Name = "Playlist 1",
                Description = "Description 1",
                Privacy = Playlist.PrivacyEnum.Public,
                UserId = user.Id
            },
            new() {
                Id = Guid.NewGuid(),
                Name = "Playlist 2",
                Description = "Description 2",
                Privacy = Playlist.PrivacyEnum.Private,
                UserId = Guid.NewGuid()
            },
            new() {
                Id = Guid.NewGuid(),
                Name = "Playlist 3",
                Description = "Description 3",
                Privacy = Playlist.PrivacyEnum.Public,
                UserId = Guid.NewGuid()
            }
        }.ToArray();

        _dbContextMock.Setup(db => db.Playlists)
            .Returns(CreateMockDbSet(playlists));
        



        var expectedPlaylists = playlists
            .Where(p => (p.Privacy == Playlist.PrivacyEnum.Public || p.UserId == user.Id)
                && ((AppDbContext.Soundex(searchTerm) == AppDbContext.Soundex(p.Name))
                || (AppDbContext.Soundex(searchTerm) == AppDbContext.Soundex(p.Description))))
            .Skip(page * pageSize)
            .Take(pageSize)
            .Select(p => new PlaylistInfoResponse(p, domainUrl))
            .ToList();

        // Act
        var result = await _playlistService.SearchPlaylistsAsync(searchTerm, user, page, pageSize, domainUrl);

        // Assert
        Assert.Equal(expectedPlaylists.Count, result.Count);
        for (int i = 0; i < expectedPlaylists.Count; i++)
        {
            Assert.Equal(expectedPlaylists[i].Id, result[i].Id);
            Assert.Equal(expectedPlaylists[i].Name, result[i].Name);
            Assert.Equal(expectedPlaylists[i].Description, result[i].Description);
        }
    }

    #endregion Search Playlists Tests
}