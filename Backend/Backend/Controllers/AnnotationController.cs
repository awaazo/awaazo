using Azure.Core;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("annotation")]
    [Authorize]
    public class AnnotationController : ControllerBase
    {
        private readonly IAnnotationService _annotationService;
        private readonly IAuthService _authService;
        private readonly ILogger _logger;

        public AnnotationController(IAnnotationService annotationService, IAuthService authService, ILogger logger)
        {
            _annotationService = annotationService;
            _authService = authService;
            _logger = logger;
        }
        [HttpPost("{episodeId}/createAnnotation")]
        public async Task<IActionResult> CreateAnnotation(Guid episodeId,GeneralAnnotationRequest annotationRequest)
        {
            try
            {
                // Log the message
                _logger.LogDebug(@"Using the annotation\episodeId\createAnnotation Endpoint");

                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user == null)
                    return NotFound("User does not exist.");
                // Call the services Method
                return await _annotationService.AddAnnotationToEpisodeAsync(user.Id,episodeId,annotationRequest) ? Ok("Successfully Created Annotation") : BadRequest("Database Error Occured");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }


        [HttpPost("{episodeId}/createMediaLinkAnnotation")]
        public async Task<IActionResult> CreateMediaLinkAnnotation(Guid episodeId, MediaLinkAnnotationRequest annotationRequest)
        {
            try
            {
                // Log the message
                _logger.LogDebug(@"Using the annotation\episodeId\createMediaLinkAnnotation Endpoint");

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
                return BadRequest(ex.Message);
            }


        }

        [HttpPost("{episodeId}/createSponserAnnotation")]
        public async Task<IActionResult> CreateSponserAnnotation(Guid episodeId, SponsershipAnnotationRequest annotationRequest)
        {
            try
            {
                // Log the message
                _logger.LogDebug(@"Using the annotation\episodeId\createSponserAnnotation Endpoint");

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
                return BadRequest(ex.Message);
            }


        }

        [HttpGet("{episodeId}/getAnnotation")]
        public async Task<IActionResult> GetAnnotation(Guid episodeId)
        {
            try
            {
                // Log the message
                _logger.LogDebug(@"Using the annotation\episodeId\GetAnnotation Endpoint");

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
                return BadRequest(ex.Message);
            }


        }

        [HttpDelete("{annotationId}/delete")]
        public async Task<IActionResult> DeleteAnnotation(Guid annotationId)
        {
            try
            {
                // Log the message
                _logger.LogDebug(@"Using the annotation\annotationId\delete Endpoint");

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
                return BadRequest(ex.Message);
            }


        }


    }
}
