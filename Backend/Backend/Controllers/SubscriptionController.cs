using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.ControllerHelper;

namespace Backend.Controllers;

/// <summary>
/// The Subscription Controller is responsible for handling all the requests related to subscription.
/// </summary>
[ApiController]
[Route("subscription")]
[Authorize]
public class SubscriptionController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ISubscriptionService _subscriptionService;
    private readonly ILogger<SubscriptionController> _logger;

    /// <summary>
    /// Constructor for SubscriptionController
    /// </summary>
    /// <param name="authService"> Service for authentication </param>
    /// <param name="subscriptionService"> Service for subscription </param>
    ///  <param name="logger"> Logger for logging </param>
    public SubscriptionController(IAuthService authService, ISubscriptionService subscriptionService, ILogger<SubscriptionController> logger)
    {
        _authService = authService;
        _subscriptionService = subscriptionService;
        _logger = logger;
    }

    /// <summary>
    /// Subscribe the user to the podcast
    /// </summary>
    /// <param name="PodcastId">Id of the podcast to be subscribed</param>
    /// <returns> True if the user is subscribed to the podcast, false otherwise </returns>
    [HttpPost("{PodcastId}/subscribe")]
    public async Task<IActionResult> Subscribe(Guid PodcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(Subscribe));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _subscriptionService.SubscribeAsync(PodcastId, user) ? Ok("Successfully Subscribed to the Podcast") : Ok("Failed to subscribe the Podcast");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(Subscribe));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Unsubscribe the user from the podcast
    /// </summary>
    /// <param name="PodcastId">Id of the podcast to be unsubscribed</param>
    /// <returns> True if the user is unsubscribed from the podcast, false otherwise</returns>
    [HttpPost("{PodcastId}/unsubscribe")]
    public async Task<IActionResult> Unsubscribe(Guid PodcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(Unsubscribe));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _subscriptionService.UnsubscribeAsync(PodcastId, user) ? Ok("Successfully unsubscribed to the Podcast") : Ok("Failed to unsubscribe the Podcast");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(Unsubscribe));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Check if the user is subscribed to the podcast
    /// </summary>
    /// <param name="PodcastId">Id of the podcast to be checked</param>
    /// <returns> True if the user is subscribed to the podcast, false otherwise </returns>
    [HttpGet("{PodcastId}/IsSubscribed")]
    public async Task<IActionResult> IsSubscribed(Guid PodcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(IsSubscribed));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _subscriptionService.IsSubscribed(PodcastId, user));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(IsSubscribed));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get all the podcasts subscribed by the user
    /// </summary>
    /// <returns> List of podcasts subscribed by the user </returns>
    [HttpGet("MySubscriptions")]
    public async Task<IActionResult> MySubscriptions()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(MySubscriptions));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _subscriptionService.MySubscriptionsAsync(user, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(MySubscriptions));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get all the subscribers of a podcast
    /// </summary>
    /// <param name="PodcastId">Id of the podcast for which subscribers are to be fetched</param>
    /// <returns> List of subscribers of the podcast </returns>
    [HttpGet("{PodcastId}/GetAllPodcastSubscriber")]
    public async Task<IActionResult> GetAllPodcastSubscriber(Guid PodcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAllPodcastSubscriber));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _subscriptionService.GetPodcastSubscriptionAsync(PodcastId, user, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(GetAllPodcastSubscriber));           
            return BadRequest(e.Message);
        }
    }
}