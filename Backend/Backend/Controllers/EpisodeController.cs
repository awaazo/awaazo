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
    [Route("episode")]
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
        [HttpDelete("delete")]
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
                           return Ok( "Successfully deleted");
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
        [HttpPost("add")]
        public async Task<IActionResult> AddEpisode([FromForm] CreateEpisodeRequest createEpisodRequest)
        {
            if(createEpisodRequest.PodcastId != null)
            {
                 Guid id = Guid.Parse(createEpisodRequest.PodcastId);
             
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
                                return Ok("Successfully Added the Episode");

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

        [Authorize]
        [HttpPut("edit")]
        public async Task<IActionResult> EditEpisode([FromForm]EditEpisodeRequest editEpisodeRequest)
        {

            try
            {
            Episode? episode = await  _episodeService.EditEpisode(editEpisodeRequest, HttpContext);

            if(episode != null)
            {
                return Ok("Sucsessfully Editted the Epsiode");
            }
                return BadRequest("Bad Request");
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);


            }
        }


       
    }
}
