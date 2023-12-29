 using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using PusherServer;

namespace Backend.Services.Interfaces
{
    public interface INotificationService
    {
        public Task<int> GetUnreadNoticationCountAsync(User user);
        public Task<List<NotificationResponse>> GetAllNotificationAsync(User user, string domainUrl,int page,int pageSize);
        public Task<bool> AddEpisodeNotification(Guid PodcastId, Episode episode, AppDbContext db);
    }
}
