using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// The Analytic Controller is responsible for handling all requests to the analytic endpoints.
/// </summary>
[ApiController]
[Route("analytic")]
[Authorize]
public class AnalyticController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IAnalyticService _analyticService;
    private readonly ILogger<AnalyticController> _logger;

    /// <summary>
    /// The constructor for the Analytic Controller.
    /// </summary>
    /// <param name="analyticService">Analytic Service to be injected.</param>
    /// <param name="authService">Auth Service to be injected.</param>
    /// <param name="logger">Logger to be injected.</param>
    public AnalyticController(IAnalyticService analyticService, IAuthService authService, ILogger<AnalyticController> logger)
    {
        _analyticService = analyticService;
        _authService = authService;
        _logger = logger;
    }

    #region Watch Time

    [HttpGet("{podcastOrEpisodeId}/averageWatchTime")]
    public async Task<ActionResult> GetAverageWatchTime(Guid podcastOrEpisodeId)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAverageWatchTime));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _analyticService.GetAverageWatchTimeAsync(podcastOrEpisodeId, user));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetAverageWatchTime));

            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{podcastOrEpisodeId}/totalWatchTime")]
    public async Task<ActionResult> GetTotalWatchTime(Guid podcastOrEpisodeId)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetTotalWatchTime));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _analyticService.GetTotalWatchTimeAsync(podcastOrEpisodeId, user));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetTotalWatchTime));

            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{podcastOrEpisodeId}/watchTimeDistribution")]
    public async Task<ActionResult> GetWatchTimeDistribution(Guid podcastOrEpisodeId, uint timeInterval = 1, bool intervalIsInMinutes = true)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetWatchTimeDistribution));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _analyticService.GetWatchTimeDistributionInfoAsync(podcastOrEpisodeId, user, timeInterval, intervalIsInMinutes));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetWatchTimeDistribution));

            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{podcastOrEpisodeId}/watchTimeRangeInfo")]
    public async Task<ActionResult> GetWatchTimeRangeInfo(Guid podcastOrEpisodeId, DateTime startTime, DateTime endTime)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetWatchTimeRangeInfo));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _analyticService.GetWatchTimeRangeInfoAsync(podcastOrEpisodeId, user, startTime, endTime));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetWatchTimeRangeInfo));

            return BadRequest(ex.Message);
        }
    }

    #endregion

    #region Audience Age

    /// <summary>
    /// Get the average age of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <returns>The average age of the audience.</returns>
    /// <response code="200">Returns the average age of the audience.</response>
    /// <response code="400">If the podcast or episode does not exist or the user is not the owner.
    /// Or if no audience data is available for the given podcast or episode.</response>
    /// <response code="404">If the user does not exist.</response>
    [HttpGet("{podcastOrEpisodeId}/averageAudienceAge")]
    public async Task<ActionResult> GetAverageAudienceAge(Guid podcastOrEpisodeId)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAverageAudienceAge));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _analyticService.GetAverageAudienceAgeAsync(podcastOrEpisodeId, user));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetAverageAudienceAge));

            return BadRequest(ex.Message);
        }
    }
    
    /// <summary>
    /// Get the age range of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="min">The minimum age of the audience.</param>
    /// <param name="max">The maximum age of the audience.</param>
    /// <returns>The age range of the audience.</returns>
    /// <response code="200">Returns the age range of the audience.</response>
    /// <response code="400">If the podcast or episode does not exist or the user is not the owner.
    /// Or if no audience data is available for the given podcast or episode.</response>
    /// <response code="404">If the user does not exist.</response>
    [HttpGet("{podcastOrEpisodeId}/ageRangeInfo")]
    public async Task<ActionResult> GetAgeRangeInfo(Guid podcastOrEpisodeId, uint min = uint.MinValue , uint max = uint.MaxValue)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAgeRangeInfo));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _analyticService.GetAgeRangeInfoAsync(podcastOrEpisodeId, min, max, user));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetAgeRangeInfo));

            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get the age range distribution of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="ageInterval">The age interval for the distribution.</param>
    /// <returns>The age range distribution of the audience.</returns>
    /// <response code="200">Returns the age range distribution of the audience.</response>
    /// <response code="400">If the podcast or episode does not exist or the user is not the owner.
    /// Or if no audience data is available for the given podcast or episode.</response>
    /// <response code="404">If the user does not exist.</response>
    [HttpGet("{podcastOrEpisodeId}/ageRangeDistributionInfo")]
    public async Task<ActionResult> GetAgeRangeDistributionInfo(Guid podcastOrEpisodeId, uint ageInterval=1)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAgeRangeDistributionInfo));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _analyticService.GetAgeRangeDistributionInfoAsync(podcastOrEpisodeId, ageInterval, user));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetAgeRangeDistributionInfo));

            return BadRequest(ex.Message);
        }
    }

    #endregion Audience Age
}