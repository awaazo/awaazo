using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public class User : BaseEntity
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    public string Password { get; set; }

    public DateTime DateOfBirth { get; set; }
}