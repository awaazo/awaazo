using AutoMapper;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;

namespace Backend.Tests;

/// <summary>
/// Tests for Bookmark Service
/// </summary>
[Collection("Sequential")]
public class BookmarkTests : IAsyncLifetime
{
    private Mock<Microsoft.Extensions.Logging.ILogger> _IloggerMock;

    public BookmarkTests()
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
    public async void GetBookmarks_InvalidEpisodeGuid()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        BookmarkService service = new(dbContextMock.Object);

        User user = new User()
        {
            Id = Guid.NewGuid(),
        };
        
        Mock<DbSet<User>> users = new[]
        {
            user
        }.AsQueryable().BuildMockDbSet();
        
        Mock<DbSet<Bookmark>> bookmarks = new Bookmark[] {}.AsQueryable().BuildMockDbSet();
        
        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        dbContextMock.SetupGet(db => db.Bookmarks).Returns(bookmarks.Object);

        var result = await service.GetBookmarks(user, Guid.NewGuid());
        Assert.True(result.Count == 0);
    }

    [Fact]
    public async void GetBookmarks_ValidEpisodeGuid()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        BookmarkService service = new(dbContextMock.Object);

        User user = new User()
        {
            Id = Guid.NewGuid(),
        };
        
        Mock<DbSet<User>> users = new[]
        {
            user
        }.AsQueryable().BuildMockDbSet();

        Guid episodeId = Guid.NewGuid();
        Mock<DbSet<Bookmark>> bookmarks = new Bookmark[]
        {
            new Bookmark()
            {
                Id = Guid.NewGuid(),
                UserId =user.Id,
                EpisodeId = episodeId
            },             
            new Bookmark()
            {
                Id = Guid.NewGuid(),
                UserId =user.Id,
                EpisodeId = episodeId
            }
        }.AsQueryable().BuildMockDbSet();
        
        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        dbContextMock.SetupGet(db => db.Bookmarks).Returns(bookmarks.Object);

        var result = await service.GetBookmarks(user, episodeId);
        Assert.True(result.Count == 2);       
    }

    [Fact]
    public async void Add_InvalidEpisodeGuid()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        BookmarkService service = new(dbContextMock.Object);

        User user = new User()
        {
            Id = Guid.NewGuid(),
        };
        
        Mock<DbSet<User>> users = new[]
        {
            user
        }.AsQueryable().BuildMockDbSet();
        
        Mock<DbSet<Bookmark>> bookmarks = new Bookmark[] {}.AsQueryable().BuildMockDbSet();
        Mock<DbSet<Episode>> episodes = new Episode[] { }.AsQueryable().BuildMockDbSet();
        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        dbContextMock.SetupGet(db => db.Bookmarks).Returns(bookmarks.Object);
        dbContextMock.SetupGet(db => db.Episodes).Returns(episodes.Object);

        await Assert.ThrowsAsync<Exception>(() => service.Add(user, Guid.NewGuid(), default(BookmarkAddRequest)));       
    }
    
    [Fact]
    public async void Add_ValidEpisodeGuid()
    {
        Mock<AppDbContext> dbContextMock = new(new DbContextOptions<AppDbContext>());
        Mock<IMapper> mapperMock = new();

        BookmarkService service = new(dbContextMock.Object);

        User user = new User()
        {
            Id = Guid.NewGuid(),
        };
        
        Mock<DbSet<User>> users = new[]
        {
            user
        }.AsQueryable().BuildMockDbSet();
        
        
        Mock<DbSet<Bookmark>> bookmarks = new Bookmark[] {}.AsQueryable().BuildMockDbSet();
        
        Guid episodeId = Guid.NewGuid();
        Mock<DbSet<Episode>> episodes = new Episode[]
        {
            new Episode()
            {
                Id = episodeId
            }
        }.AsQueryable().BuildMockDbSet();
        dbContextMock.SetupGet(db => db.Users).Returns(users.Object);
        dbContextMock.SetupGet(db => db.Bookmarks).Returns(bookmarks.Object);
        dbContextMock.SetupGet(db => db.Episodes).Returns(episodes.Object);

        //bookmarks.Setup(d => d.Add(It.IsAny<Bookmark>())).Callback<Bookmark>((s) => bookmarks.Object.Add(s));

        await service.Add(user, episodeId, new BookmarkAddRequest());
        bookmarks.Verify(m => m.AddAsync(It.IsAny<Bookmark>(), default), Times.Once());
        dbContextMock.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }

    #endregion
}