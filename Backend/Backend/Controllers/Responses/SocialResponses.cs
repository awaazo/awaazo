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
    
    public static CommentResponse? FromComment(Comment? comment, string domainUrl) {
        return comment is null ? null : new CommentResponse(comment, domainUrl);
    }
}

[BindProperties]
public class EpisodeCommentResponse
{
    public EpisodeCommentResponse()
    {
        Id = Guid.Empty;
        User = new();
        EpisodeId = Guid.Empty;
        Likes = 0;
        Text = string.Empty;
        DateCreated = DateTime.Now;
        NoOfReplies = 0;
    }
    public EpisodeCommentResponse(Comment comment, string domainUrl)
    {
        Id = comment.Id;
        User = new UserMenuInfoResponse(comment.User, domainUrl);
        EpisodeId = comment.EpisodeId;
        Text = comment.Text;
        DateCreated = comment.CreatedAt;
        Likes = comment.Likes.Count;
        NoOfReplies = comment.Comments.Count();
    }


    public Guid Id { get; set; }
    public UserMenuInfoResponse User { get; set; }
    public Guid EpisodeId { get; set; }
    public int Likes { get; set; }
    public string Text { get; set; }
    public DateTime DateCreated { get; set; }
    public int NoOfReplies { get; set; }

    public static CommentResponse? FromComment(Comment? comment, string domainUrl)
    {
        return comment is null ? null : new CommentResponse(comment, domainUrl);
    }


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
    public RatingResponse(PodcastRating rating, string domainUrl)
    {
        Id = rating.Id;
        User = new (rating.User,domainUrl);
        PodcastId = rating.PodcastId;
        Rating = (int)rating.Rating;
        Review = rating.Review;
    }

    public Guid Id { get; set; } = Guid.Empty;
    public UserMenuInfoResponse User { get; set; } = null!;
    public Guid PodcastId { get; set; } = Guid.Empty;
    public int Rating { get; set; } = 0;
    public string Review{get;set;} = string.Empty;
}