using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represent the points
    /// </summary>
    public class Points : BaseEntity
    {
        /// <summary>
        /// Get New guid
        /// </summary>
        [Required]
        public Guid Id { get; set; } = Guid.NewGuid();
        /// <summary>
        /// User Id associated with Points
        /// </summary>
        [Required]
        public Guid UserId { get; set; } = Guid.Empty;

        /// <summary>
        /// Episode Id associated with points
        /// </summary>
        [Required]
        public Guid EpisodeId { get; set; } = Guid.Empty;

        /// <summary>
        /// Episode with the points
        /// </summary>
        [Required]
        public Episode Episode { get; set; } = null!;

        /// <summary>
        /// No of Points
        /// </summary>
        [Required]
        public int PointCount {  get; set; } = 0;

        /// <summary>
        /// Amount in CAD
        /// </summary>
        [Required]
        public double Amount { get; set;} = 0.0;

        /// <summary>
        /// Whether the transaction have went through or not
        /// </summary>
        [Required]
        public bool Success { get; set; } = false;
    }
}
