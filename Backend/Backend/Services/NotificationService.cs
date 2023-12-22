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

        /// <summary>
        /// Pusher Instance
        /// </summary>
        private readonly Pusher _pusher;
        
        /// <summary>
        /// Database Context
        /// </summary>
        private readonly AppDbContext _db;
        
        /// <summary>
        /// Configuration Instance to access configuration
        /// </summary>
        private readonly IConfiguration _configuration;
        
        /// <summary>
        /// A DEFAULT Notification Picture
        /// </summary>
        private const string DEFAULT_NOTIFICATION_PICTURE = "https://png.pngtree.com/png-vector/20211018/ourmid/pngtree-simple-podcast-logo-design-png-image_3991612.png";
        

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


        /// <summary>
        /// Gets Count of Unread Notification
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<int> GetUnreadNoticationCountAsync(User user)
        {
            return await _db.Notifications!.Where(u => (u.UserId == user.Id) && u.IsRead == false).CountAsync();
        }

       
        /// <summary>
        /// Gets All the notification
        /// </summary>
        /// <param name="user"></param>
        /// <param name="domainUrl"></param>
        /// <returns></returns>
        public async Task<List<NotificationResponse>> GetAllNotificationAsync(User user,string domainUrl)
        {         
            //Get the Notifications
            List<Notification> notifications = await _db.Notifications!.Where(u => u.UserId == user.Id).ToListAsync();

            // Update the IsRead Bool value to True
            List<NotificationResponse> response = new List<NotificationResponse>();
          
            foreach (Notification notification in notifications)
            {
                // Get Cover Art when Notification Regarding Podcast is being rendered
                if (notification.Type == Notification.NotificationType.PodcastAlert)
                {
                    // Dont show notification if podcast have been deleted
                    if(await _db.Podcasts.AnyAsync(u => u.Id == Guid.Parse(notification.Link)))
                    {
                        response.Add(new PodcastNotificationResponse(notification, domainUrl));  
                    }

                }



                // When type is None then just get the saved Image
                if(notification.Type == Notification.NotificationType.None)
                {
                    response.Add(new NotificationResponse(notification));

                }
                
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

        /// <summary>
        /// Helper function to Send Notification to the subscribed Users
        /// </summary>
        /// <param name="PodcastId"></param>
        /// <param name="episode"></param>
        /// <param name="db"></param>
        /// <returns></returns>
        public async Task<bool> AddEpisodeNotification(Guid PodcastId,Episode episode,AppDbContext db)
        {
            // Get All the followers
            List<PodcastFollow> podcastFollow = await db.PodcastFollows!.Where(u => u.PodcastId == PodcastId).ToListAsync();
            
            //Loop through all of them
            foreach (PodcastFollow follow in podcastFollow)
            {
                // Add Cover Art for Notification Media
                Notification notification = new Notification()
                {
                    UserId = follow.UserId,
                    Title = "Podcast : " + episode.Podcast.Name,
                    Message = "New Episode added : " + episode.EpisodeName,
                    Link = episode.Podcast.Id.ToString(),
                    Media = DEFAULT_NOTIFICATION_PICTURE,
                    Type = Notification.NotificationType.PodcastAlert,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };            
                await CreateNotification(notification, db);
            }
            return true;
        }

        #region Private Methods

        /// <summary>
        /// Creates and trigger notification
        /// </summary>
        /// <param name="notification"></param>
        /// <param name="db"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
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

        /// <summary>
        /// Trigger any Kind of events
        /// </summary>
        /// <param name="channel"></param>
        /// <param name="Event"></param>
        /// <param name="notification"></param>
        /// <returns></returns>
        private async Task<ITriggerResult> TriggerNotification(string channel, string Event, Notification notification)
        {
            return await _pusher.TriggerAsync(channel, Event, notification);
        }

        #endregion
    }
}
