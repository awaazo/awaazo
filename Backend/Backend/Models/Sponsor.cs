using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Sponsor : BaseEntity
{
    [Key]
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    
    public string Website { get; set; }
}