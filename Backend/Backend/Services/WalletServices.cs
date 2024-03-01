using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.Controllers.Responses;
using System.Collections;
using System.Drawing.Printing;

namespace Backend.Services
{
    public class WalletServices : IWalletServices
    {
        private readonly AppDbContext _db;
        private readonly ILogger _logger;
        public WalletServices(AppDbContext db, ILogger logger)
        {
            _db = db;
            _logger = logger;

        }
        /// <summary>
        /// Withdraws Cash From users Wallet
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="amount"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Withdraw(Guid userId, double amount)
        {
            // Check Amount value is valid or not
            if (amount <= 0 || amount > 200)
            {
                throw new Exception("Withdraw amount should be greater then zero and less then 200");

            }
            // Check if the user have that much to withdraw
            double balance = await GetUserBalance(userId);

            // If amount inputted is greater then the balance throw an error
            if (amount > balance)
            {
                throw new Exception("You can't withdraw more then your balance");

            }

            // If all the checks have passed then Proceed with withdrawal
            await _db.AddAsync(new Transactions() { Amount = -amount,TransactionType = Transactions.Type.Withdraw,UserId = userId, CreatedAt = DateTime.Now });

            // Save the changes to the database
            return await _db.SaveChangesAsync() > 0;

        }
        /// <summary>
        /// Gets the current Balance of the User
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<double> GetUserBalance(Guid userId)
        {
            return await _db.Transactions.Where(u => u.UserId == userId).SumAsync(u => u.Amount);

        }

        /// <summary>
        /// Gets all the user transaction
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<TransactionResponse>> GetUserTransactions(int page, int pageSize, Guid userId)
        {
            List<TransactionResponse> response = await _db.Transactions.Include(u => u.User).Where(u => u.UserId == userId).OrderBy(u => u.CreatedAt).Skip(page * pageSize).Take(pageSize).Select(u => new TransactionResponse(u)).ToListAsync();
            
            return response;


        }

        /// <summary>
        /// Gets the last 5 Days Balance
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<Activity>> Last5DaysBalance(Guid userId)
        {

            List<Activity> activty = new List<Activity>();
            for (int i = 0;i<=4;i++)
            {
                var date = DateTime.Today.AddDays(-i +1).Date;
                activty.Add(new Activity() { date = date , Amount =  await _db.Transactions.Where(u =>u.UserId == userId && u.CreatedAt <= date).SumAsync(u => u.Amount) });
            }
            
            return activty;
        }
        /// <summary>
        /// Gets last 5 days Earning
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<Activity>> Last5DaysEarning(Guid userId)
        {
            List<Activity> activty = new List<Activity>();
            for (int i = 0; i <= 4; i++)
            {

                var date = DateTime.Today.AddDays(-i).Date;
                var nextDate = DateTime.Today.AddDays(-i + 1).Date;
                activty.Add(new Activity() { date = date, Amount = await _db.Transactions.Where(u => u.TransactionType == Transactions.Type.Gift && u.UserId == userId && u.CreatedAt >= date && u.CreatedAt < nextDate).SumAsync(u => u.Amount) });
                var lower = DateTime.Today.AddDays(-i).Date;


            }
            return activty;

        }

        /// <summary>
        /// Gives list of episode in descending order of total points
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="domainUrl"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        
        public async Task<List<EpisodeResponse>> MostGiftedEpisodes(Guid userId,string domainUrl,int page, int pageSize)
        {
            List<EpisodeResponse> episodeList = await _db.Episodes
            .Include(e => e.Podcast)
            .Include(e => e.Likes)
            .Include(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(e => e.Comments).ThenInclude(c => c.User)
            .Include(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(e => e.Comments).ThenInclude(c => c.Likes)
            .Include(e => e.Points)
            .Where(u => u.Podcast.PodcasterId== userId)
            .Select(u => new EpisodeResponse(u, domainUrl,false))
            .ToListAsync();

            episodeList = episodeList.Skip(page * pageSize).Take(pageSize).OrderByDescending(u => u.TotalPoints).ToList();

            return episodeList;

        }

        public async Task<List<PodcastResponse>> MostGiftedPodcasts(Guid userId,string domainUrl,int page,int pageSize)
        {
            // Check if the user has any podcasts, if they do retrieve them.
            List<PodcastResponse> podcastResponses = await _db.Podcasts
            .Include(p => p.Podcaster)
            .Include(p => p.Episodes).ThenInclude(e => e.Likes)
            .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Include(p => p.Episodes).ThenInclude(e => e.Points)
            .Include(p => p.Ratings).ThenInclude(r => r.User)
            .Where(p => p.PodcasterId == userId)
            .Select(p => new PodcastResponse(p, domainUrl))
            .ToListAsync();

            podcastResponses = podcastResponses.Skip(page * pageSize).Take(pageSize).OrderByDescending(u => u.TotalPodcastPoints).ToList();

            return podcastResponses;
        }
       

    }
}
