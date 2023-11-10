using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface ISubscriptionService
    {
        public Task<bool> SubscribeAsync(Guid PodcastId, User user);
        public Task<bool> UnsubscribeAsync(Guid PodcastId, User user);
        public Task<List<PodcastResponse>> MySubscriptionsAsync(User user,string DomainUrl);
        public Task<List<UserProfileResponse>> GetPodcastSubscriptionAsync(Guid PodcastId,string DomainUrl);
        public Task<bool> IsSubscribed(Guid PodcastId, User user);
    }
}
