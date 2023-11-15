using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.ControllerHelper;

namespace Backend.Controllers
{
    [ApiController]
    [Route("subscription")]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ISubscriptionService _subscriptionService;
        private readonly ILogger _logger;

        public SubscriptionController(IAuthService authService, ISubscriptionService subscriptionService, ILogger logger) { 
            _authService = authService;
            _subscriptionService = subscriptionService;
            _logger = logger;
        }

        [HttpPost("{PodcastId}/subscribe")]
        public async Task<IActionResult> Subscribe(Guid PodcastId)
        {
            _logger.LogDebug(@"Using the subscription\PodcastId\subscribe Endpoint");

            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");

                return await _subscriptionService.SubscribeAsync(PodcastId, user) ? Ok("Successfully Subscribed to the Podcast"):Ok("Failed to subscribe the Podcast");
            }
            catch (Exception e)
            {
                _logger.LogError(e, "");
                return BadRequest(e.Message);
            }
        }

        [HttpPost("{PodcastId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe(Guid PodcastId)
        {
            _logger.LogDebug(@"Using the subscription\PodcastId\unsubscribe Endpoint");

            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");

                return await _subscriptionService.UnsubscribeAsync(PodcastId, user) ? Ok("Successfully unsubscribed to the Podcast") : Ok("Failed to unsubscribe the Podcast");
            }
            catch (Exception e)
            {
                _logger.LogError(e, "");
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{PodcastId}/IsSubscribed")]
        public async Task<IActionResult> IsSubscribed(Guid PodcastId)
        {
            _logger.LogDebug(@"Using the subscription\PodcastId\IsSubscribed Endpoint");

            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");

                return Ok(await _subscriptionService.IsSubscribed(PodcastId, user)) ;
            }
            catch (Exception e)
            {
                _logger.LogError(e, "");
                return BadRequest(e.Message);
            }
        }

        [HttpGet("MySubscriptions")]
        public async Task<IActionResult> MySubscriptions()
        {
            _logger.LogDebug(@"Using the subscription\MySubscriptions Endpoint");

            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");

                return Ok(await _subscriptionService.MySubscriptionsAsync(user, GetDomainUrl(HttpContext))); 
            }
            catch (Exception e)
            {
                _logger.LogError(e, "");
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{PodcastId}/GetAllPodcastSubscriber")]
        public async Task<IActionResult> GetAllPodcastSubscriber(Guid PodcastId)
        {
            _logger.LogDebug(@"Using the subscription\PodcastId\GetAllPodcastSubscriber Endpoint");

            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");

                return Ok(await _subscriptionService.GetPodcastSubscriptionAsync(PodcastId, user, GetDomainUrl(HttpContext)));
            }
            catch (Exception e)
            {
                _logger.LogError(e, "");
                return BadRequest(e.Message);
            }
        }
    }
}
