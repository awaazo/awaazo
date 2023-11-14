using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Controllers.Requests;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Backend.Infrastructure;
using Backend.Services;
using Google.Apis.Auth;
using Backend.Services.Interfaces;
using Backend.Controllers.Responses;
using static Backend.Infrastructure.ControllerHelper;
using Google.Apis.Auth.OAuth2.Requests;

namespace Backend.Controllers;

[ApiController]
[Route("auth")]
[Authorize]
public class AuthController : ControllerBase
{
    private static readonly TimeSpan TokenLifeTime = TimeSpan.FromDays(30);
    private readonly IConfiguration _configuration;
    private readonly IAuthService _authService;

    public AuthController(IConfiguration configuration, IAuthService authService)
    {
        _configuration = configuration;
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
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
            return BadRequest(e.Message);
        }
    }

    [HttpGet("logout")]
    public ActionResult Logout()
    {
        Response.Cookies.Delete("jwt-token");
        return Ok("Logged out.");
    }
}