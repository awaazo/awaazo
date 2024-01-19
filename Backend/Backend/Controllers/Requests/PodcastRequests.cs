using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
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
}

[BindProperties]
public class EditEpisodeRequest : CreateEpisodeRequest
{
    public new IFormFile? AudioFile { get; set; }

    public new IFormFile? Thumbnail { get; set; }
}

[BindProperties]
public class EpisodeHistorySaveRequest
{
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
