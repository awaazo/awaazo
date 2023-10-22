using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IPodcastService
    {
        public Task<Podcast?> CreatePodcast(CreatePodcastRequest createPodcastRequest,HttpContext httpContext);
    }
}
