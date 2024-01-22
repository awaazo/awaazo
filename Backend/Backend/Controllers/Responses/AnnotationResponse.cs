using Backend.Models;
using System.ComponentModel.DataAnnotations;
using static Backend.Models.Annotation;
using static Backend.Models.MediaLink;


namespace Backend.Controllers.Responses
{
    public class AnnotationResponse
    {
        public AnnotationResponse(Annotation annotation) 
        {
            Id = annotation.Id;
            Timestamp = annotation.Timestamp;
            Content = annotation.Content;
            AnnotationType = GetAnnotationString(annotation.Type);
            if(annotation.MediaLink != null)
            {
                MediaLink = new MediaLinkResponse(annotation.MediaLink);
            }
            if(annotation.Sponsorship != null)
            {
                Sponser = new SponsershipResponse(annotation.Sponsorship);

            }
            

        
        }
        [Required]
        public Guid Id { get; set; }

        [Required]
        public double Timestamp { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public string AnnotationType { get; set; } = string.Empty;

        public MediaLinkResponse? MediaLink { get; set; }

        public SponsershipResponse? Sponser {  get; set; }

    }

    public class MediaLinkResponse
    {
        public MediaLinkResponse(MediaLink mediaLink)
        {
            Url = mediaLink.Url;
            Platform = getPlatformString(mediaLink.Platform);

        }

        public string Url { get; set; } = string.Empty;
        public string Platform { get; set; } 


    }

    public class SponsershipResponse
    {
        public SponsershipResponse(Sponsor sponsor)
        {
            Name = sponsor.Name;
            Website = sponsor.Website;
        }

        public string Name { get; set; } = string.Empty;

        public string Website { get; set; } = string.Empty;
    }


}
