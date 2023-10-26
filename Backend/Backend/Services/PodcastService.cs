using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class PodcastService : IPodcastService
    {
        private readonly AppDbContext _db;
        private readonly IFileService _fileService;
        private readonly IAuthService _authService;
        public PodcastService(AppDbContext db,IFileService fileService,IAuthService authService) {
            _db = db;
            _fileService = fileService;
            _authService = authService;
        }



        public async Task<GetPodcastRequest?> CreatePodcast(CreatePodcastRequest createPodcastRequest,HttpContext httpContext)
        {
            User? user = await _authService.IdentifyUserAsync(httpContext);
            if (user == null)
                return null;
            
            Podcast? podcast = new Podcast();
            podcast.PodcasterId = user.Id;
            if(createPodcastRequest.coverImage != null)
            {
                
                Files? coverImage = await _fileService.UploadFile(createPodcastRequest.coverImage);
                if(coverImage == null) return null;
                else { podcast.CoverId = coverImage.FileId; }
            }
            if (createPodcastRequest.Tags != null)
            {
                podcast.Tags = createPodcastRequest.Tags;

            }
            if(createPodcastRequest.Description != null)
            {
                podcast.Description = createPodcastRequest.Description;
            }
            podcast.Name = createPodcastRequest.Name!;

            


            await _db.Podcasts!.AddAsync(podcast);
            await _db.SaveChangesAsync();

            GetPodcastRequest getPodcastRequest = new GetPodcastRequest()
            {
                Id = podcast.Id.ToString(),
                Name = podcast.Name,
                Description = podcast.Description,
                Tags = podcast.Tags,
                coverImage = podcast.Cover

            };


            return getPodcastRequest;
         
        }

        public async Task<Podcast?> GetPodcast(string id)
        {
            if(id == null)
            {
                return null;
            }
            else
            {
                var podcastId = Guid.Parse(id);
                return await _db.Podcasts!.Include(u => u.Cover).Include(u =>u.Episodes).FirstOrDefaultAsync(u => u.Id == podcastId);
        
            }
        }




    }
}
