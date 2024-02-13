using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("admin")]
[Authorize]
public class AdminPanelController : ControllerBase
{
    private readonly AdminPanelService _adminService;
    private readonly IAuthService _authService;
    private readonly ILogger<AdminPanelController> _logger;
    public AdminPanelController(AdminPanelService service, IAuthService authService, ILogger<AdminPanelController> logger) {
        _adminService = service;
        _authService = authService;
        _logger = logger;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers(bool? withDeleted) {
        try {
            this.LogDebugControllerAPICall(_logger);
            return Ok(await _adminService.GetAllUsers(withDeleted ?? false));
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    [HttpPost("ban/{userId}")]
    public async Task<IActionResult> BanUser(Guid userId) {
        try {
            this.LogDebugControllerAPICall(_logger);
            
            var admin = await IdentifyAdminAsync();
            await _adminService.BanUser(admin, userId);
            return Ok();
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    private async Task<User> IdentifyAdminAsync() {
        User? admin = await _authService.IdentifyUserAsync(HttpContext);
        if (admin is null)
            throw new InvalidOperationException("A critical error has occured. Admin is null while route is protected by VerifyAdmin middleware");
        return admin;
    }
}