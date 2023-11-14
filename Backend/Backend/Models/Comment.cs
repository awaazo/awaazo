using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

/// <summary>
/// Comment Entity. Represents a comment on an episode, done by a user.
/// </summary>
public class Comment : BaseEntity
{
    /// <summary>
    /// Id of the comment.
    /// </summary>
    [Key]
    public Guid Id {get;set;} = Guid.NewGuid();
    
    /// <summary>
    /// Id of the user who created the comment.
    /// </summary>
    public Guid UserId { get; set; } = Guid.Empty;

    public User User {get;set;} = null!;
    
    /// <summary>
    /// Id of the episode the comment is on.
    /// </summary>
    [Required]
    public Guid EpisodeId {get;set; } = Guid.Empty;

    /// <summary>
    /// 
    /// </summary>
    public Episode Episode {get;set;} = null!;
    
    /// <summary>
    /// Comments that belong to this comment
    /// </summary>
    /// <typeparam name="Comment"></typeparam>
    /// <returns></returns>
    public ICollection<CommentReply> Comments {get;set;} = new Collection<CommentReply>();

    /// <summary>
    /// Text of the comment.
    /// </summary>
    [Required]
    public string Text {get;set;} = string.Empty;

    /// <summary>
    /// Likes that belong to this comment
    /// </summary>
    public ICollection<CommentLike> Likes {get;set;} = new Collection<CommentLike>();
}

public class CommentReply : BaseEntity
{
/// <summary>
    /// Id of the comment.
    /// </summary>
    [Key]
    public Guid Id {get;set;} = Guid.NewGuid();
    
    /// <summary>
    /// Id of the user who created the comment.
    /// </summary>
    public Guid UserId { get; set; } = Guid.Empty;

    public User User {get;set;} = null!;

    /// <summary>
    /// Text of the comment.
    /// </summary>
    [Required]
    public string Text {get;set;} = string.Empty;

    /// <summary>
    /// Likes that belong to this comment
    /// </summary>
    public ICollection<CommentReplyLike> Likes {get;set;} = new Collection<CommentReplyLike>();

    /// <summary>
    /// Id of Comment to which this comment is a reply. 
    /// </summary>
    [Required]
    public Guid ReplyToCommentId {get;set;} = Guid.Empty;

    public Comment ReplyToComment {get;set;} = null!;
}
