using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ISectionService
    {
        public Task<bool> AddSectionAsync(Guid EpisodeId, Guid userId,SectionRequest sectionRequest);
        public Task<List<EpisodeSections>> GetSectionsAsync(Guid EpisodeId);
        public Task<bool> DeleteSectionAsync(Guid sectionId, Guid userId);
    }
}
