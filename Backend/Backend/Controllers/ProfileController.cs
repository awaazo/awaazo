using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using static Backend.Infrastructure.FileStorageHelper;
using static Backend.Infrastructure.ControllerHelper;
using Backend.Infrastructure;

namespace Backend.Controllers;

[ApiController]
[Route("profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private const int MIN_PAGE = 0;
    private const int DEFAULT_PAGE_SIZE = 20;

    private readonly IAuthService _authService;
    private readonly IProfileService _profileService;
    private readonly ILogger _logger;

    public ProfileController(IAuthService authService, IProfileService profileService, ILogger logger)
    {
        _authService = authService;
        _profileService = profileService;
        _logger = logger;
    }

    #region Current User

    [HttpDelete("delete")]
    public async Task<ActionResult> DeleteProfile()
    {
        _logger.LogDebug(@"Using the profile\delete Endpoint");

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
    public async Task<ActionResult> SetupProfile([FromForm] ProfileSetupRequest setupRequest)
    {
        _logger.LogDebug(@"Using the profile\setup Endpoint");

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
    public async Task<ActionResult> EditProfile([FromForm] ProfileEditRequest editRequest)
    {
        _logger.LogDebug(@"Using the profile\edit Endpoint");

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
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpGet("get")]
    public async Task<ActionResult<UserProfileResponse>> GetProfile()
    {
        _logger.LogDebug(@"Using the profile\get Endpoint");

        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // If User is not found, return 404
        if (user == null)
            return NotFound("User does not exist.");


        return await _profileService.GetProfileAsync(user, GetDomainUrl(HttpContext));
    }

    [HttpGet("avatar")]
    public async Task<ActionResult> GetProfileAvatar()
    {
        _logger.LogDebug(@"Using the profile\avatar Endpoint");

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

    #endregion 

    #region Other Users

    [HttpGet("search")]
    public async Task<IActionResult> ProfileSearch(string searchTerm = "", int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        _logger.LogDebug(@"Using the profile\search Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _profileService.SearchUserProfiles(searchTerm,page,pageSize,GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpGet("{userId}/get")]
    public async Task<IActionResult> GetUser(Guid userId)
    {
        _logger.LogDebug(@"Using the profile\get Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _profileService.GetUserProfile(userId, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpGet("{userId}/avatar")]
    public async Task<IActionResult> GetUserAvatar(Guid userId)
    {
        _logger.LogDebug(@"Using the profile\userId\avatar Endpoint");

        try
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            // Get the avatar name of the user. 
            string avatarName = await _profileService.GetUserAvatarNameAsync(userId);

            // If the avatar name is the default avatar name, return the default avatar. 
            // Otherwise, return the user's avatar.
            return avatarName == Models.User.DEFAULT_AVATAR_NAME ?
                Redirect(Models.User.DEFAULT_AVATAR_URL) :
                PhysicalFile(GetUserAvatarPath(avatarName), GetFileType(avatarName));
        }
        catch (Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    #endregion
}