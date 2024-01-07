using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Requests
{
    public class AnnotationRequest
    {

        [Required]
        [Range(0.0, Double.MaxValue, ErrorMessage = "Time must be a positive number")]
        public double Timestamp { get; set; }

        [Required]
        public string Content {  get; set; }  = string.Empty;

        
    }

    public class GeneralAnnotationRequest : AnnotationRequest
    {
        [Required]
        public string AnnotationType { get; set; } = string.Empty;
    }



    public class MediaLinkAnnotationRequest : AnnotationRequest
    {
        [Required]
        public string Url { get; set; } = string.Empty;

        [Required]
        public string PlatformType { get; set; } = string.Empty;


    }

    public class SponsershipAnnotationRequest : AnnotationRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Website { get; set; } = string.Empty;    

    }


}
