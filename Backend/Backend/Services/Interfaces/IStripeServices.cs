using Backend.Controllers.Requests;

namespace Backend.Services.Interfaces
{
    public interface IStripeServices
    {
        public Task<string> CreatePaymentSession(int Points,Guid pointId);
        
    }
}
