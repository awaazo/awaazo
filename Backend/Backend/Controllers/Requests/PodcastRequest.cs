using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

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
}
