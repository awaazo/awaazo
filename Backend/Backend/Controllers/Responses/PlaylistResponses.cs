using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Responses;

[BindProperties]
public class PlaylistInfoResponse
{
    public const string DEFAULT_PLAYLIST_URL = "https://icons8.com/icon/24520/playlist";

    public PlaylistInfoResponse(Playlist p, string domainUrl)
    {
        Id = p.Id;
        User = new UserMenuInfoResponse(p.User, domainUrl);
        Name = p.Name;
        Description = p.Description;
        Privacy = p.GetPrivacyString();
        IsHandledByUser = p.IsHandledByUser;
        NumberOfEpisodes = p.PlaylistEpisodes.Count;

        if(p.CoverArt == "default")
        {
            CoverArt = DEFAULT_PLAYLIST_URL;
        }
        else
        {
            CoverArt = domainUrl + string.Format("playlist/{0}/getCoverArt", p.Id);
        }


        Duration = p.PlaylistEpisodes
            .Sum(e=>e.Episode.Duration);
        
        CreatedAt = p.CreatedAt;
        UpdatedAt = p.UpdatedAt;
    }

    public Guid Id { get; set; } = Guid.Empty;

    public UserMenuInfoResponse User {get;set;} = new();

    public string Name {get;set;} = string.Empty;
    public string Description {get;set;} = string.Empty;

    public string Privacy {get;set;} = string.Empty;

    public bool IsHandledByUser {get;set;} = true;

    public int NumberOfEpisodes {get;set;} = 0;

    public double Duration {get;set;} = 0;

    public DateTime CreatedAt {get;set;} = DateTime.Now;

    public DateTime UpdatedAt {get;set;} = DateTime.Now;

    public string CoverArt { get;set;} = string.Empty;
}

[BindProperties]
public class PlaylistResponse : PlaylistInfoResponse
{
    public PlaylistResponse(Playlist p, string domainUrl) : base(p, domainUrl)
    {
        PlaylistEpisodes = p.PlaylistEpisodes
            .Select(e=>new EpisodeResponse(e.Episode, domainUrl))
            .ToList();
    }

    public List<EpisodeResponse> PlaylistEpisodes {get;set;} = new();
}