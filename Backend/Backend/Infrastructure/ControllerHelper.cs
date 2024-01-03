namespace Backend.Infrastructure;

/// <summary>
/// Provides helper methods for controllers.
/// </summary>
public static class ControllerHelper
{
    /// <summary>
    /// Returns the domain url of the server.
    /// </summary>
    /// <param name="context">The HttpContext object representing the current HTTP request.</param>
    /// <returns>The domain URL of the server.</returns>
    public static string GetDomainUrl(HttpContext context)
    {
        string domain = "";
        domain +=  "http";
        if (context.Request.IsHttps)
            domain += "s";
        domain += @"://" + context.Request.Host + @"/";

        return domain;
    }
}