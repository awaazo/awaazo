using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using PusherServer;

namespace Backend.Services.Interfaces
{
    public interface INotificationService
    {
        public Task<bool> CreateNotification(Notification notification, AppDbContext db);
        public Task<ITriggerResult> TriggerNotification(string channel, string Event, Notification notification);

        public Task<bool> AddEpisodeNotification(Guid PodcastId, Episode episode, AppDbContext db);

        public Task<List<NotificationResponse>> GetAllNotificationAsync(User user);

    }
}
