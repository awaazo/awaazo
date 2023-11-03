using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Podcast : BaseEntity
{

    public Podcast() 
    {
        Id = new Guid();
        Name  = string.Empty;
        Description = string.Empty;
        Podcaster = null!;
        PodcasterId = Guid.Empty;
        Tags = Array.Empty<string>();
        IsExplicit = false;
        Type = PodcastType.Real;
        Episodes = new List<Episode>();
        AverageRating = 0;
        TotalRatings = 0;       
    }

    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
    public string CoverArt {get;set;} = string.Empty;

    public User Podcaster { get; set; }

    // Required reference navigation to principal
    public Guid PodcasterId { get; set; }


    /// <summary>
    /// Array of tags/categories associated with the podcast
    /// </summary>
    public string[] Tags { get; set; }

    /// <summary>
    /// Optional flag indicating if the podcast has explicit content
    /// </summary>
    public bool IsExplicit { get; set; }

    /// <summary>
    /// Type of podcast: either real or AI-generated
    /// </summary>
    public PodcastType Type { get; set; }

    public ICollection<Episode> Episodes { get; set; }

    /// <summary>
    /// computed average of all ratings for this podcast
    /// </summary>
    public float AverageRating { get; set; }

    /// <summary>
    ///  total number of ratings received for this podcast
    /// </summary>
    public ulong TotalRatings { get; set; }
    
    public enum PodcastType
    {
        Real, AIGenerated
    }
}