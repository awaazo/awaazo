using Backend.Controllers;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MockQueryable.Moq;
using Moq;
using Assert = Xunit.Assert;
using InvalidDataException = System.IO.InvalidDataException;

namespace Backend.Tests;

[Collection("Sequential")]
public class ProfileTests
{

    private Mock<AppDbContext> _dbContextMock;
    private Mock<HttpContext> _httpContextMock;
    private Mock<IAuthService> _authServiceMock;
    private ProfileService _profileService;
    private ProfileController _profileController;
    private const string DOMAIN = "TestDomain";
    private Mock<HttpRequest> _httpRequestMock;
    private Mock<ILogger<ProfileController>> _loggerMock;

    public ProfileTests()
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
        _loggerMock = new();
        _profileService = new(config, _dbContextMock.Object, new EmailService(config));
        _profileController = new(_authServiceMock.Object, _profileService, _loggerMock.Object)
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
        // Configuration
        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

        // Re-initilize every test
        _dbContextMock = new(new DbContextOptions<AppDbContext>());
        _httpContextMock = new();
        _authServiceMock = new();
        _httpRequestMock = new();
        _loggerMock = new();
        _profileService = new(config, _dbContextMock.Object, new EmailService(config));
        _profileController = new(_authServiceMock.Object, _profileService, _loggerMock.Object)
        {
            ControllerContext = new ControllerContext()
            {
                HttpContext = _httpContextMock.Object
            }
        };
        
        // Set the Key to null
        config["Jwt:Key"] = null;
        MockBasicUtilities(out var podcast, out var user, out var episode);
    }

    #region Test Service


    [Fact]
    public void Profile_DeleteProfileAsync_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        bool response = false;

        // Act
        try
        {
            response = _profileService.DeleteProfileAsync(user.Object.First()).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.True(response);
    }

    [Fact]
    public void Profile_SetupProfileAsync_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateProfileSetupRequest();
        bool response = false;

        // Act
        try
        {
            response = _profileService.SetupProfileAsync(request, user.Object.First()).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.True(response);
    }

    [Fact]
    public void Profile_EditProfileAsync_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateProfileEditRequest();
        bool response = false;

        // Act
        try
        {
            response = _profileService.EditProfileAsync(request, user.Object.First()).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.True(response);
    }

    [Fact]
    public void Profile_GetProfileAsync_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        UserProfileResponse response = null;

        // Act
        try
        {
            response = _profileService.GetProfileAsync(user.Object.First(), DOMAIN).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    // This Service will be tested some other time, Soundex is currently impossible to test
    //[Fact]
    //public void Profile_ProfileSearch_ValidInput_ReturnsTrue()
    //{
    //    // Arrange
    //    MockBasicUtilities(out var podcast, out var user, out var episode);
    //    int page = 0;
    //    int pageSize = 10;
    //    List<UserProfileResponse> response = null;
    //
    //    // Act
    //    try
    //    {
    //        response = _profileService.SearchUserProfiles("SampleUsername", page, pageSize, DOMAIN).Result;
    //    }
    //    // Assert
    //    catch (Exception e)
    //    {
    //        Assert.Fail("Should not have thrown an error: " + e.Message);
    //    }
    //
    //    Assert.NotNull(response);
    //}

    [Fact]
    public void Profile_GetUserProfile_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        FullUserProfileResponse response = null;

        // Act
        try
        {
            response = _profileService.GetUserProfile(user.Object.First().Id, DOMAIN).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.NotNull(response);
    }

    [Fact]
    public void Profile_GetUserAvatarName_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        string response = null;

        // Act
        try
        {
            response = _profileService.GetUserAvatarNameAsync(user.Object.First().Id).Result;
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
    public void Profile_DeleteProfile_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        ActionResult response = null;

        // Act
        try
        {
            response = _profileController.DeleteProfile().Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Profile_SetupProfile_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateProfileSetupRequest();
        ActionResult response = null;

        // Act
        try
        {
            response = _profileController.SetupProfile(request).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Profile_EditProfile_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateProfileEditRequest();
        ActionResult response = null;

        // Act
        try
        {
            response = _profileController.EditProfile(request).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Profile_GetProfile_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        ActionResult<UserProfileResponse> response = null;

        // Act
        try
        {
            response = _profileController.GetProfile().Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.Equal(user.Object.First().Id, response.Value.Id);
    }

    [Fact]
    public void Profile_GetProfileAvatar_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        ActionResult<UserProfileResponse> response = null;

        // Act
        try
        {
            response = _profileController.GetProfileAvatar().Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<RedirectResult>(response.Result);
    }

    [Fact]
    public void Profile_GetUser_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateProfileEditRequest();
        IActionResult response = null;

        // Act
        try
        {
            response = _profileController.GetUser(user.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<OkObjectResult>(response);
    }

    [Fact]
    public void Profile_GetUserAvatar_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = CreateProfileEditRequest();
        IActionResult response = null;

        // Act
        try
        {
            response = _profileController.GetUserAvatar(user.Object.First().Id).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }

        Assert.IsType<RedirectResult>(response);
    }

    [Fact]
    public void Profile_ChangePassword_ValidInput_ReturnsTrue()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = new ChangePasswordRequest() {
            OldPassword = "XXXXXXXXXXXXXXXXX",
            NewPassword = "hehe",
            ConfirmNewPassword = "hehe"
        };
        IActionResult response = null;

        // Act
        try
        {
            response = _profileController.ChangePassword(request).Result;
        }
        // Assert
        catch (Exception e)
        {
            Assert.Fail("Should not have thrown an error: " + e.Message);
        }
    }
    
    [Fact]
    public void Profile_ChangePassword_InvalidOldPassword_ThrowsException()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = new ChangePasswordRequest() {
            OldPassword = "efaefafeafefaef",
            NewPassword = "hehe",
            ConfirmNewPassword = "hehe"
        };
        IActionResult response = null;

        // Act
        try {
            response = _profileController.ChangePassword(request).Result;
            Assert.Fail("Should have thrown an error: ");
        }
        // Assert
        catch (Exception e) {}
    }
    
    [Fact]
    public void Profile_ChangePassword_InvalidPasswordConfirmation_ThrowsException()
    {
        // Arrange
        MockBasicUtilities(out var podcast, out var user, out var episode);
        var request = new ChangePasswordRequest() {
            OldPassword = "XXXXXXXXXXXXXXXXX",
            NewPassword = "hehe",
            ConfirmNewPassword = "lllll"
        };
        IActionResult response = null;

        // Act
        try {
            response = _profileController.ChangePassword(request).Result;
            Assert.Fail("Should have thrown an error: ");
        }
        // Assert
        catch (Exception e) {}
    }
    
    #endregion

    #region Private Methods

    private ProfileSetupRequest CreateProfileSetupRequest()
    {
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        ProfileSetupRequest request = new ProfileSetupRequest();
        request.Avatar = coverImage.Object;
        request.DisplayName = "TestDisplayName";
        request.Bio = "TestBio";
        request.Interests = new string[]{ "FirstInterest", "SecondInterest"};

        return request;
    }

    private ProfileEditRequest CreateProfileEditRequest()
    {
        var coverImage = new Mock<IFormFile>();
        coverImage.Setup(file => file.ContentType).Returns("image/png");
        ProfileEditRequest request = new ProfileEditRequest();
        request.Avatar = coverImage.Object;
        request.DisplayName = "TestDisplayName";
        request.Bio = "TestBio";
        request.Interests = new string[] { "FirstInterest", "SecondInterest" };
        request.Username = "username";
        request.TwitterUrl = "SampleTwitterUrl";
        request.LinkedInUrl = "SampleLinkedInUrl";
        request.GitHubUrl = "SampleGitHubUrl";
        request.WebsiteUrl = "SampleWebsiteUrl";

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
                Email = "SampleEmail@yahoo.com",
                Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                Username = "SampleUsername",
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

        var test = user;

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

    #endregion
}