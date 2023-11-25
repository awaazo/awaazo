using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
    [BindProperties]
    public class BookmarkAddRequest
    {
        
        [Required(ErrorMessage = "Title is required")]
        [MinLength(3, ErrorMessage = "Title must be >= to 3 characters")]
        public string Title { get; set; } = string.Empty;

        public string Note { get; set; } = string.Empty;

        [Range(0.0, Double.MaxValue, ErrorMessage = "Time must be a positive number")]
        public double Time { get; set; } = 0.0;
    }
}