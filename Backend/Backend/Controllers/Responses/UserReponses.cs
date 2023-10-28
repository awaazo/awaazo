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

        if(user.Avatar == "DefaultAvatar")
            AvatarUrl = "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png";
        else
            AvatarUrl = httpContext.Request.GetDisplayUrl()[..^7] + "profile/avatar";
    }
    

    [Required]
    public Guid Id {get;set;}

    [Required]
    public string AvatarUrl {get;set;}

    [Required]
    public string Username{get;set;}

    public static explicit operator UserMenuInfoResponse(User v)
    {
        UserMenuInfoResponse response = new()
        {
            Id = v.Id,
            Username = v.Username
        };

        if(v.Avatar == "DefaultAvatar")
        {
            response.AvatarUrl = "https://img.icons8.com/?size=512&id=492ILERveW8G&format=png";
        }

        return response;
    }
}

[BindProperties]
public class UserProfileResponse
{
    public UserProfileResponse() 
    {
        Email = string.Empty;
        Username = string.Empty;
        Bio = string.Empty;
        Interests = Array.Empty<string>();
        TwitterUrl = string.Empty;
        LinkedInUrl = string.Empty;
        GitHubUrl = string.Empty;
        Gender = string.Empty;
        AvatarUrl = string.Empty;
    }
    
    [Required]
    public Guid Id {get;set;}

    [Required]
    public string AvatarUrl {get;set;}

    [Required]
    public string Email {get;set;}

    [Required]
    public string Username{get;set;}

    [Required]
    public string Bio { get; set; }

    [Required]
    public string[] Interests { get; set; }

    [Required]
    public string TwitterUrl { get; set; }

    [Required]
    public string LinkedInUrl { get; set; }

    [Required]
    public string GitHubUrl { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    public string Gender { get; set; }

    public static explicit operator UserProfileResponse(User v)
    {

        
        UserProfileResponse response = new()
        {
            Id = v.Id,
            Email = v.Email,
            Username = v.Username,
            Bio = v.Bio,
            Interests = v.Interests,
            TwitterUrl = v.TwitterUrl,
            LinkedInUrl = v.LinkedInUrl,
            GitHubUrl = v.GitHubUrl,
            DateOfBirth = v.DateOfBirth,
            Gender = v.GetGenderString()
        };

        return response;
    }
}