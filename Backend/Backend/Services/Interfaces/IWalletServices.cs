namespace Backend.Services.Interfaces
{
    public interface IWalletServices
    {
        public Task<bool> Withdraw(Guid userId,double amount);
        public Task<double> GetUserBalance(Guid userId);

    }
}
