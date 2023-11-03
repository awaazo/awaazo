using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using Backend.Models;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Responses;

[BindProperties]
public class UserMenuInfoResponse
{
    public UserMenuInfoResponse()
    {
        AvatarUrl = string.Empty;
        Username = string.Empty;
    }

    public UserMenuInfoResponse(User user, HttpContext httpContext)
    {
        Id = user.Id;
        Username = user.Username;

        if (user.Avatar == "DefaultAvatar")
            AvatarUrl = "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png";
        else
            AvatarUrl = httpContext.Request.GetDisplayUrl()[..^7] + "profile/avatar";
    }


    [Required]
    public Guid Id { get; set; }

    [Required]
    public string AvatarUrl { get; set; }

    [Required]
    public string Username { get; set; }

    public static explicit operator UserMenuInfoResponse(User v)
    {
        UserMenuInfoResponse response = new()
        {
            Id = v.Id,
            Username = v.Username
        };

        if (v.Avatar == "DefaultAvatar")
        {
            response.AvatarUrl = "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png";
        }

        return response;
    }
}

[BindProperties]
public class UserProfileResponse
{
    [Required]
    public Guid Id { get; set; } = Guid.Empty;

    [Required]
    public string AvatarUrl { get; set; } = "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png";

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Username { get; set; } = string.Empty;

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
    public string Gender { get; set; } = "None";

    public static explicit operator UserProfileResponse(User v)
    {
        UserProfileResponse response = new()
        {
            Id = v.Id,
            Email = v.Email,
            Username = v.Username,
            DisplayName = v.DisplayName,
            Bio = v.Bio,
            Interests = v.Interests,
            TwitterUrl = v.TwitterUrl,
            LinkedInUrl = v.LinkedInUrl,
            GitHubUrl = v.GitHubUrl,
            WebsiteUrl = v.WebsiteUrl,
            DateOfBirth = v.DateOfBirth,
            Gender = v.GetGenderString()
        };

        return response;
    }
}