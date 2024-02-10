using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.Controllers.Responses;
using System.Collections;

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
            await _db.AddAsync(new Transactions() { Amount = -amount,TransactionType = Transactions.Type.Withdraw,UserId = userId, CreatedAt = DateTime.UtcNow });

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
                var date = DateTime.Today.AddDays(-i).Date;
                activty.Add(new Activity() { date = date , Amount =  await _db.Transactions.Where(u => u.CreatedAt < date).SumAsync(u => u.Amount) });
            }
            
            return activty;
        }



    }
}
