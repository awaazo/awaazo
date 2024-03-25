using Backend.Models.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represents the Episode Highlight
    /// </summary>
    public class Highlight : BaseEntity, ISoftDeletable
    {
        /// <summary>
        /// ID of Highlight
        /// </summary>
        [Required]
        [Key]
        public Guid HighlightId { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Episode ID of the associated Episode
        /// </summary>
        [Required]
        public Guid EpisodeId { get; set; } = Guid.Empty;

        /// <summary>
        /// User Id associated with Highlight creator
        /// </summary>
        [Required]
        public Guid UserId { get; set; } = Guid.Empty;

        /// <summary>
        /// The start timestamp of the highlight in the episode
        /// </summary>
        public double StartTime { get; set; } = 0;

        /// <summary>
        /// The end timestamp of the highlight
        /// </summary>
        public double EndTime { get; set; } = 0;

        /// <summary>
        /// Title of the highlight
        /// </summary>
        public string Title { get; set; } = "No Title Given";

        /// <summary>
        /// Description of the highlight
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// The location for the highlight audio
        /// </summary>
        public string Audio { get; set; } = string.Empty;

        /// <summary>
        /// Soft delete Neccesseties
        /// </summary>
        public DateTime? DeletedAt { get; set; }

        /// <summary>
        /// Soft delete Neccesseties
        /// </summary>
        public Guid DeletedBy { get; set; }
    }  
}
