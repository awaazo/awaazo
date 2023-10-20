using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("profile")]
public class ProfileController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IProfileService _profileService;

    public ProfileController(IAuthService authService, IProfileService profileService)
    {
        _authService = authService;
        _profileService = profileService;
    }

    [HttpDelete("delete")]
    [Authorize]
    public async Task<ActionResult> Delete()
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // If User is not found, return 404
        if(user is null)
            return NotFound("User does not exist.");

        // Delete the User Profile 
        bool isDeleted = await _profileService.DeleteProfileAsync(user);

        // If User Profile is deleted successfully, return 200, else return 400 with error message. 
        if(isDeleted)
            return Ok("User profile deleted successfully.");
        else
            return BadRequest("User profile could not be deleted.");
    }

    [HttpGet("get")]
    [Authorize]
    public async Task<ActionResult> Get()
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // If User is not found, return 404, else return 200 with the user
        if(user is null)
            return NotFound("User does not exist.");
        else
            return Ok(new {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Avatar = user.Avatar,
                Bio = user.Bio,
                Interests = user.Interests,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                IsPodcaster = user.IsPodcaster,
                Podcasts = user.Podcasts,
                UserFollows = user.UserFollows,
                Subscriptions = user.Subscriptions,
                Ratings = user.Ratings,
                EpisodeInteractions = user.EpisodeInteractions
            });
    }

    [HttpPut("edit")]
    [Authorize]
    public async Task<ActionResult> Edit([FromBody] ProfileEditRequest editRequest)
    {
        return Ok();
    }


    [HttpPut("setup")]
    [Authorize]
    public async Task<ActionResult> Setup([FromBody] ProfileSetupRequest setupRequest)
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // Update User Profile
        user = await _profileService.SetupProfileAsync(setupRequest,user);

        // If User is not found, return 404, else return 200 with the updated user
        if (user == null)
            return NotFound("User does not exist.");
        else
            return Ok(new{
                Email = user.Email,
                Id = user.Id,
                Username = user.Username,
                Avatar = user.Avatar
            });
    }
}