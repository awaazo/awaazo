using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.FileStorageHelper;
using static Backend.Infrastructure.ControllerHelper;
using System.ComponentModel.DataAnnotations;
using Backend.Controllers.Responses;
using Azure.Core;

namespace Backend.Controllers;

/// <summary>
/// The Podcast Controller is responsible for handling all the requests related to podcast.
/// </summary>
[ApiController]
[Route("podcast")]
[Authorize]
public class PodcastController : ControllerBase
{
    private const int MIN_PAGE = 0;
    private const int DEFAULT_PAGE_SIZE = 20;
    private readonly IPodcastService _podcastService;
    private readonly IAuthService _authService;
    private readonly ILogger<PodcastController> _logger;


    /// <summary>
    /// Constructor for PodcastController
    /// </summary>
    /// <param name="podcastService"> Service for podcast to be injected</param>
    /// <param name="authService"> Service for authentication to be injected</param>
    /// <param name="logger"> Logger for logging to be injected</param>
    public PodcastController(IPodcastService podcastService, IAuthService authService, ILogger<PodcastController> logger)
    {
        _logger = logger;
        _podcastService = podcastService;
        _authService = authService;
    }

    #region Podcast

    /// <summary>
    /// Creates a podcast.
    /// </summary>
    /// <param name="request">Request object containing the podcast details.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("create")]
    public async Task<IActionResult> CreatePodcast([FromForm] CreatePodcastRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(CreatePodcast));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.CreatePodcastAsync(request, user) ? Ok("Podcast created.") : Ok("Failed to create podcast.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(CreatePodcast));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Edits a podcast.
    /// </summary>
    /// <param name="request">Request object containing the podcast details.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("edit")]
    public async Task<IActionResult> EditPodcast([FromForm] EditPodcastRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(EditPodcast));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.EditPodcastAsync(request, user) ? Ok("Podcast changes saved.") : Ok("Failed to save podcast changes.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(EditPodcast));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Deletes a podcast by Id.
    /// </summary>
    /// <param name="podcastId">Id of the podcast to be deleted.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpDelete("delete")]
    public async Task<IActionResult> DeletePodcast(Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeletePodcast));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.DeletePodcastAsync(podcastId, user) ? Ok("Podcast deleted.") : Ok("Failed to delete podcast.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(DeletePodcast));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets all podcasts for the current user.
    /// </summary>
    /// <param name="page">The page number to return.</param>
    /// <param name="pageSize">The number of results per page.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("myPodcasts")]
    public async Task<IActionResult> GetMyPodcasts(int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetMyPodcasts));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetUserPodcastsAsync(page, pageSize, GetDomainUrl(HttpContext), user));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetMyPodcasts));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets all podcasts for a user.
    /// </summary>
    /// <param name="userId">Id of the user to get podcasts for.</param>
    /// <param name="page">The page number to return.</param>
    /// <param name="pageSize">The number of results per page.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("userPodcasts")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserPodcasts(Guid userId, int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetUserPodcasts));

            return Ok(await _podcastService.GetUserPodcastsAsync(page, pageSize, GetDomainUrl(HttpContext), userId));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetUserPodcasts));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets all podcasts.
    /// </summary>
    /// <param name="page">The page number to return.</param>
    /// <param name="pageSize">The number of results per page.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllPodcasts(int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAllPodcasts));

            return Ok(await _podcastService.GetAllPodcastsAsync(page, pageSize, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetAllPodcasts));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Searches for podcasts based on a filter.
    /// </summary>
    /// <param name="filter">The filter to apply.</param>
    /// <param name="page">The page number to return.</param>
    /// <param name="pageSize">The number of results per page.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchPodcast([FromBody] PodcastFilter filter, int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(SearchPodcast));

            return Ok(await _podcastService.GetSearchPodcastsAsync(page, pageSize, GetDomainUrl(HttpContext), filter));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(SearchPodcast));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets a podcast by Id.
    /// </summary>
    /// <param name="podcastId">Id of the podcast to be fetched.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{podcastId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPodcastById(Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetPodcastById));

            return Ok(await _podcastService.GetPodcastByIdAsync(GetDomainUrl(HttpContext), podcastId));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetPodcastById));
            return BadRequest(e.Message);
        }
    }


    /// <summary>
    /// Gets the cover art of a podcast.
    /// </summary>
    /// <param name="podcastId">Id of the podcast for which the cover art is to be fetched.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{podcastId}/getCoverArt")]
    [AllowAnonymous]
    public async Task<ActionResult> GetPodcastCoverArt(Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetPodcastCoverArt));

            // Get the name of the cover art file
            string coverArtName = await _podcastService.GetPodcastCoverArtNameAsync(podcastId);

            // Return the cover art file from the server
            return PhysicalFile(GetPodcastCoverArtPath(coverArtName), GetFileType(coverArtName), enableRangeProcessing: false);
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetPodcastCoverArt));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets podcasts that match the given tags/genres.
    /// </summary>
    /// <param name="tags">Tags to match.</param>
    /// <param name="page">Page number to get.</param>
    /// <param name="pageSize">Number of results per page.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("byTags")]
    [AllowAnonymous]
    public async Task<ActionResult> GetPodcastsByTags([FromHeader][Required] string[] tags, int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetPodcastsByTags));

            // Return the podcasts that match the given genres
            return Ok(await _podcastService.GetPodcastsByTagsAsync(page, pageSize, GetDomainUrl(HttpContext), tags));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetPodcastsByTags));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets metrics for a podcast.
    /// </summary>
    /// <param name="podcastId">Id of the podcast to get metrics for.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{podcastId}/metrics")]
    public async Task<ActionResult> GetMetrics(Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetMetrics));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetMetrics(user, podcastId, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetMetrics));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets recent podcasts
    /// </summary>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("getRecentPodcasts")]
    [AllowAnonymous]
    public async Task<ActionResult> GetRecentPodcasts(int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetMetrics));

            return Ok(await _podcastService.GetRecentPodcasts(page, pageSize, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetMetrics));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get Recommeded Podcasts for a User
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <returns></returns>
    [HttpGet("getRecommendedPodcasts")]
    [AllowAnonymous]

    public async Task<ActionResult> GetRecommededPodcasts(int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);


            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetRecommededPodcasts));

            return Ok(await _podcastService.GetRecommendedPodcast(user,page,pageSize));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetRecommededPodcasts));
            return BadRequest(e.Message);
        }
    }

    #endregion

    #region Episode

    #region  Episode CRUD

    /// <summary>
    /// Adds an episode to a podcast.
    /// </summary>
    /// <param name="podcastId">Id of the podcast to add the episode to.</param>
    /// <param name="request">Request object containing the episode details.</param>        
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("{podcastId}/add")]
    [RequestFormLimits(ValueLengthLimit = PodcastService.MAX_REQUEST_SIZE, MultipartBodyLengthLimit = PodcastService.MAX_REQUEST_SIZE)]
    [RequestSizeLimit(PodcastService.MAX_REQUEST_SIZE)]
    public async Task<IActionResult> AddEpisode(Guid podcastId, [FromForm] CreateEpisodeRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddEpisode));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            Guid episodeId = await _podcastService.CreateEpisodeAsync(request, podcastId, user);
            return Ok(episodeId);
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(AddEpisode));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Edits an episode of a podcast by Id.
    /// </summary>
    /// <param name="episodeId">Id of the episode to be edited.</param>
    /// <param name="request">Request object containing the episode details.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("{episodeId}/edit")]
    [RequestFormLimits(ValueLengthLimit = PodcastService.MAX_REQUEST_SIZE, MultipartBodyLengthLimit = PodcastService.MAX_REQUEST_SIZE)]
    [RequestSizeLimit(PodcastService.MAX_REQUEST_SIZE)]
    public async Task<IActionResult> EditEpisode(Guid episodeId, [FromForm] EditEpisodeRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(EditEpisode));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.EditEpisodeAsync(request, episodeId, user) ? Ok("Episode changes saved.") : Ok("Failed to save episode changes.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(EditEpisode));
            return BadRequest(e.Message);
        }
    }


    /// <summary>
    /// Adds audio to an episode of a podcast by Id.
    /// </summary>
    /// <param name="episodeId">Id of the episode to add audio to.</param>
    /// <param name="request">Request object containing the episode audio details.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("{episodeId}/addEpisodeAudio")]
    [RequestFormLimits(ValueLengthLimit = PodcastService.MAX_REQUEST_SIZE, MultipartBodyLengthLimit = PodcastService.MAX_REQUEST_SIZE)]
    [RequestSizeLimit(PodcastService.MAX_REQUEST_SIZE)]
    public async Task<ActionResult> AddEpisodeAudio(Guid episodeId, [FromForm] AddEpisodeAudioRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddEpisodeAudio));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.AddEpisodeAudioAsync(request, episodeId, user) ? Ok("Episode audio added.") : Ok("Failed to add episode audio.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(AddEpisodeAudio));
            return BadRequest(e.Message + " " + e.StackTrace);
        }
    }

    /// <summary>
    /// Deletes an episode of a podcast by Id.
    /// </summary>
    /// <param name="episodeId">Id of the episode to be deleted.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpDelete("{episodeId}/delete")]
    public async Task<IActionResult> DeleteEpisode(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeleteEpisode));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.DeleteEpisodeAsync(episodeId, user) ? Ok("Episode deleted.") : Ok("Failed to delete episode.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(DeleteEpisode));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets an episode of a podcast by Id.
    /// </summary>
    /// <param name="episodeId">Id of the episode to be fetched.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("episode/{episodeId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetEpisode(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisode));

            return Ok(await _podcastService.GetEpisodeByIdAsync(episodeId, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetEpisode));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the audio of an episode.
    /// </summary>
    /// <param name="podcastId">Id of the podcast for which the episode audio is to be fetched.</param>
    /// <param name="episodeId">Id of the episode for which the audio is to be fetched.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{podcastId}/{episodeId}/getAudio")]
    [AllowAnonymous]
    public async Task<ActionResult> GetEpisodeAudio(Guid podcastId, Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisodeAudio));

            // Get the name of the audio file
            string audioName = await _podcastService.GetEpisodeAudioNameAsync(episodeId);

            var test = GetFileType(audioName);

            // Return the audio file from the server
            return PhysicalFile(GetPodcastEpisodeAudioPath(audioName, podcastId), GetFileType(audioName), enableRangeProcessing: true);
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetEpisodeAudio));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the thumbnail of an episode.
    /// </summary>
    /// <param name="podcastId">Id of the podcast for which the episode thumbnail is to be fetched.</param>
    /// <param name="episodeId">Id of the episode for which the thumbnail is to be fetched.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{podcastId}/{episodeId}/getThumbnail")]
    [AllowAnonymous]
    public async Task<ActionResult> GetEpisodeThumbnail(Guid podcastId, Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisodeThumbnail));

            // Get the name of the thumbnail file
            string thumbnailName = await _podcastService.GetEpisodeThumbnailNameAsync(episodeId);

            // Return the thumbnail file from the server
            return PhysicalFile(GetPodcastEpisodeThumbnailPath(thumbnailName, podcastId), GetFileType(thumbnailName), enableRangeProcessing: false);
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetEpisodeThumbnail));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Searches for episodes based on a filter.
    /// </summary>
    /// <param name="episodeFilter">The filter to apply.</param>
    /// <param name="page">The page number to return.</param>
    /// <param name="pageSize">The number of results per page.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("episode/search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchEpisode([FromBody] EpisodeFilter episodeFilter, int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(SearchEpisode));

            return Ok(await _podcastService.SearchEpisodeAsync(page, pageSize, episodeFilter, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(SearchEpisode));
            return BadRequest(e.Message);
        }
    }

    #endregion Episode CRUD

    #region AI Generated Episode

    /// <summary>
    /// Generates an AI episode for a podcast.
    /// </summary>
    /// <param name="podcastId">Id of the podcast to generate the AI episode for.</param>
    /// <param name="request">Request object containing the AI episode details.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns> 
    [HttpPost("{podcastId}/generateAIEpisode")]
    public async Task<IActionResult> GenerateAIEpisode([FromForm] GenerateAIEpisodeRequest request, Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GenerateAIEpisode));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.GenerateAIEpisodeAsync(request, podcastId, user, GetDomainUrl(HttpContext)) ? Ok("AI Generated Episode created.") : Ok("Failed to create AI Generated Episode.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GenerateAIEpisode));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Generates an AI episode for a podcast from text.
    /// </summary>
    /// <param name="podcastId">Id of the podcast to generate the AI episode for.</param>
    /// <param name="request">Request object containing the AI episode details.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns> 
    [HttpPost("{podcastId}/generateAIEpisodeFromText")]
    public async Task<IActionResult> GenerateAIEpisodeFromText([FromForm] GenerateAIEpisodeFromTextRequest request, Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GenerateAIEpisodeFromText));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.GenerateAIEpisodeFromTextAsync(request, podcastId, user, GetDomainUrl(HttpContext)) ? Ok("AI Generated Episode created.") : Ok("Failed to create AI Generated Episode.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            this.LogErrorAPICall(_logger, e, callerName: nameof(GenerateAIEpisodeFromText));
            return BadRequest(e.Message);
        }

    }


    #endregion AI Generated Episode

    #region Episode Watch History

    /// <summary>
    /// This function saves the last watched position on a specific episode
    /// On the frontend:
    ///     - You need to add a onBeforeUnload  hook to the episode webpage and this hook should
    ///       send request to this route.
    /// </summary>
    /// <param name="episodeId">Id of the episode for which the watch history is to be saved.</param>
    /// <param name="request">ListenPosition of the episode in seconds.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("{episodeId}/saveWatchHistory")]
    public async Task<IActionResult> SaveWatchHistory(Guid episodeId, [FromBody] EpisodeHistorySaveRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(SaveWatchHistory));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return await _podcastService.SaveWatchHistory(user, episodeId, request.ListenPosition) ? Ok("Successfully saved watch history") : Ok("Failed to save watch history");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(SaveWatchHistory));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the watch history of a specific episode
    /// </summary>
    /// <param name="episodeId">ID of the episode for which the watch history is requested.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{episodeId}/watchHistory")]
    public async Task<IActionResult> GetWatchHistory(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetWatchHistory));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.GetWatchHistory(user, episodeId));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetWatchHistory));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the Users Watch History
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <returns></returns>
    [HttpGet("UserWatchHistory")]
    public async Task<IActionResult> GetUserWatchHistory(int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetUserWatchHistory));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.GetUserWatchHistory(page, pageSize, user));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetUserWatchHistory));
            return BadRequest(e.Message);
        }
    }


    /// <summary>
    /// Delete specific episode from the Watch History
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    [HttpDelete("{episodeId}/deleteWatchHistory")]
    public async Task<IActionResult> DeleteWatchHistory(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeleteWatchHistory));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.DeleteWatchHistory(user, episodeId) ? "Successfully Deleted the History" : "Error while Deleting the History");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetUserWatchHistory));
            return BadRequest(e.Message);
        }
    }


    /// <summary>
    /// Delete the whole history associated by the User
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    [HttpDelete("deleteAllWatchHistory")]
    public async Task<IActionResult> DeleteAllWatchHistory(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeleteAllWatchHistory));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.DeleteAllWatchHistory(user) ? "Successfully Cleared the History" : "Error while Deleting the History");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(DeleteAllWatchHistory));
            return BadRequest(e.Message);
        }
    }



    #endregion Episode Watch History

    #region Adjecent Episodes

    /// <summary>
    /// Gets Adjecent Episodes
    /// </summary>
    /// <param name="episodeId">ID of the episode for which adjecent episodes are requested.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{episodeId}/adjecentEpisode")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAdjecentEpisode(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAdjecentEpisode));

            return Ok(await _podcastService.GetAdjecentEpisodeAsync(episodeId));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetAdjecentEpisode));
            return BadRequest(e.Message);
        }
    }



    /// <summary>
    /// Gets recent Episodes
    /// </summary>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("getRecentEpisodes")]
    [AllowAnonymous]
    public async Task<ActionResult> GetRecentEpisodes(int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetMetrics));

            return Ok(await _podcastService.GetRecentEpisodes(page, pageSize, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetMetrics));
            return BadRequest(e.Message);
        }
    }

    #endregion Adjecent Episodes

    #region Episode Chat

    /// <summary>
    /// Gets the chat of an episode.
    /// </summary>
    /// <param name="episodeId">ID of the episode for which a chat is requested.</param>
    /// <param name="page">The page number to return.</param>
    /// <param name="pageSize">The number of results per page.</param>
    /// <returns>The chat or null if its not ready.</returns>
    [HttpGet("{episodeId}/getEpisodeChat")]
    public async Task<IActionResult> GetEpisodeChat(Guid episodeId, int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisodeChat));

            User? user = await _authService.IdentifyUserAsync(HttpContext);

            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.GetEpisodeChatAsync(page, pageSize, episodeId, user, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetEpisodeChat));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Adds a chat message to an episode.
    /// </summary>
    /// <param name="request">Request object containing the episode chat details.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    /// <remarks>
    /// The request object should contain the following fields:
    /// - EpisodeId: The ID of the episode to add the chat to.
    /// - Prompt: The prompt to add to the episode chat.
    /// </remarks>
    [HttpPost("addEpisodeChat")]
    public async Task<IActionResult> AddEpisodeChat([FromBody] PromptEpisodeRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddEpisodeChat));

            User? user = await _authService.IdentifyUserAsync(HttpContext);

            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.PromptEpisodeChatAsync(request.EpisodeId, user, request.Prompt, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(AddEpisodeChat));
            return BadRequest(e.Message);
        }
    }



    #endregion Episode Chat

    #region Transcript

    /// <summary>
    /// Gets the transcript of an episode.
    /// </summary>
    /// <param name="episodeId">ID of the episode for which a transcript is requested.</param>
    /// <param name="seekTime">The time to seek to in the transcript.</param>
    /// <param name="includeWords">Whether to include the words in the transcript.</param>
    /// <returns>The transcript or null if its not ready.</returns>
    [HttpGet("{episodeId}/getTranscript")]
    public async Task<ActionResult> GetEpisodeTranscript(Guid episodeId, float? seekTime = null, bool includeWords = false)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisodeTranscript));

            User? user = await _authService.IdentifyUserAsync(HttpContext);

            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.GetEpisodeTranscriptAsync(episodeId, seekTime, includeWords));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetEpisodeTranscript));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the transcript text of an episode.
    /// </summary>
    /// <param name="episodeId">ID of the episode for which a transcript is requested.</param>
    /// <returns>The transcript text or null if its not ready.</returns>
    [HttpGet("{episodeId}/getTranscriptText")]
    public async Task<ActionResult> GetEpisodeTranscriptText(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisodeTranscriptText));

            User? user = await _authService.IdentifyUserAsync(HttpContext);

            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.GetEpisodeTranscriptTextAsync(episodeId));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetEpisodeTranscriptText));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Edits the transcript lines of an episode.
    /// </summary>
    /// <param name="episodeId">ID of the episode for which the transcript lines are to be edited.</param>
    /// <param name="transcriptLines">The transcript lines to edit.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("{episodeId}/editTranscriptLines")]
    public async Task<ActionResult> EditEpisodeTranscriptLines(Guid episodeId, TranscriptLineResponse[] transcriptLines)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(EditEpisodeTranscriptLines));

            User? user = await _authService.IdentifyUserAsync(HttpContext);

            if (user is null)
                return NotFound("User not found");

            return await _podcastService.EditEpisodeTranscriptLinesAsync(user, episodeId, transcriptLines) ?
                Ok("Transcript lines edited successfully") : Ok("Failed to edit transcript lines. Transcript may not be ready yet.");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(EditEpisodeTranscriptLines));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Generates the transcript of an episode.
    /// </summary>
    /// <param name="episodeId">ID of the episode for which the transcript is to be generated.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    /// <remarks>
    /// This function will start the transcript generation process in the background.
    /// </remarks>
    [HttpPost("{episodeId}/generateTranscript")]
    public async Task<ActionResult> GenerateEpisodeTranscript(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GenerateEpisodeTranscript));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return await _podcastService.GenerateEpisodeTranscriptAsync(episodeId, user) ? Ok("Transcript generation started") : Ok("Failed to start transcript generation");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GenerateEpisodeTranscript));
            return BadRequest(e.Message);
        }
    }



    #endregion Transcript

    #region Recommeded Episode


    [HttpGet("getRecommendedEpisodes")]
    public async Task<IActionResult> GetRecommendedEpisodes()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetRecommendedEpisodes));

            User? user = await _authService.IdentifyUserAsync(HttpContext);

            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.GetRecommendedEpisodes(user, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetRecommendedEpisodes));
            return BadRequest(e.Message);
        }
    }
    #endregion

    #region Highlights

    /// <summary>
    /// Creates a highlight of the given episode. Highlight has a maximum duration of 15 seconds
    /// </summary>
    /// <param name="highlightRequest"></param>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    [HttpPost("{episodeId}/CreateHighlight")]
    public async Task<IActionResult> CreateHighlight([FromForm] HighlightRequest highlightRequest, Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(CreateHighlight));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            var response = await _podcastService.CreateHighlightAsync(highlightRequest, episodeId, user);

            return Ok(response);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(CreateHighlight));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Allows users to edit the title and description of a given Highligh if it belongs to them
    /// </summary>
    /// <param name="highlightRequest"></param>
    /// <param name="highlightId"></param>
    /// <returns></returns>
    [HttpPost("{highlightId}/EditHighlight")]
    public async Task<IActionResult> EditHighlight([FromForm] EditHighlightRequest highlightRequest, Guid highlightId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(EditHighlight));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return await _podcastService.EditHighlightAsync(highlightRequest, highlightId, user) ? Ok("Highlight changed") : Ok("Failed to edit highlight");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(EditHighlight));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Allows users to delete their own highlights
    /// </summary>
    /// <param name="highlightId"></param>
    /// <returns></returns>
    [HttpPost("{highlightId}/RemoveHighlight")]
    public async Task<IActionResult> RemoveHighlight(Guid highlightId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(RemoveHighlight));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return await _podcastService.RemoveHighlightAsync(highlightId, user) ? Ok("Highlight Deleted") : Ok("Failed to Delete highlight");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(RemoveHighlight));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Allows users to get all the highlighs associated with a given user
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpGet("{userId}/GetAllUserHighlights")]
    public async Task<IActionResult> GetAllUserHighlights(Guid userId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAllUserHighlights));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            var results = await _podcastService.GetAllUserHighlightsAsync(userId);
            return Ok(results);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetAllUserHighlights));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets all the highlights associated with a given episode
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    [HttpGet("{episodeId}/GetAllEpisodeHighlights")]
    public async Task<IActionResult> GetAllEpisodeHighlights(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAllEpisodeHighlights));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            var results = await _podcastService.GetAllEpisodeHighlightsAsync(episodeId);
            return Ok(results);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetAllEpisodeHighlights));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the audio file of a given highlight
    /// </summary>
    /// <param name="highlightId"></param>
    /// <returns></returns>
    [HttpGet("{highlightId}/GetHighlightAudio")]
    public async Task<IActionResult> GetHighlightAudio(Guid highlightId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetHighlightAudio));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            Dictionary<string, string> guids = await _podcastService.GetHighlightAudioAysnc(highlightId);

            return PhysicalFile(GetHighlightPath(guids[nameof(Episode)], guids[nameof(User)], highlightId.ToString()), FORMATTED_HIGHLIGHT_FILE_TYPE, enableRangeProcessing: true);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetHighlightAudio));
            return BadRequest(e.Message);
        }
    }

    [AllowAnonymous]
    [HttpGet("GetRandomHighlights")]
    public async Task<IActionResult> GetRandomHighlights(int quantity = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetRandomHighlights));

            var highlights = await _podcastService.GetRandomHighlightsAsync(quantity);

            return Ok(highlights);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetRandomHighlights));
            return BadRequest(e.Message);
        }
    }

    #endregion

    #endregion

}