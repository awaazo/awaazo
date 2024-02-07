namespace Backend.Middlewares;

public class RefererMiddleware
{
    private readonly RequestDelegate _next;
    private readonly List<string> _allowedReferers;

    public RefererMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _allowedReferers = new List<string> { config["PyServer:DockerUrl"]!, config["PyServer:DefaultUrl"]!,"https://localhost:7126" };
    }

    public async Task Invoke(HttpContext context)
    {
        var referer = context.Request.Headers["Referer"].ToString();

        if (_allowedReferers.Any(url => referer.StartsWith(url)))
        {
            await _next(context);
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
        }
    }
}