using Backend.Migrations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
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
public class AddEpisodeAudioRequest{

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

    public string? ReleaseDate { get; set;}

    [Range(0.0, Double.MaxValue, ErrorMessage = "Time must be a positive number")]
    public float? MinEpisodeLength { get; set;}

}
