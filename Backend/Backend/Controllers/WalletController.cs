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
        private const int MIN_PAGE = 0;
        private const int DEFAULT_PAGE_SIZE = 20;
        private readonly ILogger<WalletController> _logger;
        private readonly IAuthService _authService;
        private readonly IWalletServices _walletServices;
        public WalletController(IAuthService authService,IWalletServices walletServices,ILogger<WalletController> logger) {
            _authService = authService;
            _walletServices = walletServices;
            _logger = logger;
        }

        /// <summary>
        /// Endpoint responsible to Withdraw from the waller
        /// </summary>
        /// <param name="Amount"></param>
        /// <returns></returns>

        [HttpPost("withdraw")]
        public async Task<IActionResult> withdraw(double Amount)
        {
            try
            {

                this.LogDebugControllerAPICall(_logger, callerName: nameof(withdraw));


                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");



                return Ok(await _walletServices.Withdraw(user.Id,Amount) ? "Successfully Withdrawed" : "Error while Withdrawing");

            }
            catch (Exception e)
            {
                this.LogErrorAPICall(_logger, e, callerName: nameof(withdraw));
                return BadRequest(e.Message);

            }
        }

        /// <summary>
        /// Get the Balance in the Wallet
        /// </summary>
        /// <returns></returns>
        [HttpGet("balance")]
        public async Task<IActionResult> getUserBalance()
        {
            try
            {

                this.LogDebugControllerAPICall(_logger, callerName: nameof(withdraw));


                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");



                return Ok(await _walletServices.GetUserBalance(user.Id));

            }
            catch (Exception e)
            {
                this.LogErrorAPICall(_logger, e, callerName: nameof(withdraw));
                return BadRequest(e.Message);

            }
        }


        [HttpGet("transactions")]
        public async Task<IActionResult> getUserTransactions(int page= MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
        {
            try
            {

                this.LogDebugControllerAPICall(_logger, callerName: nameof(withdraw));


                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");



                return Ok(await _walletServices.GetUserTransactions(page,pageSize,user.Id));

            }
            catch (Exception e)
            {
                this.LogErrorAPICall(_logger, e, callerName: nameof(withdraw));
                return BadRequest(e.Message);

            }
        }

    }
}
