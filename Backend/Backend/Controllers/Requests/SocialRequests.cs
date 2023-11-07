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
