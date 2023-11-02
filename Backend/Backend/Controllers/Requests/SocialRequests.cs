using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests;

/// <summary>
/// Comment Request to be sent to the API.
/// </summary>
[BindProperties]
public class CommentRequest
{
    public CommentRequest()
    {
        EpisodeId = Guid.Empty;
        ReplyToCommentId = Guid.Empty;
        Text = string.Empty;
    }   
    
    [Required]
    public Guid EpisodeId {get;set;}

    public Guid? ReplyToCommentId {get;set;}

    [Required]
    public string Text {get;set;}
}

[BindProperties]
public class RatingRequest
{
    [Required]
    public Guid PodcastId{get;set;}

    [Required]
    public int Rating {get;set;}
}

public class ReviewRequest
{
    [Required]
    public Guid PodcastId{get;set; }

    [Required]
    public string Review{get;set;} = string.Empty;
}
