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

namespace Backend.Controllers;

/// <summary>
/// The Podcast Controller is responsible for handling all the requests related to podcast.
/// </summary>
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
    public async Task<IActionResult> GetMyPodcasts(int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetMyPodcasts));

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
    public async Task<IActionResult> GetUserPodcasts(Guid userId, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetUserPodcasts));

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
    public async Task<IActionResult> GetAllPodcasts(int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAllPodcasts));

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
    public async Task<IActionResult> SearchPodcast([FromBody] PodcastFilter filter, int page=MIN_PAGE,int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(SearchPodcast));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetSearchPodcastsAsync(page,pageSize,GetDomainUrl(HttpContext),filter));
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
    public async Task<IActionResult> GetPodcastById(Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetPodcastById));

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
    public async Task<ActionResult> GetPodcastCoverArt(Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetPodcastCoverArt));

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
    public async Task<ActionResult> GetPodcastsByTags([FromHeader][Required] string[] tags, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetPodcastsByTags));

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
    public async Task<ActionResult> GetMetrics(Guid podcastId) {
        try {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetMetrics));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _podcastService.GetMetrics(user, podcastId));
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetMetrics));
            return BadRequest(e.Message);
        }
    }
    
    #endregion 

    #region Episode

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

            return await _podcastService.CreateEpisodeAsync(request, podcastId, user) ? Ok("Episode added to podcast.") : Ok("Failed to add episode to podcast.");
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
    public async Task<IActionResult> GetEpisode(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisode));

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
    public async Task<ActionResult> GetEpisodeAudio(Guid podcastId, Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisodeAudio));

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
    public async Task<ActionResult> GetEpisodeThumbnail(Guid podcastId, Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetEpisodeThumbnail));

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
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetEpisodeThumbnail));
            return BadRequest(e.Message);
        }
    }

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
    public async Task<IActionResult> SaveWatchHistory(Guid episodeId, [FromBody] EpisodeHistorySaveRequest request) {
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
            this.LogErrorAPICall(_logger, e:e, callerName: nameof(SaveWatchHistory));
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
            this.LogErrorAPICall(_logger, e:e, callerName: nameof(GetWatchHistory));
            return BadRequest(e.Message);
        }
    }   

    /// <summary>
    /// Gets Adjecent Episodes
    /// </summary>
    /// <param name="episodeId">ID of the episode for which adjecent episodes are requested.</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{episodeId}/adjecentEpisode")]
    public async Task<IActionResult> GetAdjecentEpisode(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAdjecentEpisode));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");
            return Ok(await _podcastService.GetAdjecentEpisodeAsync(episodeId));

        }
        catch(Exception e)
        {
            this.LogErrorAPICall(_logger, e:e, callerName: nameof(GetAdjecentEpisode));
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
    public async Task<IActionResult> SearchEpisode([FromBody] EpisodeFilter episodeFilter,int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(SearchEpisode));

            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if (user is null)
                return NotFound("User not found");
            return Ok(await _podcastService.SearchEpisodeAsync(page,pageSize,episodeFilter,GetDomainUrl(HttpContext)));

        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e:e, callerName: nameof(SearchEpisode));
            return BadRequest(e.Message);
        }
    }

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
        catch(Exception e)
        {
            this.LogErrorAPICall(_logger, e:e, callerName: nameof(GetEpisodeTranscript));
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
        catch(Exception e)
        {
            this.LogErrorAPICall(_logger, e:e, callerName: nameof(GetEpisodeTranscriptText));
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

            return await _podcastService.EditEpisodeTranscriptLinesAsync(user,episodeId, transcriptLines)?
                Ok("Transcript lines edited successfully") : Ok("Failed to edit transcript lines. Transcript may not be ready yet.");
        }
        catch(Exception e)
        {
            this.LogErrorAPICall(_logger, e:e, callerName: nameof(EditEpisodeTranscriptLines));
            return BadRequest(e.Message);
        }
    }

    #endregion Transcript

    #endregion
}