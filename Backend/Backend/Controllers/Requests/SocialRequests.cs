using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests;

/// <summary>
/// Comment Request to be sent to the API.
/// </summary>
[BindProperties]
public class CommentRequest
{    
    [Required]
    public Guid EpisodeId {get;set;} = Guid.Empty;

    public Guid? ReplyToCommentId {get;set;} = null;

    [Required]
    public string Text {get;set;} = string.Empty;
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
