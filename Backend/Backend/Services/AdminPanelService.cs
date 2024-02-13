using Backend.Infrastructure;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AdminPanelService
{
    private readonly AppDbContext _db;
    public AdminPanelService(AppDbContext db, IConfiguration config) {
        _db = db;
        
        // Insure that there's at least 1 admin for testing purpose 
        User? admin = db.Users.FirstOrDefault(u => u.IsAdmin);
        if (admin is null) {
            User newAdmin = new User() {
                Email = config["Admin:Email"],
                Password = config["Admin:Password"],
                Username = "admin",
                DisplayName = "Admin",
                IsAdmin = true,
            };
            db.Users.Add(newAdmin);
            db.SaveChanges();
        }
    }

    public Task<User[]> GetAllUsers(bool withDeleted) {
        if (withDeleted)
            return _db.Users.IgnoreQueryFilters().ToArrayAsync();
        return _db.Users.ToArrayAsync();
    }

    public async Task BanUser(User admin, Guid userId) {
        User? user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
            throw new InvalidDataException("Invalid user ID");
        
        user.DeletedAt = DateTime.Now;
        user.DeletedBy = admin.Id;
        _db.Users.Update(user);
        
        // Soft delete all podcasts and episodes associated with the user
        Podcast[] podcasts = await _db.Podcasts.Where(p => p.PodcasterId == userId).ToArrayAsync();
        foreach (Podcast podcast in podcasts) {
            podcast.DeletedAt = DateTime.Now;
            podcast.DeletedBy = admin.Id;
        }
        _db.Podcasts.UpdateRange(podcasts);
        
        Episode[] episodes = await _db.Episodes.Where(e => e.Podcast.PodcasterId == userId).ToArrayAsync();
        foreach (Episode episode in episodes) {
            episode.DeletedAt = DateTime.Now;
            episode.DeletedBy = admin.Id;
        }
        _db.Episodes.UpdateRange(episodes);
        
        // Soft delete all comments and comments reply associated with the user
        Comment[] comments = await _db.Comments.Where(c => c.UserId == userId).ToArrayAsync();
        foreach (Comment comment in comments) {
            comment.DeletedAt = DateTime.Now;
            comment.DeletedBy = admin.Id;
        }
        _db.Comments.UpdateRange(comments);
        
        CommentReply[] commentReplies = await _db.CommentReplies.Where(cr => cr.UserId == userId).ToArrayAsync();
        foreach (CommentReply commentReply in commentReplies) {
            commentReply.DeletedAt = DateTime.Now;
            commentReply.DeletedBy = admin.Id;
        }
        _db.CommentReplies.UpdateRange(commentReplies);
        
        await _db.SaveChangesAsync();
    }
}