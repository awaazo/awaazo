using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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
        private readonly IFileService _fileService;
        public EpisodeController(AppDbContext db,IFileService fileService, IEpisodeService episodeService, IAuthService authService) {
            _db = db;
            _episodeService = episodeService;
            _authService = authService;
            _fileService = fileService;

        }



        [Authorize]
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteEpisodeRequest deleteEpisodeRequest)
        {
            if (deleteEpisodeRequest != null)
            {
                Guid id = Guid.Parse(deleteEpisodeRequest.EpisodeId);
                Episode? episode =  _db.Episodes!.Include(u => u.Podcast).FirstOrDefault(u => u.Id == id);
                if(episode != null)
                {
                    User? user = await _authService.IdentifyUserAsync(HttpContext);
                    if(user != null && episode.Podcast.PodcasterId == user.Id)
                    {
                        try
                        {
                           await _episodeService.DeleteEpisode(episode, deleteEpisodeRequest);
                           return Ok( new {message =  "Successfully deleted"});
                        }catch (Exception ex)
                        {
                            return BadRequest(ex.Message);

                        }
                        

                    }
                    return Unauthorized("Unauthorized");
                }
                return NotFound("Episode Not Found");

            }
            return BadRequest("Invalid Body");


        }



        [Authorize]
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
