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
    public Task<List<PodcastResponse>> GetSearchPodcastsAsync(int page, int pageSize, string domainUrl, string searchTerm);
    public Task<List<PodcastResponse>> GetPodcastsByTagsAsync(int page, int pageSize, string domainUrl, string[] tags);

    // EPISODES

    public Task<bool> CreateEpisodeAsync(CreateEpisodeRequest request, Guid podcastId, User user);
    public Task<bool> EditEpisodeAsync(EditEpisodeRequest request, Guid podcastId, User user);
    public Task<bool> DeleteEpisodeAsync(Guid episodeId, User user);
    public Task<EpisodeResponse> GetEpisodeByIdAsync(Guid episodeId, string domainUrl);
    public Task<string> GetEpisodeAudioNameAsync(Guid episodeId);
    public Task<string> GetEpisodeThumbnailNameAsync(Guid episodeId);
    public Task<UserEpisodeInteraction?> GetUserEpisodeInteraction(User user, Guid episodeId);
    public Task<UserEpisodeInteraction> SaveWatchHistory(User user, Guid episodeId, double listenPosition, string domain);
}