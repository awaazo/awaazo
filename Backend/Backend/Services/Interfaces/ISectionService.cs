using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ISectionService
    {
        public Task<bool> AddSection(Guid EpisodeId, Guid userId,SectionRequest sectionRequest);
        public Task<List<EpisodeSections>> GetSections(Guid EpisodeId);
        public Task<bool> DeleteSection(Guid sectionId, Guid userId);
    }
}
