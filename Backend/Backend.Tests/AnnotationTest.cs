using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Assert = Xunit.Assert;
using Microsoft.VisualBasic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MockQueryable.Moq;
using Moq;
using Backend.Models;
using Microsoft.Extensions.Configuration;

namespace Backend.Tests
{
    [Collection("Sequential")]
    public class AnnotationTest
    {
        private Mock<AppDbContext> _dbContextMock;
        private Mock<IAuthService> _authServiceMock;
        private Mock<DbSet<User>> _user;
        private Mock<DbSet<Episode>> _episode;
        private Mock<DbSet<Podcast>> _podcast;
        private Mock<DbSet<Annotation>> _annotation;
        private Mock<DbSet<MediaLink>> _medialink;
        private Mock<DbSet<Sponsor>> _sponser;

        private AnnotationService _annotationService;

        public AnnotationTest() {
            // Mock Basic Services
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();

            // Mock Annotation Service
            _annotationService = new(_dbContextMock.Object);

            MockBasicUtilities();

        }

        [TestInitialize]
        public void Initialize()
        {
            // Mock Basic Services
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _authServiceMock = new();

            // Mock Annotation Service
            _annotationService = new(_dbContextMock.Object);
            MockBasicUtilities();


        }

        [Fact]
        public void Annotation_AddAnnotationToEpisodeAsync_ValidRequest_Success() {
            bool response = false;
            try
            {
                GeneralAnnotationRequest generalAnnotation = new GeneralAnnotationRequest()
                {
                    AnnotationType = "info",
                    Content = "Some random text",
                    Timestamp = 0.8
                };

                response = _annotationService.AddAnnotationToEpisodeAsync(_user.Object.First().Id,_episode.Object.First().Id,generalAnnotation).Result;

            }catch(Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }
            Assert.True(response);

        }
        [Fact]
        public void Annotation_AddMediaAnnotationToEpisodeAsync_ValidRequest_Success()
        {
            bool response = false;
            try
            {
                MediaLinkAnnotationRequest generalAnnotation = new ()
                {   
                    Content = "Some random text",
                    Timestamp = 0.8,
                    PlatformType = "youtube",
                    Url = "www.google.com"
                };

                response = _annotationService.AddMediaAnnotationToEpisodeAsync(_user.Object.First().Id, _episode.Object.First().Id, generalAnnotation).Result;

            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }
            Assert.True(response);

        }

        [Fact]
        public void Annotation_AddSponsershipAnnotationToEpisodeAsync_ValidRequest_Success()
        {
            bool response = false;
            try
            {
                SponsershipAnnotationRequest generalAnnotation = new()
                {
                    Content = "Some random text",
                    Timestamp = 0.2,
                    Name = "Some random Name",
                    Website = "Random Website"
                };

                response = _annotationService.AddSponsershipAnnotationToEpisodeAsync(_user.Object.First().Id, _episode.Object.First().Id, generalAnnotation).Result;

            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }
            Assert.True(response);

        }

        [Fact]
        public void Annotation_DeleteAnnotationAsync_ValidRequest_Success()
        {
            bool response = false;
            try
            {
               

                response = _annotationService.DeleteAnnotationAsync(_user.Object.First().Id, _annotation.Object.First().Id).Result;

            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }
            Assert.True(response);

        }
        [Fact]
        public void Annotation_GetEpisodeAnnotationAsync_ValidRequest_Success()
        {
            List<AnnotationResponse>? response = null;
            try
            {
                SponsershipAnnotationRequest generalAnnotation = new()
                {
                    Content = "Some random text",
                    Timestamp = 0.2,
                    Name = "Some random Name",
                    Website = "Random Website"
                };

                response = _annotationService.GetEpisodeAnnotationAsync(_episode.Object.First().Id).Result;

            }
            catch (Exception e)
            {
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }
            Assert.True(response.Count() == 2);

        }








        private void MockBasicUtilities()
        {
            var userGuid = Guid.NewGuid();
            var episodeGuid = Guid.NewGuid();
            var podGuid = Guid.NewGuid();
            var annotationGuid = Guid.NewGuid();

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


            _sponser = new[] { new Sponsor { Name = "Some Random Name", Website = "some Random Website"} } .AsQueryable().BuildMockDbSet();


            _medialink = new[]
            {
                new MediaLink()
                {
                    AnnotationId = annotationGuid,
                    Url = "google.com",
                    Platform = MediaLink.PlatformType.YouTube,

                }
            }.AsQueryable().BuildMockDbSet();




            _annotation = new[]
           {
                new Annotation()
                {
                    Id =annotationGuid,
                    EpisodeId = episodeGuid,
                    Episode = _episode.Object.First(),
                    Content = "Some random Content",
                    Timestamp = 0.5,
                    Type = Annotation.AnnotationType.MediaLink,
                  
                    MediaLink =_medialink.Object.First() 
                    
                  
                },
                new Annotation()
                {
                    Id = Guid.NewGuid(),
                    EpisodeId = episodeGuid,
                    Episode = _episode.Object.First(),
                    Content = "Some random Content",
                    Timestamp = 0.4,
                    Type = Annotation.AnnotationType.Sponsorship,
                    Sponsorship = _sponser.Object.First()


                }


            }.AsQueryable().BuildMockDbSet();

            // Configuration
            IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

            _dbContextMock.SetupGet(db => db.Users).Returns(_user.Object);
            _dbContextMock.SetupGet(db => db.Podcasts).Returns(_podcast.Object);
            _dbContextMock.SetupGet(db => db.Episodes).Returns(_episode.Object);
            _dbContextMock.SetupGet(db => db.Annotations).Returns(_annotation.Object);
            _dbContextMock.SetupGet(db => db.MediaLinks).Returns(_medialink.Object);
            _dbContextMock.SetupGet(db => db.Sponsors).Returns(_sponser.Object);

            _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

            _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(_user.Object.First()));

        }



    }
}
