using System.ComponentModel.DataAnnotations;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("bookmark")]
[Authorize]
public class BookmarkController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly BookmarkService _bookmarkService;
    private readonly ILogger<BookmarkController> _logger;
    public BookmarkController(AuthService auth, BookmarkService bookmark, ILogger<BookmarkController> logger)
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
            // Identify User from JWT Token
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;
            return Ok(await _bookmarkService.GetBookmarks(user, episodeId));
        }
        catch (Exception e)
        {
            _logger.LogDebug("Error occurred in {1}: {2}",
                System.Reflection.MethodBase.GetCurrentMethod()?.Name,
                e.Message);
            return BadRequest(e.Message);
        }
    }

    [HttpPost]
    [HttpGet("{episodeId}/add")]
    public async Task<IActionResult> AddBookmark([Required] Guid episodeId, [FromBody] BookmarkAddRequest request)
    {
        try
        {
            // Identify User from JWT Token
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            return Ok(await _bookmarkService.Add(user, episodeId, request));
        }
        catch (Exception e)
        {
            _logger.LogDebug("Error occurred in {1}: {2}",
                System.Reflection.MethodBase.GetCurrentMethod()?.Name,
                e.Message);
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{bookmarkId}/delete")]
    public async Task<IActionResult> DeleteBookmark([Required] Guid bookmarkId)
    {
        try
        {
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;
            await _bookmarkService.Delete(user, bookmarkId);
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogDebug("Error occurred in {1}: {2}",
                System.Reflection.MethodBase.GetCurrentMethod()?.Name,
                e.Message);
            return BadRequest(e.Message);
        }
    }

}