using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Represent the withdrawal done by the user
    /// </summary>
    public class Transactions : BaseEntity
    {
        /// <summary>
        /// ID of Withdrawal
        /// </summary>

        [Required]
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>
        /// User Id associated with User
        /// </summary>
        [Required]
        public Guid UserId { get; set; } = Guid.Empty;

        /// <summary>
        /// Account User
        /// </summary>
     
        public User User { get; set; } = null!;

        /// <summary>
        /// Sender Account Id
        /// </summary>
       
        public Guid SenderId { get; set; } = Guid.Empty;

        /// <summary>
        /// Amount Withdrawed
        /// </summary>
        [Required]
        public double Amount { get; set; } = 0.0;


        [Required]
        public Type TransactionType { get; set; } = Type.Gift;


        public enum Type
        {
            Withdraw, Gift
        }

    }
    
}
