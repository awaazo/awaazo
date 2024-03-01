using Backend.Controllers.Responses;

namespace Backend.Services.Interfaces
{
    public interface IWalletServices
    {
        public Task<bool> Withdraw(Guid userId,double amount);
        public Task<double> GetUserBalance(Guid userId);
        public Task<List<TransactionResponse>> GetUserTransactions(int page, int pageSize, Guid userId);
        public Task<List<Activity>> Last5DaysBalance(Guid userId);
        public Task<List<Activity>> Last5DaysEarning(Guid userId);
        public Task<List<EpisodeResponse>> MostGiftedEpisodes(Guid userId, string domainUrl, int page, int pageSize);

        public Task<List<PodcastResponse>> MostGiftedPodcasts(Guid userId, string domainUrl, int page, int pageSize);
    }
}
