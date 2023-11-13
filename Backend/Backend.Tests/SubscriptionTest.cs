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
    public class SubscriptionTest
    {
        private Mock<AppDbContext> _dbContextMock;
        private Mock<IAuthService> _authServiceMock;
        private Mock<HttpContext> _httpContextMock;
        private Mock<HttpRequest> _httpRequestMock;
        private Mock<DbSet<Podcast>> _podcast;
        private Mock<DbSet<User>> _user;
        private Mock<DbSet<PodcastFollow>> _podcastFollows;

        private SubscriptionService _subscriptionService;
        private SubscriptionController _subscriptionController;

        private const string DOMAIN = "TestDomain";

        public SubscriptionTest()
        {
            // First init for no nulls
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();
            _httpContextMock = new();
            _httpRequestMock = new();
            _subscriptionService = new(_dbContextMock.Object);
            _subscriptionController = new(_authServiceMock.Object, _subscriptionService)
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
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();
            _httpContextMock = new();
            _httpRequestMock = new();
            _subscriptionService = new(_dbContextMock.Object);
            _subscriptionController = new( _authServiceMock.Object,_subscriptionService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = _httpContextMock.Object
                }
            };

            MockBasicUtilities();
        }

        #region Service Test

        [Fact]
        public void Subscription_MySubscriptionsAsync_ValidRequest_Success()
        {
            List<PodcastResponse>? response = null;

            try
            {
                response = _subscriptionService.MySubscriptionsAsync(_user.Object.First(), DOMAIN).Result;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Single(response);
        }

        [Fact]
        public void Subscription_GetPodcastSubscriptionAsync_ValidRequest_Success()
        {
            List<UserProfileResponse>? response = null;

            try
            {
                response = _subscriptionService.GetPodcastSubscriptionAsync(_podcast.Object.First().Id, _user.Object.First(), DOMAIN).Result;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Single(response);
        }

        [Fact]
        public void Subscription_SubscribeAsync_ValidRequest_Success()
        {           
            bool response = false;

            try
            {
                response = _subscriptionService.SubscribeAsync(_podcast.Object.Last().Id, _user.Object.First()).Result;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.True(response);
        }

        [Fact]
        public void Subscription_UnsubscribeAsync_ValidRequest_Success()
        {
            bool response = false;

            try
            {
                response = _subscriptionService.UnsubscribeAsync(_podcast.Object.First().Id, _user.Object.First()).Result;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.True(response);
        }

        [Fact]
        public void Notification_IsSubscribed_ValidRequest_Success()
        {
            bool response = false;

            try
            {
                response = _subscriptionService.IsSubscribed(_podcast.Object.First().Id, _user.Object.First()).Result;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.True(response);
        }

        #endregion

        #region Controller Test

        [Fact]
        public void Subscription_Subscribe_ValidRequest_Success()
        {
            OkObjectResult? response = null;

            try
            {
                response = _subscriptionController.Subscribe(_podcast.Object.Last().Id).Result as OkObjectResult;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Contains("Successfully Subscribed to the Podcast",  response.Value.ToString());
        }

        [Fact]
        public void Subscription_unsubscribe_ValidRequest_Success()
        {
            OkObjectResult? response = null;

            try
            {
                response = _subscriptionController.Unsubscribe(_podcast.Object.First().Id).Result as OkObjectResult;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Contains("Successfully unsubscribed to the Podcast", response.Value.ToString());

        }

        [Fact]
        public void Subscription_IsSubscribed_ValidRequest_Success()
        {
            OkObjectResult? response = null;

            try
            {
                response = _subscriptionController.IsSubscribed(_podcast.Object.First().Id).Result as OkObjectResult;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.True((bool)response.Value);
        }

        [Fact]
        public void Subscription_MySubscriptions_ValidRequest_Success()
        {
            OkObjectResult? response = null;

            try
            {
                response = _subscriptionController.MySubscriptions().Result as OkObjectResult;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Equal(1, ((List<PodcastResponse>)response.Value).Count());
        }

        [Fact]
        public void Subscription_GetAllPodcastSubscriber_ValidRequest_Success()
        {
            OkObjectResult? response = null;

            try
            {
                response = _subscriptionController.GetAllPodcastSubscriber(_podcast.Object.First().Id).Result as OkObjectResult;
            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Equal(1, ((List<UserProfileResponse>)response.Value).Count());
        }

        #endregion

        #region Private Method

        private void MockBasicUtilities()
        {
            var userGuid = Guid.NewGuid();
            var podcastId = Guid.NewGuid();
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
                    Id = podcastId,
                    PodcasterId = userGuid,
                },
                new Podcast()
                {
                    Id = Guid.NewGuid(),
                    PodcasterId = Guid.NewGuid(),
                }
            }.AsQueryable().BuildMockDbSet();
            _podcastFollows = new[]
            {
                new PodcastFollow()
                {
                    Id = Guid.NewGuid(),
                    UserId = userGuid,
                    PodcastId = podcastId,
                    User = _user.Object.First()
                }
            }.AsQueryable().BuildMockDbSet();


            // Configuration
            IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

            _dbContextMock.SetupGet(db => db.Users).Returns(_user.Object);
            _dbContextMock.SetupGet(db => db.Podcasts).Returns(_podcast.Object);
            _dbContextMock.SetupGet(db => db.PodcastFollows).Returns(_podcastFollows.Object);
            _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

            _httpRequestMock.Setup(t => t.IsHttps).Returns(true);
            _httpRequestMock.Setup(t => t.Host).Returns(new HostString(DOMAIN, 1443));
            _httpContextMock.Setup(ctx => ctx.Request).Returns(_httpRequestMock.Object);

            var filesMock = new Mock<Files>();
            _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(_user.Object.First()));
        }

        #endregion
    }
}
