namespace Backend.Infrastructure;

/// <summary>
/// Provides helper methods for controllers.
/// </summary>
public static class ControllerHelper
{
    /// <summary>
    /// Returns the domain url of the server.
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
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