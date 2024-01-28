namespace Backend.Models;

/// <summary>
/// Chat message sent or received by a user for an episode
/// </summary>
public class EpisodeChatMessage : BaseEntity
{

    /// <summary>
    /// The unique ID of the episode chat
    /// </summary> 
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// The user who sent or received the message
    /// </summary>
    public Guid UserId { get; set; } = Guid.Empty;

    /// <summary>
    /// The episode this chat belongs to
    /// </summary>
    public Guid EpisodeId { get; set; } = Guid.Empty;

    /// <summary>
    /// The message sent or received
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Is the message a prompt? (i.e. a question to be answered)
    /// </summary>
    public bool IsPrompt { get; set; } = false;

}