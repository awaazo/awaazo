using System.Data;
using Backend.Infrastructure;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Backend.Controllers.Responses;

[BindProperties]
public class EpisodeResponse
{

    public EpisodeResponse(Episode e,string domainUrl)
    {
        //Episode = e;
        Id = e.Id;
        PodcastId = e.PodcastId;
        EpisodeName = e.EpisodeName;
        Description = e.Description;
        Duration = e.Duration;
        ReleaseDate = e.ReleaseDate;
        IsExplicit = e.IsExplicit;
        PlayCount = e.PlayCount;
        AudioUrl = domainUrl + string.Format("podcast/{0}/{1}/getAudio", e.PodcastId, e.Id);
        ThumbnailUrl = domainUrl + string.Format("podcast/{0}/{1}/getThumbnail", e.PodcastId, e.Id);
        Likes = e.Likes.Count;
        Comments = e.Comments.Select(c => new CommentResponse(c, domainUrl)).ToList();
        PodcastName = e.Podcast.Name;

    }

    public Guid Id { get; set; } = Guid.Empty;
    public Guid PodcastId { get; set; } = Guid.Empty;
    public string EpisodeName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Duration { get; set; } = 0;
    public DateTime ReleaseDate { get; set; } = DateTime.Now;
    public bool IsExplicit { get; set; } = true;
    public ulong PlayCount { get; set; } = 0;
    public string AudioUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public int Likes { get; set; } = 0;
    
    public List<CommentResponse> Comments { get; set; } = new();

    public string PodcastName { get; set; } = string.Empty;
}


[BindProperties]
public class PodcastResponse
{
    public PodcastResponse(Podcast p, string domainUrl)
    {
        Id = p.Id;
        Name = p.Name;
        Description = p.Description;
        CoverArtUrl = domainUrl + string.Format("podcast/{0}/getCoverArt", p.Id);
        Tags = p.Tags;
        IsExplicit = p.IsExplicit;
        Type = p.GetPodcastTypeString();
        PodcasterId = p.PodcasterId;
        Episodes = p.Episodes.Select(e => new EpisodeResponse(e, domainUrl)).ToList();
        Ratings = p.Ratings.Select(r => new RatingResponse(r, domainUrl)).ToList();
        TotalRatings = (ulong)Ratings.Where(r => r.Rating != 0).Count();
        if (TotalRatings > 0)
            AverageRating = (float)Ratings.Where(r => r.Rating != 0).Average(r => r.Rating);
    }

    public Guid Id { get; set; } = Guid.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverArtUrl { get; set; } = string.Empty;
    public Guid PodcasterId { get; set; } = Guid.Empty;
    public string[] Tags { get; set; } = Array.Empty<string>();
    public bool IsExplicit { get; set; } = true;
    public string Type { get; set; } = string.Empty;
    public List<EpisodeResponse> Episodes { get; set; } = new List<EpisodeResponse>();
    public float AverageRating { get; set; } = 0;
    public ulong TotalRatings { get; set; } = 0;
    public List<RatingResponse> Ratings { get; set; } = new List<RatingResponse>();
}

/// <summary>
/// Response for a transcript word.
/// </summary>
[BindProperties]
public class TranscriptWordResponse
{
    /// <summary>
    /// Gets or sets the start time of the transcript word.
    /// </summary>
    public float Start { get; set; } = 0;

    /// <summary>
    /// Gets or sets the end time of the transcript word.
    /// </summary>
    public float End { get; set; } = 0;

    /// <summary>
    /// Gets or sets the word in the transcript.
    /// </summary>
    public string Word { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the score of the transcript word.
    /// </summary>
    public float Score { get; set; } = 0;

    /// <summary>
    /// Gets or sets the speaker of the transcript word.
    /// </summary>
    public string Speaker { get; set; } = string.Empty;
}

/// <summary>
/// Response for a transcript line.
/// </summary>
[BindProperties]
public class TranscriptLineResponse
{
    /// <summary>
    /// Gets or sets the ID of the transcript line.
    /// </summary>
    public int Id { get; set; } = 0;

    /// <summary>
    /// Gets or sets the seek value of the transcript line.
    /// </summary>
    public float Seek { get; set; } = 0;

    /// <summary>
    /// Gets or sets the start time of the transcript line.
    /// </summary>
    public float Start { get; set; } = 0;

    /// <summary>
    /// Gets or sets the end time of the transcript line.
    /// </summary>
    public float End { get; set; } = 0;

    /// <summary>
    /// Gets or sets the text of the transcript line.
    /// </summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the list of words in the transcript line.
    /// </summary>
    public List<TranscriptWordResponse> Words { get; set; } = new List<TranscriptWordResponse>();

    /// <summary>
    /// Gets or sets the speaker of the transcript line.
    /// </summary>
    public string Speaker { get; set; } = string.Empty;
}

/// <summary>
/// Response for a transcript.
/// </summary>
[BindProperties]
public class EpisodeTranscriptResponse
{
    /// <summary>
    /// Gets or sets the ID of the episode.
    /// </summary>
    public Guid EpisodeId { get; set; } = Guid.Empty;

    /// <summary>
    /// Gets or sets the status of the transcript.
    /// </summary>
    public string Status { get; set; } = "Ready";

    /// <summary>
    /// Gets or sets the list of transcript lines.
    /// </summary>
    public List<TranscriptLineResponse> Lines { get; set; } = new List<TranscriptLineResponse>();
}

[BindProperties]
public class AdjecentEpisodeResponse
{
    public Guid? Next { get; set; }
    public Guid? Previous { get; set; }

}