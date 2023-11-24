using Backend.Infrastructure;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Responses
{
    public class PodcastNotificationResponse : NotificationResponse
    {
        public PodcastNotificationResponse(Notification notification,string domainUrl) : base(notification)
        {

           
            Media =  domainUrl + string.Format("podcast/{0}/getCoverArt", notification.Link);
        }

        

    }

    public class NotificationResponse
    {
        public NotificationResponse(Notification notification) {
            Id = notification.Id;
            Title = notification.Title;
            Message = notification.Message;
            IsRead = notification.IsRead;
            Type = notification.GetTypeString();
            CreatedAt = notification.CreatedAt;
            Media = notification.Media;
            Link = notification.Link;
        }
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;
        
        [Required]
        public bool IsRead { get; set; } = false;
     
        [Required]
        public string Type { get; set; } = "None";

        [Required]
        public string Media { get; set; } = string.Empty;

        [Required]
        public string Link { get;set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }

    }
}
