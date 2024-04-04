using Azure.Core;
using Backend.Controllers.Requests;
using Backend.Infrastructure;
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
    private readonly ReportService _reportService;
    public AdminPanelController(AdminPanelService service, IAuthService authService, ILogger<AdminPanelController> logger, ReportService reportService) {
        _adminService = service;
        _authService = authService;
        _logger = logger;
        _reportService = reportService;
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
    
    [HttpGet("reports/pending")]
    public async Task<IActionResult> GetPendingReports() {
        try {
            this.LogDebugControllerAPICall(_logger);
            return Ok(await _reportService.GetPendingReports());
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("reports/resolved")]
    public async Task<IActionResult> GetResolvedReports() {
        try {
            this.LogDebugControllerAPICall(_logger);
            return Ok(await _reportService.GetResolvedReports());
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("reports/rejected")]
    public async Task<IActionResult> GetRejectedReports() {
        try {
            this.LogDebugControllerAPICall(_logger);
            return Ok(await _reportService.GetRejectedReports());
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("resolveReport/{reportId}")]
    public async Task<IActionResult> ResolveReport(Guid reportId) {
        try {
            this.LogDebugControllerAPICall(_logger);
            var admin = await IdentifyAdminAsync();
            await _reportService.ResolveReport(admin, reportId);
            return Ok();
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("rejectReport/{reportId}")]
    public async Task<IActionResult> RejectReport(Guid reportId) {
        try {
            this.LogDebugControllerAPICall(_logger);
            var admin = await IdentifyAdminAsync();
            await _reportService.RejectReport(admin, reportId);
            return Ok();
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Podcast/CreateDailyRecomendation")]
    public async Task<IActionResult> CreateDailyPodcastRecomendation([FromForm] AdminPodcastRecommendationRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);

            var result = await _adminService.CreateDailyPodcastRecomendationAsync(request, ControllerHelper.GetDomainUrl(HttpContext));
            return Ok(result);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    [HttpGet("Podcast/GetDailyRecomendations")]
    public async Task<IActionResult> GetDailyPodcastRecomendations()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);

            var result = await _adminService.GetDailyPodcastRecomendationsAsync(ControllerHelper.GetDomainUrl(HttpContext));
            return Ok(result);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    [HttpPost("Podcast/RemoveDailyRecommendations")]
    public async Task<IActionResult> RemoveDailyPodcastRecomendations([FromForm] AdminPodcastRecommendationRemovalRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);

            await _adminService.RemoveDailyPodcastRecomendationsAsync(request.podcastsToRemove);
            return Ok();
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    

    /// <summary>
    /// Returns total amount of users in the database. Includes admins
    /// </summary>
    /// <param name="withDeleted">Value to check if we wanted soft deleted users as well. Defaults to no</param>
    /// <returns></returns>
    [HttpGet("GetTotalUsers")]
    public async Task<IActionResult> GetTotalUsers(bool withDeleted = false)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);

            var totalUsers = await _adminService.GetTotalUsersAsync(withDeleted);
            return Ok(totalUsers);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Gets the amount of recently created users in the database. Includes admins
    /// </summary>
    /// <param name="daySinceCreation">Positive interger defaulting to 1 that shows from how many days ago we are searching</param>
    /// <returns></returns>
    [HttpGet("GetRecentlyCreatedUserCount")]
    public async Task<IActionResult> GetRecentlyCreatedUserCount(int daySinceCreation = 1)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);

            var totalUsers = await _adminService.GetRecentlyCreatedUserCountAsync(daySinceCreation);
            return Ok(totalUsers);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

    /// <summary>
    /// Endpoint that gets the total amount of users who are creators/podcasters
    /// </summary>
    /// <returns></returns>
    [HttpGet("GetTotalAmountOfPodcasters")]
    public async Task<IActionResult> GetTotalAmountOfPodcasters()
    {
        try
        {
            this.LogDebugControllerAPICall(_logger);

            var totalUsers = await _adminService.GetTotalAmountOfPodcastersAsync();
            return Ok(totalUsers);
        }
        catch (Exception e)
        {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }
}