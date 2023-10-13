using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Sponsor : BaseEntity
{

    public Sponsor() 
    {
        Name = string.Empty;
        Website = string.Empty;
    }

    [Key]
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public string? Website { get; set; }
}