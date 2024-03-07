using System.ComponentModel.DataAnnotations;
using Backend.Models.Interfaces;

namespace Backend.Models;

public class Podcast : BaseEntity, ISoftDeletable
{
    /// <summary>
    /// Podcast ID
    /// </summary>
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Name of the Podcast
    /// </summary>
    [Required]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Description of the Podcast
    /// </summary>
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Cover Art, Contains the File name + MIME Type
    /// </summary>
    public string CoverArt {get;set;} = string.Empty;

    /// <summary>
    /// User who created the podcast
    /// </summary>
    public User Podcaster { get; set; } = null!;

    /// <summary>
    /// Required reference navigation to principal
    /// </summary>
    public Guid PodcasterId { get; set; } = Guid.Empty;

    /// <summary>
    /// Array of tags/categories associated with the podcast
    /// </summary>
    public string[] Tags { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Optional flag indicating if the podcast has explicit content
    /// </summary>
    public bool IsExplicit { get; set; } = true;

    /// <summary>
    /// Type of podcast: either real or AI-generated
    /// </summary>
    public PodcastType Type { get; set; } = PodcastType.Real;

    /// <summary>
    /// Episodes associated with this podcast
    /// </summary>
    public ICollection<Episode> Episodes { get; set; } = new List<Episode>();

    /// <summary>
    /// computed average of all ratings for this podcast
    /// </summary>
    public float AverageRating { get; set; }

    /// <summary>
    ///  total number of ratings received for this podcast
    /// </summary>
    public ulong TotalRatings { get; set; }
    
    /// <summary>
    /// Ratings received for this podcast
    /// </summary>
    public List<PodcastRating> Ratings { get; set; } = new List<PodcastRating>();

    /// <summary>
    /// Enum that represents the type of podcast, which is either real or AI generated
    /// </summary>
    public enum PodcastType
    {
        Real, AIGenerated
    }

    /// <summary>
    /// Gets a string representation of the podcast type
    /// </summary>
    public string GetPodcastTypeString()
    {
        return Type switch
        {
            PodcastType.Real => "Real",
            PodcastType.AIGenerated => "AI Generated",
            _ => "Unknown"
        };
    }
    public static PodcastType GetPodcastType(string podcast)
    {
        podcast = podcast.ToLower();
        if(podcast == "AIGenerated")
        {
            return PodcastType.AIGenerated;
        }
        else
        {
            return PodcastType.Real;
        }
    }

    public DateTime? DeletedAt { get; set; }
    public Guid DeletedBy { get; set; }
}