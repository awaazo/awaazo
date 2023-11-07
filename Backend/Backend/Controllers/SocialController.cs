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

    public SocialController(IAuthService authService, ISocialService socialService)
    {
        _authService = authService;
        _socialService = socialService;
    }

    [HttpPost("comment")]
    public async Task<ActionResult> AddComment(CommentRequest request)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Return the add comment status
            return await _socialService.AddCommentAsync(request, user) ? Ok("Comment saved.") : Ok("Comment failed to save.");
        }
        catch (Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    [HttpGet("getEpisodeComment")]
    public async Task<ActionResult> GetEpisodeComments([Required] Guid episodeId)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Return the comments
            return Ok(await _socialService.GetEpisodeCommentsAsync(episodeId));
        }
        catch (Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    [HttpGet("getUserComments")]
    public async Task<ActionResult> GetUserComments()
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Return the comments
            return Ok(await _socialService.GetUserCommentsAsync(user));
        }
        catch (Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("deleteComment")]
    public async Task<ActionResult> DeleteComment([Required] Guid commentId)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Return the add comment status
            return await _socialService.DeleteCommentAsync(commentId, user) ? Ok("Comment deleted.") : Ok("Comment failed to be deleted.");
        }
        catch (Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    [HttpPost("like")]
    public async Task<ActionResult> AddLike(Guid episodeId, Guid commentId)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Add like to the right entity.
            if (episodeId != Guid.Empty)
                return await _socialService.AddLikeToEpisodeAsync(episodeId, user) ? Ok("Episode liked.") : Ok("Episode failed to be liked.");
            else if (commentId != Guid.Empty)
                return await _socialService.AddLikeToCommentAsync(commentId, user) ? Ok("Comment liked.") : Ok("Comment failed to be liked.");
            else
                return BadRequest("Episode or Comment ID is required.");
        }
        catch (Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("unlike")]
    public async Task<ActionResult> RemoveLike(Guid episodeId, Guid commentId)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Add like to the right entity.
            if (episodeId != Guid.Empty)
                return await _socialService.RemoveEpisodeLikeAsync(episodeId, user) ? Ok("Episode unliked.") : Ok("Episode failed to be unliked.");
            else if (commentId != Guid.Empty)
                return await _socialService.RemoveCommentLikeAsync(commentId, user) ? Ok("Comment unliked.") : Ok("Comment failed to be unliked.");
            else
                return BadRequest("Episode or Comment ID is required.");
        }
        catch (Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    #region Rating

    
    [HttpPost("rating")]
    public async Task<ActionResult> AddRating(RatingRequest request)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("deleteRating")]
    public async Task<ActionResult> RemoveRating(Guid podcastId)
    {
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
            return BadRequest(e.Message);
        }
    }

    #endregion


    [HttpPost("review")]
    public async Task<ActionResult> AddReview(ReviewRequest request)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("deleteReview")]
    public async Task<ActionResult> RemoveReview(Guid podcastId)
    {
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
            return BadRequest(e.Message);
        }
    }
}