using Backend.Controllers.Requests;
using Backend.Controllers.Responses;

namespace Backend.Services.Interfaces
{
    public interface IAnnotationService
    {
        public Task<bool> AddAnnotationToEpisodeAsync(Guid userId, Guid episodeId, GeneralAnnotationRequest annotationRequest);

        public Task<bool> AddMediaAnnotationToEpisodeAsync(Guid userId, Guid episodeId, MediaLinkAnnotationRequest annotationRequest);

        public Task<bool> AddSponsershipAnnotationToEpisodeAsync(Guid userId, Guid episodeId, SponsershipAnnotationRequest annotationRequest);

        public Task<List<AnnotationResponse>> GetEpisodeAnnotationAsync(Guid episodeId);

        public Task<bool> DeleteAnnotationAsync(Guid userId, Guid annotationId);
    }
}
