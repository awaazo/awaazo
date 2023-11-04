using AutoMapper;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Backend.Infrastructure.FileStorageHelper;

namespace Backend.Services;
public class PodcastService : IPodcastService
{
    private readonly AppDbContext _db;

    private readonly List<string> AllowedTypes = new List<string> { "image/bmp", "image/jpeg", "image/x-png", "image/png" };
    
    private readonly IProfileService _profileService;

    public PodcastService(AppDbContext db, IProfileService profileService)
    {
        _db = db;
        _profileService = profileService;
    }

    #region Podcast

    public async Task<List<Podcast>> GetAllPodcastAsync()
    {
        // Get all podcasts
        List<Podcast> podcasts = await _db.Podcasts.ToListAsync();

        // Get all episodes for each podcast
        foreach (Podcast podcast in podcasts)
        {
            podcast.Episodes = await _db.Episodes.Where(e => e.PodcastId == podcast.Id).ToListAsync();
        }

        // Return the podcasts
        return podcasts;
    }


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

    public Task<Podcast> GetPodcastResponseAsync(Podcast podcast)
    {
        return Task.FromResult(podcast);        
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
            // Remove the old episode audio from the server
            RemovePodcastEpisodeAudio(episode.Audio, episode.PodcastId);

            // Save the new episode audio to the server
            episode.Audio = SavePodcastEpisodeAudio(episode.Id, episode.PodcastId, request.AudioFile);
        }

        // Update the episode thumbnail if it was changed
        if (request.Thumbnail != null)
        {
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

    public Task<EpisodeResponse> GetEpisodeResponseAsync(Episode episode, string baseUrl)
    {
        // Domain Url (anything before the url for the controller)
        string domainUrl = baseUrl.Split("podcast")[0];

        // Create a new Episode Response
        EpisodeResponse episodeResponse = new(episode,domainUrl);

        return Task.FromResult(episodeResponse);
    }

    public async Task<EpisodeResponse> GetEpisodeByIdAsync(Guid episodeId, string baseUrl)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist for the given ID.");

        return await GetEpisodeResponseAsync(episode, baseUrl);
    }

    public async Task<PodcastResponse> GetPodcastResponseAsync(Podcast podcast, string baseUrl)
    {
        // Domain Url (anything before the url for the controller)
        string domainUrl = baseUrl.Split("podcast")[0];

        // Get the user that owns the podcast
        User user = await _db.Users.FirstOrDefaultAsync(u => u.Id == podcast.PodcasterId) ?? throw new Exception("Podcast does not exist for the given ID.");

        // Get the podcast response
        PodcastResponse podcastResponse = new(podcast, domainUrl)
        {
            User = _profileService.GetProfile(user, domainUrl)
        };


        return podcastResponse;
    }

    public async Task<string> GetEpisodeAudioNameAsync(Guid episodeId)
    {
        // If the episode does not exist, throw an exception, otherwise return the audio name
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");
        return episode.Audio;
    }

    public async Task<string> GetEpisodeThumbnailNameAsync(Guid episodeId)
    {
        // If the episode does not exist, throw an exception, otherwise return the thumbnail name
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");
        return episode.Thumbnail;
    }

    public async Task<string> GetPodcastCoverArtNameAsync(Guid podcastId)
    {
        // If the podcast does not exist, throw an exception, otherwise return the cover art name
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == podcastId) ?? throw new Exception("Podcast does not exist.");
        return podcast.CoverArt;
    }

    public async Task<Podcast> GetPodcastByIdAsync(Guid podcastId, string baseUrl)
    {
        // Check if the podcast exists, if it does retrieve it.
        Podcast podcast = await _db.Podcasts.Include(p=>p.Episodes).FirstOrDefaultAsync(p => p.Id == podcastId) ?? throw new Exception("Podcast does not exist.");

        return podcast;
    }

    #endregion Episode
}