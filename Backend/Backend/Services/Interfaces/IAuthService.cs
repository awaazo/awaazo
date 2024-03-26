using Backend.Controllers.Requests;
using Backend.Models;
using Google.Apis.Auth;

namespace Backend.Services.Interfaces;

public interface IAuthService
{
    public string GenerateToken(Guid userId, IConfiguration configuration, TimeSpan tokenLifeTime);

    public Task<User?> RegisterAsync(RegisterRequest request);

    public Task<User?> LoginAsync(LoginRequest request);

    public Task<User?> IdentifyUserAsync(HttpContext httpContext);

    public Task<bool> ValidateGoogleTokenAsync(string token);

    public Task<User?> GoogleSSOAsync(GoogleRequest google);

    public Task<bool> CheckEmail(string email);

    public Task SentForgotPasswordEmail(string requestEmail);
    public Task SendWelcomeEmail(User newUser, string getDomainUrl);
    public Task VerifyEmail(User? user, string requestToken);
}