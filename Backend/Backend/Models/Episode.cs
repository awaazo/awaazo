using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Backend.Infrastructure;

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

    public DateTime ReleaseDate { get; set; } = DateTime.Now;

    public bool IsExplicit { get; set; } = false;

    public ulong PlayCount { get; set; } = 0;


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
}

public class UserEpisodeInteraction : BaseEntity
{
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;
    
    public Guid EpisodeId { get; set; }

    [DefaultValue(false)]
    public bool HasListened { get; set; }

    [DefaultValue(false)]
    public bool HasLiked { get; set; }

    public double LastListenPosition { get; set; }

    public DateTime DateListened { get; set; }

    private readonly AppDbContext _db;
    public UserEpisodeInteraction(AppDbContext db)
    {
        _db = db;
    }

    public Episode? Episode => _db.Episodes?.Where(e => e.Id == EpisodeId).FirstOrDefault();
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
