using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.FileStorageHelper;
using static Backend.Infrastructure.ControllerHelper;

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

    public PodcastController(IPodcastService podcastService, IAuthService authService)
    {
        _podcastService = podcastService;
        _authService = authService;
    }

    #region Podcast

    [HttpPost("create")]
    public async Task<IActionResult> CreatePodcast([FromForm] CreatePodcastRequest request)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpPost("edit")]
    public async Task<IActionResult> EditPodcast([FromForm] EditPodcastRequest request)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeletePodcast(Guid podcastId)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpGet("myPodcasts")]
    public async Task<IActionResult> GetMyPodcasts(int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpGet("userPodcasts")]
    public async Task<IActionResult> GetUserPodcasts(Guid userId, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllPodcasts(int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchPodcast(string searchTerm, int page=MIN_PAGE,int pageSize=DEFAULT_PAGE_SIZE)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpGet("{podcastId}")]
    public async Task<IActionResult> GetPodcastById(Guid podcastId)
    {
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
            return BadRequest(e.Message);
        }
    }


    [HttpGet("{podcastId}/getCoverArt")]
    public async Task<ActionResult> GetEpisodeThumbnail(Guid podcastId)
    {
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
            return BadRequest(e.Message);
        }
    }

    #endregion 

    #region Episode

    /// <summary>
    /// Adds an episode to a podcast.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("{podcastId}/add")]
    [RequestFormLimits(ValueLengthLimit = PodcastService.MAX_REQUEST_SIZE, MultipartBodyLengthLimit = PodcastService.MAX_REQUEST_SIZE)]
    [RequestSizeLimit(PodcastService.MAX_REQUEST_SIZE)]
    public async Task<IActionResult> AddEpisode(Guid podcastId, [FromForm] CreateEpisodeRequest request)
    {
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
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Edits an episode of a podcast by Id.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("{episodeId}/edit")]
    [RequestFormLimits(ValueLengthLimit = PodcastService.MAX_REQUEST_SIZE, MultipartBodyLengthLimit = PodcastService.MAX_REQUEST_SIZE)]
    [RequestSizeLimit(PodcastService.MAX_REQUEST_SIZE)]
    public async Task<IActionResult> EditEpisode(Guid episodeId, [FromForm] EditEpisodeRequest request)
    {
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
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Deletes an episode of a podcast by Id.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    [HttpDelete("{episodeId}/delete")]
    public async Task<IActionResult> DeleteEpisode(Guid episodeId)
    {
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
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets an episode of a podcast by Id.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    [HttpGet("episode/{episodeId}")]
    public async Task<IActionResult> GetEpisode(Guid episodeId)
    {
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
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the audio of an episode.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    [HttpGet("{podcastId}/{episodeId}/getAudio")]
    public async Task<ActionResult> GetEpisodeAudio(Guid podcastId, Guid episodeId)
    {
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
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the thumbnail of an episode.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    [HttpGet("{podcastId}/{episodeId}/getThumbnail")]
    public async Task<ActionResult> GetEpisodeThumbnail(Guid podcastId, Guid episodeId)
    {
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
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// THis function saves the last watched position on a specific episode
    /// On the frontend:
    ///     - You need to add a onBeforeUnload  hook to the episode webpage and this hook should
    ///       send request to this route.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="episodeId"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("{episodeId}/saveWatchHistory")]
    public async Task<IActionResult> SaveWatchHistory(Guid episodeId, [FromBody] EpisodeHistorySaveRequest request)
    {
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
            return BadRequest(e.Message);
        }
    }
    
    #endregion
}