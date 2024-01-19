using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Backend.Models.Playlist;
using static Backend.Infrastructure.FileStorageHelper;
namespace Backend.Services;

/// <summary>
/// Service for managing playlists. Handles all CRUD operations for playlists.
/// </summary>
public class PlaylistService : IPlaylistService
{
    private readonly AppDbContext _db;

    /// <summary>
    /// Accepted file types for cover art and thumbnail
    /// </summary>
    private static readonly string[] ALLOWED_IMG_FILES = { "image/jpeg", "image/png", "image/svg+xml" };


    /// <summary>
    /// Maximum image file is 5MB
    /// </summary>
    private const int MAX_IMG_SIZE = 5242880;

    public PlaylistService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Creates a new playlist for the given user.
    /// </summary>
    /// <param name="request">Create Playlist Request</param>
    /// <param name="user">Current User</param>
    /// <returns>True if created, otherwise false.</returns>
    public async Task<bool> CreatePlaylistAsync(CreatePlaylistRequest request, User user)
    {
        // Check if a playlist with the same name exists for the given user
        if (await _db.Playlists.AnyAsync(p => p.Name == request.Name && p.UserId == user.Id))
            throw new Exception("Playlist with the same name already exists.");

        // Check if the playlist Cover Art was provided
        if (request.CoverArt == null)
            throw new Exception("Cover Art is required.");

        // Check if the Playlist Cover Art is an image
        if (!ALLOWED_IMG_FILES.Contains(request.CoverArt.ContentType))
            throw new Exception("Cover Art must be a JPEG, PNG, or SVG.");

        // Check if the Playlist Cover Art is smaller than 5MB
        if (request.CoverArt.Length > MAX_IMG_SIZE)
            throw new Exception("Cover Art must be smaller than 5MB.");

        // Check if all request episodes exist in the database
        foreach (Guid episodeId in request.EpisodeIds)
        {
            if (!await _db.Episodes.AnyAsync(e => e.Id == episodeId))
                throw new Exception("One or more episodes do not exist in the database.");
        }

        // Make sure that there are no duplicate episodes
        request.EpisodeIds = request.EpisodeIds.Distinct().ToArray();
        
        // Generate new Guid
        Guid playlistGuid = Guid.NewGuid();

        // Create the playlist
        Playlist playlist = new()
        {
            Id = playlistGuid,
            Name = request.Name,
            UserId = user.Id,
            Description = request.Description,
            Privacy = GetPrivacyEnum(request.Privacy),
            IsHandledByUser = true,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // Save cover Art to the file system
        if(playlist.CoverArt != null)
        {
            playlist.CoverArt = SavePlaylistCoverArt(playlistGuid, request.CoverArt);
        }

        await _db.Playlists.AddAsync(playlist);

        // Add all episodes to the playlist, if any
        List<PlaylistEpisode> playlistEpisodes = request.EpisodeIds
            .Select(episodeId => new PlaylistEpisode
            {
                EpisodeId = episodeId,
                PlaylistId = playlist.Id,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            })
            .ToList();

        await _db.PlaylistEpisodes.AddRangeAsync(playlistEpisodes);

        // Return true if the playlist was created successfully
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summaryD
    /// Edits a playlist for the given user.
    /// </summary>
    /// <param name="playlistId">Id of the playlist to edit</param>
    /// <param name="request">Edit playlist request</param>
    /// <param name="user">Current user</param>
    /// <returns>True if edited, otherwise false.</returns>
    public async Task<bool> EditPlaylistAsync(Guid playlistId, EditPlaylistRequest request, User user)
    {
        // Check if the playlist exists
        Playlist playlist = await _db.Playlists
            .FirstOrDefaultAsync(p => p.Id == playlistId && p.UserId == user.Id && p.IsHandledByUser)
            ?? throw new Exception("Playlist does not exist.");

        // Update the playlist
        playlist.Name = request.Name;
        playlist.Description = request.Description;
        playlist.Privacy = GetPrivacyEnum(request.Privacy);
        playlist.UpdatedAt = DateTime.Now;

        if(request.CoverArt != null)
        {
            // Check if the Playlist Cover Art is an image
            if (!ALLOWED_IMG_FILES.Contains(request.CoverArt.ContentType))
                throw new Exception("Cover Art must be a JPEG, PNG, or SVG.");

            // Check if the Playlist Cover Art is smaller than 5MB
            if (request.CoverArt.Length > MAX_IMG_SIZE)
                throw new Exception("Cover Art must be smaller than 5MB.");

            // Remove the old Cover Art
            RemovePlaylistCoverArt(playlist.CoverArt);

            // Save the new cover Art
            playlist.CoverArt = SavePlaylistCoverArt(playlistId.ToString(), request.CoverArt);

        }

        _db.Playlists.Update(playlist);

        // Return true if the playlist was updated successfully
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Deletes a playlist for the given user.
    /// </summary>
    /// <param name="playlistId">Id of playlist to be deleted</param>
    /// <param name="user">Current user</param>
    /// <returns>True if deleted, otherwise false.</returns>
    public async Task<bool> DeletePlaylistAsync(Guid playlistId, User user)
    {
        // Check if the playlist exists
        Playlist playlist = await _db.Playlists
            .FirstOrDefaultAsync(p => p.Id == playlistId && p.UserId == user.Id && p.IsHandledByUser)
            ?? throw new Exception("Playlist does not exist for the given ID.");

        try
        {
            // Delete the Image from the file system
            RemovePlaylistCoverArt(playlist.CoverArt);
        }
        catch(Exception ex)
        {
            // log Error

        }

        // Delete the playlist
        _db.Playlists.Remove(playlist);

        // Deleting the playlist will cascade delete the playlist episodes.

        // Return true if the playlist was deleted successfully
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Adds one or many episodes to the given playlist.
    /// </summary>
    /// <param name="playlistId">Id of the playlist</param>
    /// <param name="episodeIds">Array of episode Ids</param>
    /// <param name="user">Current user</param>
    /// <returns>True if the episodes are added, otherwise false.</returns>
    public async Task<bool> AddEpisodesToPlaylistAsync(Guid playlistId, Guid[] episodeIds, User user)
    {
        // Check if the playlist exists
        if (!await _db.Playlists.AnyAsync(p => p.Id == playlistId && p.UserId == user.Id && p.IsHandledByUser))
            throw new Exception("Playlist does not exist.");

        // Check if all request episodes exist in the database
        foreach (Guid episodeId in episodeIds)
        {
            if (!await _db.Episodes.AnyAsync(e => e.Id == episodeId))
                throw new Exception("One or more episodes do not exist in the database.");
        }

        // Make sure that there are no duplicate episodes
        episodeIds = episodeIds.Distinct().ToArray();

        // Make sure that the episodes are not already in the playlist
        episodeIds = episodeIds
            .Where(episodeId => !_db.PlaylistEpisodes
                .Any(pe => pe.EpisodeId == episodeId && pe.PlaylistId == playlistId))
            .ToArray();

        // Add all episodes to the playlist, if any
        List<PlaylistEpisode> playlistEpisodes = episodeIds
            .Select(episodeId => new PlaylistEpisode
            {
                EpisodeId = episodeId,
                PlaylistId = playlistId,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            })
            .ToList();

        await _db.PlaylistEpisodes.AddRangeAsync(playlistEpisodes);

        // Return true if the playlist episodes were created successfully
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Removes one or many episodes for the given playlist.
    /// </summary>
    /// <param name="playlistId">Id of the playlist</param>
    /// <param name="episodeIds">Array of episode Ids</param>
    /// <param name="user">Current user</param>
    /// <returns>True if the episodes are removed, otherwise false.</returns>
    public async Task<bool> RemoveEpisodesFromPlaylistAsync(Guid playlistId, Guid[] episodeIds, User user)
    {
        // Check if the playlist exists
        Playlist playlist = await _db.Playlists
            .FirstOrDefaultAsync(p => p.Id == playlistId && p.UserId == user.Id && p.IsHandledByUser)
            ?? throw new Exception("Playlist does not exist for the given ID.");

        // Check if the episodes exists in the playlist
        List<PlaylistEpisode> playlistEpisodes = await _db.PlaylistEpisodes
            .Where(pe => pe.PlaylistId == playlistId && episodeIds.Contains(pe.EpisodeId))
            .ToListAsync();

        // Delete the playlist episodes
        _db.PlaylistEpisodes.RemoveRange(playlistEpisodes);

        // Return true if the playlist episode was deleted successfully
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Gets the liked episodes playlist for the given user.
    /// </summary>
    /// <param name="user">Current user</param>
    /// <param name="domainUrl">App domain name</param>
    /// <returns>Playlist info with all playlist episodes.</returns>
    public async Task<PlaylistResponse> GetLikedEpisodesPlaylist(User user, string domainUrl)
    {
        // Get the liked episodes playlist for the user
        return await _db.Playlists
            .Where(p=>p.Name == "Liked Episodes" && p.UserId == user.Id && !p.IsHandledByUser)
            .Include(p => p.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Podcast)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Select(p => new PlaylistResponse(p, domainUrl))
            .FirstOrDefaultAsync()
            ?? throw new Exception("Playlist does not exist.");
    }

    /// <summary>
    /// Gets all episodes for the given playlist.
    /// </summary>
    /// <param name="playlistId">Id of the playlist</param>
    /// <param name="user">Current user</param>
    /// <param name="domainUrl">App domain name</param>
    /// <returns>Playlist info with all playlist episodes.</returns>
    public async Task<PlaylistResponse> GetPlaylistEpisodesAsync(Guid playlistId, User user, string domainUrl)
    {
        // Get the playlist
        return await _db.Playlists
            .Where(p => p.Id == playlistId && (p.Privacy == PrivacyEnum.Public || p.UserId == user.Id))
            .Include(p => p.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Podcast)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Select(p => new PlaylistResponse(p, domainUrl))
            .FirstOrDefaultAsync()
            ?? throw new Exception("Playlist does not exist for the given ID.");
    }

    /// <summary>
    /// Gets all playlists for the given user.
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="user">Current user</param>
    /// <param name="page">Index of the page</param>
    /// <param name="pageSize">Size of the page</param>
    /// <param name="domainUrl">App domain name</param>
    /// <returns></returns>
    public async Task<List<PlaylistInfoResponse>> GetUserPlaylistsAsync(Guid userId, User user, int page, int pageSize, string domainUrl)
    {
        // Get all playlists for the user
        return await _db.Playlists
            .Where(p => p.UserId == userId && (p.Privacy == PrivacyEnum.Public || userId == user.Id))
            .Skip(page * pageSize)
            .Take(pageSize)
            .Include(p => p.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Select(p => new PlaylistInfoResponse(p, domainUrl))
            .ToListAsync();
    }

    /// <summary>
    /// Gets all playlists.
    /// </summary>
    /// <param name="user">Current user</param>
    /// <param name="page">Index of the page</param>
    /// <param name="pageSize">Size of the page</param>
    /// <param name="domainUrl">App domain name</param>
    /// <returns></returns>
    public async Task<List<PlaylistInfoResponse>> GetAllPlaylistsAsync(User user, int page, int pageSize, string domainUrl)
    {
        // Get all playlists 
        return await _db.Playlists
            .Where(p => p.Privacy == PrivacyEnum.Public || p.UserId == user.Id)
            .Skip(page * pageSize)
            .Take(pageSize)
            .Include(p => p.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Select(p => new PlaylistInfoResponse(p, domainUrl))
            .ToListAsync();
    }

    /// <summary>
    /// Gets all playlists that match the given search term.
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="user">Current user</param>
    /// <param name="page">Index of the page</param>
    /// <param name="pageSize">Size of the page</param>
    /// <param name="domainUrl">App domain name</param>
    /// <returns></returns>
    public async Task<List<PlaylistInfoResponse>> SearchPlaylistsAsync(string searchTerm, User user, int page, int pageSize, string domainUrl)
    {
        // Get all playlists 
        return await _db.Playlists
            .Where(p => (p.Privacy == PrivacyEnum.Public || p.UserId == user.Id) 
                && ((AppDbContext.Soundex(searchTerm) == AppDbContext.Soundex(p.Name)) 
                || (AppDbContext.Soundex(searchTerm) == AppDbContext.Soundex(p.Description))))
            .Skip(page * pageSize)
            .Take(pageSize)
            .Include(p => p.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p => p.PlaylistEpisodes).ThenInclude(pe => pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Select(p => new PlaylistInfoResponse(p, domainUrl))
            .ToListAsync();
    }

    /// <summary>
    ///  Gets pl
    /// </summary>
    /// <param name="playlistId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>

    public async Task<string> GetPlaylistCoverArtNameAsync(Guid playlistId)
    {
        Playlist playlist = await _db.Playlists.FirstOrDefaultAsync(e => e.Id == playlistId) ?? throw new Exception("Playlist Does not Exist") ;
        return playlist.CoverArt;

    }
}