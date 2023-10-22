using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("podcast")]
    public class PodcastController : Controller
    {
        private readonly IPodcastService _podcastService;
        public PodcastController(IPodcastService podcastService)
        {
            _podcastService = podcastService;

        }
        [Authorize]
        [HttpPost("/create")]
        public async Task<IActionResult> CreatePodcast([FromForm]CreatePodcastRequest createPodcastRequest)
        {
            
            Podcast? podcast = await _podcastService.CreatePodcast(createPodcastRequest, HttpContext);
            

            if (podcast != null)
            {

            return Ok(podcast);
            
            }
            else { return BadRequest("Bad Request"); }

        } 
        
    }
}
