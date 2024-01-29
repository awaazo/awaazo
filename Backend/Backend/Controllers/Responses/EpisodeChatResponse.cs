using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Responses;

/// <summary>
/// Response for an episode chat.
/// </summary>
public class EpisodeChatResponse
{

    /// <summary>
    /// Default constructor
    /// </summary>
    public EpisodeChatResponse(List<EpisodeChatMessage> chats, User user, Guid episodeId, string domainUrl)
    {
        EpisodeId = episodeId;
        UserId = user.Id;

        // Add all chats to the response
        foreach (EpisodeChatMessage chat in chats)
            Messages.Add(new EpisodeChatMessageResponse(chat,user, domainUrl));

        // Sort the messages by date
        Messages.Sort((x, y) => x.SentAt.CompareTo(y.SentAt));
    }

    /// <summary>
    /// The Id of the episode
    /// </summary>
    public Guid EpisodeId { get; set; } = Guid.Empty;
    
    /// <summary>
    /// The user who sent or received the message
    /// </summary>
    public Guid UserId { get; set; } = Guid.Empty;

    /// <summary>
    /// The messages sent or received
    /// </summary>
    public List<EpisodeChatMessageResponse> Messages { get; set; } = new List<EpisodeChatMessageResponse>();
}

/// <summary>
/// Response for an episode chat message.
/// </summary>
[BindProperties]
public class EpisodeChatMessageResponse
{
    /// <summary>
    /// Default constructor
    /// </summary>
    public EpisodeChatMessageResponse(EpisodeChatMessage chat, User user, string domainUrl)
    {
        Id = chat.Id;
        UserId = chat.UserId;
        EpisodeId = chat.EpisodeId;
        Message = chat.Message;
        IsPrompt = chat.IsPrompt;
        Username = user.Username;
        SentAt = chat.CreatedAt;
        if (!user.Avatar.Contains("google"))
            AvatarUrl = string.Format("{0}profile/{1}/avatar", domainUrl, user.Id);
        else
            AvatarUrl = user.Avatar;
    }

    /// <summary>
    /// The unique ID of the episode chat
    /// </summary>
    [Required]
    public Guid Id { get; set; } = Guid.Empty;

    /// <summary>
    /// The user who sent or received the message
    /// </summary>
    [Required]
    public Guid UserId { get; set; } = Guid.Empty;

    /// <summary>
    /// The episode this chat belongs to
    /// </summary>
    [Required]
    public Guid EpisodeId { get; set; } = Guid.Empty;

    /// <summary>
    /// The message sent or received
    /// </summary>
    [Required]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Is the message a prompt? (i.e. a question to be answered)
    /// </summary>
    [Required]
    public bool IsPrompt { get; set; } = false;

    /// <summary>
    /// The username of the user who sent the message
    /// </summary>
    [Required]
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// The URL of the user's avatar
    /// </summary>
    [Required]
    public string AvatarUrl { get; set; } = string.Empty;

    /// <summary>
    /// Sent at time
    /// </summary>
    [Required]
    public DateTime SentAt { get; set; } = DateTime.Now;
}