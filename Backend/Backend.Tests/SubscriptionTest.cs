using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
using Assert = Xunit.Assert;
using Xunit;


namespace Backend.Tests
{
    [Collection("Sequential")]
    public class SubscriptionTest : IAsyncLifetime
    {
        private Mock<AppDbContext> _dbContextMock;
        private Mock<IAuthService> _authServiceMock;
        private Mock<IProfileService> _profileServiceMock;
        private Mock<HttpContext> _httpContextMock;
        
        private SubscriptionService _subscriptionService;
        private SubscriptionController _subscriptionController;

        private const string DOMAIN = "TestDomain";

        public SubscriptionTest()
        {
            // Re-initilize every test
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();
            _profileServiceMock = new();
            _subscriptionService = new(_dbContextMock.Object);
            _httpContextMock = new();
            _subscriptionController = new(_authServiceMock.Object, _subscriptionService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = _httpContextMock.Object
                }
            };

            MockBasicUtilities(out var podcast, out var user, out var episode);
        }
      
        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        public Task InitializeAsync()
        {
            return Task.CompletedTask;
        }

        [TestInitialize]
        public void Initialize()
        {
            // Re-initilize every test
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();
            _profileServiceMock = new();
            _subscriptionService = new(_dbContextMock.Object);
            _httpContextMock = new();
            _subscriptionController = new( _authServiceMock.Object,_subscriptionService)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = _httpContextMock.Object
                }
            };

            MockBasicUtilities(out var podcast, out var user, out var episode);
        }

        [Fact]
        public void Subscribe_Podcast_Success()
        {
            MockBasicUtilities(out var podcast, out var user, out var episode);
            bool response = false;

            try
            {
                response = _subscriptionService.SubscribeAsync(podcast.Object.First().Id, user.Object.Skip(1).First()).Result;

            }
            catch (Exception e)
            {
                Assert.Fail(e.Message);

            }

            Assert.True(response);

        }
        [Fact]
        public void unsubscribe_Podcast()
        {
            MockBasicUtilities(out var podcast, out var user, out var episode);
            bool response = false;

            try
            {
                response = _subscriptionService.UnsubscribeAsync(podcast.Object.First().Id, user.Object.First()).Result;

            }
            catch (Exception e)
            {
                Assert.Fail(e.Message);

            }
            Assert.True(response);
        }

        [Fact]
        public void issubscribed_Podcast()
        {
            MockBasicUtilities(out var podcast, out var user, out var episode);
            bool response = false;

            try
            {
                response = _subscriptionService.IsSubscribed(podcast.Object.First().Id, user.Object.First()).Result;

            }
            catch (Exception e)
            {
                Assert.Fail(e.Message);

            }
            Assert.True(response);
        }

        //[Fact]
        //public void GetPodcastSubscriptionAsync_Test()
        //{
        //    MockBasicUtilities(out var podcast, out var user, out var episode);
        //    List<UserProfileResponse> response = new ();
        //    try
        //    {
        //        response = _subscriptionService.GetPodcastSubscriptionAsync(podcast.Object.First().Id, user.Object.Skip(2).First(),DOMAIN).Result;

        //    }catch(Exception e)
        //    {
        //        Assert.Fail(e.Message);

        //    }
        //    Assert.True(response.Count > 0);

        //}


        private void MockBasicUtilities(out Mock<DbSet<Podcast>> podcast, out Mock<DbSet<User>> user, out Mock<DbSet<PodcastFollow>> podcastFollow)
        {
            var userGuid = Guid.NewGuid();
            var userGuid2 = Guid.NewGuid(); 
            var userGuid3 = Guid.NewGuid();
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
                Gender = Models.User.GenderEnum.Male,
                
                
            },
            new User()
            {
                Id = userGuid2,
                Email = "XXXXXXXXXXXXXXXXX",
                Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                Username = "XXXXXXXXXXXXXXXXX",
                DateOfBirth = DateTime.Now,
                Gender = Models.User.GenderEnum.Male
            },
            new User()
            {
                Id = userGuid3,
                Email = "XXXXXXXXXXXXXXXXX",
                Password = BCrypt.Net.BCrypt.HashPassword("XXXXXXXXXXXXXXXXX"),
                Username = "XXXXXXXXXXXXXXXXX",
                DateOfBirth = DateTime.Now,
                Gender = Models.User.GenderEnum.Male
            },

        }.AsQueryable().BuildMockDbSet();
            podcast = new[]
            {
            new Podcast()
            {
                Id = podGuid,
                Name = "Sample Podcast Name",
                Description = "Sample Podcast Description",
                CoverArt = "TestCoverArt",
                PodcasterId = userGuid3 ,
                
            }
        }.AsQueryable().BuildMockDbSet();
            podcastFollow = new[]
            {
            new PodcastFollow()
            {
                Id = Guid.NewGuid(),
                UserId = userGuid,
                PodcastId = podGuid
               
                
            }
           
        }.AsQueryable().BuildMockDbSet();

            _dbContextMock.SetupGet(db => db.Podcasts).Returns(podcast.Object);
            _dbContextMock.SetupGet(db => db.Users).Returns(user.Object);
            _dbContextMock.SetupGet(db => db.PodcastFollows).Returns(podcastFollow.Object);
           
            _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));
      
            var filesMock = new Mock<Files>();
            _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(user.Object.First()));
            
        }





    }
}
