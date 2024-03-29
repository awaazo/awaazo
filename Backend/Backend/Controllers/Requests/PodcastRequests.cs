using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.ML.Data;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static Backend.Models.Podcast;

namespace Backend.Controllers.Requests;

[BindProperties]
public class CreatePodcastRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string[] Tags { get; set; } = Array.Empty<string>();

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public IFormFile? CoverImage { get; set; }

}

[BindProperties]
public class EditPodcastRequest : CreatePodcastRequest
{
    [Required]
    public Guid Id { get; set; } = Guid.Empty;
    public new IFormFile? CoverImage { get; set; }
}

[BindProperties]
public class CreateEpisodeRequest
{
    [Required]
    public string EpisodeName { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public bool IsExplicit { get; set; } = true;

    [Required]
    public IFormFile? AudioFile { get; set; }

    [Required]
    public IFormFile? Thumbnail { get; set; }

    public bool IsFullEpisode()
    {
        try
        {
            if (AudioFile is null)
                return true;
            else if (!AudioFile.FileName.Contains("<##>"))
                return true;
            else
                return AudioFile!.FileName.Split("<##>")[1].Split('/')[0] == AudioFile!.FileName.Split("<##>")[1].Split('/')[1];
        }
        catch
        {
            return true;
        }
    }
}

[BindProperties]
public class EditEpisodeRequest : CreateEpisodeRequest
{
    public new IFormFile? AudioFile { get; set; }

    public new IFormFile? Thumbnail { get; set; }
}

[BindProperties]
public class GenerateAIEpisodeRequest
{

    /// <summary>
    /// The name of the episode
    /// </summary> 
    [Required]
    public string EpisodeName { get; set; } = string.Empty;

    /// <summary>
    /// The description of the episode
    /// </summary> 
    [Required]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// The prompt for the AI to generate the episode
    /// </summary>
    [Required]
    public string Prompt { get; set; } = string.Empty;

    /// <summary>
    /// Whether to use a female voice or not
    /// </summary>
    [Required]
    public bool IsFemaleVoice { get; set; }

    /// <summary>
    /// Episode thumbnail
    /// </summary>
    [Required]
    public IFormFile? Thumbnail { get; set; }
}


[BindProperties]
public class GenerateAIEpisodeFromTextRequest
{
    /// <summary>
    /// The name of the episode
    /// </summary> 
    [Required]
    public string EpisodeName { get; set; } = string.Empty;

    /// <summary>
    /// The description of the episode
    /// </summary> 
    [Required]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// The text to generate the episode from
    /// </summary>
    [Required]
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Whether to use a female voice or not
    /// </summary>
    [Required]
    public bool IsFemaleVoice { get; set; }

    /// <summary>
    /// Episode thumbnail
    /// </summary>
    [Required]
    public IFormFile? Thumbnail { get; set; }
}

[BindProperties]
public class AddEpisodeAudioRequest
{

    [Required]
    public IFormFile? AudioFile { get; set; }

    public bool IsFullEpisode()
    {
        try
        {
            if (AudioFile is null)
                return true;
            else if (!AudioFile.FileName.Contains("<##>"))
                return true;
            else
                return AudioFile!.FileName.Split("<##>")[1].Split('/')[0] == AudioFile!.FileName.Split("<##>")[1].Split('/')[1];
        }
        catch
        {
            return true;
        }
    }
}

/// <summary>
/// Request to save the current listen position of an episode
/// </summary>
[BindProperties]
public class EpisodeHistorySaveRequest
{
    /// <summary>
    /// The Listen Position in seconds
    /// </summary>
    [Required]
    public double ListenPosition { get; set; }
}


[BindProperties]
public class PodcastFilter
{
    [Required]
    public string SearchTerm { get; set; } = string.Empty;

    public string[]? Tags { get; set; }

    public bool? IsExplicit { get; set; }

    public string? Type { get; set; }

    public float? RatingGreaterThen { get; set; }

    public string? ReleaseDate { get; set; }

}

public class EpisodeFilter
{
    [Required]
    public string SearchTerm { get; set; } = string.Empty;

    public bool? IsExplicit { get; set; }

    public string? ReleaseDate { get; set; }

    [Range(0.0, Double.MaxValue, ErrorMessage = "Time must be a positive number")]
    public float? MinEpisodeLength { get; set; }

}


public class History
{
    public History(UserEpisodeInteraction episodeInteraction)
    {
        EpisodeId = episodeInteraction.EpisodeId;
        HasListened = episodeInteraction.HasListened;
        HasLiked = episodeInteraction.HasLiked;
        Clicks = episodeInteraction.Clicks;
        TotalListenTime = episodeInteraction.TotalListenTime;
        LastListenPosition = episodeInteraction.LastListenPosition;
        DateListened = episodeInteraction.DateListened;
    }
    [Required]
    public Guid EpisodeId { get; set; }

    [DefaultValue(false)]
    public bool HasListened { get; set; }

    [DefaultValue(false)]
    public bool HasLiked { get; set; }

    [DefaultValue(0)]
    public int Clicks { get; set; }

    [DefaultValue("00:00:00")]
    public TimeSpan TotalListenTime { get; set; }

    [DefaultValue(0.0)]
    public double LastListenPosition { get; set; }

    [DefaultValue("01/01/0001 00:00:00")]
    public DateTime DateListened { get; set; }

}

public class EpisodeRating
{
    public EpisodeRating(UserEpisodeInteraction userEpisodeInteraction)
    {
        UserId = userEpisodeInteraction.UserId.ToString();
        EpisodeId = userEpisodeInteraction.EpisodeId.ToString();
        TotalListenTime = (float)userEpisodeInteraction.TotalListenTime.TotalSeconds;

    }
    public EpisodeRating()
    {

    }
    [LoadColumn(0)]
    public string UserId;
    [LoadColumn(1)]
    public string EpisodeId;
    [LoadColumn(2)]
    public float TotalListenTime;
}


public class ModelResult
{
    public float TotalListenTime;
    public float Score;
}


public class PodcastRecommendationInput
{

    [LoadColumn(0)]
    public string UserId;
    [LoadColumn(1)]
    public string PodcastId;
    [LoadColumn(2)]
    public float TotalListenTime;
}

public class LikedPodcasts
{
    public Podcast podcast;
    public int totalLikes;
}

#region Highlight Requests

/// <summary>
/// Basic HighlightRequest
/// </summary>
public class HighlightRequest
{

    public HighlightRequest()
    {
    }

    public HighlightRequest(Highlight highlight)
    {
        StartTime = highlight.StartTime;
        EndTime = highlight.EndTime;
        Title = highlight.Title;
        Description = highlight.Description;
    }

    [DefaultValue(0)]
    public double StartTime { get; set; }

    [DefaultValue(0)]
    public double EndTime { get; set; }

    [DefaultValue("No Title Given")]
    [MaxLength(50)]
    public string Title { get; set; }

    [DefaultValue("")]
    [MaxLength(500)]
    public string Description { get; set; }

}

/// <summary>
/// EditHighlight Request. 
/// </summary>
public class EditHighlightRequest
{
    [DefaultValue("No Title Given")]
    [MaxLength(50)]
    public string? Title { get; set; }

    [DefaultValue("")]
    [MaxLength(500)]
    public string? Description { get; set; }
}

#endregion

