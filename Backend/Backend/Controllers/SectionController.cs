using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// The Section Controller is responsible for handling all the requests related to section.
/// </summary>
[ApiController]
[Route("section")]
[Authorize]
public class SectionController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ISectionService _SectionService;
    private readonly ILogger<SectionController> _logger;

    /// <summary>
    /// Constructor for SectionController
    /// </summary>
    /// <param name="authService"> Service for authentication to be injected</param>
    /// <param name="sectionService"> Service for section to be injected</param>
    /// <param name="logger"> Logger for logging to be injected</param>
    public SectionController(IAuthService authService, ISectionService sectionService, ILogger<SectionController> logger)
    {
        _logger = logger;
        _authService = authService;
        _SectionService = sectionService;
    }

    /// <summary>
    /// Add a section to an episode
    /// </summary>
    /// <param name="episodeId"> Id of the episode to which section is to be added</param>
    /// <param name="request"> Request object containing the section details</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpPost("{episodeId}/add")]
    public async Task<IActionResult> AddSection(Guid episodeId, SectionRequest request)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(AddSection));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            // Call the services Method
            return await _SectionService.AddSectionAsync(episodeId, user.Id, request) ? Ok("Successfully Added Section") : BadRequest("Database Error Occured");
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(logger: _logger, e: ex, callerName: nameof(AddSection));
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get Sections for an episode
    /// </summary>
    /// <param name="episodeId"> Id of the episode for which sections are to be fetched</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpGet("{episodeId}/get")]
    public async Task<IActionResult> GetSection(Guid episodeId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetSection));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return Ok(await _SectionService.GetSectionsAsync(episodeId));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(logger: _logger, e: ex, callerName: nameof(GetSection));
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete a section from an episode
    /// </summary>
    /// <param name="sectionId"> Section Id to be deleted</param>
    /// <returns>200 Ok if successful, 400 BadRequest if not successful</returns>
    [HttpDelete("{sectionId}/delete")]
    public async Task<IActionResult> DeleteSection(Guid sectionId)
    {
        try
        {
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeleteSection));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            return await _SectionService.DeleteSectionAsync(sectionId, user.Id) ? Ok("Successfully Deleted") : BadRequest("Error occured while saving");

        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(logger: _logger, e: ex, callerName: nameof(DeleteSection));
            return BadRequest(ex.Message);
        }
    }
}
