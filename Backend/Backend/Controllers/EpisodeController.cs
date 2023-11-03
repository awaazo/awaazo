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
            if (deleteEpisodeRequest == null)
                return BadRequest("Nothing was recieved");

            if (deleteEpisodeRequest.EpisodeId == null)
                return BadRequest("EpisodeId Not Provided");

            Guid id = Guid.Parse(deleteEpisodeRequest.EpisodeId);
            Episode? episode =  _db.Episodes!.Include(u => u.Podcast).FirstOrDefault(u => u.Id == id);
            if(episode == null)
                return NotFound("Episode Not Found");

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            if (episode.Podcast.PodcasterId != user.Id)
                return BadRequest("Podcast does not belong to the user");

            try
            {
                await _episodeService.DeleteEpisode(episode, deleteEpisodeRequest);
                return Ok( "Successfully deleted");
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddEpisode([FromForm] CreateEpisodeRequest createEpisodRequest)
        {
            if (createEpisodRequest == null)
                return BadRequest("Nothing was recieved");

            if (createEpisodRequest.PodcastId == null)
                return BadRequest("PodcastId Not Provided");

            Guid id = Guid.Parse(createEpisodRequest.PodcastId);           
            Podcast? podcast = await _db.Podcasts!.FirstOrDefaultAsync(u => u.Id == id);

            if (podcast == null)
                return NotFound("Podcast Not found");

            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");

            if (podcast.PodcasterId != user.Id)
                return BadRequest("Podcast Does not belong to the user");

            try
            {
                Episode? episode = await _episodeService!.AddEpisode(createEpisodRequest, podcast, HttpContext);
                if (episode == null)
                    return BadRequest("There was an issue adding the Episode. Please try again later");

                return Ok("Successfully Added the Episode");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("edit")]
        public async Task<IActionResult> EditEpisode([FromForm]EditEpisodeRequest editEpisodeRequest)
        {
            // Identify User from JWT Token
            User? user = await _authService.IdentifyUserAsync(HttpContext);

            // If User is not found, return 404
            if (user == null)
                return NotFound("User does not exist.");
            try
            {
                Episode? episode = await  _episodeService.EditEpisode(editEpisodeRequest, HttpContext);

                if(episode != null)
                    return Ok("Sucsessfully Editted the Epsiode");

                return BadRequest("There was an issue editing the Episode");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }      
    }
}
