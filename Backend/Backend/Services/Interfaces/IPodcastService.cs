using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IPodcastService
    {
        public Task<bool> CreatePodcastAsync(CreatePodcastRequest request, User user);
        
        public Task<bool> EditPodcastAsync(EditPodcastRequest request, User user);

        public Task<bool> DeletePodcastAsync(Guid podcastId, User user);

        // public Task<Podcast?> GetPodcast(string id);

        // public Task<List<GetPodcastResponse>> GetMyPodcast(HttpContext httpContext);


        public Task<Podcast> GetPodcastResponse(Podcast podcast);

        public Task<List<Podcast>> GetAllPodcastAsync();



        public Task<bool> CreateEpisodeAsync(CreateEpisodeRequest request, Guid podcastId, User user);

        public Task<bool> EditEpisodeAsync(EditEpisodeRequest request, Guid podcastId, User user);

        public Task<bool> DeleteEpisodeAsync(Guid episodeId, Guid podcastId, User user);
    }
}
