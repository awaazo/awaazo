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
        public bool IsExplicit  { get; set; }

        [Required]
        public IFormFile? AudioFile { get; set; }


    }

    [BindProperties]
    public class DeleteEpisodeRequest
    {
        [Required]
        public string EpisodeId { get; set; }


    }

    public class EditEpisodeRequest
    {

        [Required]
        public string? EpisodeId { get; set; }

    
        public string? EpisodeName { get; set; }

     
        public bool? IsExplicit { get; set; }

       
        public IFormFile? AudioFile { get; set; }


    }


    [BindProperties]
    public class GetEpisodeResponse {

        public Guid? Id { get; set; }

        public string? EpisodeName { get; set; }
        public Guid? AudioFileId { get; set; }
        public string? Thumbnail { get; set; }

        public double? Duration { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public bool? IsExplicit { get; set; } = false;

        public ulong? PlayCount { get; set; }

    }


}
