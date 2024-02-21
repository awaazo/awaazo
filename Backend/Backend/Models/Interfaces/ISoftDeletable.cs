namespace Backend.Models.Interfaces;

public interface ISoftDeletable
{

    public DateTime? DeletedAt { get; set; }
    
    /// <summary>
    /// The Admin responsible for the deletion.
    /// </summary>
    public Guid DeletedBy { get; set; }
}