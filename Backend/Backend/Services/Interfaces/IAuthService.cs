using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IAuthService
{
    public string GenerateToken(Guid userId, IConfiguration configuration, TimeSpan tokenLifeTime);

    public Task<User?> RegisterAsync(RegisterRequest request);

    public Task<User?> LoginAsync(LoginRequest request);

    public Task<User?> IdentifyUserAsync(HttpContext httpContext);

}