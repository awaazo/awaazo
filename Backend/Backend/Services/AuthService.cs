using Backend.Services.Interfaces;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Backend.Controllers.Requests;
using Backend.Models;
using Microsoft.IdentityModel.Tokens;
using Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using static Backend.Models.User;
using System.Security.Cryptography.X509Certificates;
using Google.Apis.Auth;


namespace Backend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public AuthService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    /// <summary>
    /// Generates a JWT token and returns it as a string.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="configuration"></param>
    /// <param name="tokenLifeTime"></param>
    /// <returns></returns>
    public string GenerateToken(Guid userId, IConfiguration configuration, TimeSpan tokenLifeTime)
    {
        // Check if key is null
        if (configuration["Jwt:Key"] is null) 
            throw new Exception("Key is null");
        
        // Check if Issuer is null
        if(configuration["Jwt:Issuer"] is null)
            throw new Exception("Issuer is null");
        
        // Check if Audience is null
        if(configuration["Jwt:Audience"] is null)
            throw new Exception("Audience is null");
        
        // Create Credentials
        SymmetricSecurityKey key = new (Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        SigningCredentials credentials = new (key, SecurityAlgorithms.HmacSha256);

        // Declare all Claims
        Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };

        // Create Security Token
        JwtSecurityToken token = new 
        (
            configuration["Jwt:Issuer"],
            configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.Add(tokenLifeTime),
            signingCredentials: credentials
        );

        // Return token as string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<User?> LoginAsync(LoginRequest request)
    {
        // Return NULL if the User does not exists or if the password is incorrect
        User? user = await _db.Users!.FirstOrDefaultAsync(u => u.Email == request.Email || u.Username == request.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user!.Password))
            return null;

        return user;
    }

    /// <summary>
    /// Registers a new User in the Database. Returns NULL if the User already exists.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    public async Task<User?> RegisterAsync(RegisterRequest request)
    {
        // Return NULL if the User exists (ie. has same email and/or username)
        User? existingUser = await _db.Users!.FirstOrDefaultAsync(u => u.Email == request.Email || u.Username == request.Username);
        if (existingUser is not null)
            return null;

        // Make sure the Request sent a Valid Gender
        bool isValidGender = Enum.TryParse(request.Gender, out GenderEnum gender);
        if (!isValidGender)
            request.Gender = "None";
        
        // Create the new User
        User newUser = _mapper.Map<User>(request);
        newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

        //Default Avatar
        newUser.Avatar = "DefaultAvatar";
        newUser.Interests = Array.Empty<string>();

        // Add the User to the Database
        await _db.Users!.AddAsync(newUser);
        await _db.SaveChangesAsync();
        
        return newUser;
    }

    /// <summary>
    /// Identifies the User from the HttpContext. Returns NULL if the User is not identified.
    /// </summary>
    /// <param name="httpContext"></param>
    /// <returns></returns>
    public async Task<User?> IdentifyUserAsync(HttpContext httpContext)
    {
        // Return NULL if the User is not identified
        if (httpContext.User.Identity is not ClaimsIdentity identity)
            return null;

        // Get the User Id
        Claim? claim = identity.FindFirst(ClaimTypes.NameIdentifier);
        if (claim is null || !Guid.TryParse(claim.Value, out Guid userId))
            return null;

        // Return the User object from the Database
        return await _db.Users!.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public void AuthGoogle(IConfiguration configuration ,GoogleRequest request){
        GoogleJsonWebSignature.ValidationSettings settings = new()
        {
            Audience = new List<string> { configuration["jwt:Google_ClientId"]! }
        };
        GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(request.Token, settings).Result;
         
    }

    /// <summary>
    /// Retrieves or Creates the Google SSO user.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    public async Task<User?> GoogleSSOAsync(GoogleRequest request)
    {
        // Check if the User exists
        User? existingUser = await _db.Users!.FirstOrDefaultAsync(u => 
            u.Email == request.Email);
        
        // Return the user if he exists already
        if(existingUser is not null)
            return existingUser;

        // Otherwise create the user
        User newUser = new()
        {
            Id = Guid.NewGuid(),
            Email = request.Email!,
            Avatar = request.Avatar!,
            Username = request.Username!,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Sub),
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // Add the User to the Database
        await _db.Users!.AddAsync(newUser);
        await _db.SaveChangesAsync();
        
        return newUser;
    }
}

    




