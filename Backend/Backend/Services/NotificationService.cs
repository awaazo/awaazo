using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PusherServer;
using static Backend.Infrastructure.FileStorageHelper;

namespace Backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly Pusher _pusher;
        private readonly AppDbContext _db;
        private readonly IConfiguration _configuration;

        public NotificationService(IConfiguration configuration,AppDbContext db) {
            _configuration = configuration;
            _db = db;
            // Intialize the Pusher Instance
            var options = new PusherOptions
            {
                Cluster = _configuration["Pusher:Cluster"],
                Encrypted = true
            };
            _pusher = new Pusher(
                _configuration["Pusher:PUSHER_APP_ID"],
                _configuration["Pusher:PUSHER_APP_KEY"],
                _configuration["Pusher:PUSHER_APP_SECRET"],
                options
            );         
        }


        // Gets Number of Unread Notifications
        public async Task<int> GetUnreadNoticationCountAsync(User user)
        {
            return await _db.Notifications!.Where(u => (u.UserId == user.Id) && u.IsRead == false).CountAsync();
        }

       
        // Get All the Notifications
        public async Task<List<NotificationResponse>> GetAllNotificationAsync(User user)
        {         
            //Get the Notifications
            List<Notification> notifications = await _db.Notifications!.Where(u => u.UserId == user.Id).ToListAsync();

            // Update the IsRead Bool value to True
            List<NotificationResponse> response = new List<NotificationResponse>();
          
            foreach (Notification notification in notifications)
            {
                // Cast the Notification Object to Desired Output
                response.Add((NotificationResponse)notification);

                // Update the IsRead Value
                if(notification.IsRead == false)
                {
                    notification.IsRead = true;
                    _db.Update(notification);
                }  
            }
            // Save the Changes to DB
            await _db.SaveChangesAsync();

            //Return the List of Notification Response 
            return response;        
        }     

        // HELPER FUNCTION - Will Send Notification to all the Subscribed User 
        public async Task<bool> AddEpisodeNotification(Guid PodcastId,Episode episode,AppDbContext db)
        {
            // Get All the followers
            List<PodcastFollow> podcastFollow = await db.PodcastFollows!.Where(u => u.PodcastId == PodcastId).ToListAsync();
            
            //Loop through all of them
            foreach (PodcastFollow follow in podcastFollow)
            {
                // TODO Add an Apropriete Picture for the Notification
                Notification notification = new Notification()
                {
                    UserId = follow.UserId,
                    Title = "Podcast : " + episode.Podcast.Name,
                    Message = "New Episode added : " + episode.EpisodeName,
                    Link = episode.Id.ToString(),
                    Media = "https://png.pngtree.com/png-vector/20211018/ourmid/pngtree-simple-podcast-logo-design-png-image_3991612.png",
                    Type = Notification.NotificationType.PodcastAlert,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };            
                await CreateNotification(notification, db);
            }
            return true;
        }

        #region Private Methods

        // Trigger Message and Save the Notification to the Database 
        private async Task<bool> CreateNotification(Notification notification, AppDbContext db)
        {
            // Check Whether the User Id is null or not
            if (notification.UserId == Guid.Empty)
            {
                throw new Exception("Please Pass User ID");
            }
            // Check if user Exist
            if (_db.Users.FirstOrDefaultAsync(u => u.Id == notification.UserId) == null)
            {
                throw new Exception("User does not Exist");
            }

            // Trigger Notification
            await TriggerNotification(notification.UserId.ToString(), "notification", notification);

            //Add the Notification to DB
            await db.Notifications!.AddAsync(notification);
            return true;
        }

        // Trigger Function
        private async Task<ITriggerResult> TriggerNotification(string channel, string Event, Notification notification)
        {
            return await _pusher.TriggerAsync(channel, Event, notification);
        }

        #endregion
    }
}
