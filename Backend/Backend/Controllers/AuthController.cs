using Backend.Controllers.Requests;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interfaces;
using Backend.Controllers.Responses;
using static Backend.Infrastructure.ControllerHelper;


namespace Backend.Controllers;

/// <summary>
/// The AuthController is responsible for handling all requests related to authentication.
/// </summary>
[ApiController]
[Route("auth")]
[Authorize]
public class AuthController : ControllerBase
{
    private static readonly TimeSpan TokenLifeTime = TimeSpan.FromDays(30);
    private readonly IConfiguration _configuration;
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    /// <summary>
    /// The constructor for the Auth Controller.
    /// </summary>
    /// <param name="configuration"> Configuration to be injected.</param>
    /// <param name="authService">Auth Service to be injected.</param>
    /// <param name="logger">Logger to be injected.</param>
    public AuthController(IConfiguration configuration, IAuthService authService, ILogger<AuthController> logger)
    {
        _logger = logger;
        _configuration = configuration;
        _authService = authService;
    }

    /// <summary>
    /// Endpoint for logging in a user.
    /// </summary>
    /// <param name="request">The request body for the login.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(Login));

            // Login 
            User? user = await _authService.LoginAsync(request);
            if (user is null)
                return BadRequest("Login failed. Invalid Email/Username and/or Password.");

            // Generate JWT Token for user
            string token = _authService.GenerateToken(user.Id, _configuration, TokenLifeTime);

            Response.Cookies.Append("jwt-token", token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Lax });

            // Return JWT Token
            return Ok("Logged in.");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(Login));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Endpoint for registering a new user.
    /// </summary>
    /// <param name="request">The request body for the registration.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(Register));

            // Register User if he does not already exist
            User? newUser = await _authService.RegisterAsync(request);
            if (newUser is null)
                return BadRequest("An Account with that Email and/or Username already exists. Please Login or use a different Email address.");

            // Generate JWT Token for user
            string token = _authService.GenerateToken(newUser.Id, _configuration, TokenLifeTime);

            Response.Cookies.Append("jwt-token", token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Lax });

            // Return JWT Token
            return Ok("Registered.");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(Register));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Endpoint for getting the current user.
    /// </summary>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(Me));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // Return UserId
            if (user is null) return BadRequest("User not found.");
            else return Ok(new UserMenuInfoResponse(user, GetDomainUrl(HttpContext)));

        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(Me));
            return BadRequest(e.Message);
        }
    }


    /// <summary>
    /// Endpoint for Google SSO.
    /// </summary>
    /// <param name="request">The request body for the Google SSO.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpPost("googleSSO")]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleSSO([FromBody] GoogleRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GoogleSSO));

            // Verify the Google Token
            if (!await _authService.ValidateGoogleTokenAsync(request.Token))
                return BadRequest("Invalid Google Token.");

            // Get the SSO User
            User? user = await _authService.GoogleSSOAsync(request);
            if (user is null)
                return BadRequest("An account already exists for that email.");

            // Generate JWT Token for user
            string token = _authService.GenerateToken(user.Id, _configuration, TokenLifeTime);
            Response.Cookies.Append("jwt-token", token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Lax });

            // Return JWT Token
            return Ok("Logged in.");
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GoogleSSO));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Endpoint for Logging the user out.
    /// </summary>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(Logout));

            Response.Cookies.Delete("jwt-token");
            return await Task.FromResult<IActionResult>(Ok("Logged out."));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(Logout));
            return await Task.FromResult<IActionResult>(BadRequest(e.Message));
        }
    }


    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    [HttpGet("CheckEmail")]
    public async Task<ActionResult> CheckEmail([FromBody] CheckEmailRequest request)
    {
        _logger.LogDebug(@"Using the auth\CheckEmail Endpoint");
        try
        {
            var userExists = await _authService.CheckEmail(request.Email);
            return Ok(userExists);
        }
        catch(Exception e)
        {
            _logger.LogError(e, "");
            return BadRequest("There was an issue checking this email");
        }       
    }
}