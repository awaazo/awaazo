using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Requests
{
    public class SectionRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Range(0.0, Double.MaxValue, ErrorMessage = "Time must be a positive number")]
        public Double Start { get; set; } = 0.0;

        [Range(0.0, Double.MaxValue, ErrorMessage = "Time must be a positive number")]
        public Double End { get; set; } = 0.0;

    }
}
