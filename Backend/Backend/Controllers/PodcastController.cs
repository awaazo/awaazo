using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.FileStorageHelper;
using static Backend.Infrastructure.ControllerHelper;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers;

[ApiController]
[Route("podcast")]
[Authorize]
public class PodcastController : ControllerBase
{
    private const int MIN_PAGE=0;
    private const int DEFAULT_PAGE_SIZE=20;
    private readonly IPodcastService _podcastService;
    private readonly IAuthService _authService;
    private readonly ILogger<PodcastController> _logger;

    /// <summary>
    /// Represents a controller for managing podcasts.
    /// </summary>
    public PodcastController(IPodcastService podcastService, IAuthService authService, ILogger<PodcastController> logger)
    {
        _logger = logger;
        _podcastService = podcastService;
        _authService = authService;
        _logger = logger;
    }

    #region Podcast

    /// <summary>
    /// Creates a new podcast.
    /// </summary>
    /// <param name="request">The request object containing the podcast details.</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpPost("create")]
    public async Task<IActionResult> CreatePodcast([FromForm] CreatePodcastRequest request)
    {
        _logger.LogDebug(@"Using the podcast\create Endpoint");

        try
        {
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
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Edits a podcast.
    /// </summary>
    /// <param name="request">The request containing the podcast data to be edited.</param>
    /// <returns>An IActionResult representing the result of the edit operation.</returns>
    [HttpPost("edit")]
    public async Task<IActionResult> EditPodcast([FromForm] EditPodcastRequest request)
    {
        _logger.LogDebug(@"Using the podcast\edit Endpoint");

        try
        {
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
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Deletes a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast to delete.</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpDelete("delete")]
    public async Task<IActionResult> DeletePodcast(Guid podcastId)
    {
        _logger.LogDebug(@"Using the podcast\delete Endpoint");

        try
        {
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
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves the podcasts owned by the authenticated user.
    /// </summary>
    /// <param name="page">The page number of the results (optional, default is MIN_PAGE).</param>
    /// <param name="pageSize">The number of podcasts per page (optional, default is DEFAULT_PAGE_SIZE).</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpGet("myPodcasts")]
    public async Task<IActionResult> GetMyPodcasts(int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        _logger.LogDebug(@"Using the podcast\myPodcasts Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetUserPodcastsAsync(page,pageSize,GetDomainUrl(HttpContext),user));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves the podcasts of a specific user.
    /// </summary>
    /// <param name="userId">The ID of the user.</param>
    /// <param name="page">The page number of the results (optional, default is MIN_PAGE).</param>
    /// <param name="pageSize">The number of results per page (optional, default is DEFAULT_PAGE_SIZE).</param>
    /// <returns>An IActionResult containing the user's podcasts.</returns>
    [HttpGet("userPodcasts")]
    public async Task<IActionResult> GetUserPodcasts(Guid userId, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        _logger.LogDebug(@"Using the podcast\userPodcasts Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetUserPodcastsAsync(page,pageSize,GetDomainUrl(HttpContext),userId));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves all podcasts with pagination.
    /// </summary>
    /// <param name="page">The page number to retrieve.</param>
    /// <param name="pageSize">The number of podcasts per page.</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpGet("all")]
    public async Task<IActionResult> GetAllPodcasts(int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        _logger.LogDebug(@"Using the podcast\all Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetAllPodcastsAsync(page,pageSize, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Searches for podcasts based on the provided search term.
    /// </summary>
    /// <param name="searchTerm">The term to search for.</param>
    /// <param name="page">The page number of the search results (optional, default is MIN_PAGE).</param>
    /// <param name="pageSize">The number of results per page (optional, default is DEFAULT_PAGE_SIZE).</param>
    /// <returns>An IActionResult representing the search results.</returns>
    [HttpGet("search")]
    public async Task<IActionResult> SearchPodcast(string searchTerm, int page=MIN_PAGE,int pageSize=DEFAULT_PAGE_SIZE)
    {
        _logger.LogDebug(@"Using the podcast\search Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetSearchPodcastsAsync(page,pageSize,GetDomainUrl(HttpContext),searchTerm));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves a podcast by its ID.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast to retrieve.</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpGet("{podcastId}")]
    public async Task<IActionResult> GetPodcastById(Guid podcastId)
    {
        _logger.LogDebug(@"Using the podcast\podcastId Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetPodcastByIdAsync(GetDomainUrl(HttpContext),podcastId));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves the cover art file for a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <returns>An <see cref="ActionResult"/> containing the cover art file.</returns>
    [HttpGet("{podcastId}/getCoverArt")]
    public async Task<ActionResult> GetPodcastCoverArt(Guid podcastId)
    {
        _logger.LogDebug(@"Using the podcast\podcastId\getCoverArt Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Get the name of the cover art file
            string coverArtName = await _podcastService.GetPodcastCoverArtNameAsync(podcastId);

            // Return the cover art file from the server
            return PhysicalFile(GetPodcastCoverArtPath(coverArtName), GetFileType(coverArtName),enableRangeProcessing:false);
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves podcasts based on the specified tags.
    /// </summary>
    /// <param name="tags">An array of tags to filter the podcasts.</param>
    /// <param name="page">The page number of the results (optional, default is MIN_PAGE).</param>
    /// <param name="pageSize">The number of podcasts per page (optional, default is DEFAULT_PAGE_SIZE).</param>
    /// <returns>An ActionResult containing the podcasts that match the given tags.</returns>
    [HttpGet("byTags")]
    public async Task<ActionResult> GetPodcastsByTags([FromHeader][Required] string[] tags, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        _logger.LogDebug(@"Using the podcast\byTags Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Return the podcasts that match the given genres
            return Ok(await _podcastService.GetPodcastsByTagsAsync(page,pageSize,GetDomainUrl(HttpContext),tags));
        }
        catch(Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves the metrics for a specific podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <returns>An ActionResult representing the metrics of the podcast.</returns>
    [HttpGet("{podcastId}/metrics")]
    public async Task<ActionResult> GetMetrics(Guid podcastId) {
        this.LogDebugControllerAPICall(_logger);

        try {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetMetrics(user, podcastId));
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }
    
    #endregion 

    #region Episode
    
    /// <summary>
    /// Adds an episode to a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="request">The request containing the episode details.</param>
    /// <returns>An <see cref="IActionResult"/> representing the result of the operation.</returns>
    [HttpPost("{podcastId}/add")]
    [RequestFormLimits(ValueLengthLimit = PodcastService.MAX_REQUEST_SIZE, MultipartBodyLengthLimit = PodcastService.MAX_REQUEST_SIZE)]
    [RequestSizeLimit(PodcastService.MAX_REQUEST_SIZE)]
    public async Task<IActionResult> AddEpisode(Guid podcastId, [FromForm] CreateEpisodeRequest request)
    {
        _logger.LogDebug(@"Using the podcast\podcastId\add Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _podcastService.CreateEpisodeAsync(request, podcastId, user) ? Ok("Episode added to podcast.") : Ok("Failed to add episode to podcast.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }
    
    /// <summary>
    /// Edits an episode of a podcast.
    /// </summary>
    /// <param name="episodeId">The ID of the episode to edit.</param>
    /// <param name="request">The request containing the updated episode information.</param>
    /// <returns>An IActionResult representing the result of the edit operation.</returns>
    [HttpPost("{episodeId}/edit")]
    [RequestFormLimits(ValueLengthLimit = PodcastService.MAX_REQUEST_SIZE, MultipartBodyLengthLimit = PodcastService.MAX_REQUEST_SIZE)]
    [RequestSizeLimit(PodcastService.MAX_REQUEST_SIZE)]
    public async Task<IActionResult> EditEpisode(Guid episodeId, [FromForm] EditEpisodeRequest request)
    {
        _logger.LogDebug(@"Using the podcast\podcastId\edit Endpoint");

        try
        {
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
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Deletes an episode from the podcast.
    /// </summary>
    /// <param name="episodeId">The ID of the episode to delete.</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpDelete("{episodeId}/delete")]
    public async Task<IActionResult> DeleteEpisode(Guid episodeId)
    {
        _logger.LogDebug(@"Using the podcast\podcastId\delete Endpoint");

        try
        {
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
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves an episode by its ID.
    /// </summary>
    /// <param name="episodeId">The ID of the episode to retrieve.</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpGet("episode/{episodeId}")]
    public async Task<IActionResult> GetEpisode(Guid episodeId)
    {
        _logger.LogDebug(@"Using the podcast\episode\episodeId Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetEpisodeByIdAsync(episodeId, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }
 
    /// <summary>
    /// Retrieves the audio file for a specific episode of a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="episodeId">The ID of the episode.</param>
    /// <returns>An ActionResult representing the audio file.</returns>
    [HttpGet("{podcastId}/{episodeId}/getAudio")]
    public async Task<ActionResult> GetEpisodeAudio(Guid podcastId, Guid episodeId)
    {
        _logger.LogDebug(@"Using the podcast\podcastId\episodeId\getAudio Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Get the name of the audio file
            string audioName = await _podcastService.GetEpisodeAudioNameAsync(episodeId);

            // Return the audio file from the server
            return PhysicalFile(GetPodcastEpisodeAudioPath(audioName, podcastId), GetFileType(audioName),enableRangeProcessing:true);
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Retrieves the thumbnail for a specific episode of a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="episodeId">The ID of the episode.</param>
    /// <returns>An ActionResult containing the thumbnail file.</returns>
    [HttpGet("{podcastId}/{episodeId}/getThumbnail")]
    public async Task<ActionResult> GetEpisodeThumbnail(Guid podcastId, Guid episodeId)
    {
        _logger.LogDebug(@"Using the podcast\podcastId\episodeId\getThumbnail Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Get the name of the thumbnail file
            string thumbnailName = await _podcastService.GetEpisodeThumbnailNameAsync(episodeId);

            // Return the thumbnail file from the server
            return PhysicalFile(GetPodcastEpisodeThumbnailPath(thumbnailName, podcastId), GetFileType(thumbnailName),enableRangeProcessing:false);
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Saves the watch history for a specific episode.
    /// This function saves the last watched position on a specific episode
    /// On the frontend:
    ///     - You need to add a onBeforeUnload  hook to the episode webpage and this hook should
    ///       send request to this route.
    /// </summary>
    /// <param name="episodeId">The ID of the episode.</param>
    /// <param name="request">The request containing the episode history data.</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpPost("{episodeId}/saveWatchHistory")]
    public async Task<IActionResult> SaveWatchHistory(Guid episodeId, [FromBody] EpisodeHistorySaveRequest request) {
        this.LogDebugControllerAPICall(_logger);

        try
        {
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            var interaction = await _podcastService.SaveWatchHistory(user, episodeId, request.ListenPosition, GetDomainUrl(HttpContext));
            return Ok(interaction);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }
    
    /// <summary>
    /// Retrieves the watch history for a specific episode.
    /// </summary>
    /// <param name="episodeId">The ID of the episode.</param>
    /// <returns>An IActionResult representing the watch history.</returns>
    [HttpGet("{episodeId}/watchHistory")]
    public async Task<IActionResult> GetWatchHistory(Guid episodeId)
    {
        
        this.LogDebugControllerAPICall(_logger);

        try
        {
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            var interaction = await _podcastService.GetWatchHistory(user, episodeId, GetDomainUrl(HttpContext));
            return Ok(interaction);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }   
    
    /// <summary>
    /// Retrieves the transcript for a specific episode.
    /// </summary>
    /// <param name="episodeId">The ID of the episode.</param>
    /// <returns>The transcript of the episode.</returns>
    [HttpGet("{episodeId}/getTranscript")]
    public async Task<ActionResult> GetEpisodeTranscript(Guid episodeId)
    {
        _logger.LogDebug(@"Using the podcast\episodeId\getTranscript Endpoint");

        try
        {
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");

            return Ok(await _podcastService.GetEpisodeTranscriptAsync(episodeId));
        }
        catch(Exception e)
        {
             _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }
    
    /// <summary>
    /// Retrieves the adjacent episode based on the given episode ID.
    /// </summary>
    /// <param name="episodeId">The ID of the current episode.</param>
    /// <returns>An IActionResult representing the adjacent episode.</returns>
    [HttpGet("{episodeId}/adjecentEpisode")]
    public async Task<IActionResult> GetAdjecentEpisode(Guid episodeId)
    {
        _logger.LogDebug(@"Using the podcast\episodeId\adjecentEpisode Endpoint");

        try
        {
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");
            return Ok(await _podcastService.GetAdjecentEpisodeAsync(episodeId));

        }
        catch(Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }

    }

    #endregion
}