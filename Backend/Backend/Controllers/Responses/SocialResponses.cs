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