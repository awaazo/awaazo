using Backend.Controllers.Requests;
using Backend.Services.Interfaces;
using Stripe;
using Stripe.Checkout;
using System.Threading;

namespace Backend.Services
{
    public class StripeServices : IStripeServices
    {
        private readonly SessionService _sessionService;
        private readonly IConfiguration _configuration;
        public StripeServices(SessionService sessionService, IConfiguration configuration)
        {
            _sessionService = sessionService; 
            _configuration = configuration;

        }
        public async Task<string> CreatePaymentSession(int points,Guid pointId)
        {

            var options = new SessionCreateOptions()
            {

                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions> { new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions()
                    {
                        Currency = "cad",
                        UnitAmount = Convert.ToInt32(0.1 * 100),
                        ProductData = new SessionLineItemPriceDataProductDataOptions()
                        {
                            Name = "Points",
                            Description = "Awaazo Points"
                        }

                    },
                    Quantity = points
                }

                },
                Mode = "payment",
                SuccessUrl = _configuration["jwt:Audience"],
                CancelUrl = _configuration["jwt:Audience"],
                ClientReferenceId = pointId.ToString()
               
            };

            var session = await _sessionService.CreateAsync(options);

            return session.Url;
        }
    }
}
