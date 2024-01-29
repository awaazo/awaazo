using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests;

/// <summary>
/// Request for a prompt episode.
/// </summary>
[BindProperties]
public class PromptEpisodeRequest
{
    /// <summary>
    /// The ID of the episode.
    /// </summary>
    [Required]
    public Guid EpisodeId { get; set; } = Guid.Empty;

    /// <summary>
    /// The prompt to be sent.
    /// </summary>
    [Required]
    public string Prompt { get; set; } = string.Empty;
}