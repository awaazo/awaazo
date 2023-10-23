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
    public class PodcastController : ControllerBase
    {
        private readonly IPodcastService _podcastService;
        public PodcastController(IPodcastService podcastService)
        {
            _podcastService = podcastService;

        }

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreatePodcast([FromForm]CreatePodcastRequest createPodcastRequest)
        {
            
            GetPodcastRequest? podcast = await _podcastService.CreatePodcast(createPodcastRequest, HttpContext);
            

            if (podcast != null)
            {

            return Ok(podcast);
            
            }
            else { return BadRequest("Bad Request"); }

        }
        [HttpGet("getById")]
        [Authorize]
        public async Task<IActionResult> GetPodcastById(string id)
        {
            Podcast? podcast =  await _podcastService.GetPodcast(id);
            if(podcast != null)
            {
                return Ok(podcast);
            }
            else
            {
                return BadRequest("Bad Request");
            }
        
        }






        
    }
}
