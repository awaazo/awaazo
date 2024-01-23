using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// The Annotation Controller is responsible for handling all requests to the annotation endpoints.
/// </summary>
[ApiController]
[Route("annotation")]
[Authorize]
public class AnnotationController : ControllerBase
{
    private readonly IAnnotationService _annotationService;
    private readonly IAuthService _authService;
    private readonly ILogger<AnnotationController> _logger;

    /// <summary>
    /// The constructor for the Annotation Controller.
    /// </summary>
    /// <param name="annotationService">Annotation Service to be injected.</param>
    /// <param name="authService">Auth Service to be injected.</param>
    /// <param name="logger">Logger to be injected.</param>
    public AnnotationController(IAnnotationService annotationService, IAuthService authService, ILogger<AnnotationController> logger)
    {
        _annotationService = annotationService;
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// The endpoint for creating a general annotation.
    /// </summary>
    /// <param name="episodeId">Id of the episode to add the annotation to.</param>
    /// <param name="annotationRequest">The request body for the annotation.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpPost("{episodeId}/createAnnotation")]
    public async Task<IActionResult> CreateAnnotation(Guid episodeId, GeneralAnnotationRequest annotationRequest)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(CreateAnnotation));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            // Call the services Method
            return await _annotationService.AddAnnotationToEpisodeAsync(user.Id, episodeId, annotationRequest) ? Ok("Successfully Created Annotation") : BadRequest("Database Error Occured");
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(CreateAnnotation));

            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// The endpoint for creating a media link annotation.
    /// </summary>
    /// <param name="episodeId">Id of the episode to add the annotation to.</param>
    /// <param name="annotationRequest">The request body for the annotation.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpPost("{episodeId}/createMediaLinkAnnotation")]
    public async Task<IActionResult> CreateMediaLinkAnnotation(Guid episodeId, MediaLinkAnnotationRequest annotationRequest)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(CreateMediaLinkAnnotation));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            // Call the services Method
            return await _annotationService.AddMediaAnnotationToEpisodeAsync(user.Id, episodeId, annotationRequest) ? Ok("Successfully Created Annotation") : BadRequest("Database Error Occured");
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(CreateMediaLinkAnnotation));

            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// The endpoint for creating a sponser annotation.
    /// </summary>
    /// <param name="episodeId">Id of the episode to add the annotation to.</param>
    /// <param name="annotationRequest">The request body for the annotation.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpPost("{episodeId}/createSponserAnnotation")]
    public async Task<IActionResult> CreateSponserAnnotation(Guid episodeId, SponsershipAnnotationRequest annotationRequest)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(CreateSponserAnnotation));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            // Call the services Method
            return await _annotationService.AddSponsershipAnnotationToEpisodeAsync(user.Id, episodeId, annotationRequest) ? Ok("Successfully Created Annotation") : BadRequest("Database Error Occured");
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(CreateSponserAnnotation));

            return BadRequest(ex.Message);
        }
    }


    /// <summary>
    /// The endpoint for getting an annotation.
    /// </summary>
    /// <param name="episodeId">Id of the episode to get the annotation from.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpGet("{episodeId}/getAnnotation")]
    public async Task<IActionResult> GetAnnotation(Guid episodeId)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(GetAnnotation));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            // Call the services Method
            return Ok(await _annotationService.GetEpisodeAnnotationAsync(episodeId));
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(GetAnnotation));

            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// The endpoint for deleting an annotation.
    /// </summary>
    /// <param name="annotationId">Id of the annotation to delete.</param>
    /// <returns>200 OK if successful, 400 Bad Request if unsuccessful.</returns>
    [HttpDelete("{annotationId}/delete")]
    public async Task<IActionResult> DeleteAnnotation(Guid annotationId)
    {
        try
        {
            // Log the message
            this.LogDebugControllerAPICall(_logger, callerName: nameof(DeleteAnnotation));

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            // Call the services Method
            return await _annotationService.DeleteAnnotationAsync(user.Id, annotationId) ? Ok("Successfully Deleted Annotation") : BadRequest("Database Error Occured");
        }
        catch (Exception ex)
        {
            this.LogErrorAPICall(_logger, ex, callerName: nameof(DeleteAnnotation));

            return BadRequest(ex.Message);
        }
    }
}