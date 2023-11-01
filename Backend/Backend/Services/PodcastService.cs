using AutoMapper;
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
        private readonly IMapper _mapper;
        private readonly List<string> AllowedTypes = new List<string> { "image/bmp", "image/jpeg", "image/x-png", "image/png"};
        public PodcastService(AppDbContext db,IFileService fileService,IAuthService authService,IMapper mapper) {
            _db = db;
            _fileService = fileService;
            _authService = authService;
            _mapper = mapper;
        }



        public async Task<GetPodcastRequest?> CreatePodcast(CreatePodcastRequest createPodcastRequest,HttpContext httpContext)
        {


            if (createPodcastRequest.coverImage != null && !AllowedTypes.Contains(createPodcastRequest.coverImage!.ContentType))
            {
                throw new InvalidDataException("Invalid Data Types");

            }
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


        public async Task<List<GetPodcastResponse>> GetMyPodcast(HttpContext httpContext)
        {
           User? user = await  _authService.IdentifyUserAsync(httpContext);
            if(user != null)
            {
                List<Podcast> podcasts = await _db.Podcasts!.Include(u => u.Episodes).Where(u => u.PodcasterId == user.Id).ToListAsync();
 
                List<GetPodcastResponse> response = new List<GetPodcastResponse>();
                foreach(var podcast in podcasts)
                {
                    response.Add(new GetPodcastResponse()
                    {
                        Id = podcast.Id,
                        Name = podcast.Name,
                        Description = podcast.Description,
                        CoverId = podcast.CoverId,
                        Tags = podcast.Tags,
                        IsExplicit = podcast.IsExplicit,
                        Type = podcast.Type,
                        AverageRating = podcast.AverageRating,
                        TotalRatings = podcast.TotalRatings,
                        NoOfEpisode = podcast.Episodes.Count,

                    });

                }

                return response;
                
      


            }
            else
            {
                throw new Exception("Not found");

            }

        }



    }
}
