using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("admin")]
[Authorize]
public class AdminPanelController : ControllerBase
{
    private readonly AdminPanelService _adminService;
    public AdminPanelController(AdminPanelService service) {
        _adminService = service;
    }
    
    
}