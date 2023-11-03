using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.FileStorageHelper;

namespace Backend.Controllers;

[ApiController]
[Route("profile")]
[Authorize]
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
    public async Task<ActionResult> Delete()
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // If User is not found, return 404
        if (user is null)
            return NotFound("User does not exist.");

        // Delete the User Profile 
        bool isDeleted = await _profileService.DeleteProfileAsync(user);

        // If User Profile is deleted successfully, return 200, else return 400 with error message. 
        if (isDeleted)
            return Ok("User profile deleted successfully.");
        else
            return BadRequest("User profile could not be deleted.");
    }

    [HttpPost("setup")]
    public async Task<ActionResult> Setup([FromForm] ProfileSetupRequest setupRequest)
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // If User is not found, return 404
        if (user == null)
            return NotFound("User does not exist.");

        // Update User Profile
        bool isChanged = await _profileService.SetupProfileAsync(setupRequest, user);

        return isChanged ? Ok("User Profile Updated.") : Ok("User Profile Unchanged.");
    }

    [HttpPost("edit")]
    public async Task<ActionResult> Edit([FromForm] ProfileEditRequest editRequest)
    {
        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            // Update User Profile
            bool isChanged = await _profileService.EditProfileAsync(editRequest, user);

            return isChanged ? Ok("User Profile Updated.") : Ok("User Profile Unchanged.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("get")]
    public async Task<ActionResult<UserProfileResponse>> Get()
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // If User is not found, return 404
        if (user == null)
            return NotFound("User does not exist.");


        return _profileService.GetProfile(user, HttpContext);
    }

    [HttpGet("avatar")]
    public async Task<ActionResult> Avatar()
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // If User is not found, return 404
        if (user is null)
            return NotFound("User does not exist.");

        // If user has yet to upload an avatar, return default avatar. 
        if (user.Avatar == "DefaultAvatar")
            return Redirect("https://img.icons8.com/?size=512&id=492ILERveW8G&format=png");

        // Otherwise, return the avatar
        return PhysicalFile(GetUserAvatarPath(user.Avatar), GetFileType(user.Avatar));
    }
}