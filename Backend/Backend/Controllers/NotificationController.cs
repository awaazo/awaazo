using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.ControllerHelper;

namespace Backend.Controllers;

/// <summary>
/// The Notification Controller is responsible for handling all requests to the notification endpoints.
/// </summary>
[ApiController]
[Route("notification")]
[Authorize]
public class NotificationController : ControllerBase
{
    private const int MIN_PAGE = 0;
    private const int DEFAULT_PAGE_SIZE = 5;
    private readonly IAuthService _authService;
    private readonly INotificationService _notificationService;
    private readonly ILogger<NotificationController> _logger;

    /// <summary>
    /// The constructor for the Notification Controller.
    /// </summary>
    /// <param name="authService">Auth Service to be injected.</param>
    /// <param name="notificationService">Notification Service to be injected.</param>
    /// <param name="logger">Logger to be injected.</param>
    public NotificationController(IAuthService authService, INotificationService notificationService, ILogger<NotificationController> logger)
    {
        _logger = logger;
        _authService = authService;
        _notificationService = notificationService;
    }

    /// <summary>
    /// The endpoint for getting all notifications for a user.
    /// </summary>
    /// <param name="page">The page number to get.</param>
    /// <param name="pageSize">The number of notifications to get per page.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpGet("all")]
    public async Task<IActionResult> GetAllNotification(int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAllNotification));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _notificationService.GetAllNotificationAsync(user, GetDomainUrl(HttpContext), page, pageSize));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetAllNotification));
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// The endpoint for getting all unread notifications for a user.
    /// </summary>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpGet("count")]
    public async Task<IActionResult> GetUnreadNotificationCount()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetUnreadNotificationCount));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _notificationService.GetUnreadNoticationCountAsync(user));
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e, callerName: nameof(GetUnreadNotificationCount));
            return BadRequest(e.Message);
        }
    }
}