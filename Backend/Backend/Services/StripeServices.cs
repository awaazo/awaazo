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
        private readonly string ACCEPTED_CURRENCY = "cad";
      
        public StripeServices(SessionService sessionService, IConfiguration configuration)
        {
            _sessionService = sessionService; 
            _configuration = configuration;

        }
        public async Task<string> CreatePaymentSession(int points,Guid pointId)
        {
            Dictionary<string, string> meta = new Dictionary<string, string>();
            meta.Add("id", pointId.ToString());
            var options = new SessionCreateOptions()
            {

                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions> { new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions()
                    {
                        Currency = ACCEPTED_CURRENCY,
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
                SuccessUrl = _configuration["jwt:Audience"]+"/success/?pointId="+pointId,
                CancelUrl = _configuration["jwt:Audience"]+"/failure",
                Metadata = meta
               
            };

            var session = await _sessionService.CreateAsync(options);

            return session.Url;
        }
    }
}
