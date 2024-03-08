using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;
using Microsoft.Extensions.FileProviders.Physical;

namespace Backend.Services.Interfaces;
public interface IPodcastService
{
    // PODCASTS
    public Task<bool> CreatePodcastAsync(CreatePodcastRequest request, User user);
    public Task<bool> EditPodcastAsync(EditPodcastRequest request, User user);
    public Task<bool> DeletePodcastAsync(Guid podcastId, User user);
    public Task<string> GetPodcastCoverArtNameAsync(Guid podcastId);
    public Task<List<PodcastResponse>> GetAllPodcastsAsync(int page, int pageSize, string domainUrl);
    public Task<PodcastResponse> GetPodcastByIdAsync(string domainUrl, Guid podcastId);
    public Task<List<PodcastResponse>> GetUserPodcastsAsync(int page, int pageSize, string domainUrl, User user);
    public Task<List<PodcastResponse>> GetUserPodcastsAsync(int page, int pageSize, string domainUrl, Guid userId);
    public Task<List<PodcastResponse>> GetSearchPodcastsAsync(int page, int pageSize, string domainUrl, PodcastFilter filter);
    public Task<List<PodcastResponse>> GetPodcastsByTagsAsync(int page, int pageSize, string domainUrl, string[] tags);
    public Task<List<PodcastResponse>> GetRecentPodcasts(int page, int pageSize, string domainUrl);

    

    // EPISODES

    public Task<Guid> CreateEpisodeAsync(CreateEpisodeRequest request, Guid podcastId, User user);
    public Task<bool> EditEpisodeAsync(EditEpisodeRequest request, Guid podcastId, User user);
    public Task<bool> AddEpisodeAudioAsync(AddEpisodeAudioRequest request, Guid episodeId, User user);
    public Task<bool> DeleteEpisodeAsync(Guid episodeId, User user);
    public Task<EpisodeResponse> GetEpisodeByIdAsync(Guid episodeId, string domainUrl);
    public Task<string> GetEpisodeAudioNameAsync(Guid episodeId);
    public Task<string> GetEpisodeThumbnailNameAsync(Guid episodeId);
    public Task<bool> SaveWatchHistory(User user, Guid episodeId, double listenPosition);
    public Task<ListenPositionResponse> GetWatchHistory(User user, Guid episodeId);
    public Task<AdjecentEpisodeResponse> GetAdjecentEpisodeAsync(Guid episodeId);
    public Task<PodcastMetricsResponse> GetMetrics(User user, Guid podcastId, string domainUrl);
    public Task<List<EpisodeResponse>> SearchEpisodeAsync(int page, int pageSize,EpisodeFilter episodeFilter,string domainUrl);
    public Task<List<EpisodeResponse>> GetRecentEpisodes(int page, int pageSize, string domainUrl);
    public Task<List<History>> GetUserWatchHistory (int page,int pageSize,User user);
    public Task<bool> DeleteWatchHistory(User user,Guid episodeId);



    // TRANSCRIPT
    public Task<EpisodeTranscriptResponse> GetEpisodeTranscriptAsync(Guid episodeId, float? seekTime, bool includeWords);
    public Task<EpisodeTranscriptTextResponse> GetEpisodeTranscriptTextAsync(Guid episodeId);
    public Task<bool> EditEpisodeTranscriptLinesAsync(User user,Guid episodeId, TranscriptLineResponse[] lines);
    public Task<bool> GenerateEpisodeTranscriptAsync(Guid episodeId, User user);


    // EPISODE CHAT
    public Task<EpisodeChatResponse> GetEpisodeChatAsync(int page, int pageSize, Guid episodeId, User user, string domainUrl);
    public Task<EpisodeChatMessageResponse> PromptEpisodeChatAsync(Guid episodeId, User user, string prompt, string domainUrl);

}