using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;
using Microsoft.Extensions.FileProviders.Physical;

namespace Backend.Services.Interfaces
{
    public interface IPodcastService
    {


        // PODCASTS
        public Task<bool> CreatePodcastAsync(CreatePodcastRequest request, User user);
        public Task<bool> EditPodcastAsync(EditPodcastRequest request, User user);
        public Task<bool> DeletePodcastAsync(Guid podcastId, User user);
        public Task<string> GetPodcastCoverArtNameAsync(Guid podcastId);
        public Task<PodcastResponse> GetPodcastResponseAsync(Podcast podcast, string baseUrl);
        public Task<List<Podcast>> GetAllPodcastAsync();
        public Task<Podcast> GetPodcastByIdAsync(Guid podcastId, string baseUrl);

        // EPISODES

        public Task<bool> CreateEpisodeAsync(CreateEpisodeRequest request, Guid podcastId, User user);
        public Task<bool> EditEpisodeAsync(EditEpisodeRequest request, Guid podcastId, User user);
        public Task<bool> DeleteEpisodeAsync(Guid episodeId, User user);
        public Task<EpisodeResponse> GetEpisodeByIdAsync(Guid episodeId, string baseUrl);
        public Task<EpisodeResponse> GetEpisodeResponseAsync(Episode episode, string baseUrl);
        public Task<string> GetEpisodeAudioNameAsync(Guid episodeId);
        public Task<string> GetEpisodeThumbnailNameAsync(Guid episodeId);
    }
}
