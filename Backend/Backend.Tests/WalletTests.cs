using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Backend.Tests
{
    [Collection("Sequential")]
    public class WalletTests
    {
        private Mock<ILogger<WalletController>> _loggerMock;
        private Mock<AppDbContext> _dbContextMock;
        private Mock<IAuthService> _authServiceMock;

        private WalletServices _walletServices;
        private WalletController _walletController;

        private Mock<DbSet<User>> _user;
        private Mock<DbSet<Podcast>> _podcast;
        private Mock<DbSet<Episode>> _episode;
        private Mock<DbSet<Transactions>> _transactions;
        private readonly string[] TAGS = { "TestTagOne", "TestTagTwo" };


        public WalletTests()
        {
            _dbContextMock = new(new DbContextOptions<AppDbContext>());
            _loggerMock = new();
            _authServiceMock = new();
            _walletServices = new(_dbContextMock.Object, _loggerMock.Object);
            _walletController = new(_authServiceMock.Object, _walletServices, _loggerMock.Object);

            MockBasicUtilities();



        }
        [Fact]
        public void Wallet_Withdraw_ValidRequest_ReturnsTrue()
        {
            bool response = false;
            try
            {   
                // Try to Withdraw 
                response = _walletServices.Withdraw(_user.Object.First().Id, 5).Result;
               
            }
            catch (Exception e)
            {
                // Else Assert fail
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            // Assert true is response is true
            Assert.True(response);
        }

        [Fact]

        public void Wallet_Withdraw_InvalidRequest_case1_ReturnsFalse()
        {
            bool response = false;
            try
            {
                // Try to Withdraw 
                response = _walletServices.Withdraw(_user.Object.First().Id, 15).Result;
                Assert.Fail("Withdrawal should have failed but succeeded");

            }
            catch (Exception e)
            {
                // Else Assert fail

                Assert.Contains("You can't withdraw more then your balance",e.Message);
            }

        }
        [Fact]
        public void Wallet_Withdraw_InvalidRequest_case2_ReturnsFalse()
        {
            bool response = false;
            try
            {
                // Try to Withdraw 
                response = _walletServices.Withdraw(_user.Object.First().Id, -15).Result;
                Assert.Fail("Withdrawal should have failed but succeeded");

            }
            catch (Exception e)
            {
                // Else Assert fail

                Assert.Contains("Withdraw amount should be greater then zero and less then 200", e.Message);
            }

        }

        [Fact]
        public void Wallet_GetTransaction_ValidRequest_ReturnsTrue()
        {
            List<TransactionResponse> response = new();
            try
            {
                // Try to Withdraw 
                response = _walletServices.GetUserTransactions(1,5,_user.Object.First().Id).Result;

            }
            catch (Exception e)
            {
                // Else Assert fail
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            // Assert true is response is true
            Assert.NotNull(response);
        }

        [Fact]
        public void Wallet_GetBalance_ValidRequest_ReturnsTrue()
        {
            double response = new();
            try
            {
                // Try to Withdraw 
                response = _walletServices.GetUserBalance(_user.Object.First().Id).Result;

            }
            catch (Exception e)
            {
                // Else Assert fail
                Assert.Fail("Should not have thrown an error: " + e.Message);
            }

            // Assert true is response is true
            Assert.True(response == 10);
        }


        private void MockBasicUtilities()
        {
            var userGuid = Guid.NewGuid();
            var user2Guid = Guid.NewGuid();
            var podGuid = Guid.NewGuid();
            var episodeGuid = Guid.NewGuid();


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
            },
            new User()
            {
                Id = user2Guid,
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
                    Id = podGuid,
                    Tags = TAGS,
                    Name = "Sample Podcast Name",
                    Description = "Sample Podcast Description",
                    CoverArt = podGuid+@".png|/|\|test/png",
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
                    Thumbnail = @"Thumbnail|/|\|test/png",
                    Audio = @"Audio|/|\|test/mp3",
                    Podcast = _podcast.Object.First()

                }
            }.AsQueryable().BuildMockDbSet();

            _transactions = new[]
            {
                new Transactions()
                {
                    Id = Guid.NewGuid(),
                    UserId = userGuid,
                    SenderId = user2Guid,
                    TransactionType = Transactions.Type.Gift,
                    Amount = 10,
                }
            }.AsQueryable().BuildMockDbSet();


            _dbContextMock.SetupGet(db => db.Podcasts).Returns(_podcast.Object);
            _dbContextMock.SetupGet(db => db.Users).Returns(_user.Object);
            _dbContextMock.SetupGet(db => db.Episodes).Returns(_episode.Object);
            _dbContextMock.SetupGet(db => db.Transactions).Returns(_transactions.Object);
            _dbContextMock.Setup(db => db.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));


            _authServiceMock.Setup(auth => auth.IdentifyUserAsync(It.IsAny<HttpContext>())).Returns(Task.FromResult(_user.Object.First()));



        }
    }
}
