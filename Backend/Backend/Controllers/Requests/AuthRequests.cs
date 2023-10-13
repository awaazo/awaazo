using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Requests
{
    [BindProperties]
    public class LoginRequest
    {
        [Required]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
    }

    [BindProperties]
    public class GoogleRequest
    {
        [Required]
        public string Token { get; set; }
       
    }

    public class GoogleResponse
    {
        public string email { get; set; }
        public string name { get; set; }
    }

    [BindProperties]
    public class RegisterRequest : LoginRequest
    {
        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string? Gender {  get; set; }

        [Required]
        public string? Username {  get; set; }

       

    }

  
}

