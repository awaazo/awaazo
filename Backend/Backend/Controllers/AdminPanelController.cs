using Backend.Controllers.Requests;
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
    public AdminPanelController(AdminPanelService service, IAuthService authService) {
        _adminService = service;
        _authService = authService;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers() {
        try {
            return Ok(await _adminService.GetAllUsers());
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("email/{userId}")]
    public async Task<IActionResult> EmailUser(Guid userId, [FromBody] AdminEmailUserRequest request) {
        try {
            User? admin = await _authService.IdentifyUserAsync(HttpContext);
            if (admin is null)
                throw new InvalidOperationException("Admin user Id cannot be null");
            
            await _adminService.EmailUser(admin, userId, request);
            return Ok();
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("emailLogs")]
    public async Task<IActionResult> EmailLogs([FromQuery(Name = "page")] uint page) {
        try {
            User? admin = await _authService.IdentifyUserAsync(HttpContext);
            if (admin is null)
                throw new InvalidOperationException("Admin user Id cannot be null");

            return Ok(await _adminService.EmailLogs(admin, (int)page));
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }   
    }
    
    [HttpPost("ban/{userId}")]
    public async Task<IActionResult> BanUser(Guid userId) {
        try {
            User? admin = await _authService.IdentifyUserAsync(HttpContext);
            if (admin is null)
                throw new InvalidOperationException("Admin user Id cannot be null");
            
            await _adminService.BanUser(admin, userId);
            return Ok();
        }
        catch (Exception e) {
            return BadRequest(e.Message);
        }
    }    
}