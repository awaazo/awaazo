using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.ControllerHelper;
using static Backend.Infrastructure.FileStorageHelper;
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
    public async Task<ActionResult> CreatePlaylist([FromForm] CreatePlaylistRequest request)
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

    /// <summary>
    /// Edits a playlist's information.
    /// </summary>
    /// <param name="playlistId">Id of the Playlist.</param>
    /// <param name="request">Edit Playlist Request.</param>
    [HttpPost("{playlistId}/edit")]
    public async Task<ActionResult> EditPlaylist(Guid playlistId, [FromForm] EditPlaylistRequest request)
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
                Ok("Playlist updated."):
                Ok("Failed to update playlist.");
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Adds new Episodes to the Playlist.
    /// </summary>
    /// <param name="playlistId">Id of the Playlist.</param>
    /// <param name="episodeIds">Id of the Episode(s) to add.</param>
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
            
            // Add episodes to playlist
            return await _playlistService.AddEpisodesToPlaylistAsync(playlistId,episodeIds,user)? 
                Ok("Episode(s) added."):
                Ok("Failed to add episode(s).");
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Removes the Episode(s) from the Playlist.
    /// </summary>
    /// <param name="playlistId">Id of the Playlist.</param>
    /// <param name="episodeIds">Id of the Episode(s) to remove.</param>
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
            
            // Removes Episodes from playlist
            return await _playlistService.RemoveEpisodesFromPlaylistAsync(playlistId,episodeIds,user)? 
                Ok("Episode(s) Removed."):
                Ok("Failed to remove episode(s).");
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Deletes the Playlist.
    /// </summary>
    /// <param name="playlistId">Id of the Playlist to delete.</param>
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
            
            // Delete the playlist.
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

    /// <summary>
    /// Gets the Playlists of the current User.
    /// </summary>
    /// <param name="page">Index of the current page.</param>
    /// <param name="pageSize">Size of the current page.</param>
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

    /// <summary>
    /// Gets the public Playlists of the given user. 
    /// </summary>
    /// <param name="userId">Id of the User who owns the playlists.</param>
    /// <param name="page">Index of the current page.</param>
    /// <param name="pageSize">Size of the current page.</param>
    [HttpGet("{userId}/getUserPlaylists")]
    public async Task<ActionResult> GetUserPlaylists(Guid userId, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\myPlaylists Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            // Get the user playlists.
            return Ok(await _playlistService.GetUserPlaylistsAsync(userId,user,page,pageSize,GetDomainUrl(HttpContext)));
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }
    
    /// <summary>
    /// Gets all public Playlists.
    /// </summary>
    /// <param name="page">Index of the current page.</param>
    /// <param name="pageSize">Size of the current page.</param>
    [HttpGet("all")]
    public async Task<ActionResult> GetAllPlaylists(int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\myPlaylists Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            // Get the user playlists.
            return Ok(await _playlistService.GetAllPlaylistsAsync(user,page,pageSize,GetDomainUrl(HttpContext)));
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Searches for public Playlists.
    /// </summary>
    /// <param name="searchTerm">Search Term.</param>
    /// <param name="page">Index of the current page.</param>
    /// <param name="pageSize">Size of the current page.</param>
    [HttpGet("search")]
    public async Task<ActionResult> SearchPlaylists(string searchTerm, int page=MIN_PAGE, int pageSize=DEFAULT_PAGE_SIZE)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\myPlaylists Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            // Gets the searched Playlists
            return Ok(await _playlistService.SearchPlaylistsAsync(searchTerm,user,page,pageSize,GetDomainUrl(HttpContext)));
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }   
    }


    /// <summary>
    /// Gets the Playlist Episodes for the given Playlist Id.
    /// </summary>
    /// <param name="playlistId">Id of the Playlist.</param>
    [HttpGet("{playlistId}")]
    public async Task<ActionResult> GetPlaylist(Guid playlistId)
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\myPlaylists Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            // Get the user playlist episodes.
            return Ok(await _playlistService.GetPlaylistEpisodesAsync(playlistId,user,GetDomainUrl(HttpContext)));
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the Playlist of liked Episodes for the current user.
    /// </summary>
    [HttpGet("getLikedEpisodesPlaylist")]
    public async Task<ActionResult> GetLikedEpisodesPlaylist()
    {
        try
        {
            _logger.LogDebug(@"Using the playlist\myPlaylists Endpoint");

            // Get the current User
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            if(user is null)
                return NotFound("User does not exist.");
            
            // Get the user playlist of liked episodes.
            return Ok(await _playlistService.GetLikedEpisodesPlaylist(user,GetDomainUrl(HttpContext)));
        }
        catch(Exception e)
        {
            _logger.LogError(e,e.Message);

            return BadRequest(e.Message);
        }
    }
    /// <summary>
    /// Gets Playlists Cover Art
    /// </summary>
    /// <param name="playlistId"></param>
    /// <returns></returns>
    [HttpGet("{playlistId}/getCoverArt")]
    public async Task<ActionResult> GetPlaylistCoverArt(Guid playlistId)
    {
        _logger.LogDebug(@"Using the playlist\playlistId\getCoverArt Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Get the name of the cover art file
            string coverArtName = await _playlistService.GetPlaylistCoverArtNameAsync(playlistId);

            // Return the cover art file from the server
            return PhysicalFile(GetPlaylistCoverArtPathFile(coverArtName), GetFileType(coverArtName), enableRangeProcessing: false);
        }
        catch (Exception e)
        {
            // If error occurs, return BadRequest
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

}

