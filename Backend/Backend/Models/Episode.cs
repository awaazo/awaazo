using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using static Backend.Infrastructure.FileStorageHelper;

namespace Backend.Models;

/// <summary>
/// Podcast episode.
/// </summary>
public class Episode : BaseEntity
{
    public Episode()
    {
        EpisodeName = string.Empty;
        Thumbnail = string.Empty;
    }

    /// <summary>
    /// The unique ID of the episode
    /// </summary>
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// The podcast this episode belongs to
    /// </summary>
    public Podcast Podcast { get; set; } = null!;

    /// <summary>
    /// ID of the podcast this episode belongs to
    /// </summary>
    public Guid PodcastId { get; set; } = Guid.Empty;

    /// <summary>
    /// Name of the episode
    /// </summary>
    public string EpisodeName { get; set; } = string.Empty;

    /// <summary>
    /// Description of the episode
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// String that points to the Audio File location on the server
    /// </summary>
    public string Audio { get; set; } = string.Empty;

    /// <summary>
    /// String that points to the thumbnail image location on the server
    /// </summary>
    public string Thumbnail { get; set; } = string.Empty;

    /// <summary>
    /// Duration of the episode in seconds
    /// </summary>
    public double Duration { get; set; } = 0;

    /// <summary>
    /// The date the episode was released
    /// </summary> 
    public DateTime ReleaseDate { get; set; } = DateTime.Now;

    public bool IsExplicit { get; set; } = false;

    public ulong PlayCount { get; set; } = 0;

    public ICollection<UserEpisodeInteraction> UserInteractions { get; } = new List<UserEpisodeInteraction>();

    public ICollection<EpisodeSections> episodeSections = new List<EpisodeSections>();

    public ICollection<Bookmark> Bookmarks { get; } = new List<Bookmark>();

    public ICollection<Annotation> Annotations { get; } = new List<Annotation>();

    public ICollection<Sponsor> Sponsors { get; } = new List<Sponsor>();

    /// <summary>
    /// Comments for this episode
    /// </summary>
    public ICollection<Comment> Comments { get; } = new List<Comment>();

    /// <summary>
    /// Episode likes for this episode
    /// </summary>
    public ICollection<EpisodeLike> Likes { get; } = new List<EpisodeLike>();

    /// <summary>
    /// Playlist Episodes for this episode
    /// </summary>
    public ICollection<PlaylistEpisode> PlaylistEpisodes { get; } = new List<PlaylistEpisode>();
}

/// <summary>
/// User interaction with an episode
/// </summary>
[PrimaryKey(nameof(UserId), nameof(EpisodeId))]
public class UserEpisodeInteraction : BaseEntity
{
    /// <summary>
    /// ID of the user who interacted with the episode  
    /// </summary>
    [Required]
    public Guid UserId { get; set; }

    /// <summary>
    /// The user who interacted with the episode
    /// </summary>
    public User User { get; set; } = null!;
    
    /// <summary>
    /// ID of the episode that the user interacted with
    /// </summary>
    [Required]
    public Guid EpisodeId { get; set; }

    /// <summary>
    /// The episode that the user interacted with
    /// </summary>
    public Episode Episode { get; set; } = null!;

    /// <summary>
    /// Whether the user has listened to the episode
    /// </summary>
    [DefaultValue(false)]
    public bool HasListened { get; set; }

    /// <summary>
    /// Whether the user has liked the episode
    /// </summary>
    [DefaultValue(false)]
    public bool HasLiked { get; set; }

    /// <summary>
    /// The number of times the user has clicked on the episode
    /// </summary>
    [DefaultValue(0)]
    public int Clicks { get; set; }

    /// <summary>
    /// The total time the user has listened to the episode
    /// </summary>
    [DefaultValue("00:00:00")]
    public TimeSpan TotalListenTime { get; set; }

    /// <summary>
    /// The last position the user listened to
    /// </summary> 
    [DefaultValue(0.0)]
    public double LastListenPosition { get; set; }

    /// <summary>
    /// The date the user last listened to the episode
    /// </summary>
    [DefaultValue("01/01/0001 00:00:00")]
    public DateTime DateListened { get; set; }
}

public class EpisodeSections
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Episode Episode { get; set; } = null!;

    [Required]
    public Guid EpisodeId { get; set; }

    [Required]
    public double Start { get; set;}

    [Required]
    public double End { get; set;}

    [Required]
    public string Title { get; set;} = string.Empty;

   
}
