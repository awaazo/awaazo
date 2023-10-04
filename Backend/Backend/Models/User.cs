using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// User model.
/// </summary>
public class User : BaseEntity
{
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
    public string? Email { get; set; }

    /// <summary>
    /// User password.
    /// </summary>
    public string? Password { get; set; }

    public DateTime DateOfBirth { get; set; }
}