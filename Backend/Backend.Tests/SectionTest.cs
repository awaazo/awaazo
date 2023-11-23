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
using PusherServer;
using Assert = Xunit.Assert;

namespace Backend.Tests
{
    [Collection("Sequential")]
    public class SectionTest
    {
        private Mock<AppDbContext> _dbContextMock;
        private Mock<IAuthService> _authServiceMock;

        private Mock<DbSet<User>> _user;
        private Mock<DbSet<Episode>> _episode;
        private Mock<DbSet<EpisodeSections>> _episodeSections;
        private Mock<DbSet<Podcast>> _podcast;


        private SectionService _sectionService;
        private SectionController _sectionController;

        public SectionTest() {
            // Intialize the Mock Objects
            _dbContextMock = new (new DbContextOptions<AppDbContext>());
            _authServiceMock = new();
            // Intialize the services
            _sectionService = new(_dbContextMock.Object);
            _sectionController = new (_authServiceMock.Object,_sectionService);
            MockBasicUtilities();
        }

        [TestInitialize]
        public void Initialize()
        {
            // Intialize the Mock Objects
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();
            // Intialize the services
            _sectionService = new(_dbContextMock.Object);
            _sectionController = new(_authServiceMock.Object, _sectionService);
            MockBasicUtilities();
        }



        #region Service Tests

        [Fact]
        public void Section_AddSectionAsync_ValidRequest_Success()
        {
            bool response = false;
            try
            {
                SectionRequest sectionRequest = new SectionRequest()
                {
                    Start = 10,
                    End = 20,
                    Title = "Part1"
                    
                };

                response = _sectionService.AddSectionAsync(_episode.Object.First().Id, _user.Object.First().Id, sectionRequest).Result;
                
            }
            catch(Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);

            }
            
            Assert.True(response);

        }
        [Fact]
        public void Section_GetSections_ValidRequest_Success()
        {
            List<EpisodeSections> episodeSections = null;
            try
            {
                episodeSections = _sectionService.GetSectionsAsync(_episode.Object.First().Id).Result;



            }
            catch(Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }
            Assert.NotNull(episodeSections);
            Assert.Equal(1, episodeSections.Count);

        }

        [Fact]
        public void Section_DeleteSection_ValidRequest_Success()
        {
            bool response = false;
            try
            {
                response = _sectionService.DeleteSectionAsync(_episodeSections.Object.First().Id, _user.Object.First().Id).Result;

            }
            catch(Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);

            }

            Assert.True(response);
        }
        #endregion


        #region Controller Test
        
        [Fact]
        public void Section_AddSectionController_ValidRequest_Success()
        {
            OkObjectResult? response = null;

            try
            {
                SectionRequest sectionRequest = new SectionRequest()
                {
                    Start = 10,
                    End = 20,
                    Title = "Part1"

                };
                response = _sectionController.AddSection(_episode.Object.First().Id, sectionRequest).Result as OkObjectResult;

            }
            catch(Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
            Assert.Contains("Successfully Added Section",response.Value.ToString());
        }

        [Fact]
        public void Section_GetSectionController_ValidRequest_Success()
        {
            OkObjectResult? response = null;
            try
            {
                
                response = _sectionController.GetSection(_episode.Object.First().Id).Result as OkObjectResult;

            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            Assert.NotNull(response);
        }

        [Fact]
        public void Section_DeleteSectionController_ValidRequest_Success() { 
            OkObjectResult? response = null;

            try
            {
                response = _sectionController.DeleteSection(_episodeSections.Object.First().Id).Result as OkObjectResult;
            }
            catch(Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }
            Assert.NotNull(response);
            Assert.Contains("Successfully Deleted", response.Value.ToString());
        }



        #endregion
        private void MockBasicUtilities()
        {
            var userGuid = Guid.NewGuid();
            var episodeGuid = Guid.NewGuid();
            var podGuid = Guid.NewGuid();
            var sectionGuid = Guid.NewGuid();

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
                    Id=podGuid,
                    Name = "Sample Podcast Name",
                    Description = "Sample Podcast Description",
                    CoverArt = @"CoverArt|/|\|test/png",
                    Podcaster = _user.Object.First(),
                    PodcasterId = userGuid
                    
                }
            }.AsQueryable().BuildMockDbSet();



            _episode = new[]
            {
                new Episode()
                {
                    Id = episodeGuid,
                    EpisodeName = "Sample Episode Name",
                    PodcastId = podGuid,
                    Podcast = _podcast.Object.First(),
                    Thumbnail = @"Thumbnail|/|\|test/png",
                    Audio = @"Audio|/|\|test/mp3",
                    Duration = 25
    


                }
            }.AsQueryable().BuildMockDbSet();

            _episodeSections = new[]
           {
                new EpisodeSections()
                {
                    Id =sectionGuid,
                    Start = 0,
                    End = 5,
                    EpisodeId = episodeGuid,
                    Episode = _episode.Object.First()
                }
            }.AsQueryable().BuildMockDbSet();


            // Configuration
            IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

            _dbContextMock.SetupGet(db => db.Users).Returns(_user.Object);
            _dbContextMock.SetupGet(db => db.Podcasts).Returns(_podcast.Object);
            _dbContextMock.SetupGet(db => db.Episodes).Returns(_episode.Object);
            _dbContextMock.SetupGet(db => db.EpisodeSections).Returns(_episodeSections.Object);
            _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

            _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(_user.Object.First()));

        }
    }
}
