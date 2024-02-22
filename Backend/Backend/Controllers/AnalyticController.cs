using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.ControllerHelper;

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

    #region User Interaction

    /// <summary>
    /// Get the user interaction metrics for a podcast.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <returns>The user interaction metrics for the podcast or episode.</returns>
    /// <response code="200">Returns the user interaction metrics for the podcast or episode.</response>
    /// <response code="404">If the user interaction metrics for the podcast or episode cannot be found.</response>
    [HttpGet("{podcastOrEpisodeId}/userEngagementMetrics")]
    public async Task<ActionResult> GetUserEngagementMetrics(Guid podcastOrEpisodeId)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetUserEngagementMetrics));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _analyticService.GetUserEngagementMetricsAsync(podcastOrEpisodeId, user));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetUserEngagementMetrics));

            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get the top commented podcasts or episodes.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="count">The number of podcasts or episodes to return.</param>
    /// <param name="getLessCommented">Whether to get the less commented podcasts or episodes.</param>
    /// <returns>The top commented podcasts or episodes.</returns>
    /// <response code="200">Returns the top commented podcasts or episodes.</response>
    /// <response code="404">If the top commented podcasts or episodes cannot be found.</response>
    /// <response code="400">If the user does not exist.</response>
    [HttpGet("getMostCommented")]
    public async Task<ActionResult> GetTopCommented(Guid? podcastId, int count = 5, bool getLessCommented = false)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetTopCommented));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return podcastId is null?
                Ok(await _analyticService.GetTopCommentedPodcastsAsync(count, getLessCommented, user, GetDomainUrl(HttpContext))) :
                Ok(await _analyticService.GetTopCommentedEpisodesAsync(podcastId.Value, count, getLessCommented, user, GetDomainUrl(HttpContext)));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetTopCommented));

            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get the top liked podcasts or episodes.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="count">The number of podcasts or episodes to return.</param>
    /// <param name="getLessLiked">Whether to get the less liked podcasts or episodes.</param>
    /// <returns>The top liked podcasts or episodes.</returns>
    /// <response code="200">Returns the top liked podcasts or episodes.</response>
    /// <response code="404">If the top liked podcasts or episodes cannot be found.</response>
    /// <response code="400">If the user does not exist.</response>
    [HttpGet("getMostLiked")]
    public async Task<ActionResult> GetTopLiked(Guid? podcastId, int count = 5, bool getLessLiked = false)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetTopLiked));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return podcastId is null?
                Ok(await _analyticService.GetTopLikedPodcastsAsync(count, getLessLiked, user, GetDomainUrl(HttpContext))) :
                Ok(await _analyticService.GetTopLikedEpisodesAsync(podcastId.Value, count, getLessLiked, user, GetDomainUrl(HttpContext)));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetTopLiked));

            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get the top clicked podcasts or episodes.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="count">The number of podcasts or episodes to return.</param>
    /// <param name="getLessClicked">Whether to get the less clicked podcasts or episodes.</param>
    /// <returns>The top clicked podcasts or episodes.</returns>
    /// <response code="200">Returns the top clicked podcasts or episodes.</response>
    /// <response code="404">If the top clicked podcasts or episodes cannot be found.</response>
    /// <response code="400">If the user does not exist.</response>
    [HttpGet("getMostClicked")]
    public async Task<ActionResult> GetTopClicked(Guid? podcastId, int count = 5, bool getLessClicked = false)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetTopClicked));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return podcastId is null?
                Ok(await _analyticService.GetTopClickedPodcastsAsync(count, getLessClicked, user, GetDomainUrl(HttpContext))) :
                Ok(await _analyticService.GetTopClickedEpisodesAsync(podcastId.Value, count, getLessClicked, user, GetDomainUrl(HttpContext)));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetTopClicked));

            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get the top watched podcasts or episodes.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="count">The number of podcasts or episodes to return.</param>
    /// <param name="getLessWatched">Whether to get the less watched podcasts or episodes.</param>
    /// <returns>The top watched podcasts or episodes.</returns>
    /// <response code="200">Returns the top watched podcasts or episodes.</response>
    /// <response code="404">If the top watched podcasts or episodes cannot be found.</response>
    /// <response code="400">If the user does not exist.</response>
    [HttpGet("getMostWatched")]
    public async Task<ActionResult> GetTopWatched(Guid? podcastId, int count = 5, bool getLessWatched = false)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetTopWatched));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return podcastId is null?
                Ok(await _analyticService.GetTopWatchedPodcastsAsync(count, getLessWatched, user, GetDomainUrl(HttpContext))) :
                Ok(await _analyticService.GetTopWatchedEpisodesAsync(podcastId.Value, count, getLessWatched, user, GetDomainUrl(HttpContext)));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetTopWatched));

            return BadRequest(ex.Message);
        }
    }

    #endregion User Interaction

    #region Watch Time

    /// <summary>
    /// Get the average watch time of a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <returns>The average watch time of the podcast or episode.</returns>
    /// <response code="200">Returns the average watch time of the podcast or episode.</response>
    /// <response code="400">If the podcast or episode does not exist or the user is not the owner.</response>
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

    /// <summary>
    /// Get the total watch time of a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <returns>The total watch time of the podcast or episode.</returns>
    /// <response code="200">Returns the total watch time of the podcast or episode.</response>
    /// <response code="400">If the podcast or episode does not exist or the user is not the owner.</response>
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

    /// <summary>
    /// Get the watch time range of a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="timeInterval">The time interval for the distribution.</param>
    /// <param name="intervalIsInMinutes">Whether the interval is in minutes or not.</param>
    /// <returns>The watch time range of the podcast or episode.</returns>
    /// <response code="200">Returns the watch time range of the podcast or episode.</response>
    /// <response code="400">If the podcast or episode does not exist or the user is not the owner.</response>
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

    /// <summary>
    /// Get the watch time range of a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="minTime">The minimum time of the range.</param>
    /// <param name="maxTime">The maximum time of the range.</param>
    /// <returns>The watch time range of the podcast or episode.</returns>
    /// <response code="200">Returns the watch time range of the podcast or episode.</response>
    /// <response code="400">If the podcast or episode does not exist or the user is not the owner.</response>
    [HttpGet("{podcastOrEpisodeId}/watchTimeRangeInfo")]
    public async Task<ActionResult> GetWatchTimeRangeInfo(Guid podcastOrEpisodeId, TimeSpan minTime, TimeSpan maxTime)
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

            return Ok(await _analyticService.GetWatchTimeRangeInfoAsync(podcastOrEpisodeId, user, minTime, maxTime));
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