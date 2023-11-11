using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// Like entity. Represents a like on an episode or Comment.
/// </summary>
[PrimaryKey(nameof(UserId),nameof(EpisodeId),nameof(CommentId))]
public class Like: BaseEntity
{
    public Like()
    {
        UserId = Guid.Empty;
        EpisodeId = Guid.Empty;
        CommentId = Guid.Empty;
    }

    /// <summary>
    /// Id of the user who liked the episode.
    /// </summary>
    /// <value></value>
    [Required]
    public Guid UserId { get; set; }
    
    /// <summary>
    /// EpisodeId of the episode that was liked.
    /// </summary>
    /// <value></value>
    public Guid EpisodeId { get; set; }

    /// <summary>
    /// CommentId of the comment that was liked.
    /// </summary>
    /// <value></value>
    public Guid CommentId { get; set; }
}