using System.Diagnostics;
using System.Reflection.Metadata;
using AutoMapper;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using NAudio;
using NAudio.Wave;
using static Backend.Infrastructure.FileStorageHelper;

namespace Backend.Services;

/// <summary>
/// Handles API requests for podcasts and episodes.
/// </summary>
public class PodcastService : IPodcastService
{
    /// <summary>
    /// Current database instance
    /// </summary>
    private readonly AppDbContext _db;

    /// <summary>
    /// Accepted file types for cover art and thumbnail
    /// </summary>
    private static readonly string[] ALLOWED_IMG_FILES = {"image/jpeg", "image/png", "image/svg+xml" };
    
    /// <summary>
    /// Accepted file types for audio files
    /// </summary>
    private static readonly string[] ALLOWED_AUDIO_FILES = {"audio/mpeg", "audio/mp3", "audio/x-wav", "audio/mp4" };    

    /// <summary>
    /// Maximum image file is 5MB
    /// </summary>
    private const int MAX_IMG_SIZE = 5242880;

    /// <summary>
    /// Maximum audio file is 2GB
    /// </summary>
    private const int MAX_AUDIO_SIZE = 2000000000;


    public PodcastService(AppDbContext db)
    {
        _db = db;
    }

    #region Podcast

    /// <summary>
    /// Creates a new Podcast.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> CreatePodcastAsync(CreatePodcastRequest request, User user)
    {
        // Check if a podcast with the same name already exists
        if (await _db.Podcasts.AnyAsync(p => p.Name == request.Name))
            throw new Exception("A podcast with the same name already exists");

        // Check if the cover art was provided
        if (request.CoverImage == null)
            throw new Exception("Cover art is required.");

        // Check if the cover art is an image
        if (!ALLOWED_IMG_FILES.Contains(request.CoverImage.ContentType))
            throw new Exception("Cover art must be a JPEG, PNG, or SVG.");

        // Check if the cover art is smaller than 5MB
        if (request.CoverImage.Length > MAX_IMG_SIZE)
            throw new Exception("Cover art must be smaller than 5MB.");

        // Create the new Podcast
        Podcast podcast = new()
        {
            Id = Guid.NewGuid(),
            PodcasterId = user.Id,
            Name = request.Name,
            Description = request.Description,
            Tags = request.Tags,
            UpdatedAt = DateTime.Now,
            CreatedAt = DateTime.Now,
            IsExplicit = false
        };

        // Save the new cover art to the server
        podcast.CoverArt = SavePodcastCoverArt(podcast.Id, request.CoverImage!);

        // Add Podcaster flag to user
        user.IsPodcaster = true;
        user.UpdatedAt = DateTime.Now;
        _db.Users.Update(user);

        // Add the Podcast to the database and return status
        await _db.Podcasts.AddAsync(podcast);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Edits an existing Podcast.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> EditPodcastAsync(EditPodcastRequest request, User user)
    {
        // Get the podcast
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == request.Id && p.PodcasterId == user.Id) ?? throw new Exception("Podcast does not exist and/or it is not owned by user.");

        // Check if a podcast with the same name already exists if it was changed
        if (request.Name != podcast.Name && await _db.Podcasts.AnyAsync(p => p.Name == request.Name))
            throw new Exception("A podcast with the same name already exists");

        // Update the podcast with the new values
        podcast.Name = request.Name;
        podcast.Description = request.Description;
        podcast.Tags = request.Tags;
        podcast.UpdatedAt = DateTime.Now;

        // Update the cover art if it was changed
        if (request.CoverImage != null)
        {
            // Check if the cover art is an image
            if (!ALLOWED_IMG_FILES.Contains(request.CoverImage.ContentType))
                throw new Exception("Cover art must be a JPEG, PNG, or SVG.");

            // Check if the cover art is smaller than 5MB
            if (request.CoverImage.Length > MAX_IMG_SIZE)
                throw new Exception("Cover art must be smaller than 5MB.");

            // Remove the old cover art from the server
            RemovePodcastCoverArt(podcast.CoverArt);

            // Save the new cover art to the server
            string coverArtName = SavePodcastCoverArt(podcast.Id, request.CoverImage);

            // Update the Podcast object with the cover art name
            podcast.CoverArt = coverArtName;
        }

        // Save the changes to the database and return status
        _db.Podcasts.Update(podcast);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Gets the cover art name for the given podcast.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<string> GetPodcastCoverArtNameAsync(Guid podcastId)
    {
        // If the podcast does not exist, throw an exception, otherwise return the cover art name
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == podcastId) ?? throw new Exception("Podcast does not exist.");
        return podcast.CoverArt;
    }

    /// <summary>
    /// Gets a podcast by ID.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<PodcastResponse> GetPodcastByIdAsync(string domainUrl, Guid podcastId)
    {
        // Check if the podcast exists, if it does retrieve it.
        Podcast podcast = await _db.Podcasts.Include(p=>p.Episodes).FirstOrDefaultAsync(p => p.Id == podcastId) ?? throw new Exception("Podcast does not exist.");
        
        return new PodcastResponse(podcast,domainUrl);
    }

    /// <summary>
    /// Gets all podcasts for the given user.
    /// </summary>
    /// <param name="domainUrl"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<List<PodcastResponse>> GetUserPodcastsAsync(string domainUrl, User user)
    {
        // Check if the user has any podcasts, if they do retrieve them.
        List<Podcast> podcasts = await _db.Podcasts.Include(p=>p.Episodes).Where(p => p.PodcasterId == user.Id).ToListAsync() ?? throw new Exception("User doesnt have any podcasts.");

        // Get the podcast responses and return them
        List<PodcastResponse> podcastResponses = new();
        foreach (Podcast podcast in podcasts)
        {
            podcastResponses.Add(new PodcastResponse(podcast,domainUrl));
        }

        return podcastResponses;
    }

    /// <summary>
    /// Gets all podcasts for the given search term.
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="domainUrl"></param>
    /// <param name="searchTerm"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<List<PodcastResponse>> GetSearchPodcastsAsync(int page, int pageSize, string domainUrl, string searchTerm)
    {
        // Get the podcasts from the database, where the podcast name sounds like the searchTerm
        List<Podcast> podcasts = await _db.Podcasts.Include(p => p.Episodes)
        .Skip(page * pageSize)
        .Where(p => AppDbContext.Soundex(p.Name)==AppDbContext.Soundex(searchTerm))
        .Take(pageSize)
        .ToListAsync() ?? throw new Exception("No podcasts found.");

        // Create a list of podcast responses
        List<PodcastResponse> podcastResponses = new();
        foreach (Podcast podcast in podcasts)
        {
            podcastResponses.Add(new PodcastResponse(podcast, domainUrl));
        }

        return podcastResponses;
    }

    /// <summary>
    /// Gets all podcasts.
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<List<PodcastResponse>> GetAllPodcastsAsync(int page, int pageSize, string domainUrl)
    {
        // Get the podcasts from the database
        List<Podcast> podcasts = await _db.Podcasts.Include(p => p.Episodes).Skip(page * pageSize).Take(pageSize).ToListAsync() ?? throw new Exception("No podcasts found.");

        // Create a list of podcast responses
        List<PodcastResponse> podcastResponses = new();
        foreach (Podcast podcast in podcasts)
        {
            podcastResponses.Add(new PodcastResponse(podcast, domainUrl));
        }

        return podcastResponses;
    }

    #endregion Podcast

    #region Episode

    /// <summary>
    /// Creates a new episode for the specified podcast.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="podcastId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> CreateEpisodeAsync(CreateEpisodeRequest request, Guid podcastId, User user)
    {
        // Check if the podcast exists
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == podcastId && p.PodcasterId == user.Id) ?? throw new Exception("Podcast does not exist and/or it is not owned by user.");

        // Check if the episode name already exists for the podcast
        if (await _db.Episodes.AnyAsync(e => e.PodcastId == podcastId && e.EpisodeName == request.EpisodeName))
            throw new Exception("An episode with the same name already exists for this podcast.");

        // Check if the episode audio was provided
        if (request.AudioFile == null)
            throw new Exception("Audio file is required.");

        // Check if the episode audio is an audio file
        if (!ALLOWED_AUDIO_FILES.Contains(request.AudioFile.ContentType))
            throw new Exception("Audio file must be an MP3, WAV, MP4, or MPEG.");

        // Check if the episode audio is smaller than 2GB
        if (request.AudioFile.Length > MAX_AUDIO_SIZE)
            throw new Exception("Audio file must be smaller than 2GB.");

        // Check if the episode thumbnail was provided
        if (request.Thumbnail == null)
            throw new Exception("Thumbnail is required.");

        // Check if the episode thumbnail is an image
        if (!ALLOWED_IMG_FILES.Contains(request.Thumbnail.ContentType))
            throw new Exception("Thumbnail must be a JPEG, PNG, or SVG.");

        // Check if the episode thumbnail is smaller than 5MB
        if (request.Thumbnail.Length > MAX_IMG_SIZE)
            throw new Exception("Thumbnail must be smaller than 5MB.");

        // Create the new episode
        Episode episode = new()
        {
            Id = Guid.NewGuid(),
            PodcastId = podcastId,
            EpisodeName = request.EpisodeName,
            Description = request.Description,
            IsExplicit = request.IsExplicit,
            ReleaseDate = DateTime.Now,
            UpdatedAt = DateTime.Now,
            CreatedAt = DateTime.Now
        };

        // Check if the episode is explicit and the podcast is not
        if (episode.IsExplicit && !podcast.IsExplicit)
        {
            podcast.IsExplicit = true;
            _db.Podcasts.Update(podcast);
        }

        // Save the episode audio to the server
        episode.Audio = SavePodcastEpisodeAudio(episode.Id, podcastId, request.AudioFile!);

        // Save the episode thumbnail to the server
        episode.Thumbnail = SavePodcastEpisodeThumbnail(episode.Id, podcastId, request.Thumbnail!);

        // Find and Save the duration of the audio in seconds
        episode.Duration = new AudioFileReader(GetPodcastEpisodeAudioPath(episode.Audio, podcastId)).TotalTime.TotalSeconds;

        // Add the episode to the database and return status
        await _db.Episodes.AddAsync(episode);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Edits an existing episode for the specified podcast.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="episodeId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> EditEpisodeAsync(EditEpisodeRequest request, Guid episodeId, User user)
    {
        // Get the episode
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");

        // Check if the podcast exists
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == episode.PodcastId && p.PodcasterId == user.Id) ?? throw new Exception("Podcast does not exist and/or it is not owned by user.");

        // Check if the episode name already exists for the podcast
        if (request.EpisodeName != episode.EpisodeName && await _db.Episodes.AnyAsync(e => e.PodcastId == episode.PodcastId && e.EpisodeName == request.EpisodeName))
            throw new Exception("An episode with the same name already exists for this podcast.");

        // Update the episode with the new values
        episode.EpisodeName = request.EpisodeName;
        episode.Description = request.Description;
        episode.IsExplicit = request.IsExplicit;
        episode.UpdatedAt = DateTime.Now;

        // Update the episode audio if it was changed
        if (request.AudioFile != null)
        {
            // Check if the episode audio is an audio file
            if (!ALLOWED_AUDIO_FILES.Contains(request.AudioFile.ContentType))
                throw new Exception("Audio file must be an MP3, WAV, MP4, or MPEG.");

            // Check if the episode audio is smaller than 2GB
            if (request.AudioFile.Length > MAX_AUDIO_SIZE)
                throw new Exception("Audio file must be smaller than 2GB.");

            // Remove the old episode audio from the server
            RemovePodcastEpisodeAudio(episode.Audio, episode.PodcastId);

            // Save the new episode audio to the server
            episode.Audio = SavePodcastEpisodeAudio(episode.Id, episode.PodcastId, request.AudioFile);

            // Find and Save the duration of the audio in seconds
            episode.Duration = new AudioFileReader(GetPodcastEpisodeAudioPath(episode.Audio, episode.PodcastId)).TotalTime.TotalSeconds;
        }

        // Update the episode thumbnail if it was changed
        if (request.Thumbnail != null)
        {
            // Check if the episode thumbnail is an image
            if (!ALLOWED_IMG_FILES.Contains(request.Thumbnail.ContentType))
                throw new Exception("Thumbnail must be a JPEG, PNG, or SVG.");

            // Check if the episode thumbnail is smaller than 5MB
            if (request.Thumbnail.Length > MAX_IMG_SIZE)
                throw new Exception("Thumbnail must be smaller than 5MB.");

            // Remove the old episode thumbnail from the server
            RemovePodcastEpisodeThumbnail(episode.Thumbnail, episode.PodcastId);

            // Save the new episode thumbnail to the server
            episode.Thumbnail = SavePodcastEpisodeThumbnail(episode.Id, episode.PodcastId, request.Thumbnail);
        }

        // Check if the episode is explicit and the podcast is not
        if (episode.IsExplicit && !podcast.IsExplicit)
        {
            podcast.IsExplicit = true;
            _db.Podcasts.Update(podcast);
        }

        // Save the changes to the database and return status
        _db.Episodes.Update(episode);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Removes a Podcast from the database and the server, including all its episodes.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> DeletePodcastAsync(Guid podcastId, User user)
    {
        // Check if the podcast exists
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == podcastId && p.PodcasterId == user.Id) ?? throw new Exception("Podcast does not exist and/or it is not owned by user.");

        // Get the episodes for the podcast
        List<Episode> episodes = await _db.Episodes.Where(e => e.PodcastId == podcastId).ToListAsync();

        // Remove each podcast episode
        foreach (Episode episode in episodes)
            await DeleteEpisodeAsync(episode.Id,user);

        // Remove the cover art from the server
        RemovePodcastCoverArt(podcast.CoverArt);

        // TODO: Remove dependent entities as well
        // ===================================

        // ===================================

        // Remove the podcast from the database
        _db.Podcasts.Remove(podcast);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Removes an episode from the database and the server.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> DeleteEpisodeAsync(Guid episodeId, User user)
    {
        // Check if the episode exists and is owned by the user
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");

        // Check if the podcast exists
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == episode.PodcastId && p.PodcasterId == user.Id) ?? throw new Exception("Episode podcast does not exist and/or it is not owned by user.");


        // Remove audio and thumbnail from server
        RemovePodcastEpisodeThumbnail(episode.Thumbnail, podcast.Id);
        RemovePodcastEpisodeAudio(episode.Audio, podcast.Id);

        // TODO: Remove dependent entities as well
        // ===================================

        // ===================================

        // Remove episode from database
        _db.Episodes.Remove(episode);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Retrieves an episode by ID.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<EpisodeResponse> GetEpisodeByIdAsync(Guid episodeId, string domainUrl)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist for the given ID.");

        // Return the episode response
        return new EpisodeResponse(episode,domainUrl);
    }

    /// <summary>
    /// Gets the audio name for the given episode.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<string> GetEpisodeAudioNameAsync(Guid episodeId)
    {
        // If the episode does not exist, throw an exception, otherwise return the audio name
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");
        return episode.Audio;
    }

    /// <summary>
    /// Gets the thumbnail name for the given episode.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<string> GetEpisodeThumbnailNameAsync(Guid episodeId)
    {
        // If the episode does not exist, throw an exception, otherwise return the thumbnail name
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");
        return episode.Thumbnail;
    }

    #endregion Episode
}