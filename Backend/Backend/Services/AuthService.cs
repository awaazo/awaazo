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
using System.Net.Mail;

namespace Backend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly IConfiguration _config;
    private readonly EmailService _emailService;

    public AuthService(AppDbContext db, IMapper mapper, IConfiguration config, EmailService emailService)
    {
        _db = db;
        _mapper = mapper;
        _config = config;
        _emailService = emailService;
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

    public void AuthGoogle(IConfiguration configuration, GoogleRequest request)
    {
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
    /// <returns>The Google SSO User, otherwise null</returns>
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
    /// Validates the Google Token.
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    public async Task<bool> ValidateGoogleTokenAsync(string token)
    {
        return await GoogleJsonWebSignature.ValidateAsync(token) is not null;
    }


    public async Task<bool> CheckEmail(string email)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Email == email) is not null;
    }

    /// <summary>
    /// Sends a forgot password email to the requested email
    /// </summary>
    /// <param name="requestEmail"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task SentForgotPasswordEmail(string requestEmail)
    {
        // Verify that email exists
        User? user = await _db.Users.Where(u => u.Email == requestEmail).FirstOrDefaultAsync();
        if (user is null)
            throw new Exception("The email is not associated to a user");

        // Delete all previous tokens
        _db.ForgetPasswordTokens.RemoveRange(_db.ForgetPasswordTokens.Where(token => token.UserId == user.Id));
        await _db.SaveChangesAsync();

        // Generate token
        ForgetPasswordToken token = new ForgetPasswordToken(user);
        _db.ForgetPasswordTokens.Add(token);
        await _db.SaveChangesAsync();

        string url = $"{_config["Jwt:Audience"]}/resetpassword?token={token.Token}&email={requestEmail}";
        string awazoEmail = _config["Smtp:Username"]!; //"noreply@awazo.com";
        MailMessage message = new MailMessage()
        {
            From = new MailAddress(awazoEmail),
            Subject = $"Password Reset for {requestEmail}",
            Body = $"A password reset was requests for {requestEmail}. Click on the link below to reset your password <br /><br />" +
                 $"<a href=\"{url}\">Click here</a> <br /><br />",
            IsBodyHtml = true
        };
        message.To.Add(requestEmail);
        _emailService.Send(message);
    }

    public async Task SendWelcomeEmail(User newUser, string domainUrl) {
        string token = $"{Guid.NewGuid()}{Guid.NewGuid()}{Guid.NewGuid()}".Replace("-", "");
        newUser.VerificationToken = token;
        _db.Users.Update(newUser);
        await _db.SaveChangesAsync();
        
        string url = $"{domainUrl}/verifyemail?token={token}";
        
        string awazoEmail = _config["Smtp:Username"]!;
        MailMessage message = new MailMessage()
        {
            From = new MailAddress(awazoEmail),
            Subject = "Welcome to Awazo!",
            Body = $"Welcome to Awazo! Click on the link below to verify your email <br /><br />" +
                 $"<a href=\"{url}\">Click here</a> <br /><br />",
            IsBodyHtml = true
        };
        
        message.To.Add(newUser.Email);
        _emailService.Send(message);
    }

    public async Task VerifyEmail(User? user, string requestToken) {
        if (user is null)
            throw new Exception("User not found");
        
        if (user.VerificationToken != requestToken)
            throw new Exception("Invalid token");
        
        user.VerificationToken = null;
        user.IsVerified = true;
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
    }
}






