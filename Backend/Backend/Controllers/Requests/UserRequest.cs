using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
    public class UserRequest
    {
    }

    [BindProperties]
    public class ProfileSetupRequest
    {
        public ProfileSetupRequest()
        {
            Avatar = string.Empty;
            Bio = string.Empty;
            Interests = Array.Empty<string>();
        }

        [Required]
        public string Avatar {get;set;}

        [Required]
        public string Bio {get;set;}

        [Required]
        public string[] Interests {get;set;}
    }

    [BindProperties]
    public class ProfileEditRequest
    {
        public ProfileEditRequest()
        {
            Username = string.Empty;
            Avatar = string.Empty;
            Bio = string.Empty;
            Interests = Array.Empty<string>();
            Podcasts = Array.Empty<Podcast>();
            Bookmarks = Array.Empty<Bookmark>();
            PodcastFollows = Array.Empty<PodcastFollow>();
            UserFollows = Array.Empty<UserFollow>();
            Subscriptions = Array.Empty<Subscription>();
            Ratings = Array.Empty<PodcastRating>();
            EpisodeInteractions = Array.Empty<UserEpisodeInteraction>();
            Gender = string.Empty;
        }
        
        [Required]
        public string Username { get; set; }

        [Required]
        public string? Avatar { get; set; }

        [Required]
        public string Bio {get;set;}

        [Required]
        public string[] Interests { get; set; }
        
        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required] 
        public string Gender { get; set; }

        [Required]
        public bool IsPodcaster { get; set; }

        [Required]
        public Podcast[] Podcasts { get; set;}

        [Required]
        public Bookmark[] Bookmarks { get; set;}

        [Required]
        public PodcastFollow[] PodcastFollows { get; set;}

        [Required]
        public UserFollow[] UserFollows { get;set; }

        [Required]
        public Subscription[] Subscriptions { get; set;}

        [Required]
        public PodcastRating[] Ratings { get; set;}

        [Required]  
        public UserEpisodeInteraction[] EpisodeInteractions { get; set;}

    }
}


