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

}


