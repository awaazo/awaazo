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
        private readonly List<string> AllowedTypes = new List<string> { "image/bmp", "image/jpeg", "image/x-png", "image/png", "image/gif" };
        public PodcastService(AppDbContext db,IFileService fileService,IAuthService authService) {
            _db = db;
            _fileService = fileService;
            _authService = authService;
        }



        public async Task<GetPodcastRequest?> CreatePodcast(CreatePodcastRequest createPodcastRequest,HttpContext httpContext)
        {
            if (createPodcastRequest == null)
                throw new InvalidDataException("Podcast request was missing");

            Podcast podcast = new Podcast();

            // Check if user exists
            User? user = await _authService.IdentifyUserAsync(httpContext);
            if (user == null)
                return null;

            podcast.PodcasterId = user.Id;         

            // image has to exist AND has to contain the wrong type of cover image to throw error here. If it doesnt, just use default
            if (createPodcastRequest.coverImage != null && !AllowedTypes.Contains(createPodcastRequest.coverImage!.ContentType))
            {
                throw new InvalidDataException("Invalid Cover Image data Type: " + createPodcastRequest.coverImage.ContentType.ToString());
            }
                
            if (createPodcastRequest.Tags != null)
                podcast.Tags = createPodcastRequest.Tags;

            if (createPodcastRequest.Description != null)
                podcast.Description = createPodcastRequest.Description;
         
            if(createPodcastRequest.Name != null)
                podcast.Name = createPodcastRequest.Name!;

            if(createPodcastRequest.coverImage != null)
            {                
                Files? coverImage = await _fileService.UploadFile(createPodcastRequest.coverImage);
                podcast.CoverId = coverImage.FileId;
            }                     

            user.IsPodcaster = true;

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
