using Backend.Controllers;
using Backend.Controllers.Responses;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualBasic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MockQueryable.Moq;
using Moq;
using Assert = Xunit.Assert;


namespace Backend.Tests
{
    [Collection("Sequential")]
    public class NotificationTests
    {
        private Mock<AppDbContext> _dbContextMock;
        private Mock<IAuthService> _authServiceMock;
        private Mock<HttpContext> _httpContextMock;

        private NotificationController _notificationController;
        private NotificationService _notificationService;

        public NotificationTests()
        {
            // Re-initilize every test
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();
            _httpContextMock = new();

            // Configuration
            IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

            _notificationService = new (config, _dbContextMock.Object);
            _notificationController = new(_authServiceMock.Object, _notificationService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = _httpContextMock.Object
                }
            };

            MockBasicUtilities(out var user);
        }

        [TestInitialize]
        public void Initialize()
        {
            // Re-initilize every test
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();
            _httpContextMock = new();

            // Configuration
            IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

            _notificationService = new(config, _dbContextMock.Object);
            _notificationController = new(_authServiceMock.Object, _notificationService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = _httpContextMock.Object
                }
            };

            MockBasicUtilities(out var user);
        }

        #region Service Tests

        [Fact]
        public void Notification_CreateNotification_ValidRequest_Success()
        {
            MockBasicUtilities(out var user);
            int response = 0;

            try
            {
                response = _notificationService.GetUnreadNoticationCountAsync(user.Object.First()).Result;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotEqual(0, response);
        }

        [Fact]
        public void Notification_GetAllNotificationAsync_ValidRequest_Success()
        {
            MockBasicUtilities(out var user);
            List<NotificationResponse> response = null;

            try
            {
                response = _notificationService.GetAllNotificationAsync(user.Object.First()).Result;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Equal(1, response.Count);
        }

        #endregion

        #region Controller Tests

        [Fact]
        public void Notification_GetAllNotification_ValidRequest_Success()
        {
            MockBasicUtilities(out var user);
            OkObjectResult? response = null;

            try
            {
                response = _notificationController.GetAllNotification().Result as OkObjectResult;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Equal(1, ((List<NotificationResponse>)response.Value).Count);
            Assert.IsType<OkObjectResult>(response);
        }

        [Fact]
        public void Notification_GetUnreadNotificationCount_ValidRequest_Success()
        {
            MockBasicUtilities(out var user);
            OkObjectResult? response = null;

            try
            {
                response = _notificationController.GetUnreadNotificationCount().Result as OkObjectResult;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Equal(1, response.Value);
            Assert.IsType<OkObjectResult>(response);
        }

        #endregion

        #region Private Method

        private void MockBasicUtilities(out Mock<DbSet<User>> user)
        {
            var userGuid = Guid.NewGuid();
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
        var notification = new[]
{
            new Notification()
            {
                Id = Guid.NewGuid(),
                User = user.Object.First(),
                UserId = userGuid,
                IsRead = false,
            }
        }.AsQueryable().BuildMockDbSet();

            // Configuration
            IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

            _dbContextMock.SetupGet(db => db.Users).Returns(user.Object);
            _dbContextMock.SetupGet(db => db.Notifications).Returns(notification.Object);
            _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

            var filesMock = new Mock<Files>();
            _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(user.Object.First()));
        }

        #endregion
    }
}
