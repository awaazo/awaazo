using Backend.Models;

namespace Backend.Controllers.Responses;

/// <summary>
/// Comment Response to be sent to the client.
/// </summary>
public class CommentResponse
{
    public CommentResponse()
    {
        Id = Guid.Empty;
        UserId = Guid.Empty;
        EpisodeId = Guid.Empty;
        Likes = 0;
        Text = string.Empty;
        DateCreated = DateTime.Now;
    }

    public CommentResponse(Comment comment)
    {
        Id = comment.Id;
        UserId = comment.UserId;
        EpisodeId = comment.EpisodeId;
        Likes = comment.Likes.Count;
        Text = comment.Text;
        DateCreated = comment.CreatedAt;
    }

    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid EpisodeId {get;set;}
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