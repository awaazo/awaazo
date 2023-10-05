using System.ComponentModel.DataAnnotations;
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

    public DateTime DateOfBirth { get; set; }
}