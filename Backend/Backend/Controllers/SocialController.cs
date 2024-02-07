using System.ComponentModel.DataAnnotations;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace Backend.Controllers;

/// <summary>
/// The Social Controller is responsible for handling all the requests related to social features.
/// </summary>
[ApiController]
[Route("social")]
[Authorize]
public class SocialController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ISocialService _socialService;
    private readonly ILogger<SocialController> _logger;

    /// <summary>
    /// Constructor for SocialController
    /// </summary>
    /// <param name="authService"> Service for authentication to be injected.</param>
    /// <param name="socialService"> Service for social features to be injected.</param>
    /// <param name="logger"> Logger for logging to be injected.</param>
    public SocialController(IAuthService authService, ISocialService socialService, ILogger<SocialController> logger)
    {
        _authService = authService;
        _socialService = socialService;
        _logger = logger;
    }

    #region Comment

    /// <summary>
    /// Adds a comment to the episode or comment for the current user.
    /// </summary>
    /// <param name="episodeOrCommentId">Id of the episode or comment for which comment is to be added</param>
    /// <param name="commentText">Text of the comment</param>
    /// <returns>200 OK if comment is added, otherwise 400 Bad Request</returns>
    [HttpPost("{episodeOrCommentId}/comment")]
    public async Task<IActionResult> AddComment(Guid episodeOrCommentId, [FromBody] string commentText)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddComment));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(AddComment));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Deletes the comment for the current user.
    /// </summary>
    /// <param name="commentId">Id of the comment to be deleted</param>
    /// <returns>200 OK if comment is deleted, otherwise 400 Bad Request</returns>
    [HttpDelete("{commentId}/delete")]
    public async Task<IActionResult> DeleteComment(Guid commentId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeleteComment));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(DeleteComment));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Adds a like to the comment or episode for the current user.
    /// </summary>
    /// <param name="episodeOrCommentId">Id of the episode or comment for which like is to be added</param>
    /// <returns>200 OK if like is added, otherwise 400 Bad Request</returns>
    [HttpPost("{episodeOrCommentId}/like")]
    public async Task<IActionResult> AddLike(Guid episodeOrCommentId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddLike));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(AddLike));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Removes the like from the episode or comment for the current user.
    /// </summary>
    /// <param name="episodeOrCommentId">Id of the episode or comment for which like is to be removed</param>
    /// <returns>200 OK if like is removed, otherwise 400 Bad Request</returns>
    [HttpDelete("{episodeOrCommentId}/unlike")]
    public async Task<IActionResult> RemoveLike(Guid episodeOrCommentId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(RemoveLike));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(RemoveLike));
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
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(IsLiked));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(IsLiked));
            return BadRequest(e.Message);
        }
    }


    #endregion

    #region Rating

    /// <summary>
    /// Adds the rating to the podcast for the current user.
    /// </summary>
    /// <param name="request">Request object containing the podcastId and rating</param>
    /// <returns>200 OK if rating is added, otherwise 400 Bad Request</returns>
    [HttpPost("rating")]
    public async Task<ActionResult> AddRating(RatingRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddRating));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(AddRating));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Removes the rating from the podcast for the current user.
    /// </summary>
    /// <param name="podcastId">Id of the podcast for which rating is to be removed</param>
    /// <returns>200 OK if rating is removed, otherwise 400 Bad Request</returns>
    [HttpDelete("deleteRating")]
    public async Task<ActionResult> RemoveRating(Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(RemoveRating));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(RemoveRating));
            return BadRequest(e.Message);
        }
    }

    #endregion

    #region Review

    /// <summary>
    /// Adds the review to the podcast for the current user.
    /// </summary>
    /// <param name="request">Request object containing the podcastId and review text</param>
    /// <returns>200 OK if review is added, otherwise 400 Bad Request</returns>
    [HttpPost("review")]
    public async Task<ActionResult> AddReview(ReviewRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddReview));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(AddReview));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Removes the review from the podcast for the current user.
    /// </summary>
    /// <param name="podcastId">Id of the podcast for which review is to be removed</param>
    /// <returns>200 OK if review is removed, otherwise 400 Bad Request</returns> 
    [HttpDelete("deleteReview")]
    public async Task<ActionResult> RemoveReview(Guid podcastId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(RemoveReview));

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
            this.LogErrorAPICall(logger: _logger, e, callerName: nameof(RemoveReview));
            return BadRequest(e.Message);
        }
    }

    #endregion


    #region Points
    [HttpPost("{episodeId}/points")]    
    public async Task<IActionResult> GiftPoints(Guid episodeId,int points)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GiftPoints));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _socialService.GiftPoints(points,episodeId,user));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GiftPoints));
            return BadRequest(e.Message);
        }
    }

    [HttpPost("webhook/points")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmPayment()
    {
        try
        {
  
            this.LogDebugControllerAPICall(_logger, callerName: nameof(ConfirmPayment));

            return Ok(await _socialService.ConfirmPaymentWebhook(HttpContext));

        }
        catch(Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(ConfirmPayment));
            return BadRequest(e.Message);

        }
    }
    #endregion

}