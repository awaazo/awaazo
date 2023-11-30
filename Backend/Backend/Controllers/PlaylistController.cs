
using System.ComponentModel.DataAnnotations;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.ControllerHelper;

namespace Backend.Controllers;

[ApiController]
[Route("playlist")]
[Authorize]
public class PlaylistController : ControllerBase
{
    private const int DEFAULT_PAGE_SIZE = 20;
    private const int MIN_PAGE = 0;
    private readonly IPlaylistService _playlistService;
    private readonly IAuthService _authService;
    private readonly ILogger _logger;

    public PlaylistController(IPlaylistService playlistService, IAuthService authService, ILogger logger)
    {
        _logger = logger;
        _playlistService = playlistService;
        _authService = authService;
    }
    

    /// <summary>
    /// Creates a playlist with the given Episodes.
    /// </summary>
    /// <param name="request">Create Playlist Request.</param>
    [HttpPost("create")]
    public async Task<ActionResult> CreatePlaylist([FromBody] CreatePlaylistRequest request)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\create Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            // Create the playlist.
            return await _playlistService.CreatePlaylistAsync(request,user)? 
                Ok("Playlist created."):
                Ok("Failed to create playlist.");
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    } 

    [HttpPost("{playlistId}/edit")]
    public async Task<ActionResult> EditPlaylist(Guid playlistId, [FromBody] EditPlaylistRequest request)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\playlistId\edit Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            // Edit the playlist.
            return await _playlistService.EditPlaylistAsync(playlistId,request,user)? 
                Ok("Playlist udpated."):
                Ok("Failed to update playlist.");
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    [HttpPost("{playlistId}/add")]
    public async Task<ActionResult> AddEpisodesToPlaylist(Guid playlistId, [FromBody] Guid[] episodeIds)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\playlistId\add Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            return await _playlistService.AddEpisodesToPlaylistAsync(playlistId,episodeIds,user)? 
                Ok("Episodes added."):
                Ok("Failed to add episodes.");
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{playlistId}/removeEpisodes")]
    public async Task<ActionResult> RemoveEpisodesFromPlaylist(Guid playlistId, [FromBody] Guid[] episodeIds)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\playlistId\removeEpisodes Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            return await _playlistService.RemoveEpisodesFromPlaylistAsync(playlistId,episodeIds,user)? 
                Ok("Episodes Removed."):
                Ok("Failed to remove episodes.");
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{playlistId}/delete")]
    public async Task<ActionResult> DeletePlaylist(Guid playlistId)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\playlistId\delete Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            return await _playlistService.DeletePlaylistAsync(playlistId,user)? 
                Ok("Playlist Removed."):
                Ok("Failed to remove playlist.");
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    [HttpGet("myPlaylists")]
    public async Task<ActionResult> GetMyPlaylists(int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\myPlaylists Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            // Get the user playlists.
            return Ok(await _playlistService.GetUserPlaylistsAsync(user.Id,user,page,pageSize,GetDomainUrl(HttpContext)));
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    [HttpGet("{userId}/getUserPlaylists")]
    public async Task<ActionResult> GetUserPlaylists(Guid userId, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        return Ok();
    }

    [HttpGet("{playlistId}")]
    public async Task<ActionResult> GetPlaylist(Guid playlistId)
    {
        return Ok();
    }

    [HttpGet("search")]
    public async Task<ActionResult> SearchPlaylists(string query, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        return Ok();
    }





    // /// <summary>
    // /// Creates a Playlist for the logged in user
    // /// </summary>
    // /// <param name="request"></param>
    // /// <returns>The created playlist</returns>
    // [HttpPost("create")]
    // public async Task<IActionResult> Create([FromBody] PlaylistCreateRequest request)
    // {
    //     _logger.LogDebug(@"Using the playlist\create Endpoint");
    //     return Ok(await _playlistService.Create(
    //             await _authService.IdentifyUserAsync(HttpContext)!, request.Name));
    // }
    
    // /// <summary>
    // /// Adds an element (Episode) to the given playlist
    // /// </summary>
    // /// <returns>Operation successful or not</returns>
    // [HttpPut("append")]
    // public async Task<IActionResult> Append([FromBody] PlaylistAppendRequest request)
    // {
    //     _logger.LogDebug(@"Using the playlist\append Endpoint");

    //     bool result = await _playlistService.Append(
    //         await _authService.IdentifyUserAsync(HttpContext)!, request.PlaylistId, request.EpisodeId);

    //     return result ? Ok() : BadRequest("Invalid Playlist ID or Episode ID");
    // }

    // /// <summary>
    // /// This function retreives all playlist of the logged in user
    // /// </summary>
    // /// <returns>Returns a list of Playlist</returns>
    // [HttpGet("all")]
    // public async Task<IActionResult> All()
    // {
    //     _logger.LogDebug(@"Using the playlist\all Endpoint");

    //     return Ok(await _playlistService.All(await _authService.IdentifyUserAsync(HttpContext)!));
    // }

    // /// <summary>
    // /// This function retreives all the elements (episodes) added to a given playlist
    // /// </summary>
    // [HttpGet("elements")]
    // public async Task<IActionResult> Elements([FromBody] PlaylistElementsRequest request)
    // {
    //     _logger.LogDebug(@"Using the playlist\elements Endpoint");

    //     var elements =
    //         await _playlistService.PlaylistElements(await _authService.IdentifyUserAsync(HttpContext)!, request.PlayListId);
    //     return elements is null ? BadRequest("Invalid Playlist ID") : Ok();
    // }

    // /// <summary>
    // /// Deletes a given playlist completely
    // /// </summary>
    // /// <param name="request"></param>
    // /// <returns>Operation success or failure</returns>
    // [HttpPut("delete")]
    // public async Task<IActionResult> Delete([FromBody] PlaylistDeleteRequest request)
    // {
    //     _logger.LogDebug(@"Using the playlist\delete Endpoint");

    //     bool result = await _playlistService.Delete(
    //         await _authService.IdentifyUserAsync(HttpContext)!, request.PlaylistId);

    //     return result ? Ok() : BadRequest("Invalid Playlist ID");
    // }

    // /// <summary>
    // /// Deletes an ELEMENT (Episode) from a given playlist
    // /// </summary>
    // /// <returns>Operation success or failure</returns>
    // [HttpPut("deleteElement")]
    // public async Task<IActionResult> DeleteElement([FromBody] PlaylistElementDeleteRequest request)
    // {
    //     _logger.LogDebug(@"Using the playlist\deleteElement Endpoint");

    //     bool result = await _playlistService.DeleteElement(
    //         await _authService.IdentifyUserAsync(HttpContext)!, request.PlaylistElementId);

    //     return result ? Ok() : BadRequest("Invalid Playlist Element ID");        
    // }
}

