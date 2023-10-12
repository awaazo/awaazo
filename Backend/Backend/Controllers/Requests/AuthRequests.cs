using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
    [BindProperties]
    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    [BindProperties]
    public class RegisterRequest : LoginRequest
    {
        public DateTime DateOfBirth { get; set; }
    }
}

