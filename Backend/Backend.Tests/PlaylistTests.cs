using AutoMapper;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;

namespace Backend.Tests;

/// <summary>
/// Tests for PlaylistService
/// </summary>
[Collection("Sequential")]
public class PlaylistTests : IAsyncLifetime
{
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
    public async void CreatePlaylist_Valid_ReturnsPlaylist()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };
                
        Mock<DbSet<Playlist>> playlists = new Playlist[]
        {
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object); 
        Playlist p = await service.Create(user, "testname");
        Assert.NotNull(p);
    }

    [Fact]
    public async void AppendPlayList_InvalidPlaylistId_ReturnsFalse()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };
                
        Mock<DbSet<Playlist>> playlists = new Playlist[]
        {
        }.AsQueryable().BuildMockDbSet();
        Mock<DbSet<Episode>> episodes = new Episode[]
        {
        }.AsQueryable().BuildMockDbSet(); 
        
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);
        dbContextMock.SetupGet(db => db.Episodes).Returns(episodes.Object);

        bool result = await service.Append(user, Guid.Empty, Guid.Empty);
        Assert.False(result);
    }
    
    [Fact]
    public async void AppendPlayList_InvalidEpisodeId_ReturnsFalse()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };
        
        Playlist playlist = new Playlist(dbContextMock.Object)
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = "XXXXXXX"
        };
        
        Mock<DbSet<Playlist>> playlists = new[]
        {
            playlist
        }.AsQueryable().BuildMockDbSet();
        Mock<DbSet<Episode>> episodes = new Episode[]
        {
        }.AsQueryable().BuildMockDbSet(); 
        
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);
        dbContextMock.SetupGet(db => db.Episodes).Returns(episodes.Object);
        
        bool result = await service.Append(user, playlist.Id, Guid.Empty);
        Assert.False(result);
    }    

    [Fact]
    public async void AppendPlayList_Valid_ReturnsTrue()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };
        
        Playlist playlist = new Playlist(dbContextMock.Object)
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = "XXXXXXX"
        };

        Episode episode = new Episode()
        {
            Id = Guid.NewGuid(),
        };
        
        Mock<DbSet<Playlist>> playlists = new[]
        {
            playlist
        }.AsQueryable().BuildMockDbSet();
        Mock<DbSet<Episode>> episodes = new[]
        {
            episode
        }.AsQueryable().BuildMockDbSet();
        
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);
        dbContextMock.SetupGet(db => db.Episodes).Returns(episodes.Object);
        
        bool result = await service.Append(user, playlist.Id, episode.Id);
        Assert.True(result);
    }   
    
    [Fact]
    public async void AllPlayLists_Valid_ReturnsPlaylistList()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };

        Mock<DbSet<Playlist>> playlists = new[]
        {
            new Playlist(dbContextMock.Object)
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Name = "XXXXXXX"
            },
            new Playlist(dbContextMock.Object)
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Name = "YYYYYY"
            }
        }.AsQueryable().BuildMockDbSet();

        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);

        object result = await service.All(user);
        Assert.IsType<List<Playlist>>(result);
        Assert.True(((List<Playlist>)result).Count == 2);
    }  
    
    [Fact]
    public async void PlayListElements_Valid_ReturnsPlaylistElementsList()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };

        Guid playlistGuid = Guid.NewGuid();
        Mock<DbSet<Playlist>> playlists = new[]
        {
            new Playlist(dbContextMock.Object)
            {
                Id = playlistGuid,
                UserId = user.Id,
                Name = "XXXXXXX"
            },
        }.AsQueryable().BuildMockDbSet();
        
        Mock<DbSet<PlaylistElement>> playlistElements = new[]
        {
            new PlaylistElement(dbContextMock.Object)
            {
                Id = Guid.NewGuid(),
                PlayerlistId = playlistGuid,
                EpisodeId = Guid.Empty
            },
            new PlaylistElement(dbContextMock.Object)
            {
                Id = Guid.NewGuid(),
                PlayerlistId = playlistGuid,
                EpisodeId = Guid.Empty
            },
        }.AsQueryable().BuildMockDbSet();      

        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);
        dbContextMock.SetupGet(db => db.PlaylistElements).Returns(playlistElements.Object);
        
        List<PlaylistElement>? result = await service.PlaylistElements(user, playlistGuid);
        Assert.NotNull(result);
        Assert.True(result.Count == 2);
    } 
    
    [Fact]
    public async void PlaylistDelete_InvalidPlaylistId_ReturnsFalse()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };

        Guid playlistGuid = Guid.NewGuid();
        Mock<DbSet<Playlist>> playlists = new[]
        {
            new Playlist(dbContextMock.Object)
            {
                Id = playlistGuid,
                UserId = user.Id,
                Name = "XXXXXXX"
            },
        }.AsQueryable().BuildMockDbSet();
        
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);
        bool result = await service.Delete(user, Guid.NewGuid());
        Assert.False(result);
    }  
    
    [Fact]
    public async void PlaylistDelete_Valid_ReturnsTrue()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };

        Guid playlistGuid = Guid.NewGuid();
        Mock<DbSet<Playlist>> playlists = new[]
        {
            new Playlist(dbContextMock.Object)
            {
                Id = playlistGuid,
                UserId = user.Id,
                Name = "XXXXXXX"
            },
        }.AsQueryable().BuildMockDbSet();
        
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);
        bool result = await service.Delete(user, playlistGuid);
        Assert.True(result);
        //Assert.True(playlists.Object.Count(e => true) == 0);
    }  
    
    [Fact]
    public async void PlaylistDeleteElement_InValid_ReturnsFalse()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };
                
        Mock<DbSet<Playlist>> playlists = new Playlist[]
        {
        }.AsQueryable().BuildMockDbSet();
        Mock<DbSet<PlaylistElement>> elements = new PlaylistElement[]
        {
        }.AsQueryable().BuildMockDbSet(); 
        
        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);
        dbContextMock.SetupGet(db => db.PlaylistElements).Returns(elements.Object);

        bool result = await service.DeleteElement(user, Guid.Empty);
        Assert.False(result);
    }  
    
    [Fact]
    public async void PlaylistDeleteElement_Valid_ReturnsTrue()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();
        PlaylistService service = new(dbContextMock.Object, mapperMock.Object);
        User user = new User()
        {
            Id = Guid.NewGuid()
        };

        Guid playlistGuid = Guid.NewGuid();
        Mock<DbSet<Playlist>> playlists = new[]
        {
            new Playlist(dbContextMock.Object)
            {
                Id = playlistGuid,
                UserId = user.Id,
                Name = "XXXXXXX"
            },
        }.AsQueryable().BuildMockDbSet();

        Guid elementToDelete = Guid.NewGuid();
        Mock<DbSet<PlaylistElement>> playlistElements = new[]
        {
            new PlaylistElement(dbContextMock.Object)
            {
                Id = elementToDelete,
                PlayerlistId = playlistGuid,
                EpisodeId = Guid.Empty
            },
            new PlaylistElement(dbContextMock.Object)
            {
                Id = Guid.NewGuid(),
                PlayerlistId = playlistGuid,
                EpisodeId = Guid.Empty
            },
        }.AsQueryable().BuildMockDbSet();      

        dbContextMock.SetupGet(db => db.Playlists).Returns(playlists.Object);
        dbContextMock.SetupGet(db => db.PlaylistElements).Returns(playlistElements.Object);
        
        bool result = await service.DeleteElement(user, elementToDelete);
        Assert.True(result);

        var count = playlistElements.Object.Count(e => true);
        //Assert.True(count == 1, $"Expected count 1 got {count}");
    }  
    #endregion
}