using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.AspNetCore.Server.IIS.Core;
using Microsoft.EntityFrameworkCore;
using NAudio.Wave;
using System;
using System.ComponentModel;
using System.Globalization;
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

        public double GetEpisodeDuration(string path)
        {
            try
            {
                using (var audioFileReader = new AudioFileReader(path))
                {
                    Console.WriteLine(audioFileReader.TotalTime);
                    return audioFileReader.TotalTime.TotalSeconds;
                }
            }
            catch (Exception ex)
            {
                
                Console.WriteLine("Error: " + ex.Message);
                return TimeSpan.Zero.TotalSeconds;
            }

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
            episode.ReleaseDate = DateTime.UtcNow;
            episode.Duration = GetEpisodeDuration(_fileService.GetPath(audioFile.Path!));
            

            podcast.Episodes.Add(episode);
            await _db.SaveChangesAsync();
            return episode;

        }


        public async Task<bool> DeleteEpisode(Episode episode, DeleteEpisodeRequest deleteEpisodeRequest)
        {
            Guid? guid = Guid.Parse(deleteEpisodeRequest.EpisodeId);
            Files? file = await _db.File!.FirstOrDefaultAsync(u => u.FileId == episode.AudioFileId);

            if (file != null)
            {

                _db.Remove(file);
                _db.Remove(episode);

                if (_fileService.DeleteFile(file.Path!) == true)
                {
                    await _db.SaveChangesAsync();
                    return true;


                }
                throw new Exception("Failed to Delete");
            }
            else
            {
                throw new Exception("File Not Found");
            }


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

                        bool? editted =  _fileService.EditFile(episode.AudioFile!, editEpisodeRequest.AudioFile);
                        if(editted == true)
                        {
                            episode.AudioFile!.Name = editEpisodeRequest.AudioFile.FileName;
                            episode.AudioFile!.MimeType = editEpisodeRequest.AudioFile.ContentType;
                            episode.Duration = GetEpisodeDuration(episode.AudioFile.Path!);
                            
                           
                        }
                        else
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
