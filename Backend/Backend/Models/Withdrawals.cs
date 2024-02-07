using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represent the withdrawal done by the user
    /// </summary>
    public class Withdrawals : BaseEntity
    {
        /// <summary>
        /// ID of Withdrawal
        /// </summary>
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// User Id associated with User
        /// </summary>
        [Required]
        public Guid UserId { get; set; } = Guid.Empty;

        /// <summary>
        /// User associated with the withdrawals
        /// </summary>
        [Required]
        public User User { get; set; } = null!;

        /// <summary>
        /// Amount Withdrawed
        /// </summary>
        [Required]
        public double Amount { get; set; } = 0.0;  

    }
}
