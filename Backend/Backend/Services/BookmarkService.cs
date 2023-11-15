using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class BookmarkService
{
    private readonly AppDbContext _db;

    public BookmarkService(AppDbContext db)
    {
        _db = db;
    }
    
    public async Task<List<Bookmark>> GetBookmarks(User user, Guid episodeId)
    {
        return await _db.Bookmarks.Where(b => b.UserId == user.Id && b.EpisodeId == episodeId).ToListAsync();
    }

    public async Task<Bookmark> Add(User user, Guid episodId, BookmarkAddRequest request)
    {
        Episode? episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodId);
        if (episode is null)
            throw new Exception("Invalid episode ID " + episodId);
        
        Bookmark bookmark = new Bookmark(_db)
        {
            EpisodeId = episodId,
            UserId = user.Id,
            Note = request.Note,
            Title = request.Title,
            Time = request.Time
        };
        _db.Bookmarks.Add(bookmark);
        await _db.SaveChangesAsync();
        return bookmark;
    }

    public async Task Delete(User user, Guid bookmarkId)
    {
        Bookmark? bookmark = await _db.Bookmarks.FirstOrDefaultAsync(e => e.Id == bookmarkId);
        if (bookmark is null)
            throw new Exception("Invalid bookmark Id " + bookmark);

        if (bookmark.UserId != user.Id)
            throw new UnauthorizedAccessException();

        _db.Bookmarks.Remove(bookmark);
    }
}