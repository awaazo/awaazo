using System.ComponentModel.DataAnnotations;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("social")]
[Authorize]
public class SocialController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ISocialService _socialService;
    private readonly ILogger _logger;

    public SocialController(IAuthService authService, ISocialService socialService, ILogger logger)
    {
        _authService = authService;
        _socialService = socialService;
        _logger = logger;
    }

    #region Comment

    [HttpPost("{episodeOrCommentId}/comment")]
    public async Task<IActionResult> AddComment(Guid episodeOrCommentId, [FromBody] string commentText)
    {
        _logger.LogDebug(@"Using the social\episodeOrCommentId\comment Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.AddCommentAsync(episodeOrCommentId,user,commentText)? Ok("Comment added."):Ok("Failed to add comment.");
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{commentId}/delete")]
    public async Task<IActionResult> DeleteComment(Guid commentId)
    {
        _logger.LogDebug(@"Using the social\episodeOrCommentId\delete Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.RemoveCommentAsync(commentId,user)? Ok("Comment deleted."):Ok("Failed to delete comment.");
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpPost("{episodeOrCommentId}/like")]
    public async Task<IActionResult> AddLike(Guid episodeOrCommentId)
    {
        _logger.LogDebug(@"Using the social\episodeOrCommentId\like Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.AddLikeAsync(episodeOrCommentId,user)? Ok("Like added."):Ok("Failed to add like.");
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{episodeOrCommentId}/unlike")]
    public async Task<IActionResult> RemoveLike(Guid episodeOrCommentId)
    {
        _logger.LogDebug(@"Using the social\episodeOrCommentId\unlike Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.RemoveLikeAsync(episodeOrCommentId,user)? Ok("Like removed."):Ok("Failed to remove like.");
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Checks if the user has liked the episode or comment.
    /// </summary>
    /// <param name="episodeOrCommentId">Episode or Comment ID</param>
    /// <returns>True if liked, otherwise false</returns>
    [HttpGet("{episodeOrCommentId}/isLiked")]
    public async Task<ActionResult> IsLiked(Guid episodeOrCommentId)
    {
        _logger.LogDebug(@"Using the social\episodeOrCommentId\isLike Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _socialService.IsLikedAsync(episodeOrCommentId,user));
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }


    #endregion

    #region Rating


    [HttpPost("rating")]
    public async Task<ActionResult> AddRating(RatingRequest request)
    {
        _logger.LogDebug(@"Using the social\rating Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.AddRatingToPodcastAsync(request.PodcastId, user, (uint)request.Rating) ? Ok("Rating saved.") : Ok("Rating could not be saved.");
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("deleteRating")]
    public async Task<ActionResult> RemoveRating(Guid podcastId)
    {
        _logger.LogDebug(@"Using the social\deleteRating Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.RemoveRatingFromPodcastAsync(podcastId, user) ? Ok("Rating deleted.") : Ok("Rating could not be deleted.");
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    #endregion

    #region Review

    [HttpPost("review")]
    public async Task<ActionResult> AddReview(ReviewRequest request)
    {
        _logger.LogDebug(@"Using the social\review Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.AddReviewToPodcastAsync(request.PodcastId, user, request.Review) ? Ok("Review saved.") : Ok("Review could not be saved.");
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("deleteReview")]
    public async Task<ActionResult> RemoveReview(Guid podcastId)
    {
        _logger.LogDebug(@"Using the social\deleteReview Endpoint");
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.RemoveReviewFromPodcastAsync(podcastId, user) ? Ok("Review deleted.") : Ok("Review could not be deleted.");
        }
        catch (Exception e)
        {
            // Return the error message
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    #endregion

}