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

namespace Backend.Controllers;

[ApiController]
[Route("auth")]
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
    public async Task<IActionResult> Login([FromBody] LoginRequest request) {
        // Login 
        User? user = await _authService.LoginAsync(request);
        if(user is null)
            return BadRequest("Invalid Credentials");
        
        // Generate JWT Token for user
        string token = _authService.GenerateToken(user.Id,_configuration,TokenLifeTime);

        // Return JWT Token with the User
        return Ok(new { Token = token, User = user });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request) {
        
        // Register User if he does not already exist
        User? newUser = await _authService.RegisterAsync(request);
        if(newUser is null)
            return BadRequest("User already exists");
        
        // Generate JWT Token for user
        string token = _authService.GenerateToken(newUser.Id,_configuration,TokenLifeTime);
        
        // Return JWT Token with the User
        return Ok(new {Token = token, User = newUser});
    }
    
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        // Identify User from JWT Token
        User? user = await _authService.IdentifyUserAsync(HttpContext);

        // Return UserId
        if (user is null) return BadRequest("User not found.");
        else return Ok(new 
        { 
            Email=user.Email, 
            Id = user.Id,
            Username=user.Username,
            Avatar = user.Avatar  
        });
    }

    [HttpPost("googleSSO")]
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


}