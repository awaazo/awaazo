using AutoMapper;
using Backend.Infrastructure;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class PlaylistService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public PlaylistService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<Playlist> Create(User user, string name)
    {
        var playlist = new Playlist(_db)
        {
            Name = name,
            UserId = user.Id
        };
        await _db.Playlists.AddAsync(playlist);
        await _db.SaveChangesAsync();
        return playlist;
    }

    public async Task<bool> Append(User user, Guid playlistId, Guid episodeId)
    {
        Playlist? playlist = await _db.Playlists.FirstOrDefaultAsync(e => e.Id == playlistId);
        if (playlist is null)
            return false;

        // Verify that user owns the playlist
        if (playlist.UserId != user.Id)
            return false;
        
        // Verify Episode Id
        Episode? episode = await _db.Episodes!.FirstOrDefaultAsync(e => e.Id == episodeId);
        if (episode is null)
            return false;

        PlaylistElement element = new PlaylistElement(_db)
        {
            EpisodeId = episodeId,
            PlayerlistId = playlistId
        };

        return true;
    }

    public async Task<List<Playlist>> All(User user)
    {
        return await _db.Playlists.Where(p => p.UserId == user.Id).ToListAsync();
    }

    public async Task<List<PlaylistElement>?> PlaylistElements(User user, Guid playListId)
    {
        Playlist? playlist = await _db.Playlists.FirstOrDefaultAsync(e => e.Id == playListId);
        if (playlist is null)
            return null;
        
        // Verify that user owns the playlist
        if (playlist.UserId != user.Id)
            return null;

        return playlist.Elements;
    }

    public async Task<bool> DeleteElement(User user, Guid playlistElementId)
    {
        PlaylistElement? element = await _db.PlaylistElements.FirstOrDefaultAsync(e => e.Id == playlistElementId);
        if (element is null)
            return false;
        
        // Verify that the user owns the playlist
        if (element.Playlist?.UserId != user.Id)
            return false;

        _db.PlaylistElements.Remove(element);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(User user, Guid playlistId)
    {
        Playlist? element = await _db.Playlists.FirstOrDefaultAsync(e => e.Id == playlistId);
        if (element is null)
            return false;
        
        // Verify that user owns the playlist
        if (element.UserId != user.Id)
            return false;

        _db.Playlists.Remove(element);
        await _db.SaveChangesAsync();
        return true;
    }
}