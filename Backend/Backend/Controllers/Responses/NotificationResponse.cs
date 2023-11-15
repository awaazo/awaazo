using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Responses
{
    public class NotificationResponse
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public string Link { get; set; } = string.Empty;
        
        [Required]
        public bool IsRead { get; set; } = false;

        [Required]
        public string Media { get; set; } = "DefaultMedia";

        [Required]
        public string Type { get; set; } = "None";

        [Required]
        public DateTime CreatedAt { get; set; }

        public static explicit operator NotificationResponse(Notification v)
        {
            NotificationResponse response = new()
            {
                Id = v.Id,
                Title = v.Title,
                Message = v.Message,
                Link = v.Link,
                IsRead = v.IsRead,
                Media = v.Media,
                Type = v.GetTypeString(),
                CreatedAt = v.CreatedAt,
            };

            return response;
        }

    }
}
