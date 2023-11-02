using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using static Backend.Models.Podcast;

namespace Backend.Controllers.Requests
{
    [BindProperties]
    public class CreatePodcastRequest
    {
        [Required]
        public string? Name { get; set; }

        public string[]? Tags { get; set; }

        public string? Description { get; set; }

      
        public IFormFile? coverImage { get; set; } = null!;

    }

    [BindProperties]
    public class GetPodcastRequest
    {

        public string? Id { get; set; }

        [Required]
        public string? Name { get; set; }
        public string[]? Tags { get; set; }

        public string? Description { get; set; }

        public Files? coverImage { get; set; }




    }

    [BindProperties]
    public class GetPodcastResponse
    {
        public Guid? Id { get; set; }
        public string? Name { get; set; }
        public string[]? Tags { get; set; }

        public string? Description { get; set; }

        public Guid? CoverId { get; set; }

        public float? AverageRating { get; set; }

        public ulong? TotalRatings { get; set; }

        public PodcastType? Type { get; set; }

        public bool? IsExplicit { get; set; }

        public int? NoOfEpisode { get; set; }




    }

    


}
