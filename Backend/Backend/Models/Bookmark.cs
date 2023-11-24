using System.ComponentModel.DataAnnotations;
using Backend.Infrastructure;

namespace Backend.Models;

public class Bookmark : BaseEntity
{
    public Bookmark() 
    {
        Title = string.Empty;
        Note = string.Empty;
        Time = 0.0;
    }

    [Key]
    public Guid Id { get; set; }

    public User User { get; set; } = null!;
    
    public Guid UserId { get; set; }

    public Episode Episode { get; set; } = null!;
    
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