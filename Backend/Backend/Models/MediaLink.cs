using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class MediaLink : BaseEntity
{
    public MediaLink() 
    { 
        Url = string.Empty;
    }

    [Key]
    public Guid Id { get; set; }

    public Annotation Annotation { get; set; } = null!;
    
    public Guid AnnotationId { get; set; }

    public PlatformType Platform { get; set; }

    public string Url { get; set; }
    
    public enum PlatformType
    {
        YouTube, Spotify, AppleMusic
    }
}