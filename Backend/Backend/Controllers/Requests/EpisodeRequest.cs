using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Requests
{
    [BindProperties]
    public class CreateEpisodeRequest
    {
        [Required]
        public string? PodcastId {  get; set; }

        [Required]
        public string? EpisodeName { get; set; }

        [Required]
        public string? IsExplicit  { get; set; }

        [Required]
        public IFormFile? AudioFile { get; set; }


    }
}
