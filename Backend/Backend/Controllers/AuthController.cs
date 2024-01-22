using Backend.Controllers.Requests;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interfaces;
using Backend.Controllers.Responses;
using static Backend.Infrastructure.ControllerHelper;


namespace Backend.Controllers;

[ApiController]
[Route("auth")]
[Authorize]
public class AuthController : ControllerBase
{
    private static readonly TimeSpan TokenLifeTime = TimeSpan.FromDays(30);
    private readonly IConfiguration _configuration;
    private readonly IAuthService _authService;
    private readonly ILogger _logger;

    public AuthController(IConfiguration configuration, IAuthService authService, ILogger logger)
    {
        _logger = logger;
        _configuration = configuration;
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        _logger.LogDebug(@"Using the auth\login Endpoint");

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

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        _logger.LogDebug(@"Using the auth\register Endpoint");

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

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        _logger.LogDebug(@"Using the auth\me Endpoint");

        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // Return UserId
        if (user is null) return BadRequest("User not found.");

        else return Ok(new UserMenuInfoResponse(user, GetDomainUrl(HttpContext)));
    }


    /// <summary>
    /// Google SSO Login/Register.
    /// </summary>
    /// <param name="request">GoogleSSO Request.</param>
    /// <returns></returns>
    [HttpPost("googleSSO")]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleSSO([FromBody] GoogleRequest request)
    {
        _logger.LogDebug(@"Using the auth\googleSSO Endpoint");

        try
        {
            // Verify the Google Token
            if(!await _authService.ValidateGoogleTokenAsync(request.Token))
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
            _logger.LogError(e, "");
            return BadRequest(e.Message);
        }
    }

    [HttpGet("logout")]
    public ActionResult Logout()
    {
        _logger.LogDebug(@"Using the auth\logout Endpoint");

        Response.Cookies.Delete("jwt-token");
        return Ok("Logged out.");
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