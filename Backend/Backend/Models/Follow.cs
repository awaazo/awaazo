

using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class PodcastFollow
    {
        public User User { get; set; } = null!;
        
        public Guid UserId { get; set; }
        
        [Key]
        public Guid Id { get; set; }

        public Guid PodcastId { get; set; }
    }

    public class UserFollow
    {
        public User Follower { get; set; } = null!;
        
        public Guid FollowerId { get; set; }
        
        [Key]
        public Guid Id { get; set; }
        
        public Guid FollowingId { get; set; }
    }

    public class Subscription
    {
        public User User { get; set; } = null!;
        
        public Guid UserId { get; set; }
        
        [Key]
        public Guid Id { get; set; }
        
        public SubType Type { get; set; }

        public DateTime StartDate { get; set; }
        
        public DateTime EndDate { get; set; }
        
        public enum SubType
        {
            Basic, Premium
        }
    }

    public class PodcastRating : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }

        public User User { get; set; } = null!;
        
        public Guid UserId { get; set; }
        
        public Guid PodcastId { get; set; }
        
        public uint Rating { get; set; }
        
    }
}

