
using Backend.Controllers.Requests;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("playlist")]
[Authorize]
public class PlaylistController : ControllerBase
{
    private readonly PlaylistService _service;
    private readonly IAuthService _authService;

    public PlaylistController(PlaylistService service, IAuthService authService)
    {
        _service = service;
        _authService = authService;
    }
    
    /// <summary>
    /// Creates a Playlist for the logged in user
    /// </summary>
    /// <param name="request"></param>
    /// <returns>The created playlist</returns>
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] PlaylistCreateRequest request)
    {
        return Ok(await _service.Create(
                await _authService.IdentifyUserAsync(HttpContext)!, request.Name));
    }
    
    /// <summary>
    /// Adds an element (Episode) to the given playlist
    /// </summary>
    /// <returns>Operation successful or not</returns>
    [HttpPut("append")]
    public async Task<IActionResult> Append([FromBody] PlaylistAppendRequest request)
    {
        bool result = await _service.Append(
            await _authService.IdentifyUserAsync(HttpContext)!, request.PlaylistId, request.EpisodeId);

        return result ? Ok() : BadRequest("Invalid Playlist ID or Episode ID");
    }

    /// <summary>
    /// This function retreives all playlist of the logged in user
    /// </summary>
    /// <returns>Returns a list of Playlist</returns>
    [HttpGet("all")]
    public async Task<IActionResult> All()
    {
        return Ok(await _service.All(await _authService.IdentifyUserAsync(HttpContext)!));
    }

    /// <summary>
    /// This function retreives all the elements (episodes) added to a given playlist
    /// </summary>
    [HttpGet("elements")]
    public async Task<IActionResult> Elements([FromBody] PlaylistElementsRequest request)
    {
        var elements =
            await _service.PlaylistElements(await _authService.IdentifyUserAsync(HttpContext)!, request.PlayListId);
        return elements is null ? BadRequest("Invalid Playlist ID") : Ok();
    }

    /// <summary>
    /// Deletes a given playlist completely
    /// </summary>
    /// <param name="request"></param>
    /// <returns>Operation success or failure</returns>
    [HttpPut("delete")]
    public async Task<IActionResult> Delete([FromBody] PlaylistDeleteRequest request)
    {
        bool result = await _service.Delete(
            await _authService.IdentifyUserAsync(HttpContext)!, request.PlaylistId);

        return result ? Ok() : BadRequest("Invalid Playlist ID");
    }

    /// <summary>
    /// Deletes an ELEMENT (Episode) from a given playlist
    /// </summary>
    /// <returns>Operation success or failure</returns>
    [HttpPut("deleteElement")]
    public async Task<IActionResult> DeleteElement([FromBody] PlaylistElementDeleteRequest request)
    {
        bool result = await _service.DeleteElement(
            await _authService.IdentifyUserAsync(HttpContext)!, request.PlaylistElementId);

        return result ? Ok() : BadRequest("Invalid Playlist Element ID");        
    }
}

