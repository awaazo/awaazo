using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("Episode")]
    public class EpisodeController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IEpisodeService _episodeService;
        private readonly IAuthService _authService;
        public EpisodeController(AppDbContext db,IEpisodeService episodeService,IAuthService authService) {
            _db = db;
            _episodeService = episodeService;
            _authService = authService;

        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddEpisode([FromForm] CreateEpisodeRequest createEpisodRequest)
        {
            if(createEpisodRequest.PodcastId != null)
            {
                 Guid id = Guid.Parse(createEpisodRequest.PodcastId);
                Console.WriteLine(id);
                 Podcast? podcast = await _db.Podcasts!.FirstOrDefaultAsync(u => u.Id == id);
               
                if (podcast != null)
                {
                    User? user = await _authService.IdentifyUserAsync(HttpContext);
                    if (user != null)
                    {
                        if(podcast.PodcasterId == user.Id) {
                            try
                            {
                                Episode? episode = await _episodeService!.AddEpisode(createEpisodRequest,podcast,HttpContext);
                                return Ok(episode);

                            }catch (Exception ex)
                            {

                                return BadRequest(ex.Message);
                            }
                            
                           
                            
                        }
                        return BadRequest("Not Authorized");
                    }



                }
                return NotFound("Podcast Not found");


            }

            return NotFound("Invalid Request");

        }


       
    }
}
