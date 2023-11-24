using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("bookmark")]
[Authorize]
public class BookmarkController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly BookmarkService _bookmarkService;
    private readonly ILogger<BookmarkController> _logger;
    public BookmarkController(IAuthService auth, BookmarkService bookmark, ILogger<BookmarkController> logger)
    {
        _authService = auth;
        _bookmarkService = bookmark;
        _logger = logger;
    }

    /// <summary>
    /// Returns all bookmarks for logged in user for a given episode
    /// </summary>
    /// <param name="episodeId">Episode ID</param>
    /// <returns></returns>
    [HttpGet("{episodeId}/allBookmarks")]
    public async Task<IActionResult> GetBookmarks([Required] Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);
            // Identify User from JWT Token
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;
            var result = await _bookmarkService.GetBookmarks(user, episodeId);
            return Ok(result);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("{episodeId}/add")]
    public async Task<IActionResult> AddBookmark([Required] Guid episodeId, [FromBody] BookmarkAddRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);
            
            // Identify User from JWT Token
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            return Ok(await _bookmarkService.Add(user, episodeId, request));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{bookmarkId}/delete")]
    public async Task<IActionResult> DeleteBookmark([Required] Guid bookmarkId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);
            
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;
            await _bookmarkService.Delete(user, bookmarkId);
            return Ok();
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }
}