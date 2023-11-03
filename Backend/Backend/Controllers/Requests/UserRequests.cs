using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
    public class UserRequest
    {
    }

    [BindProperties]
    public class ProfileSetupRequest
    {
        [Required]
        public IFormFile? Avatar { get; set; }

        [Required]
        public string DisplayName { get; set; } = string.Empty;

        [Required]
        public string Bio { get; set; } = string.Empty;

        [Required]
        public string[] Interests { get; set; } = Array.Empty<string>();
    }

    [BindProperties]
    public class ProfileEditRequest : ProfileSetupRequest
    {

        public new IFormFile? Avatar { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        public string TwitterUrl { get; set; } = string.Empty;

        public string LinkedInUrl { get; set; } = string.Empty;

        public string GitHubUrl { get; set; } = string.Empty;

        public string WebsiteUrl { get; set; } = string.Empty;
    }

}


