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
    public async Task<IActionResult> Login([FromBody] LoginRequest request) {
        // Login 
        User? user = await _authService.LoginAsync(request);
        if(user is null)
            return BadRequest("Login failed. Invalid Email and/or Password.");
        
        // Generate JWT Token for user
        string token = _authService.GenerateToken(user.Id,_configuration,TokenLifeTime);

        Response.Cookies.Append("jwt-token", token, new CookieOptions() { HttpOnly = true, SameSite=SameSiteMode.Lax  });

        // Return JWT Token with the User
        return Ok("Logged in.");
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request) {
        
        // Register User if he does not already exist
        User? newUser = await _authService.RegisterAsync(request);
        if(newUser is null)
            return BadRequest("An Account with that Email already exists. Please Login or use a different Email address.");
        
        // Generate JWT Token for user
        string token = _authService.GenerateToken(newUser.Id,_configuration,TokenLifeTime);
        
        Response.Cookies.Append("jwt-token", token, new CookieOptions() { HttpOnly = true, SameSite=SameSiteMode.Lax });

        // Return JWT Token with the User
        return Ok("Registered.");
    }
    
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // Return UserId
        if (user is null) return BadRequest("User not found.");

        else return Ok(new UserMenuInfoResponse(user,HttpContext));
    }


    [HttpPost("googleSSO")]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleSSO([FromBody] GoogleRequest request)
    {
        // Get the SSO User
        User? user = await _authService.GoogleSSOAsync(request);
        if(user is null)
            return BadRequest("Email already in Use.");

        // Generate JWT Token for user
        string token = _authService.GenerateToken(user.Id,_configuration,TokenLifeTime);
        
        // Return JWT Token with the User
        return Ok(new {Token = token, User = user});
    }

    [HttpGet("logout")]
    public ActionResult Logout()
    {
        Response.Cookies.Delete("jwt-token");   
        return Ok("Logged out.");
    }
}