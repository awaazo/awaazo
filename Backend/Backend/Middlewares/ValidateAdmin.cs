using Backend.Models;
using Backend.Services.Interfaces;

namespace Backend.Middlewares;

public class ValidateAdmin : IMiddleware
{
    private readonly IAuthService _authService;
    public ValidateAdmin(IAuthService authService)
    {
        _authService = authService;
    }
    
    public async Task InvokeAsync(HttpContext context, RequestDelegate next) {
        User? user = await _authService.IdentifyUserAsync(context);
        if (user is null || !user.IsAdmin)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid user or user is not admin");
        }
        
        await next.Invoke(context);
    }
}