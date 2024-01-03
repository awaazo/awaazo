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
using Google.Apis.Auth;
using static Backend.Models.Playlist;


namespace Backend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    /// <summary>
    /// Represents a service for handling authentication-related operations.
    /// </summary>
    public AuthService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    /// <summary>
    /// Generates a JWT token for the specified user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <param name="configuration">The configuration object containing JWT settings.</param>
    /// <param name="tokenLifeTime">The lifetime of the token.</param>
    /// <returns>The generated JWT token as a string.</returns>
    public string GenerateToken(Guid userId, IConfiguration configuration, TimeSpan tokenLifeTime)
    {
        // Check if key is null
        if (configuration["Jwt:Key"] is null)
            throw new Exception("Key is null");

        // Check if Issuer is null
        if (configuration["Jwt:Issuer"] is null)
            throw new Exception("Issuer is null");

        // Check if Audience is null
        if (configuration["Jwt:Audience"] is null)
            throw new Exception("Audience is null");

        // Create Credentials
        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

        // Declare all Claims
        Claim[] claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };

        // Create Security Token
        JwtSecurityToken token = new(
            configuration["Jwt:Issuer"],
            configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.Add(tokenLifeTime),
            signingCredentials: credentials
        );

        // Return token as string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Logs in a user by checking the provided credentials against the database.
    /// </summary>
    /// <param name="request">The login request containing the user's email/username and password.</param>
    /// <returns>The logged-in user if the credentials are valid, otherwise null.</returns>
    public async Task<User?> LoginAsync(LoginRequest request)
    {
        // Return NULL if the User does not exists or if the password is incorrect
        User? user = await _db.Users!.FirstOrDefaultAsync(u => u.Email == request.Email || u.Username == request.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user!.Password))
            return null;

        return user;
    }

    /// <summary>
    /// Registers a new user asynchronously.
    /// </summary>
    /// <param name="request">The registration request containing user information.</param>
    /// <returns>The newly registered user if registration is successful, otherwise null.</returns>
    public async Task<User?> RegisterAsync(RegisterRequest request)
    {
        // Return NULL if the User exists (ie. has same email and/or username)
        User? existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email || u.Username == request.Username);
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
        await _db.Users.AddAsync(newUser);

        // Add the Liked Episodes playlist
        // Create the playlist
        Playlist playlist = new()
        {
            Id = Guid.NewGuid(),
            Name = "Liked Episodes",
            UserId = newUser.Id,
            Description = "This playlist contains all episodes liked by you!",
            Privacy = DEFAULT_PRIVACY,
            IsHandledByUser = false,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        await _db.Playlists.AddAsync(playlist);

        await _db.SaveChangesAsync();

        return newUser;
    }

    /// <summary>
    /// Identifies the user based on the provided HttpContext.
    /// </summary>
    /// <param name="httpContext">The HttpContext containing user information.</param>
    /// <returns>The identified User object, or null if the user is not identified.</returns>
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

    /// <summary>
    /// Authenticates the user using Google credentials.
    /// </summary>
    /// <param name="configuration">The configuration object.</param>
    /// <param name="request">The Google request object.</param>
    public void AuthGoogle(IConfiguration configuration, GoogleRequest request)
    {
        GoogleJsonWebSignature.ValidationSettings settings = new()
        {
            Audience = new List<string> { configuration["jwt:Google_ClientId"]! }
        };
        GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(request.Token, settings).Result;

    }

    /// <summary>
    /// Authenticates a user using Google Single Sign-On (SSO).
    /// </summary>
    /// <param name="request">The GoogleRequest object containing the user's information.</param>
    /// <returns>The authenticated User object if successful, otherwise null.</returns>
    public async Task<User?> GoogleSSOAsync(GoogleRequest request)
    {
        // Get the user from the Database if he exists already.
        User? existingUser = await _db.Users
        .FirstOrDefaultAsync(u =>u.Email == request.Email);

        // Check if the email is already used by another account.
        if(existingUser is not null && !BCrypt.Net.BCrypt.Verify(request.Sub, existingUser.Password))
            return null;

        // Return the user if he exists already
        if (existingUser is not null)
            return existingUser;

        // The user's email will be used as a default username if possible.
        string username = request.Email!.Split('@')[0];
        // Define a random number generator
        Random randomNumberGen = new(DateTime.Now.Millisecond);

        // Make sure the username is unique
        while(await _db.Users.AnyAsync(u=>u.Username==username))
        {    
            // Append a random number to the username
            username+=randomNumberGen.Next(1,100).ToString();
        }
        
        // Create the user
        User newUser = new()
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Username = username,
            DisplayName = request.Name,
            Avatar = request.Avatar,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Sub),
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // Add the Liked Episodes playlist
        // Create the playlist
        Playlist playlist = new()
        {
            Id = Guid.NewGuid(),
            Name = "Liked Episodes",
            UserId = newUser.Id,
            Description = "This playlist contains all episodes liked by you!",
            Privacy = DEFAULT_PRIVACY,
            IsHandledByUser = false,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        await _db.Playlists.AddAsync(playlist);

        // Add the User to the Database
        await _db.Users!.AddAsync(newUser);
        await _db.SaveChangesAsync();

        return newUser;
    }

    /// <summary>
    /// Validates a Google token asynchronously.
    /// </summary>
    /// <param name="token">The Google token to validate.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the token is valid.</returns>
    public async Task<bool> ValidateGoogleTokenAsync(string token)
    {
        return await GoogleJsonWebSignature.ValidateAsync(token) is not null;
    }
}






