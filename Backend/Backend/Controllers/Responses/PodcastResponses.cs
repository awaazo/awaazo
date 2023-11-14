using System.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Backend.Controllers.Responses;

[BindProperties]
public class EpisodeResponse
{

    public EpisodeResponse(Episode e, string domainUrl)
    {
        //Episode = e;
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
        Likes= e.Likes.Count;
        Comments=e.Comments.Select(c => new CommentResponse(c,domainUrl)).ToList();
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
    public int Likes {get;set;} = 0;
    public List<CommentResponse> Comments { get; set; } = new();
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
        Ratings = p.Ratings.Select(r => new RatingResponse(r,domainUrl)).ToList();
        TotalRatings = (ulong) Ratings.Where(r=>r.Rating!=0).Count();
        if(TotalRatings>0)
            AverageRating = (float) Ratings.Where(r=>r.Rating!=0).Average(r=>r.Rating);
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
    public List<RatingResponse> Ratings { get; set; } = new List<RatingResponse>();
}