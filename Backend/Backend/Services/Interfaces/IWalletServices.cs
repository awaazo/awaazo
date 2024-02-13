using Backend.Controllers.Responses;

namespace Backend.Services.Interfaces
{
    public interface IWalletServices
    {
        public Task<bool> Withdraw(Guid userId,double amount);
        public Task<double> GetUserBalance(Guid userId);
        public Task<List<TransactionResponse>> GetUserTransactions(int page, int pageSize, Guid userId);
        public Task<List<Activity>> Last5DaysBalance(Guid userId);
    }
}
