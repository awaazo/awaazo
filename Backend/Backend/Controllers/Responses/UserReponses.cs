using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Responses;

/// <summary>
/// Response containing minimal public information about a user's profile.
/// </summary>
[BindProperties]
public class UserMenuInfoResponse
{
    public UserMenuInfoResponse()
    {
    }

    public UserMenuInfoResponse(User user, string domainUrl)
    {
        Id = user.Id;
        AvatarUrl = string.Format("{0}profile/{1}/avatar",domainUrl,user.Id);
        Username = user.Username;
    }

    [Required]
    public Guid Id { get; set; } = Guid.Empty;

    [Required]
    public string AvatarUrl { get; set; } = User.DEFAULT_AVATAR_URL;

    [Required]
    public string Username { get; set; } = string.Empty;
}

/// <summary>
/// Response containing all public information about a user's profile.
/// </summary>
[BindProperties]
public class UserProfileResponse : UserMenuInfoResponse
{
    public UserProfileResponse(User user, string domainUrl) : base(user, domainUrl)
    {
        Email = user.Email;
        DisplayName = user.DisplayName;
        Bio = user.Bio;
        Interests = user.Interests;
        TwitterUrl = user.TwitterUrl;
        GitHubUrl = user.GitHubUrl;
        WebsiteUrl = user.WebsiteUrl;
        DateOfBirth = user.DateOfBirth;
        Gender = user.GetGenderString();
    }

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string DisplayName { get; set; } = string.Empty;

    [Required]
    public string Bio { get; set; } = string.Empty;

    [Required]
    public string[] Interests { get; set; } = Array.Empty<string>();

    [Required]
    public string TwitterUrl { get; set; } = string.Empty;

    [Required]
    public string LinkedInUrl { get; set; } = string.Empty;

    [Required]
    public string GitHubUrl { get; set; } = string.Empty;

    [Required]
    public string WebsiteUrl { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; } = DateTime.Now;

    [Required]
    public string Gender { get; set; } = User.GetGenderEnumString(User.GenderEnum.None);
    
}

/// <summary>
/// Response containing all public information about a user.
/// </summary>
[BindProperties]
public class FullUserProfileResponse : UserProfileResponse
{   
    public FullUserProfileResponse(User user, string domainUrl) : base(user, domainUrl)
    {
        Podcasts = user.Podcasts.Select(p => new PodcastResponse(p, domainUrl)).ToList();
    }

    [Required]
    public List<PodcastResponse> Podcasts {get;set;} = new();
}