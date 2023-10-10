using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// User model.
/// </summary>
public class User : BaseEntity
{
    /// <summary>
    /// Default Constructor.
    /// </summary>
    public User()
    {
        // Make sure that the strings are not null.
        Id = Guid.Empty;
        Email = string.Empty;
        Password = string.Empty;
        DateOfBirth = DateTime.Now;
    }

    /// <summary>
    /// User Unique Identifier.
    /// </summary>
    [Key]
    public Guid Id { get; set; }
    
    /// <summary>
    /// User email.
    /// </summary>
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    /// <summary>
    /// User password.
    /// </summary>
    [Required]
    public string Password { get; set; }

    public string Username { get; set; }

    /// <summary>
    /// URL for user's PFP
    /// </summary>
    public string Avatar { get; set; }

    public string[] Interests { get; set; }
    public DateTime DateOfBirth { get; set; }
    
    public GenderEnum Gender { get; set; }

    /// <summary>
    /// Flag indicating if the user is a podcaster
    /// </summary>
    public bool IsPodcaster { get; set; }

    public ICollection<Podcast> Podcasts { get; } = new List<Podcast>();

    public ICollection<Bookmark> Bookmarks { get; } = new List<Bookmark>();

    public enum GenderEnum
    {
        Male, Female, Other, None
    }
}