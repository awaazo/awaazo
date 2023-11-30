using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// Represents a liked episode.
/// </summary>
[PrimaryKey(nameof(UserId), nameof(EpisodeId))]
public class EpisodeLike : BaseEntity
{
    /// <summary>
    /// Id of the user who liked the episode.
    /// </summary>
    /// <value></value>
    [Required]
    public Guid UserId { get; set; } = Guid.Empty;

    /// <summary>
    /// Id of the episode that was liked.
    /// </summary>
    [Required]
    public Guid EpisodeId { get; set; } = Guid.Empty;

    /// <summary>
    /// Episode that was liked.
    /// </summary>
    /// <value></value>
    public Episode Episode { get; set; } = null!;
}

/// <summary>
/// Represents a liked comment.
/// </summary>
[PrimaryKey(nameof(UserId), nameof(CommentId))]
public class CommentLike : BaseEntity
{
    /// <summary>
    /// Id of the user who liked the comment.
    /// </summary>
    /// <value></value>
    [Required]
    public Guid UserId { get; set; } = Guid.Empty;


    /// <summary>
    /// CommentId of the comment that was liked.
    /// </summary>
    /// <value></value>
    [Required]
    public Guid CommentId { get; set; } = Guid.Empty;

    /// <summary>
    /// Comment that was liked.
    /// </summary>
    /// <value></value>
    public Comment Comment { get; set; } = null!;

}

[PrimaryKey(nameof(UserId), nameof(CommentReplyId))]
public class CommentReplyLike : BaseEntity
{
    [Required]
    public Guid UserId { get; set; } = Guid.Empty;

    [Required]
    public Guid CommentReplyId { get; set; } = Guid.Empty;

    public CommentReply CommentReply { get; set; } = null!;
}