using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class EpisodeService : IEpisodeService
    {
        private readonly IFileService _fileService;
        private readonly AppDbContext _db;
        private readonly IAuthService _authService;
        

        public EpisodeService(IFileService fileService,IAuthService authService,AppDbContext db) {
            _fileService = fileService;
            _authService = authService;
            _db = db;

        }


        public async Task<Episode?> AddEpisode(CreateEpisodeRequest createEpisodeRequest,Podcast podcast,HttpContext httpContext)
        {
            Episode episode = new Episode();
            Files? audioFile = await _fileService.UploadFile(createEpisodeRequest.AudioFile!);
            if (audioFile != null)
            {
              
                episode.AudioFileId = audioFile.FileId;
            }
            else
            {
                throw new Exception("Uploading file not Successfull"); 
            }
            episode.EpisodeName = createEpisodeRequest.EpisodeName!;
            episode.IsExplicit = createEpisodeRequest.IsExplicit!;

            podcast.Episodes.Add(episode);
            await _db.SaveChangesAsync();
            return episode;

        }


        public async Task<bool> DeleteEpisode(Episode episode, DeleteEpisodeRequest deleteEpisodeRequest)
        {  
           await _fileService.DeleteFile(episode.AudioFileId.ToString()!);
           _db.Remove(episode);
           await _db.SaveChangesAsync();
           return true;

        }





     
    }
}
