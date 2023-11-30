using AutoMapper;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Backend.Models.Playlist;

namespace Backend.Services;

public class PlaylistService: IPlaylistService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public PlaylistService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    // public async Task<Playlist> Create(User user, string name)
    // {
    //     var playlist = new Playlist(_db)
    //     {
    //         Name = name,
    //         UserId = user.Id
    //     };
    //     await _db.Playlists.AddAsync(playlist);
    //     await _db.SaveChangesAsync();
    //     return playlist;
    // }

    // public async Task<bool> Append(User user, Guid playlistId, Guid episodeId)
    // {
    //     Playlist? playlist = await _db.Playlists.FirstOrDefaultAsync(e => e.Id == playlistId);
    //     if (playlist is null)
    //         return false;

    //     // Verify that user owns the playlist
    //     if (playlist.UserId != user.Id)
    //         return false;
        
    //     // Verify Episode Id
    //     Episode? episode = await _db.Episodes!.FirstOrDefaultAsync(e => e.Id == episodeId);
    //     if (episode is null)
    //         return false;

    //     PlaylistElement element = new PlaylistElement(_db)
    //     {
    //         EpisodeId = episodeId,
    //         PlayerlistId = playlistId
    //     };

    //     return true;
    // }

    // public async Task<List<Playlist>> All(User user)
    // {
    //     return await _db.Playlists.Where(p => p.UserId == user.Id).ToListAsync();
    // }

    // public async Task<List<PlaylistElement>?> PlaylistElements(User user, Guid playListId)
    // {
    //     Playlist? playlist = await _db.Playlists.FirstOrDefaultAsync(e => e.Id == playListId);
    //     if (playlist is null)
    //         return null;
        
    //     // Verify that user owns the playlist
    //     if (playlist.UserId != user.Id)
    //         return null;

    //     return playlist.Elements;
    // }

    // public async Task<bool> DeleteElement(User user, Guid playlistElementId)
    // {
    //     PlaylistElement? element = await _db.PlaylistElements.FirstOrDefaultAsync(e => e.Id == playlistElementId);
    //     if (element is null)
    //         return false;
        
    //     // Verify that the user owns the playlist
    //     if (element.Playlist?.UserId != user.Id)
    //         return false;

    //     _db.PlaylistElements.Remove(element);
    //     await _db.SaveChangesAsync();
    //     return true;
    // }

    // public async Task<bool> Delete(User user, Guid playlistId)
    // {
    //     Playlist? element = await _db.Playlists.FirstOrDefaultAsync(e => e.Id == playlistId);
    //     if (element is null)
    //         return false;
        
    //     // Verify that user owns the playlist
    //     if (element.UserId != user.Id)
    //         return false;

    //     _db.Playlists.Remove(element);
    //     await _db.SaveChangesAsync();
    //     return true;
    // }



    public async Task<bool> CreatePlaylistAsync(CreatePlaylistRequest request, User user)
    {
        // Check if a playlist with the same name exists for the given user
        if (await _db.Playlists.AnyAsync(p=>p.Name==request.Name && p.UserId==user.Id))
            throw new Exception("Playlist with the same name already exists.");

        // Check if all request episodes exist in the database
        foreach(Guid episodeId in request.EpisodeIds)
        {
            if(!await _db.Episodes.AnyAsync(e=>e.Id==episodeId))
                throw new Exception("One or more episodes do not exist in the database.");
        }

        // Make sure that there are no duplicate episodes
        request.EpisodeIds = request.EpisodeIds.Distinct().ToArray();

        // Create the playlist
        Playlist playlist = new()
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            UserId = user.Id,
            Description = request.Description,
            Privacy = GetPrivacyEnum(request.Privacy),
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

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

    public async Task<bool> EditPlaylistAsync(Guid playlistId, EditPlaylistRequest request, User user)
    {
        // Check if the playlist exists
        Playlist playlist = await _db.Playlists
            .FirstOrDefaultAsync(p=> p.Id==playlistId && p.UserId==user.Id && p.IsHandledByUser) 
            ?? throw new Exception("Playlist does not exist.");

        // Update the playlist
        playlist.Name = request.Name;
        playlist.Description = request.Description;
        playlist.Privacy = GetPrivacyEnum(request.Privacy);
        playlist.UpdatedAt = DateTime.Now;

        _db.Playlists.Update(playlist);

        // Return true if the playlist was updated successfully
        return await _db.SaveChangesAsync() > 0;
    }

    public async Task<bool> AddEpisodesToPlaylistAsync(Guid playlistId, Guid[] episodeIds, User user)
    {
        // Check if the playlist exists
        if(! await _db.Playlists.AnyAsync(p=>p.Id==playlistId && p.UserId==user.Id && p.IsHandledByUser))
            throw new Exception("Playlist does not exist.");

        // Check if all request episodes exist in the database
        foreach(Guid episodeId in episodeIds)
        {
            if(!await _db.Episodes.AnyAsync(e=>e.Id==episodeId))
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



    public Task<PlaylistResponse> GetLikedEpisodesPlaylist(User user)
    {
        throw new NotImplementedException();
    }

    public async Task<List<PlaylistInfoResponse>> GetAllPlaylistsAsync(User user, string domainUrl)
    {
        // Get all playlists for the user
        return await _db.Playlists
            .Include(p=>p.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Likes)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Select(p=>new PlaylistInfoResponse(p,domainUrl))
            .ToListAsync();
    }

    public async Task<PlaylistResponse> GetPlaylistEpisodesAsync(Guid playlistId, User user, string domainUrl)
    {
        // Get the playlist
        return await _db.Playlists
            .Include(p=>p.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Likes)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Select(p=>new PlaylistResponse(p,domainUrl))
            .FirstOrDefaultAsync(p=>p.Id==playlistId)
            ?? throw new Exception("Playlist does not exist for the given ID.");
    }

    public async Task<bool> DeletePlaylistAsync(Guid playlistId, User user)
    {
        // Check if the playlist exists
        Playlist playlist = await _db.Playlists
            .FirstOrDefaultAsync(p=>p.Id==playlistId && p.UserId==user.Id && p.IsHandledByUser) 
            ?? throw new Exception("Playlist does not exist for the given ID.");

        // Delete the playlist
        _db.Playlists.Remove(playlist);

        // Return true if the playlist was deleted successfully
        return await _db.SaveChangesAsync() > 0; 
    }

    public async Task<bool> RemoveEpisodesFromPlaylistAsync(Guid playlistId, Guid[] episodeIds, User user)
    {
        // Check if the playlist exists
        Playlist playlist = await _db.Playlists
            .FirstOrDefaultAsync(p=>p.Id==playlistId && p.UserId==user.Id && p.IsHandledByUser) 
            ?? throw new Exception("Playlist does not exist for the given ID.");
        
        // Check if the episodes exists in the playlist
        List<PlaylistEpisode> playlistEpisodes = await _db.PlaylistEpisodes
            .Where(pe=>pe.PlaylistId==playlistId && episodeIds.Contains(pe.EpisodeId))
            .ToListAsync();

        // Delete the playlist episodes
        _db.PlaylistEpisodes.RemoveRange(playlistEpisodes);

        // Return true if the playlist episode was deleted successfully
        return await _db.SaveChangesAsync() > 0; 
    }

    public async Task<List<PlaylistInfoResponse>> GetUserPlaylistsAsync(Guid userId, User user, int page, int pageSize, string domainUrl)
    {
        // Get all playlists for the user
        return await _db.Playlists
            .Where(p=>p.UserId==userId && (p.Privacy==PrivacyEnum.Public || userId==user.Id))
            .Skip(page*pageSize)
            .Take(pageSize)
            .Include(p=>p.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Likes)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(p=>p.PlaylistEpisodes).ThenInclude(pe=>pe.Episode).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
            .Select(p=>new PlaylistInfoResponse(p,domainUrl))
            .ToListAsync();
    }
}