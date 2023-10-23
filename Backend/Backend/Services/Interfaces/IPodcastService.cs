using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IPodcastService
    {
        public Task<GetPodcastRequest?> CreatePodcast(CreatePodcastRequest createPodcastRequest,HttpContext httpContext);
        public Task<Podcast?> GetPodcast(string id);
    }
}
