using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;
[ApiController]
[Route("podcast")]
[Authorize]
public class PodcastController : ControllerBase
{
    private readonly IPodcastService _podcastService;
    private readonly IAuthService _authService;

    public PodcastController(IPodcastService podcastService, IAuthService authService)
    {
        _podcastService = podcastService;
        _authService = authService;
    }

    #region Podcast

    //TODO : ADD middleware to Validate the File type inputted
    [HttpPost("create")]
    public async Task<IActionResult> CreatePodcast([FromForm] CreatePodcastRequest request)
    {
        // try
        // {
        //     GetPodcastRequest? podcast = await _podcastService.CreatePodcast(createPodcastRequest, HttpContext);
        //     if (podcast == null) return BadRequest("Bad Request");

        //     return Ok(podcast);
        // }
        // catch (Exception e)
        // {
        //     return BadRequest(e.Message);
        // }


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

            return await _podcastService.DeletePodcastAsync(podcastId,user) ? Ok("Podcast deleted.") : Ok("Failed to delete podcast.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            return BadRequest(e.Message);
        }
    }

    [HttpGet("myPodcasts")]
    public async Task<IActionResult> GetMyPodcasts()
    {
        return Ok("Not implemented");
    }

    // int page + int page size
    [HttpGet("all")]
    public async Task<IActionResult> GetAllPodcasts()
    {
        return Ok(await _podcastService.GetAllPodcastAsync());
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchPodcast()
    {
        return Ok("Not implemented");
    }

    [HttpGet("byId")]
    public async Task<IActionResult> GetPodcastById()
    {
        return Ok("Not implemented");
    }


    [HttpGet("getById")]
    public async Task<IActionResult> GetPodcastById(string id)
    {
        return Ok("Not implemented");
        // Podcast? podcast = await _podcastService.GetPodcast(id);
        // if (podcast == null)
        // {
        //     return BadRequest("Bad Request");
        // }
        // return Ok(podcast);
    }

    [HttpGet("getMyPodcast")]
    public async Task<IActionResult> GetMyPodcast()
    {
        return Ok("Not implemented");


        // try
        // {
        //     List<GetPodcastResponse> collection = await _podcastService.GetMyPodcast(HttpContext);
        //     if (collection == null)
        //     {
        //         return BadRequest("Bad Request");

        //     }
        //     return Ok(collection);
        // }
        // catch (Exception ex)
        // {
        //     return BadRequest(ex.Message);
        // }
    }

    #endregion 

    #region Episode

    [HttpPost("{podcastId}/add")]
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

    [HttpPost("{episodeId}/edit")]
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

            return await _podcastService.DeleteEpisodeAsync(episodeId,user) ? Ok("Episode deleted.") : Ok("Failed to delete episode.");
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            return BadRequest(e.Message);
        }
    }

    [HttpGet("{episodeId}")]
    public async Task<IActionResult> GetEpisode(string episodeId)
    {
        return Ok(episodeId);
    }

    #endregion
}