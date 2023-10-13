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

    [HttpPost("google")]
    public async Task<IActionResult> GoogleSSO([FromBody] GoogleRequest googleRequest)
    {
        GoogleResponse response = _authService.DecodeGoogleToken(_configuration,googleRequest.Token);
        if (response is null) return BadRequest();
        else
        {
            //If user Does not Exist it will return user and token
            User user = await _authService.UserExist(response.email);
            if (user is null) 
            {
                RegisterRequest register = new RegisterRequest()
                {
                    //TODO:Allow Date of birth to be null 
                    DateOfBirth = DateTime.UtcNow,
                    Username = response.name,
                    Email = response.email,
                    Gender = "None",
                    //TODO : Add One more field in User scheme for google request
                    Password = "12345",

                };
                User? registerUser= await _authService.RegisterAsync(register);
                string token = _authService.GenerateToken(registerUser.Id, _configuration, TokenLifeTime);
                return Ok(new { Token = token, User = registerUser });

            }
            else
            //If user Exist then it will login and Return the user and token
            {
                LoginRequest login = new LoginRequest()
                {
                    Email = response.email,
                    Password = "12345"
                };

                User? loginUser = await _authService.LoginAsync(login);
                string token = _authService.GenerateToken(loginUser.Id, _configuration, TokenLifeTime);
                return Ok(new { Token = token, User = loginUser });

            }

        }
    }

}