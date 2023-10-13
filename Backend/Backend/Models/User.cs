using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// User model.
/// </summary>
public class User : BaseEntity
{

    public User()
    {
        Email = string.Empty;
        Password = string.Empty;
        Username = string.Empty;
        Avatar = string.Empty;
        Interests = Array.Empty<string>();
    }

    /// <summary>
    /// User Unique Identifier.
    /// </summary>
    [Key]
    public Guid Id { get; set; }
    
    /// <summary>
    /// User email.
    /// </summary>
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    /// <summary>
    /// User password.
    /// </summary>
    [Required]
    public string Password { get; set; }

    public string Username { get; set; }

    /// <summary>
    /// URL for user's PFP
    /// </summary>
    public string? Avatar { get; set; }

    public string[] Interests { get; set; }
    public DateTime DateOfBirth { get; set; }
    
    [DefaultValue(GenderEnum.Other)]
    public GenderEnum Gender { get; set; }

    /// <summary>
    /// Flag indicating if the user is a podcaster
    /// </summary>
    public bool IsPodcaster { get; set; }

    public ICollection<Podcast> Podcasts { get; } = new List<Podcast>();

    public ICollection<Bookmark> Bookmarks { get; } = new List<Bookmark>();

    public ICollection<PodcastFollow> PodcastFollows { get; } = new List<PodcastFollow>();

    public ICollection<UserFollow> UserFollows { get; } = new List<UserFollow>();

    public ICollection<Subscription> Subscriptions { get; } = new List<Subscription>();

    public ICollection<PodcastRating> Ratings { get; } = new List<PodcastRating>();

    public ICollection<UserEpisodeInteraction> EpisodeInteractions { get; } = new List<UserEpisodeInteraction>();

    public enum GenderEnum
    {
        Male, Female, Other, None
    }

}