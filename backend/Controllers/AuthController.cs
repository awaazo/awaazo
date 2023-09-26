using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Controllers.Requests;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private static readonly TimeSpan TokenLifeTime = TimeSpan.FromDays(30);
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _db;

    public AuthController(IConfiguration configuration, AppDbContext context)
    {
        _configuration = configuration;
        _db = context;
    }
    
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request) {
        var user = _db.Users.FirstOrDefault(u => u.Email == request.Email);

        if (user is null)
            return NotFound("Invalid email " + request.Email);
        
        // Verify password
        if (!BCrypt.Net.BCrypt.Verify( request.Password, user.Password)) {
            return Unauthorized("Invalid password");
        }
        
        var token = GenerateJwtToken(user.Id);
        return Ok(new { Token = token });
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request) {
        
        // Check if user exists
        var user = _db.Users.FirstOrDefault(u => u.Email == request.Email);
        if (user is not null)
            return BadRequest("User already exists");

        var id = Guid.NewGuid();
        var newUser = new User() {
            Email = request.Email,
            Id = id,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            DateOfBirth = request.DateOfBirth
        };
        _db.Users.Add(newUser);
        _db.SaveChanges();

        var token = GenerateJwtToken(id);
        
        return Ok(new {Token = token, User = newUser});
    }
    
    
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        // Retrieve the user's identity
        ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;

        if (identity is null) return BadRequest("User Guid not found or invalid.");
        
        Claim? claim = identity.FindFirst(ClaimTypes.NameIdentifier);

        if (claim is null || !Guid.TryParse(claim.Value, out Guid userId))
            return BadRequest("User Guid not found or invalid.");
            
        // You now have the Guid of the authenticated user
        var user = _db.Users.FirstOrDefault(u => u.Id == userId);
        if (user is null)
            return NotFound();
        return Ok(new { UserId = userId });
    }
    
    private string GenerateJwtToken(Guid userid)
    {
        if (_configuration["Jwt:Key"] is null) throw new Exception("Key is null");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userid.ToString()),
        };

        var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.Add(TokenLifeTime),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}