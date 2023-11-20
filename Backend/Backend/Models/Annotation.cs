using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Annotation : BaseEntity
{
    public Annotation() 
    {
        Content = string.Empty;
    }

    [Key]
    public Guid Id { get; set; }
    
    public Episode Episode { get; set; } = null!;
    public Guid EpisodeId { get; set; }
    
    public double Timestamp { get; set; }
    
    public string Content { get; set; }
    public AnnotationType Type { get; set;}
    
    /// <summary>
    /// Optional sponsorship details, present if type is 'sponsorship'
    /// </summary>
    public Sponsor? Sponsorship { get; set; } = null;
    
    /// <summary>
    ///  Optional media lin details, present if type is 'media-link'
    /// </summary>
    public MediaLink? MediaLink { get; set; }
    
    public enum AnnotationType
    {
        Link, Info, Sponsorship, MediaLink
    }
}