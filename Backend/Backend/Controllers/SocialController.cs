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

    [HttpPost("{episodeOrCommentId}/comment")]
    public async Task<IActionResult> AddComment(Guid episodeOrCommentId, [FromBody] string commentText)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.AddCommentAsync(episodeOrCommentId,user,commentText)? Ok("Comment added."):Ok("Failed to add comment.");
        }
        catch(Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{commentId}/delete")]
    public async Task<IActionResult> DeleteComment(Guid commentId)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.RemoveCommentAsync(commentId,user)? Ok("Comment deleted."):Ok("Failed to delete comment.");
        }
        catch(Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    [HttpPost("{episodeOrCommentId}/like")]
    public async Task<IActionResult> AddLike(Guid episodeOrCommentId)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.AddLikeAsync(episodeOrCommentId,user)? Ok("Like added."):Ok("Failed to add like.");
        }
        catch(Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{episodeOrCommentId}/unlike")]
    public async Task<IActionResult> RemoveLike(Guid episodeOrCommentId)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return await _socialService.RemoveLikeAsync(episodeOrCommentId,user)? Ok("Like removed."):Ok("Failed to remove like.");
        }
        catch(Exception e)
        {
            // Return the error message
            return BadRequest(e.Message);
        }
    }




    // [HttpPost("like")]
    // public async Task<ActionResult> AddLike(Guid episodeId, Guid commentId)
    // {
    //     try
    //     {
    //         // Identify User from JWT Token
    //         User? user = await _authService.IdentifyUserAsync(HttpContext);

    //         // If User is not found, return 404
    //         if (user is null)
    //             return NotFound("User does not exist.");

    //         // Add like to the right entity.
    //         if(episodeId!=Guid.Empty)
    //             return await _socialService.AddLikeToEpisodeAsync(episodeId,user) ? Ok("Episode liked."): Ok("Episode failed to be liked.");
    //         else if (commentId!=Guid.Empty)
    //             return await _socialService.AddLikeToCommentAsync(commentId,user) ? Ok("Comment liked."): Ok("Comment failed to be liked.");
    //         else
    //             return BadRequest("Episode or Comment ID is required.");
    //     }
    //     catch(Exception e)
    //     {
    //         // Return the error message
    //         return BadRequest(e.Message);
    //     }
    // }

    // [HttpDelete("unlike")]
    // public async Task<ActionResult> RemoveLike(Guid episodeId, Guid commentId)
    // {
    //      try
    //     {
    //         // Identify User from JWT Token
    //         User? user = await _authService.IdentifyUserAsync(HttpContext);

    //         // If User is not found, return 404
    //         if (user is null)
    //             return NotFound("User does not exist.");

    //         // Add like to the right entity.
    //         if(episodeId!=Guid.Empty)
    //             return await _socialService.RemoveEpisodeLikeAsync(episodeId,user) ? Ok("Episode unliked."): Ok("Episode failed to be unliked.");
    //         else if (commentId!=Guid.Empty)
    //             return await _socialService.RemoveCommentLikeAsync(commentId,user) ? Ok("Comment unliked."): Ok("Comment failed to be unliked.");
    //         else
    //             return BadRequest("Episode or Comment ID is required.");
    //     }
    //     catch(Exception e)
    //     {
    //         // Return the error message
    //         return BadRequest(e.Message);
    //     }
    // }

}