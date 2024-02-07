using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class WalletServices : IWalletServices
    {
        private readonly AppDbContext _db;
        private readonly ILogger _logger;
        public WalletServices(AppDbContext db,ILogger logger)
        {
            _db = db;
            _logger = logger;

        }

        public async Task<bool> Withdraw(Guid userId, double amount)
        {
            // Check Amount value is valid or not
            if(amount < 0 || amount > 200)
            {
                throw new Exception("Withdraw amount should be greater then zero and less then 200");

            }
            // Check if the user have that much to withdraw
            double balance  =  await GetUserBalance(userId);

            // If amount inputted is greater then the balance throw an error
            if(amount > balance)
            {
                throw new Exception("You can't withdraw more then your balance");

            }
           
            // If all the checks have passed then Proceed with withdrawal
            await _db.AddAsync(new Withdrawals() { Amount = amount, UserId = userId, CreatedAt = DateTime.UtcNow });

            // Save the changes to the database
            return await _db.SaveChangesAsync() > 0;

        }


        public async Task<double> GetUserBalance(Guid userId) {

            // Get All the Point associate with the user
            List<Podcast> podcast = await _db.Podcasts.Include(u => u.Episodes).ThenInclude(u => u.Points).Where(u => u.PodcasterId == userId).ToListAsync();
            
            //Amount Withdrawed till now
            double withdrawals = await _db.Withdrawals.Where(u => u.UserId == userId).SumAsync(u => u.Amount); 

            // Intially Gifted amount is set to be 0
            double giftedAmount = 0;
            
            // Calculate the total amount associated with the point
            foreach (var pod in podcast)
            {
                foreach (var ep in pod.Episodes)
                {
                    giftedAmount += ep.Points.Where(u => u.Success == true).Sum(u => u.Amount);
                }
                
            }
            
            //Calculate the total Balance
            return giftedAmount - withdrawals;

        }
    }
}
