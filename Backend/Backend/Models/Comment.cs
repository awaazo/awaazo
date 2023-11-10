using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// Comment Entity. Represents a comment on an episode, done by a user.
/// </summary>
public class Comment : BaseEntity
{
    public Comment()
    {
        Id = Guid.NewGuid();
        UserId = Guid.Empty;
        EpisodeId = Guid.Empty;
        ReplyToCommentId = null;
        Text = string.Empty;
        Likes = new List<Like>();
    }

    /// <summary>
    /// Id of the comment.
    /// </summary>
    /// <value></value>
    [Key]
    public Guid Id {get;set;}
    
    /// <summary>
    /// Id of the user who created the comment.
    /// </summary>
    /// <value></value>
    [Required]
    public Guid UserId { get; set; }
    
    /// <summary>
    /// Id of the episode the comment is on.
    /// </summary>
    /// <value></value>
    [Required]
    public Guid EpisodeId {get;set; } 
    
    /// <summary>
    /// Id of Comment to which this comment is a reply. 
    /// If this is a top level comment, ReplyToCommentId will be Guid.Empty.
    /// </summary>
    /// <value></value>
    public Guid? ReplyToCommentId {get;set;}
    
    /// <summary>
    /// Text of the comment.
    /// </summary>
    /// <value></value>
    [Required]
    public string Text {get;set;}

    /// <summary>
    /// Likes that belong to this comment
    /// </summary>
    public List<Like> Likes;
}