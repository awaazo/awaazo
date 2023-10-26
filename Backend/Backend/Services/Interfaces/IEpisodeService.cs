using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IEpisodeService
    {
        public Task<Episode?> AddEpisode(CreateEpisodeRequest createEpisodeRequest, Podcast podcast, HttpContext httpContext);

        public Task<bool> DeleteEpisode(Episode episode, DeleteEpisodeRequest deleteEpisodeRequest);

    }
}
