using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

namespace Backend.Controllers
{
    [ApiController]
    [Route("section")]
    [Authorize]
    public class SectionController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ISectionService _SectionService;
    

        public SectionController(IAuthService authService,ISectionService sectionService)
        {
            _authService = authService;
            _SectionService = sectionService;
        }

        [HttpPost("{episodeId}/add")]
        public async Task<IActionResult> AddSection(Guid episodeId,SectionRequest request)
        {
            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user == null)
                    return NotFound("User does not exist.");
                // Call the services Method
                return await _SectionService.AddSection(episodeId,user.Id, request) ? Ok("Successfully Added Section") : BadRequest("Database Error Occured");
            }
            catch(Exception ex) { 
                return BadRequest(ex.Message);
           
            }

        }
        [HttpGet("{episodeId}/get")]
        public async Task<IActionResult> GetSection(Guid episodeId)
        {
            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user == null)
                    return NotFound("User does not exist.");

                
                return Ok(await _SectionService.GetSections(episodeId));


            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        [HttpDelete("{sectionId}/delete")]
        public async Task<IActionResult> DeleteSection(Guid sectionId)
        {
            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user == null)
                    return NotFound("User does not exist.");

                return await _SectionService.DeleteSection(sectionId,user.Id) ? Ok("Successfully Deleted") : BadRequest("Error occured while saving");

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }


       
    }
}
