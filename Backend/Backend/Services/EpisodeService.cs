using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class EpisodeService : IEpisodeService
    {
        private readonly FileService _fileService;
        private readonly AppDbContext _db;
        private readonly AuthService _authService;
        private readonly string[] allowedType = new string[] {""};

        public EpisodeService(FileService fileService,AuthService authService,AppDbContext db) {
            _fileService = fileService;
            _db = db;
            _authService = authService;

        }


        //public async Task<Episode?> AddEpisode(CreateEpisodeRequest createEpisodeRequest,HttpContext httpContext)
        //{
        //    User? user = await _authService.IdentifyUserAsync(httpContext);
        //    if(user != null)
        //    {
        //        if(createEpisodeRequest.PodcastId != null)
        //        {
        //            Guid id = Guid.Parse(createEpisodeRequest.PodcastId);
        //           Podcast? podcast = await _db.Podcasts!.FirstOrDefaultAsync(u => u.PodcasterId == id);
                        

        //        }
        //        //TODO : File Validation
        //        if(createEpisodeRequest.AudioFile != null )
        //        {
        //            Files? audioFile = await _fileService.UploadFile(createEpisodeRequest.AudioFile, "AUDIOFILE");
        //            if(audioFile != null ) {
        //                throw new Exception("Audio File Doesnt Exist");

                        
        //            }
        //            return null;
                    

        //        }

        //    }
        //    else {

        //        throw new Exception("Not Authorized");
            
        //    }
            
        //}

     
    }
}
