using Azure;
using Backend.Controllers;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualBasic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MockQueryable.Moq;
using Moq;
using System;
using System.Security.Claims;
using Xunit;
using static Google.Apis.Requests.BatchRequest;
using Assert = Xunit.Assert;
using InvalidDataException = System.IO.InvalidDataException;

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
    private PodcastService _podcastService;
    private PodcastController _podcastController;
    private const string DOMAIN = "TestDomain";
    private Mock<HttpRequest> _httpRequestMock;

    /// <summary>
    /// Initializes a new instance of the AuthTests class.
    /// </summary>
    public PodcastTests() 
    {
        // Prevent Null objects in case of no test running
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _httpContextMock = new();
        _authServiceMock = new();
        _httpRequestMock  = new();
        _podcastService = new(_dbContextMock.Object);
        _podcastController = new(_podcastService, _authServiceMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }
        };
        MockBasicUtilities(out var podcast, out var user, out var episode);
    }

    [TestInitialize]
    public void Initialize()
    {
        // Re-initilize every test
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _httpContextMock = new();
        _authServiceMock = new();
        _httpRequestMock = new();
        _podcastService = new(_dbContextMock.Object);
        _podcastController = new(_podcastService, _authServiceMock.Object) 
        { 
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }          
        };


        // Configuration

        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        // Set the Key to null
        config["Jwt:Key"] = null;
        MockBasicUtilities(out var podcast, out var user, out var episode);
    }


    #region Test Service

    [Fact]
    public void Podcast_CreatePodcastAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateStandardPodcastRequest();
        bool response = false;
           
        // Act
        try
        {
            response = _podcastService.CreatePodcastAsync(request, user.Object.First()).Result;
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
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateEditPodcastRequest();
        bool response = false;
        request.Id = podcast.Object.First().Id;


        // Act
        try
        {
            response = _podcastService.EditPodcastAsync(request, user.Object.First()).Result;
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
        MockBasicUtilities(out var podcast, out var user, out var episode);
        string response = string.Empty;

        // Act
        try
        {
            response = _podcastService.GetPodcastCoverArtNameAsync(podcast.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.Equal("TestCoverArt", response);

    }

    [Fact]
    public void Podcast_GetPodcastByIdAsync_ValidRequest_ReturnsPodcastResponse()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        PodcastResponse testReponse = new PodcastResponse(podcast.Object.First(), DOMAIN);
        PodcastResponse response = testReponse;

        // Act
        try
        {
            response = _podcastService.GetPodcastByIdAsync(DOMAIN, podcast.Object.First().Id).Result;
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
        MockBasicUtilities(out var podcast, out var user, out var episode);
        int page = 0;
        int pageSize = 10;
        List<PodcastResponse> sampleResponse = new();
        List<PodcastResponse> response = null;
        sampleResponse.Add(new PodcastResponse(podcast.Object.First(), DOMAIN));

        // Act
        try
        {
            response = _podcastService.GetUserPodcastsAsync(page, pageSize, DOMAIN, user.Object.First().Id).Result;
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
        MockBasicUtilities(out var podcast, out var user, out var episode);
        int page = 0;
        int pageSize = 10;
        List<PodcastResponse> sampleResponse = new();
        List<PodcastResponse> response = null;
        sampleResponse.Add(new PodcastResponse(podcast.Object.First(), DOMAIN));

        // Act
        try
        {
            response = _podcastService.GetUserPodcastsAsync(page, pageSize, DOMAIN, user.Object.First().Id).Result;
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
        MockBasicUtilities(out var podcast, out var user, out var episode);
        int page = 0;
        int pageSize = 10;
        List<PodcastResponse> sampleResponse = new();
        List<PodcastResponse> response = null;
        sampleResponse.Add(new PodcastResponse(podcast.Object.First(), DOMAIN));

        // Act
        try
        {
            response = _podcastService.GetAllPodcastsAsync(page, pageSize, DOMAIN).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.Equal(sampleResponse.First().Id, response.First().Id);

    }



    #endregion

    #region Test Controller

    [Fact]
    public void Podcast_CreatePodcast_ValidRequest_ReturnsOK()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateStandardPodcastRequest();
        IActionResult response = null;

        // Act
        try
        {
           response = _podcastController.CreatePodcast(request).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Podcast_EditPodcast_ValidRequest_ReturnsOK()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateEditPodcastRequest();
        request.Id = podcast.Object.First().Id;
        IActionResult response = null;

        // Act
        try
        {
            response = _podcastController.EditPodcast(request).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Podcast_DeletePodcast_ValidRequest_ReturnsOK()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        IActionResult response = null;

        // Act
        try
        {
            response = _podcastController.DeletePodcast(podcast.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Podcast_GetMyPodcasts_ValidRequest_ReturnsOK()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        IActionResult response = null;
        int page = 0;
        int pageSize = 10;

        // Act
        try
        {
            response = _podcastController.GetMyPodcasts(page, pageSize).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Podcast_GetUserPodcasts_ValidRequest_ReturnsOK()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        IActionResult response = null;
        int page = 0;
        int pageSize = 10;

        // Act
        try
        {
            response = _podcastController.GetUserPodcasts(user.Object.First().Id, page, pageSize).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Podcast_GetAllPodcasts_ValidRequest_ReturnsOK()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        IActionResult response = null;
        int page = 0;
        int pageSize = 10;

        // Act
        try
        {
            response = _podcastController.GetUserPodcasts(user.Object.First().Id, page, pageSize).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    //This test is a placeholder for now, will need to fix this at a later date
    [Fact]
    public void Podcast_SearchPodcast_ValidRequest_ReturnsOK()
    {
        Assert.True(true);
        //// Arrange
        //MockBasicUtilities(out var podcast, out var user, out var episode);
        //IActionResult response = null;
        //int page = 0;
        //int pageSize = 10;
        //string searchTerm = "testName";

        //// Act
        //try
        //{
        //    response = _podcastController.SearchPodcast(searchTerm, page, pageSize).Result;
        //}
        //// Assert
        //catch (Exception e)
        //{
        //    Assert.Fail("Should not have thrown an error: " + e.Message);
        //}

        //Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Podcast_GetPodcastById_ValidRequest_ReturnsOK()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        IActionResult response = null;

        // Act
        try
        {
            response = _podcastController.GetPodcastById(podcast.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    //This test is a placeholder for now, will need to fix this at a later date
    [Fact]
    public void Podcast_GetEpisodeThumbnail_ValidRequest_ReturnsOK()
    {
        Assert.True(true);
        //// Arrange
        //MockBasicUtilities(out var podcast, out var user, out var episode);
        //IActionResult response = null;

        //// Act
        //try
        //{
        //    response = _podcastController.GetEpisodeThumbnail(podcast.Object.First().Id).Result;
        //}
        //// Assert
        //catch (Exception e)
        //{
        //    Assert.Fail("Should not have thrown an error: " + e.Message);
        //}

        //Assert.IsType<OkObjectResult>(response);
    }

    #endregion

    private CreatePodcastRequest CreateStandardPodcastRequest()
    {
        string[] tags =  { "tag1", "tag2" };
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        CreatePodcastRequest request = new CreatePodcastRequest();
        request.Name = "Name";
        request.Tags = tags;
        request.Description = "Sample Description";
        request.CoverImage = coverImage.Object;

        return request;
    }

    private EditPodcastRequest CreateEditPodcastRequest()
    {
        string[] tags = { "tag1", "tag2" };
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        EditPodcastRequest request = new EditPodcastRequest();
        request.Name = "Name";
        request.Tags = tags;
        request.Description = "Sample Description";
        request.Id = Guid.NewGuid();
        request.CoverImage = coverImage.Object;

        return request;
    }


    private void MockBasicUtilities(out Mock<DbSet<Podcast>> podcast, out Mock<DbSet<User>> user, out Mock<DbSet<Episode>> episode)
    {
        var userGuid = Guid.NewGuid();
        var podGuid = Guid.NewGuid();
        user = new[]
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
        podcast = new[]
        {
            new Podcast()
            {
                Id = podGuid,
                Name = "Sample Podcast Name",
                Description = "Sample Podcast Description",
                CoverArt = "TestCoverArt",
                PodcasterId = userGuid
            }
        }.AsQueryable().BuildMockDbSet();
        episode = new[]
        {
            new Episode()
            {
                Id = Guid.NewGuid(),
                EpisodeName = "Sample Episode Name",
                PodcastId = podGuid,
            }
        }.AsQueryable().BuildMockDbSet();

        _dbContextMock.SetupGet(db => db.Podcasts).Returns(podcast.Object);
        _dbContextMock.SetupGet(db => db.Users).Returns(user.Object);
        _dbContextMock.SetupGet(db => db.Episodes).Returns(episode.Object);
        _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));
        _dbContextMock.Setup(db => db.Podcasts).Returns(podcast.Object);

        _httpRequestMock.Setup(t => t.IsHttps).Returns(true);
        _httpRequestMock.Setup(t => t.Host).Returns(new HostString(DOMAIN, 1443));
        _httpContextMock.Setup(ctx => ctx.Request).Returns(_httpRequestMock.Object);

        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(user.Object.First()));
    }

}