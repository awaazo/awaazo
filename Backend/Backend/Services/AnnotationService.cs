using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Backend.Models.Annotation;
using static Backend.Models.MediaLink;

namespace Backend.Services
{
    public class AnnotationService : IAnnotationService
    {
        private readonly AppDbContext _db;
        public AnnotationService(AppDbContext db) { 
            _db = db;
        }


        /// <summary>
        /// Create Link and Info Annotations
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="episodeId"></param>
        /// <param name="annotationRequest"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>

        public async Task<bool> AddAnnotationToEpisodeAsync(Guid userId, Guid episodeId, GeneralAnnotationRequest annotationRequest)
        {
           // Check if Episode Exist or Not
            Episode epsiode = await _db.Episodes.Include(u => u.Podcast).FirstOrDefaultAsync(u => u.Id == episodeId) ?? throw new Exception("Episode Does Not Exist");
           
           // Check if Podcast Owner is same as the logged In user
           if (epsiode.Podcast.PodcasterId != userId)
           {
                throw new Exception("Not authourized to Add Annotation");
           }
           
           // Check if Time stamp is not more then the duration of episode
           if (annotationRequest.Timestamp > epsiode.Duration)
            {
                throw new Exception("Not a valid Timestamp");
            }

           // Check if other Annotation Exist at the same time in the episode
           if(await _db.Annotations.AnyAsync(u => u.EpisodeId == episodeId && u.Timestamp == annotationRequest.Timestamp) == true)
            {
                throw new Exception("Other annotation Exist on the same timestamp");

           }
           // Check if the Annotation Type Inputted is Link or Info
            AnnotationType annotationType = GetAnnotationType(annotationRequest.AnnotationType);
         
           if (annotationType != AnnotationType.Info &&  annotationType != AnnotationType.Link)
           {
                // If not then throw an error to inform the user the other controller
                throw new Exception("Use other controller to create Media-link and Sponsership Annotation");
           }
           // Save to the database
            await _db.Annotations.AddAsync(new Annotation() { EpisodeId = episodeId, Timestamp = annotationRequest.Timestamp, Content = annotationRequest.Content,Type = annotationType });
            
            // Return a boolean
            return await _db.SaveChangesAsync() > 0;
        }

       /// <summary>
       /// Saves Media Link Annotation to the database
       /// </summary>
       /// <param name="userId"></param>
       /// <param name="episodeId"></param>
       /// <param name="annotationRequest"></param>
       /// <returns></returns>
       /// <exception cref="Exception"></exception>
        public async Task<bool> AddMediaAnnotationToEpisodeAsync(Guid userId, Guid episodeId, MediaLinkAnnotationRequest annotationRequest)
        {
            // Check if Episode Exist or Not
            Episode epsiode = await _db.Episodes.Include(u => u.Podcast).FirstOrDefaultAsync(u => u.Id == episodeId) ?? throw new Exception("Episode Does Not Exist");

            // Check if Podcast Owner is same as the logged In user
            if (epsiode.Podcast.PodcasterId != userId)
            {
                throw new Exception("Not authourized to Add Annotation");
            }

            // Check if Time stamp is not more then the duration of episode
            if (annotationRequest.Timestamp > epsiode.Duration)
            {
                throw new Exception("Not a valid Timestamp");
            }

            // Check if other Annotation Exist at the same time in the episode
            if (await _db.Annotations.AnyAsync(u => u.EpisodeId == episodeId && u.Timestamp == annotationRequest.Timestamp) == true)
            {
                throw new Exception("Other annotation Exist on the same timestamp");

            }

            // Save the new Annotation
            Guid AnnotationGuid = Guid.NewGuid();
            Annotation annotation = new Annotation()
            {
                Id = AnnotationGuid,
                EpisodeId = episodeId,
                Timestamp = annotationRequest.Timestamp,
                Content = annotationRequest.Content,
                Type = AnnotationType.MediaLink
            };

            await _db.Annotations.AddAsync(annotation);

            // Save the Media Link
            MediaLink mediaLink = new MediaLink()
            {
                AnnotationId = AnnotationGuid,
                Platform = getPlatformType(annotationRequest.PlatformType),
                Url = annotationRequest.Url,

            };

            await _db.MediaLinks.AddAsync(mediaLink);

            return await _db.SaveChangesAsync() > 0;
        }

        /// <summary>
        /// Create Sponsership Annotation 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="episodeId"></param>
        /// <param name="annotationRequest"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> AddSponsershipAnnotationToEpisodeAsync(Guid userId, Guid episodeId, SponsershipAnnotationRequest annotationRequest)
        {

            // Check if Episode Exist or Not
            Episode epsiode = await _db.Episodes.Include(u => u.Podcast).FirstOrDefaultAsync(u => u.Id == episodeId) ?? throw new Exception("Episode Does Not Exist");

            // Check if Podcast Owner is same as the logged In user
            if (epsiode.Podcast.PodcasterId != userId)
            {
                throw new Exception("Not authourized to Add Annotation");
            }

            // Check if Time stamp is not more then the duration of episode
            if (annotationRequest.Timestamp > epsiode.Duration)
            {
                throw new Exception("Not a valid Timestamp");
            }

            // Check if other Annotation Exist at the same time in the episode
            if (await _db.Annotations.AnyAsync(u => u.EpisodeId == episodeId && u.Timestamp == annotationRequest.Timestamp) == true)
            {
                throw new Exception("Other annotation Exist on the same timestamp");

            }

            // Save the new Annotation
            Guid AnnotationGuid = Guid.NewGuid();
            Annotation annotation = new Annotation()
            {
                Id = AnnotationGuid,
                EpisodeId = episodeId,
                Timestamp = annotationRequest.Timestamp,
                Content = annotationRequest.Content,
                Type = AnnotationType.Sponsorship
            };

            await _db.Annotations.AddAsync(annotation);

            // Save the Sponser details to the DB
            Sponsor sponsor = new Sponsor()
            {
                AnnotationId = AnnotationGuid,
                Name = annotationRequest.Name,
                Website = annotationRequest.Website
            };
            await _db.Sponsors.AddAsync(sponsor);

            return await _db.SaveChangesAsync() > 0;

        }
        /// <summary>
        /// Fetches Annotation for Each episode
        /// </summary>
        /// <param name="episodeId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<List<AnnotationResponse>> GetEpisodeAnnotationAsync(Guid episodeId)
        {
            // Check if Episode Exist or Not
            Episode epsiode = await _db.Episodes.Include(u => u.Podcast).FirstOrDefaultAsync(u => u.Id == episodeId) ?? throw new Exception("Episode Does Not Exist");

            // Fetch Annotation for the Episode
            List<AnnotationResponse> annotation = await _db.Annotations.Include(u => u.MediaLink).Include(u => u.Sponsorship).Where(u => u.EpisodeId == episodeId).Select(u => new AnnotationResponse(u)).ToListAsync();

            // Return the list
            return annotation;
        }
        /// <summary>
        /// Delete the Annotation
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="annotationId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> DeleteAnnotationAsync(Guid userId,Guid annotationId)
        {
            // Check if annotation Exist
            Annotation annotation = await _db.Annotations.Include(u => u.Episode).ThenInclude(e => e.Podcast).FirstOrDefaultAsync(u => u.Id == annotationId) ?? throw new Exception("Annotation Does Not exist");

            // Check if the logged In user is the owner of the podcast

            if(annotation.Episode.Podcast.PodcasterId != userId)
            {
                throw new Exception("Not Authorized to Delete the Annotation");

            }
            // Delete the Annotation
            _db.Annotations.Remove(annotation);

            return await _db.SaveChangesAsync() > 0;
        }

    }


}
