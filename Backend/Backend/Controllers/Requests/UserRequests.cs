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
        public ProfileSetupRequest()
        {
            Bio = string.Empty;
            Interests = Array.Empty<string>();
        }

        [Required]
        public IFormFile? Avatar {get;set;}

        [Required]
        public string Bio {get;set;}

        [Required]
        public string[] Interests {get;set;}
    }

    [BindProperties]
    public class ProfileEditRequest : ProfileSetupRequest
    {
        public ProfileEditRequest()
        {
            Username = string.Empty;
            TwitterUrl = string.Empty;
            LinkedInUrl = string.Empty;
            GitHubUrl = string.Empty;
        }

        
        public new IFormFile? Avatar {get;set;}

        [Required]
        public string Username {get;set;}
        
        [Required]
        public string TwitterUrl {get;set;}

        [Required]
        public string LinkedInUrl {get;set;}

        [Required]
        public string GitHubUrl {get;set;}
    }

}


