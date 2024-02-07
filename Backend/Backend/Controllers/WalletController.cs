using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("wallet")]
    [Authorize]
    public class WalletController : Controller
    {
        private readonly ILogger<WalletController> _logger;
        private readonly IAuthService _authService;
        private readonly IStripeServices _stripeServices;
        public WalletController(IAuthService authService,IStripeServices stripeServices,ILogger<WalletController> logger) {
            _authService = authService;
            _stripeServices = stripeServices;
            _logger = logger;
        }
        
    }
}
