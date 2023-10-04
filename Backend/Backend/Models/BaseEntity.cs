namespace Backend.Models;

/// <summary>
/// Base entity class.
/// </summary>
public class BaseEntity
{
    /// <summary>
    /// Creation date of the entity.
    /// </summary>
    /// <value>DateTime: The creation date of the entity.</value>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Update date of the entity.
    /// </summary>
    /// <value>DateTime: The update date of the entity</value>
    public DateTime UpdatedAt { get; set; }
}