using Backend.Infrastructure;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Controller]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly ReportService _service;
    private readonly ILogger<ReportController> _logger;
    public ReportController(ReportService service, ILogger<ReportController> logger) {
        _service = service;
        _logger = logger;
    }
    
    [HttpPost("report")]
    public async Task<IActionResult> Report([FromBody] Report report) {
        try {
            this.LogDebugControllerAPICall(_logger);
            await _service.Report(report);
            return Ok();
        }
        catch (Exception e) {
            this.LogErrorAPICall(_logger, e);
            return BadRequest(e.Message);
        }
    }

}