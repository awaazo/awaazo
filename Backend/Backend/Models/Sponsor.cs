using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Sponsor : BaseEntity
{

    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Annotation Annotation { get; set; } = null!;

    public Guid AnnotationId { get; set; } = Guid.Empty;

    public string Name { get; set; } = string.Empty;
    
    public string Website { get; set; } = string.Empty;
}