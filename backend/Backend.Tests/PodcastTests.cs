using Azure;
using Backend.Controllers;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualBasic;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.Client;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MockQueryable.Moq;
using Moq;
using System;
using System.Security.Claims;
using Xunit;
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
    private Mock<IFileService> _fileServiceMock;
    private Mock<HttpContext> _httpContextMock;
    private Mock<IAuthService> _authServiceMock;
    private PodcastService _podcastService;
    private PodcastController _podcastController;

    /// <summary>
    /// Initializes a new instance of the AuthTests class.
    /// </summary>
    public PodcastTests() 
    {
        // Prevent Null objects in case of no test running
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _fileServiceMock = new();
        _httpContextMock = new();
        _authServiceMock = new();
        _podcastService = new(_dbContextMock.Object, _fileServiceMock.Object, _authServiceMock.Object);
        _podcastController = new(_podcastService, _dbContextMock.Object, _fileServiceMock.Object);
        MockBasicUtilities(out var podcast, out var user);
    }

    [TestInitialize]
    public void Initialize()
    {
        // Re-initilize every test
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _fileServiceMock = new();
        _httpContextMock = new();
        _authServiceMock = new();
        _podcastService = new(_dbContextMock.Object, _fileServiceMock.Object, _authServiceMock.Object);
        _podcastController = new(_podcastService, _dbContextMock.Object, _fileServiceMock.Object);

        // Configuration

        IConfiguration config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

        // Set the Key to null
        config["Jwt:Key"] = null;
        MockBasicUtilities(out var podcast, out var user);
    }


    #region Test Service

    [Fact]
    public void Podcast_CreatePodcast_NullRequest_ThrowsException()
    {
        // Arrange
        GetPodcastRequest? response = new GetPodcastRequest();

        // Act
        try
        {
            response = _podcastService.CreatePodcast(null, _httpContextMock.Object).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Contains("Podcast request was missing", e.InnerException.Message);
            return;
        }
        
        Assert.Fail("Serive did not throw an error");
    }



    [Fact]
    public void Podcast_CreatePodcast_NullName_PodcastCreated()
    {
        // Arrange
        var request = CreateStandardPodcastRequest();
        request.Name = null;
        GetPodcastRequest? response = null;

        // Act
        try
        {
            response = _podcastService.CreatePodcast(request, _httpContextMock.Object).Result;
        }
        catch (Exception)
        {
            Assert.Fail("Service threw an error");
        }

        // Assert
        Assert.NotNull(response);
        Assert.IsType<GetPodcastRequest>(response);
    }


    [Fact]
    public void Podcast_CreatePodcast_NullTags_PodcastCreated()
    {
        // Arrange
        var request = CreateStandardPodcastRequest();
        request.Tags = null;
        GetPodcastRequest? response = null;

        // Act
        try
        {
            response = _podcastService.CreatePodcast(request, _httpContextMock.Object).Result;
        }
        catch (Exception)
        {
            Assert.Fail("Service threw an error");
        }

        // Assert
        Assert.NotNull(response);
        Assert.IsType<GetPodcastRequest>(response);
    }

    [Fact]
    public void Podcast_CreatePodcast_NullDescription_PodcastCreated()
    {
        // Arrange
        var request = CreateStandardPodcastRequest();
        request.Description = null;
        GetPodcastRequest? response = null;

        // Act
        try
        {
            response = _podcastService.CreatePodcast(request, _httpContextMock.Object).Result;
        }
        catch (Exception)
        {
            Assert.Fail("Service threw an error");
        }

        // Assert
        Assert.NotNull(response);
        Assert.IsType<GetPodcastRequest>(response);
    }

    [Fact]
    public void Podcast_CreatePodcast_NullCoverImage_PodcastCreated()
    {
        // Arrange
        var request = CreateStandardPodcastRequest();
        request.coverImage = null;
        GetPodcastRequest? response = null;

        // Act
        try
        {
            response = _podcastService.CreatePodcast(request, _httpContextMock.Object).Result;
        }
        catch (Exception)
        {
            Assert.Fail("Service threw an error");
        }

        // Assert
        Assert.NotNull(response);
        Assert.IsType<GetPodcastRequest>(response);
    }


    [Fact]
    public void Podcast_CreatePodcast_InvalidImageType_ThrowsException()
    {
        // Arrange
        var request = CreateStandardPodcastRequest();
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("application/json");
        request.coverImage = coverImage.Object;

        // Act
        try
        {
            var response = _podcastService.CreatePodcast(request, _httpContextMock.Object).Result;
        }
        catch (Exception e)
        {
            Assert.Contains("Invalid Cover Image data Type: ", e.InnerException!.Message);
            return;
        }

        // Assert
        Assert.Fail("Service did not throw an error");
    }

    [Fact]
    public void Podcast_CreatePodcast_ValidRequest_ReturnsGetPodcastRequest()
    {
        // Arrange
        var request = CreateStandardPodcastRequest();
        object response = null;

        // Act
        try
        {
            response = _podcastService.CreatePodcast(request, _httpContextMock.Object).Result;
 
        }
        // Assert
        catch (Exception e)
        {   
            Assert.Fail(e.InnerException!.Message);
        }

        Assert.NotNull(response);
        Assert.IsType<GetPodcastRequest>(response);

    }


    [Fact]
    public void Podcast_GetPodcast_NullId_ReturnsNull()
    {
        // Arrange - No Arrange

        // Act
        var response = _podcastService.GetPodcast(null).Result;

        // Assert
        Assert.Null(response);
    }

    [Fact]
    public void Podcast_GetPodcast_CorrectId_ReturnsPodcast()
    {
        // Arrange - No Arrange
        MockBasicUtilities(out var podcast, out var user);

        // Act
        var response = _podcastService.GetPodcast(podcast.Object.First().Id.ToString()).Result;

        // Assert
        Assert.Equal<Podcast>(response, podcast.Object.First());
    }

    [Fact]
    public void Podcast_GetPodcast_IncorrectId_ReturnsNull()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user);

        // Act
        var response = _podcastService.GetPodcast(Guid.NewGuid().ToString()).Result;

        // Assert
        Assert.Null(response);
    }


    #endregion

    #region Test Controller

    [Fact]
    public void Podcast_CreatePodcast_GoodRequest_CreatePodcast()
    {
        // Arrange
        var createPodcastRequestMock = CreateStandardPodcastRequest();

        // Act
        var response = _podcastController.CreatePodcast(createPodcastRequestMock).Result;


        // Assert
        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Podcast_CreatePodcast_badRequest_ReturnBadRequest()
    {
        // Arrange - No Arrange

        // Act
        var response = _podcastController.CreatePodcast(null).Result;


        // Assert
        Assert.IsType<BadRequestObjectResult>(response);
    }

    #endregion

    private CreatePodcastRequest CreateStandardPodcastRequest()
    {
        string[] tags =  { "tag1", "tag2" };
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/bmp");
        CreatePodcastRequest request = new CreatePodcastRequest();
        request.Name = "Name";
        request.Tags = tags;
        request.Description = "Sample Description";
        request.coverImage = coverImage.Object;

        return request;
    }

    private GetPodcastRequest CreateGetPodcastRequest()
    {
        string[] tags = { "tag1", "tag2" };
        var coverImage = new Mock<Files>();
        GetPodcastRequest request = new GetPodcastRequest();
        request.Name = "Name";
        request.Tags = tags;
        request.Description = "Sample Description";
        request.coverImage = coverImage.Object;

        return request;
    }

    private void MockBasicUtilities(out Mock<DbSet<Podcast>> podcast, out Mock<DbSet<User>> user)
    {
        user = new[]
        {
            new User()
            {
                Id = Guid.NewGuid(),
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
                Id = Guid.NewGuid(),
                Name = "Sample Podcast Name",
                Description = "Sample Podcast Description",
            }
        }.AsQueryable().BuildMockDbSet();

        _dbContextMock.SetupGet(db => db.Podcasts).Returns(podcast.Object);
        _dbContextMock.SetupGet(db => db.Users).Returns(user.Object);


        var filesMock = new Mock<Files>();
        _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(user.Object.First()));
        _fileServiceMock.Setup(file => file.UploadFile(It.IsAny<IFormFile>())).Returns(Task.FromResult(filesMock.Object));
    }

}