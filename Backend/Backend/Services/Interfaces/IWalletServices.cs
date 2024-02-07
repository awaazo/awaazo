namespace Backend.Services.Interfaces
{
    public interface IWalletServices
    {
        public Task<bool> Withdraw(Guid userId,double amount);


    }
}
