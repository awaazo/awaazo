using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly AppDbContext _db;

        public SubscriptionService(AppDbContext db) { 
            _db = db;      
        }

        public async Task<List<PodcastResponse>> MySubscriptionsAsync(User user,string DomainUrl)
        {
            // Get the PodcastFollow object for the User
            List<PodcastFollow> podcastFollows = await _db.PodcastFollows!.Where(u => u.UserId == user.Id).ToListAsync();
            List<PodcastResponse> list = new List<PodcastResponse>();

            // Loop through Objects and find the Append the corrosponding podcast to the list
            foreach (PodcastFollow podcastfollow in podcastFollows)
            {
                Podcast? podcast = await _db.Podcasts.FirstOrDefaultAsync(u => u.Id == podcastfollow.PodcastId);

                if (podcast == null)
                {
                    throw new Exception("Illegal State");
                }
                
                list.Add(new PodcastResponse(podcast,DomainUrl));
            }
            return list;
        }

        public async Task<List<UserProfileResponse>> GetPodcastSubscriptionAsync(Guid PodcastId,User user,string DomainUrl)
        {
            if (await _db.Podcasts.AnyAsync(u => (u.Id == PodcastId) && (u.PodcasterId == user.Id)) == false)
            {
                throw new Exception("Podcast Does not Exist or You are not Authorized");
            }

            // Get the PodcastFollow object for the Podcast
            List<PodcastFollow> podcastFollows = await _db.PodcastFollows!.Where(u => u.PodcastId == PodcastId).Include(u => u.User).ToListAsync();

            List<UserProfileResponse> list = new List<UserProfileResponse>();
            // Loop through Podcast Follow Objects
            foreach (PodcastFollow follow in podcastFollows)
            {
                Console.WriteLine(follow.User);
                User u1 = follow.User;
                UserProfileResponse res = new UserProfileResponse(u1,DomainUrl);
                res.AvatarUrl = string.Format("{0}profile/avatar", DomainUrl);
                list.Add(res);
            }

            return list;
        }
       
        public async Task<bool> SubscribeAsync(Guid PodcastId, User user)
        {
            // Check Whether the passed Argument is NULL or Not
            if(PodcastId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(PodcastId));
            }

            Podcast? podcast = await _db.Podcasts.FirstOrDefaultAsync(u => u.Id == PodcastId);
            // Check Whether the Podcast Exist or not
            if(podcast == null) 
            {
                throw new Exception("Podcast Does not Exist");
            }
            // Check Whether the user is trying subscribe to his own podcast
            if(podcast.PodcasterId == user.Id)
            {
                throw new Exception("You cant Subscribe to your own Podcast");
            }
            // Check Whether the User have already Subscribed to the podcast or not
            if (await _db.PodcastFollows!.AnyAsync(u => (u.PodcastId == PodcastId) && u.UserId == user.Id))
            {
                throw new Exception("You have Already Subscribed to this Podcast");
            }

            //Otherwise Create Podcast Follow Object and Append it to DB
            PodcastFollow podcastFollow = new PodcastFollow()
            {
                PodcastId = PodcastId,
                UserId = user.Id,              
            };

            await _db.PodcastFollows!.AddAsync(podcastFollow);
            return await _db.SaveChangesAsync() > 0;
        }

        public async Task<bool> UnsubscribeAsync(Guid PodcastId, User user)
        {
            // Check Whether the passed Argument is NULL or Not
            if (PodcastId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(PodcastId));
            }
            // Check Whether the Podcast Exist or not
            if (await _db.Podcasts.FirstOrDefaultAsync(u => u.Id == PodcastId) == null)
            {
                throw new Exception("Podcast Does not Exist");
            }
            //Check Whether the podcast subscribed or not
            PodcastFollow? podcastFollow = await _db.PodcastFollows!.FirstOrDefaultAsync(u => (u.PodcastId == PodcastId) && (u.UserId == user.Id));
            if (podcastFollow == null)
            {
                throw new Exception("You havent Subscribed to this Podcast");
            }
            _db.PodcastFollows!.Remove(podcastFollow);
            return await _db.SaveChangesAsync() > 0;
        }

        public async Task<bool> IsSubscribed(Guid PodcastId, User user)
        {
            return await _db.PodcastFollows!.AnyAsync(u => (u.PodcastId == PodcastId) && (u.UserId == user.Id));
        }        
    }
}
