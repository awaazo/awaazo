using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

/// <summary>
/// User model.
/// </summary>
public class User : BaseEntity
{
    /// <summary>
    /// User Unique Identifier.
    /// </summary>
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// User's unique Username.
    /// </summary>
    /// <value></value>
    [Key]
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// User email.
    /// </summary>
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User password.
    /// </summary>
    [Required]
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// URL for user's PFP
    /// </summary>
    public string Avatar { get; set; } = "DefaultAvatar";

    /// <summary>
    /// User's display name.
    /// </summary>
    /// <value></value>
    public string DisplayName { get; set; } = string.Empty;

    /// <summary>
    /// User's bio.
    /// </summary>
    /// <value></value>
    public string Bio { get; set; } = string.Empty;

    /// <summary>
    /// User's interests.
    /// </summary>
    /// <value></value>
    public string[] Interests { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Url to user's Twitter profile.
    /// </summary>
    /// <value></value>
    public string TwitterUrl { get; set; } = string.Empty;

    /// <summary>
    /// Url to user's LinkedIn profile.
    /// </summary>
    /// <value></value>
    public string LinkedInUrl { get; set; } = string.Empty;

    /// <summary>
    /// Url to user's GitHub profile.
    /// </summary>
    /// <value></value>
    public string GitHubUrl { get; set; } = string.Empty;

    /// <summary>
    /// Url to user's own website.
    /// </summary>
    /// <value></value>
    public string WebsiteUrl { get; set; } = string.Empty;

    /// <summary>
    /// User's date of birth.
    /// </summary>
    /// <value></value>
    public DateTime DateOfBirth { get; set; } = DateTime.Now;

    /// <summary>
    /// User's gender.
    /// </summary>
    /// <value></value>
    [DefaultValue(GenderEnum.Other)]
    public GenderEnum Gender { get; set; }

    /// <summary>
    /// Flag indicating if the user is a podcaster
    /// </summary>
    public bool IsPodcaster { get; set; }

    /// <summary>
    /// User's podcasts.
    /// </summary>
    /// <typeparam name="Podcast"></typeparam>
    /// <returns></returns>
    public ICollection<Podcast> Podcasts { get; } = new List<Podcast>();

    /// <summary>
    /// User's bookmarks
    /// </summary>
    /// <typeparam name="Bookmark"></typeparam>
    /// <returns></returns>
    public ICollection<Bookmark> Bookmarks { get; } = new List<Bookmark>();

    /// <summary>
    /// Podcasts followed by the user.
    /// </summary>
    /// <typeparam name="PodcastFollow"></typeparam>
    /// <returns></returns>
    public ICollection<PodcastFollow> PodcastFollows { get; } = new List<PodcastFollow>();

    /// <summary>
    /// Users followed by the user.
    /// </summary>
    /// <typeparam name="UserFollow"></typeparam>
    /// <returns></returns>
    public ICollection<UserFollow> UserFollows { get; } = new List<UserFollow>();

    /// <summary>
    /// User's Subscriptions.
    /// </summary>
    /// <typeparam name="Subscription"></typeparam>
    /// <returns></returns>
    public ICollection<Subscription> Subscriptions { get; } = new List<Subscription>();

    /// <summary>
    /// User's ratings.
    /// </summary>
    /// <typeparam name="PodcastRating"></typeparam>
    /// <returns></returns>
    public ICollection<PodcastRating> Ratings { get; } = new List<PodcastRating>();

    /// <summary>
    /// User's Podcast Interactions.
    /// </summary>
    /// <typeparam name="UserEpisodeInteraction"></typeparam>
    /// <returns></returns>
    public ICollection<UserEpisodeInteraction> EpisodeInteractions { get; } = new List<UserEpisodeInteraction>();

    /// <summary>
    /// Gender enum.
    /// </summary>
    public enum GenderEnum
    {
        Male, Female, Other, None
    }

    /// <summary>
    /// Returns the User's Gender as a string.
    /// </summary>
    /// <returns></returns>
    public string GetGenderString()
    {
        return Gender switch
        {
            GenderEnum.Male => "Male",
            GenderEnum.Female => "Female",
            GenderEnum.Other => "Other",
            GenderEnum.None => "None",
            _ => "None",
        };
    }

}