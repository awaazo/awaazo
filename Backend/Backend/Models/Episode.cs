using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Episode : BaseEntity
{
    [Key]
    public Guid Id { get; set; }

    /// <summary>
    /// The podcast this episode belongs to
    /// </summary>
    public Podcast Podcast { get; set; } = null!;

    /// <summary>
    /// ID of the podcast this episode belongs to
    /// </summary>
    public Guid PodcastId { get; set; }

    public string EpisodeName { get; set; }

    /// <summary>
    /// URL to the thumbnail image of the episode
    /// </summary>
    public string Thumbnail { get; set; }
    
    /// <summary>
    /// Duration of the episode in seconds
    /// </summary>
    public double Duration { get; set; }

    public DateTime ReleaseDate { get; set; }

    public bool IsExplicit { get; set; } = false;

    public ulong PlayCount { get; set; }

    public ICollection<Bookmark> Bookmarks { get; } = new List<Bookmark>();

    public ICollection<Annotation> Annotations { get; } = new List<Annotation>();

    public ICollection<Sponsor> Sponsors { get; } = new List<Sponsor>();
}