
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
    
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] PlaylistCreateRequest request)
    {
        return Ok(await _service.Create(
                await _authService.IdentifyUserAsync(HttpContext)!, request.Name));
    }
    
    [HttpPut("append")]
    public async Task<IActionResult> Append([FromBody] PlaylistAppendRequest request)
    {
        bool result = await _service.Append(
            await _authService.IdentifyUserAsync(HttpContext)!, request.PlaylistId, request.EpisodeId);

        return result ? Ok() : BadRequest("Invalid Playlist ID or Episode ID");
    }

    [HttpGet("all")]
    public async Task<IActionResult> All()
    {
        return Ok(await _service.All(await _authService.IdentifyUserAsync(HttpContext)!));
    }

    [HttpGet("elements")]
    public async Task<IActionResult> Elements([FromBody] PlaylistElementsRequest request)
    {
        var elements =
            await _service.PlaylistElements(await _authService.IdentifyUserAsync(HttpContext)!, request.PlayListId);
        return elements is null ? BadRequest("Invalid Playlist ID") : Ok();
    }
}

