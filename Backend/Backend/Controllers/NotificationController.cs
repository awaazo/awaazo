using Backend.Infrastructure;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("notification")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly INotificationService _notificationService;
        private readonly AppDbContext _db;
        public NotificationController(IAuthService authService,INotificationService notificationService, AppDbContext db) {
            _authService = authService;
            _notificationService = notificationService;
            _db = db;
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetAllNotification()
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(await _notificationService.GetAllNotificationAsync(user));


        }

        [HttpGet("count")]
        public async Task<IActionResult> GetUnreadNotificationCount()
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user is null)
                return NotFound("User does not exist.");

            return Ok(new { count =  await _notificationService.GetUnreadNoticationCountAsync(user) });
        }



        
    }
}
