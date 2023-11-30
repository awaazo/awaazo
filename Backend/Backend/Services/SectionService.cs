using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class SectionService : ISectionService
    {
        private readonly AppDbContext _db;
        
        public SectionService(AppDbContext db)
        {
            _db = db;
           
        }

        /// <summary>
        /// Deletes Section
        /// </summary>
        /// <param name="sectionId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> DeleteSectionAsync(Guid sectionId,Guid userId)
        {
            EpisodeSections? episodeSections = await _db.EpisodeSections.Include(u => u.Episode).ThenInclude(u => u.Podcast).FirstOrDefaultAsync(u => u.Id == sectionId);
            // Check If Section Exist
            if(episodeSections == null)
            {
                throw new Exception("Not Valid Section Id");
            }
            // Check if Owner of Podcast is the logged in user
            if(episodeSections.Episode.Podcast.PodcasterId != userId)
            {
                throw new Exception("Not allowed to Delete the section");

            }
            _db.EpisodeSections.Remove(episodeSections);
            return await _db.SaveChangesAsync() > 0;

        }
        /// <summary>
        /// Get Section in ascending Order
        /// </summary>
        /// <param name="EpisodeId"></param>
        /// <returns></returns>
        public async Task<List<EpisodeSections>> GetSectionsAsync(Guid EpisodeId)
        {
            return await _db.EpisodeSections.Where(u => u.EpisodeId == EpisodeId).OrderBy(u => u.Start).ToListAsync();   
        }


        /// <summary>
        /// Adds Section to an Episode
        /// </summary>
        /// <param name="EpisodeId"></param>
        /// <param name="userId"></param>
        /// <param name="sectionRequest"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> AddSectionAsync(Guid EpisodeId,Guid userId,SectionRequest sectionRequest)
        {

            Episode? episode = await _db.Episodes.Include(u => u.Podcast).FirstOrDefaultAsync(u => u.Id == EpisodeId);

            //Verify If Epside Exist
            if (episode == null)
            {
                throw new Exception("Episode Does not Exist");
            }
            //Check if user is owner of the Podcast
            if(episode.Podcast.PodcasterId != userId)
            {
                throw new Exception("You need to be owner of the podcast");

            }

            //Check if start value is not greater then the End value
            if (sectionRequest.Start >= sectionRequest.End)
            {
                throw new Exception("Start Value Should always be greater then End value");
            }
            //Check if Start and End value is in Range of Podcast duration
            if (sectionRequest.Start > episode.Duration || sectionRequest.End > episode.Duration)
            {
                throw new Exception("The time is out of range");
            }
            //Check if other sections Exist in same range
            List<EpisodeSections> episodeSections = await _db.EpisodeSections.Where(u => u.EpisodeId == EpisodeId).ToListAsync();
            foreach (EpisodeSections episodeSection in episodeSections)
            {
                // Check if any other section Exist

                if (sectionRequest.Start >= episodeSection.Start && sectionRequest.Start < episodeSection.End)
                {
                    throw new Exception("Other section Exist in this Range");

                }
                if (sectionRequest.End > episodeSection.Start && sectionRequest.End <= episodeSection.End)
                {
                    throw new Exception("Other section Exist in this range");
                }

            }

            await _db.EpisodeSections.AddAsync(new EpisodeSections() { EpisodeId = EpisodeId,Start = sectionRequest.Start,End = sectionRequest.End,Title = sectionRequest.Title});

            //Return True if all the checks have passed
            return await _db.SaveChangesAsync() > 0;
        }


    }
}
