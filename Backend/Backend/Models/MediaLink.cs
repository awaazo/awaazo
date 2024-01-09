using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class MediaLink : BaseEntity
{
    public MediaLink() 
    { 
        Url = string.Empty;
    }

    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Annotation Annotation { get; set; } = null!;

    public Guid AnnotationId { get; set; } = Guid.Empty;

    public PlatformType Platform { get; set; } = PlatformType.Other;

    public string Url { get; set; } = string.Empty;
    
    public enum PlatformType
    {
        YouTube, Spotify, AppleMusic, Other
    }

    public static PlatformType getPlatformType(string platform)
    {
        platform = platform.ToLower();
        switch (platform)
        {
            case "youtube": return PlatformType.YouTube;
            case "spotify": return PlatformType.Spotify;
            case "applemusic": return PlatformType.AppleMusic;
            default: return PlatformType.Other;
        }
    }

    public static string getPlatformString(PlatformType platformType)
    {
        switch (platformType)
        {
            case PlatformType.YouTube: return "Youtube";
            case PlatformType.Spotify: return "Spotify";
            case PlatformType.AppleMusic: return "Apple Music";
            case PlatformType.Other: return "Other";
            default: return "Other";
        }

    }


}