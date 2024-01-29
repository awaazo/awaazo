using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.FileStorageHelper;
using static Backend.Infrastructure.ControllerHelper;

namespace Backend.Controllers;

/// <summary>
/// The Profile Controller is responsible for handling all the requests related to profile.
/// </summary>
[ApiController]
[Route("profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private const int MIN_PAGE = 0;
    private const int DEFAULT_PAGE_SIZE = 20;
    private readonly IAuthService _authService;
    private readonly IProfileService _profileService;
    private readonly ILogger<ProfileController> _logger;

    /// <summary>
    /// Constructor for ProfileController
    /// </summary>
    /// <param name="authService"> Service for authentication to be injected</param>
    /// <param name="profileService"> Service for profile to be injected</param>
    /// <param name="logger"> Logger for logging to be injected</param>
    public ProfileController(IAuthService authService, IProfileService profileService, ILogger<ProfileController> logger)
    {
        _authService = authService;
        _profileService = profileService;
        _logger = logger;
    }

    #region Current User

    /// <summary>
    /// Delete the profile of the current user
    /// </summary>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpDelete("delete")]
    public async Task<ActionResult> DeleteProfile()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeleteProfile));

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
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(DeleteProfile));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Setup the profile of the current user
    /// </summary>
    /// <param name="setupRequest"> The request containing the profile details</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("setup")]
    public async Task<ActionResult> SetupProfile([FromForm] ProfileSetupRequest setupRequest)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            
            // Validate file extension
            if (!FileStorageHelper.ValidateAvatar(setupRequest.Avatar, out var errors)) {
                return BadRequest(errors);
            }

            // Update User Profile
            bool isChanged = await _profileService.SetupProfileAsync(setupRequest, user);

            return isChanged ? Ok("User Profile Updated.") : Ok("User Profile Unchanged.");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Edit the profile of the current user
    /// </summary>
    /// <param name="editRequest"> The request containing the updated profile details</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("edit")]
    public async Task<ActionResult> EditProfile([FromForm] ProfileEditRequest editRequest)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            
            // Validate file extension
            if (!FileStorageHelper.ValidateAvatar(editRequest.Avatar, out var errors)) {
                return BadRequest(errors);
            }
            
            // Update User Profile
            bool isChanged = await _profileService.EditProfileAsync(editRequest, user);

            return isChanged ? Ok("User Profile Updated.") : Ok("User Profile Unchanged.");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(EditProfile));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get the profile of the current user
    /// </summary>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("get")]
    public async Task<ActionResult<UserProfileResponse>> GetProfile()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetProfile));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _profileService.GetProfileAsync(user, GetDomainUrl(HttpContext));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetProfile));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get the avatar of the current user
    /// </summary>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("avatar")]
    public async Task<ActionResult> GetProfileAvatar()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetProfileAvatar));

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
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetProfileAvatar));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Change the password of the user
    /// </summary>
    /// <param name="request"> Request object containing the new password</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("changePassword")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(ChangePassword));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);
            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");


            await _profileService.ChangePassword(user, request);
            return Ok();
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(ChangePassword));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Reset password
    /// </summary>
    /// <param name="request"> Request object containing the new password</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [AllowAnonymous]
    [HttpPost("resetPassword")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(ResetPassword));

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _profileService.ResetPassword(request);
            return Ok();
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(ResetPassword));
            return BadRequest(e.Message);
        }
    }

    #endregion

    #region Other Users

    /// <summary>
    /// Search for users
    /// </summary>
    /// <param name="searchTerm"> Search term to be used for searching</param>
    /// <param name="page"> Page number of the search results</param>
    /// <param name="pageSize"> Number of results per page</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("search")]
    public async Task<IActionResult> ProfileSearch(string searchTerm = "", int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(ProfileSearch));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _profileService.SearchUserProfiles(searchTerm, page, pageSize, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(ProfileSearch));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get the profile of a user
    /// </summary>
    /// <param name="userId"> Id of the user whose profile is to be fetched</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{userId}/get")]
    public async Task<IActionResult> GetUser(Guid userId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetUser));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _profileService.GetUserProfile(userId, GetDomainUrl(HttpContext)));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetUser));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Get the avatar of a user
    /// </summary>
    /// <param name="userId"> Id of the user whose avatar is to be fetched</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{userId}/avatar")]
    public async Task<IActionResult> GetUserAvatar(Guid userId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetUserAvatar));

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
            this.LogErrorAPICall(_logger, e: e, callerName: nameof(GetUserAvatar));
            return BadRequest(e.Message);
        }
    }

    #endregion
}