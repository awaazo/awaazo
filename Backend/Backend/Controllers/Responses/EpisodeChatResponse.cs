using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Responses;

/// <summary>
/// Response for an episode chat.
/// </summary>
public class EpisodeChatResponse
{
    public EpisodeChatResponse(List<EpisodeChatMessage> chats, User user, Guid episodeId, string domainUrl)
    {
        EpisodeId = episodeId;
        UserId = user.Id;

        foreach (EpisodeChatMessage chat in chats)
        {
            Messages.Add(new EpisodeChatMessageResponse(chat,user, domainUrl));
        }

        Messages.Sort((x, y) => x.SentAt.CompareTo(y.SentAt));
    }

    public Guid EpisodeId { get; set; } = Guid.Empty;
    public Guid UserId { get; set; } = Guid.Empty;
    public List<EpisodeChatMessageResponse> Messages { get; set; } = new List<EpisodeChatMessageResponse>();
}

[BindProperties]
public class EpisodeChatMessageResponse
{
    public EpisodeChatMessageResponse(EpisodeChatMessage chat, User user, string domainUrl)
    {
        Id = chat.Id;
        UserId = chat.UserId;
        EpisodeId = chat.EpisodeId;
        Message = chat.Message;
        IsPrompt = chat.IsPrompt;
        Username = user.Username;
        if (!user.Avatar.Contains("google"))
            AvatarUrl = string.Format("{0}profile/{1}/avatar", domainUrl, user.Id);
        else
            AvatarUrl = user.Avatar;
    }

    [Required]
    public Guid Id { get; set; } = Guid.Empty;

    [Required]
    public Guid UserId { get; set; } = Guid.Empty;

    [Required]
    public Guid EpisodeId { get; set; } = Guid.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;

    [Required]
    public bool IsPrompt { get; set; } = false;

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string AvatarUrl { get; set; } = string.Empty;

    [Required]
    public DateTime SentAt { get; set; } = DateTime.Now;
}