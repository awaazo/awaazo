using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;

namespace Backend.Middlewares;

public class ValidateUser : IMiddleware
{
    private readonly IAuthService _authService;
    
    public ValidateUser(IAuthService authService)
    {
        _authService = authService;
    }
    
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        User? user = await _authService.IdentifyUserAsync(context);
        if (user is null)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsync("Invalid user");
        }

        await next.Invoke(context);
    }
}