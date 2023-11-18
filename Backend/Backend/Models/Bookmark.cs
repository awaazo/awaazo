using System.ComponentModel.DataAnnotations;
using Backend.Infrastructure;

namespace Backend.Models;

public class Bookmark : BaseEntity
{
    private readonly AppDbContext _db;

    public Bookmark(AppDbContext db) 
    {
        Title = string.Empty;
        Note = string.Empty;
        _db = db;
    }

    [Key]
    public Guid Id { get; set; }

    public User? User => _db.Users.FirstOrDefault(u => u.Id == UserId);
    
    public Guid UserId { get; set; }

    public Episode? Episode => _db.Episodes.FirstOrDefault(e => e.Id == EpisodeId);
    
    public Guid EpisodeId { get; set; }
    
    /// <summary>
    /// Title of the bookmark
    /// </summary>
    public string Title { get; set; }
    
    /// <summary>
    ///  Optional note associated with the bookmark
    /// </summary>
    public string Note { get; set; }
    
    /// <summary>
    ///  Time of the bookmark within the episode
    /// </summary>
    public double Time { get; set; }
}