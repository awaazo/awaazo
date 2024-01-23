using System.ComponentModel.DataAnnotations;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// The Bookmark Controller is responsible for handling all requests to the bookmark endpoints.
/// </summary>
[ApiController]
[Route("bookmark")]
[Authorize]
public class BookmarkController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly BookmarkService _bookmarkService;
    private readonly ILogger<BookmarkController> _logger;

    /// <summary>
    /// The constructor for the Bookmark Controller.
    /// </summary>
    /// <param name="auth">Auth Service to be injected.</param>
    /// <param name="bookmark">Bookmark Service to be injected.</param>
    /// <param name="logger">Logger to be injected.</param>
    public BookmarkController(IAuthService auth, BookmarkService bookmark, ILogger<BookmarkController> logger)
    {
        _authService = auth;
        _bookmarkService = bookmark;
        _logger = logger;
    }

    /// <summary>
    /// The endpoint for getting all bookmarks for a user.
    /// </summary>
    /// <param name="episodeId">Id of the episode to get the bookmarks for.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpGet("{episodeId}/allBookmarks")]
    public async Task<IActionResult> GetBookmarks([Required] Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetBookmarks));
            // Identify User from JWT Token
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;
            var result = await _bookmarkService.GetBookmarks(user, episodeId);
            return Ok(result);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetBookmarks));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// The endpoint for adding a bookmark.
    /// </summary>
    /// <param name="episodeId">Id of the episode to add the bookmark to.</param>
    /// <param name="request">The request body for the bookmark.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpPost("{episodeId}/add")]
    public async Task<IActionResult> AddBookmark([Required] Guid episodeId, [FromBody] BookmarkAddRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddBookmark));
            
            // Identify User from JWT Token
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            return Ok(await _bookmarkService.Add(user, episodeId, request));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(AddBookmark));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// The endpoint for deleting a bookmark.
    /// </summary>
    /// <param name="bookmarkId">Id of the bookmark to delete.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpDelete("{bookmarkId}/delete")]
    public async Task<IActionResult> DeleteBookmark([Required] Guid bookmarkId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeleteBookmark));
            
            User user = (await _authService.IdentifyUserAsync(HttpContext))!;
            await _bookmarkService.Delete(user, bookmarkId);
            return Ok();
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(DeleteBookmark));
            return BadRequest(e.Message);
        }
    }
}