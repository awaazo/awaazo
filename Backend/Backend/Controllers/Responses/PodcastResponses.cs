using System.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Responses;

[BindProperties]
public class EpisodeResponse
{

    public EpisodeResponse(Episode e, string domainUrl)
    {
        Id=e.Id;
        PodcastId=e.PodcastId;
        EpisodeName=e.EpisodeName;
        Description=e.Description;
        Duration=e.Duration;
        ReleaseDate=e.ReleaseDate;
        IsExplicit=e.IsExplicit;
        PlayCount=e.PlayCount;
        AudioUrl=domainUrl + string.Format("podcast/{0}/{1}/getAudio", e.PodcastId, e.Id);
        ThumbnailUrl=domainUrl + string.Format("podcast/{0}/{1}/getThumbnail", e.PodcastId, e.Id);
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
        AverageRating = p.AverageRating;
        TotalRatings = p.TotalRatings;
        Type = p.GetPodcastTypeString();
        PodcasterId = p.PodcasterId;
        Episodes = p.Episodes.Select(e => new EpisodeResponse(e, domainUrl)).ToList();
    }

    public Guid Id { get; set; } = Guid.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverArtUrl { get; set; } = string.Empty;
    public Guid PodcasterId {get;set;} = Guid.Empty;
    public string[] Tags { get; set; } = Array.Empty<string>();
    public bool IsExplicit { get; set; } = true;
    public string Type { get; set; } = string.Empty;
    public List<EpisodeResponse> Episodes { get;  set; } = new List<EpisodeResponse>();
    public float AverageRating { get; set; } = 0;
    public ulong TotalRatings { get; set; } = 0;
}