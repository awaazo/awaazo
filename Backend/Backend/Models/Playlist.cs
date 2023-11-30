using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// Playlist
/// </summary>
public class Playlist : BaseEntity
{

    public const PrivacyEnum DEFAULT_PRIVACY = PrivacyEnum.Private;

    /// <summary>
    /// Playlist Id
    /// </summary>
    [Key]
    public Guid Id { get; set; } = Guid.Empty;

    /// <summary>
    /// Id of the user that owns the playlist
    /// </summary>
    [Required]
    public Guid UserId { get; set; } = Guid.Empty;

    /// <summary>
    /// User that owns the playlist
    /// </summary>
    public User User { get; set; } = null!;

    /// <summary>
    /// Playlist Name
    /// </summary>
    [Required]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Playlist Description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Playlist episodes
    /// </summary>
    public ICollection<PlaylistEpisode> PlaylistEpisodes {get;} = new List<PlaylistEpisode>(); 

    /// <summary>
    /// Playlist privacy
    /// </summary>
    [Required]
    public PrivacyEnum Privacy { get; set; } = PrivacyEnum.Private;

    /// <summary>
    /// Flags if the playlist is handled by user or the system
    /// </summary>
    [Required]
    public bool IsHandledByUser {get;set;} = true;

    /// <summary>
    /// Playlist privacy settings
    /// </summary>
    public enum PrivacyEnum
    {
        Public, Private
    }

    /// <summary>
    /// Gets the privacy string
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
    /// Gets the string for the given privacyEnum
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
    /// Gets the enum for the given privacy string
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
/// Playlist Episode
/// </summary>
[PrimaryKey(nameof(PlaylistId), nameof(EpisodeId))]
public class PlaylistEpisode : BaseEntity
{
    /// <summary>
    /// Id of the playlist
    /// </summary>
    [Required]
    public Guid PlaylistId { get; set; } = Guid.Empty;

    /// <summary>
    /// Id of the episode
    /// </summary>
    [Required]
    public Guid EpisodeId { get; set; } = Guid.Empty;

    /// <summary>
    /// Playlist object
    /// </summary>
    public Playlist Playlist { get; set; } = null!;

    /// <summary>
    /// Episode object
    /// </summary>
    public Episode Episode { get; set; } = null!;
}


