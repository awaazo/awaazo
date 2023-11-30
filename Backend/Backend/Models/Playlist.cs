using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// 
/// </summary>
public class Playlist : BaseEntity
{

    public const PrivacyEnum DEFAULT_PRIVACY = PrivacyEnum.Private;


    /// <summary>
    /// 
    /// </summary>
    [Key]
    public Guid Id { get; set; } = Guid.Empty;

    /// <summary>
    /// 
    /// </summary>
    [Required]
    public Guid UserId { get; set; } = Guid.Empty;

    /// <summary>
    /// 
    /// </summary>
    public User User { get; set; } = null!;

    /// <summary>
    /// 
    /// </summary>
    [Required]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 
    /// </summary>
    public string Description { get; set; } = string.Empty;

    public ICollection<PlaylistEpisode> PlaylistEpisodes {get;} = new List<PlaylistEpisode>(); 

    /// <summary>
    /// 
    /// </summary>
    [Required]
    public PrivacyEnum Privacy { get; set; } = PrivacyEnum.Private;

    [Required]
    public bool IsHandledByUser {get;set;} = true;

    /// <summary>
    /// 
    /// </summary>
    public enum PrivacyEnum
    {
        Public, Private
    }

    /// <summary>
    /// 
    /// </summary>
    public string GetPrivacyString()
    {
        return Privacy switch
        {
            PrivacyEnum.Public => "Public",
            PrivacyEnum.Private => "Private",
            _ => "Private"
        };
    }

    /// <summary>
    /// 
    /// </summary>
    public static string GetPrivacyEnumString(PrivacyEnum privacy)
    {
        return privacy switch
        {
            PrivacyEnum.Public => "Public",
            PrivacyEnum.Private => "Private",
            _ => "Private"
        };
    }

    /// <summary>
    /// 
    /// </summary>
    public static PrivacyEnum GetPrivacyEnum(string privacy)
    {
        privacy = privacy.ToLower();

        if(privacy=="public")
            return PrivacyEnum.Public;
        else
            return PrivacyEnum.Private;
    }
}

/// <summary>
/// 
/// </summary>
[PrimaryKey(nameof(PlaylistId), nameof(EpisodeId))]
public class PlaylistEpisode : BaseEntity
{
    /// <summary>
    /// 
    /// </summary>
    [Required]
    public Guid PlaylistId { get; set; } = Guid.Empty;

    /// <summary>
    /// 
    /// </summary>
    [Required]
    public Guid EpisodeId { get; set; } = Guid.Empty;

    /// <summary>
    /// 
    /// </summary>
    public Playlist Playlist { get; set; } = null!;

    /// <summary>
    /// 
    /// </summary>
    public Episode Episode { get; set; } = null!;
}





// public class Playlist : BaseEntity
// {
//     [Key]
//     public Guid Id { get; set; }

//     public Guid UserId { get; set; }

//     public User? User => _context?.Users?.Where(u => u.Id == UserId).FirstOrDefault();

//     public string Name { get; set; }

//     public List<PlaylistElement>? Elements => _context?.PlaylistElements.Where(e => e.PlayerlistId == Id).ToList();

//     private AppDbContext _context;
//     public Playlist(AppDbContext context)
//     {
//         Name = string.Empty;
//         _context = context;
//     }
// }

// public class PlaylistElement
// {
//     [Key]
//     public Guid Id { get; set; }
//     public Guid PlayerlistId { get; set; }

//     public Guid EpisodeId { get; set; }

//     public Episode? Episode => _context?.Episodes!.FirstOrDefault(e => e.Id == EpisodeId);
//     public Playlist? Playlist => _context?.Playlists!.FirstOrDefault(e => e.Id == PlayerlistId);
//     private AppDbContext _context;
//     public PlaylistElement(AppDbContext context)
//     {
//         _context = context;
//     }
// }

