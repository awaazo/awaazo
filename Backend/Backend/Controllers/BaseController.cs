
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

public class BaseController : ControllerBase
{
    public BaseController()
    {
    }

    /// <summary>
    /// Returns the domain url of the server.
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    private static string GetDomainUrl(HttpContext context)
    {
        string domain = "";
        domain +=  "http";
        if (context.Request.IsHttps)
            domain += "s";
        domain += @"://" + context.Request.Host + @"/";

        return domain;
    }
}