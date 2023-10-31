using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;

namespace Backend.Services
{
    public class EpisodeService : IEpisodeService
    {
        private readonly IFileService _fileService;
        private readonly AppDbContext _db;
        private readonly IAuthService _authService;
        private readonly List<string> AllowedTypes = new List<string>{ "audio/mp4", "audio/mpeg" };
        

        public EpisodeService(IFileService fileService,IAuthService authService,AppDbContext db) {
            _fileService = fileService;
            _authService = authService;
            _db = db;

        }


        public async Task<Episode?> AddEpisode(CreateEpisodeRequest createEpisodeRequest,Podcast podcast,HttpContext httpContext)
        {
            Episode episode = new Episode();

            if(createEpisodeRequest.AudioFile != null && !AllowedTypes.Contains(createEpisodeRequest.AudioFile!.ContentType))
            {
                throw new InvalidDataException("Invalid Data Types");
 
            }
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


        public async Task<Episode?> EditEpisode(EditEpisodeRequest editEpisodeRequest, HttpContext httpContext)
        {
            if(editEpisodeRequest.EpisodeId != null)
            {

                Episode? episode = await _db.Episodes!.Include(u => u.AudioFile).FirstOrDefaultAsync(u => u.Id == Guid.Parse(editEpisodeRequest.EpisodeId));
                if (episode != null)
                {

                    if(editEpisodeRequest.AudioFile != null)
                    {

                        if (!AllowedTypes.Contains(editEpisodeRequest.AudioFile!.ContentType))
                        {
                            throw new InvalidDataException("Invalid Data Types");

                        }

                        bool? editted = await  _fileService.EditFile(episode.AudioFile!, editEpisodeRequest.AudioFile);
                        if(editted == false)
                        {
                            throw new Exception("Failed to Edit the file");
                           
                        }
                        

                    }
                    if(editEpisodeRequest.EpisodeName != null)
                    {
                        episode.EpisodeName = editEpisodeRequest.EpisodeName;

                        


                    }

                    if(editEpisodeRequest.IsExplicit != null)
                     {
                        episode.IsExplicit = (bool)editEpisodeRequest.IsExplicit;

                    }

                    await _db.SaveChangesAsync();
                    return episode;
                }
                throw new BadHttpRequestException("Cannot Find the Episode");


            }
            throw new BadHttpRequestException("Please Pass Episode ID");

        }






    }
}
