using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using static Backend.Models.User;

namespace Backend.Models
{
    public class Notification :BaseEntity 
    {
        /// <summary>
        /// User Unique Identifier.
        /// </summary>
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public User User { get; set; } = null!;

        public Guid UserId { get; set; } = Guid.Empty;

        [Required] 
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } =string.Empty;
        public string Link { get; set; } = string.Empty;
        [Required]
        public bool IsRead { get; set; } = false;

        [Required]
        public string Media { get; set; } = "DefaultMedia";

        [DefaultValue(NotificationType.None)]
        public NotificationType Type { get; set; } 

        //Add more types of Notification
        public enum NotificationType
        {
            PodcastAlert,Information,Warning,None
        }

        public string GetTypeString()
        {
            return Type switch
            {
                NotificationType.PodcastAlert => "PodcastAlert",
                NotificationType.Information => "Information",
                NotificationType.Warning => "Warning",
                NotificationType.None => "None",
                _ => "None",
            };
        }

    }

    
}
