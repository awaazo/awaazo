using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Annotation : BaseEntity
{
    public Annotation() 
    {
        Content = string.Empty;
    }
    /// <summary>
    /// Id for the Annotation
    /// </summary>
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    /// <summary>
    /// Epsiode of the Annotation
    /// </summary>
    public Episode Episode { get; set; } = null!;
    
    /// <summary>
    /// Episode Id of the Annotation
    /// </summary>
    public Guid EpisodeId { get; set; } = Guid.Empty;


    /// <summary>
    /// Timestamp for each Annotaion
    /// </summary>
    public double Timestamp { get; set; } = 0.0;
    
    /// <summary>
    /// Content Saved in each Annotation
    /// </summary>
    public string Content { get; set; } = string.Empty;
    
    /// <summary>
    /// Type of Annotations
    /// </summary>
    public AnnotationType Type { get; set; } = AnnotationType.Info;
    
    /// <summary>
    /// Optional sponsorship details, present if type is 'sponsorship'
    /// </summary>
    public Sponsor? Sponsorship { get; set; } = null;
    
    /// <summary>
    ///  Optional media lin details, present if type is 'media-link'
    /// </summary>
    public MediaLink? MediaLink { get; set; }

    /// <summary>
    /// Enum for types of Annotations
    /// </summary>
    public enum AnnotationType
    {
        Link, Info, Sponsorship, MediaLink
    }


    /// <summary>
    /// Converts String annotation to Annotation Type which can be stored in the DB
    /// </summary>
    /// <param name="annotationType"></param>
    /// <returns></returns>
    public static AnnotationType GetAnnotationType(string annotationType)
    {
        annotationType = annotationType.ToLower();
        switch (annotationType)
        {
            case "link":return AnnotationType.Link;
            case "info": return AnnotationType.Info;
            case "sponsorship": return AnnotationType.Sponsorship;
            case "medialink": return AnnotationType.MediaLink;
            default: return AnnotationType.Info;

        }
    }

    public static string GetAnnotationString(AnnotationType annotationType)
    {
        switch (annotationType)
        {
            case AnnotationType.Info: return "Info";
            case AnnotationType.Link: return "Link";
            case AnnotationType.Sponsorship: return "Sponsership";
            case AnnotationType.MediaLink: return "Media Link";
            default: return "Info";
        }

    }
}