using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Responses;

/// <summary>
/// Comment Response to be sent to the client.
/// </summary>
[BindProperties]
public class CommentResponse
{
    public CommentResponse()
    {
        Id = Guid.Empty;
        User = new();
        EpisodeId = Guid.Empty;
        Likes = 0;
        Text = string.Empty;
        DateCreated = DateTime.Now;
        Replies = new List<CommentReplyResponse>();
    }

    public CommentResponse(Comment comment, string domainUrl)
    {
        Id = comment.Id;
        User = new UserMenuInfoResponse(comment.User, domainUrl);
        EpisodeId = comment.EpisodeId;
        Text = comment.Text;
        DateCreated = comment.CreatedAt;
        Likes = comment.Likes.Count;
        Replies = comment.Comments.Select(c => new CommentReplyResponse(c,domainUrl)).ToList();
    }

    public Guid Id { get; set; }
    public UserMenuInfoResponse User {get;set;}
    public Guid EpisodeId {get;set;}
    public int Likes { get; set; }
    public string Text { get; set; }
    public DateTime DateCreated {get;set;}
    public List<CommentReplyResponse> Replies {get;set;}
}

[BindProperties]
public class CommentReplyResponse
{
    public CommentReplyResponse()
    {
        Id = Guid.Empty;
        User = new();
        Likes = 0;
        Text = string.Empty;
        DateCreated = DateTime.Now;
    }

    public CommentReplyResponse(CommentReply comment, string domainUrl)
    {
        Id = comment.Id;
        User = new UserMenuInfoResponse(comment.User, domainUrl);
        Text = comment.Text;
        DateCreated = comment.CreatedAt;
        Likes = comment.Likes.Count;
    }

    public Guid Id { get; set; }
    public UserMenuInfoResponse User {get;set;}
    public int Likes { get; set; }
    public string Text { get; set; }
    public DateTime DateCreated {get;set;}
}

/// <summary>
/// Rating Response to be sent to the client.
/// </summary>
public class RatingResponse
{
    public RatingResponse(PodcastRating rating)
    {
        Id = rating.Id;
        UserId = rating.UserId;
        PodcastId = rating.PodcastId;
        Rating = (int)rating.Rating;
        Review = rating.Review;
    }

    public Guid Id { get; set; } = Guid.Empty;
    public Guid UserId { get; set; } = Guid.Empty;
    public Guid PodcastId { get; set; } = Guid.Empty;
    public int Rating { get; set; } = 0;
    public string Review{get;set;} = string.Empty;
}