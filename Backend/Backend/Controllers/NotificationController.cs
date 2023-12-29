using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Backend.Infrastructure.ControllerHelper;


namespace Backend.Controllers
{
    [ApiController]
    [Route("notification")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private const int MIN_PAGE = 0;
        private const int DEFAULT_PAGE_SIZE = 5;

        private readonly IAuthService _authService;
        private readonly INotificationService _notificationService;
        private readonly ILogger _logger;

        public NotificationController(IAuthService authService,INotificationService notificationService, ILogger logger)
        {
            _logger = logger;
            _authService = authService;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllNotification(int page = MIN_PAGE, int pageSize = DEFAULT_PAGE_SIZE)
        {
            _logger.LogDebug(@"Using the notification\all Endpoint");
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _notificationService.GetAllNotificationAsync(user, GetDomainUrl(HttpContext),page,pageSize));
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetUnreadNotificationCount()
        {
            _logger.LogDebug(@"Using the notification\count Endpoint");
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _notificationService.GetUnreadNoticationCountAsync(user));
        }        
    }
}
