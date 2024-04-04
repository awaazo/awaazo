using System.Net.Mail;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Models.stats;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Stripe;

namespace Backend.Services;

public class AdminPanelService
{
    private readonly AppDbContext _db;
    private readonly EmailService _emailService;

    private readonly string _awazooEmail;
    private const int EmailLogsPerPage = 20;
    private const int MAX_ADMIN_PODCAST_RECOMMENDATIONS = 10;

    public AdminPanelService(AppDbContext db, IConfiguration config, EmailService emailService) {
        _db = db;
        _emailService = emailService;
        
        // Insure that there's at least 1 admin for testing purpose 
        User? admin = db.Users.FirstOrDefault(u => u.IsAdmin);
        if (admin is null) {
            User newAdmin = new User() {
                Email = config["Admin:Email"],
                Password = BCrypt.Net.BCrypt.HashPassword(config["Admin:Password"]),
                Username = "admin",
                DisplayName = "Admin",
                IsAdmin = true,
            };
            db.Users.Add(newAdmin);
            db.SaveChanges();
        }

        _awazooEmail = config["Smtp:Username"];
    }

    public Task<User[]> GetAllUsers(bool withDeleted) {
        if (withDeleted)
            return _db.Users.IgnoreQueryFilters().ToArrayAsync();
        return _db.Users.ToArrayAsync();
    }

    public async Task BanUser(User admin, Guid userId) {
        User? user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
            throw new InvalidDataException("Invalid user ID");
        
        user.DeletedAt = DateTime.Now;
        user.DeletedBy = admin.Id;
        _db.Users.Update(user);
        
        // Soft delete all podcasts and episodes associated with the user
        Podcast[] podcasts = await _db.Podcasts.Where(p => p.PodcasterId == userId).ToArrayAsync();
        foreach (Podcast podcast in podcasts) {
            podcast.DeletedAt = DateTime.Now;
            podcast.DeletedBy = admin.Id;
        }
        _db.Podcasts.UpdateRange(podcasts);
        
        Episode[] episodes = await _db.Episodes.Where(e => e.Podcast.PodcasterId == userId).ToArrayAsync();
        foreach (Episode episode in episodes) {
            episode.DeletedAt = DateTime.Now;
            episode.DeletedBy = admin.Id;
        }
        _db.Episodes.UpdateRange(episodes);
        
        // Soft delete all comments and comments reply associated with the user
        Comment[] comments = await _db.Comments.Where(c => c.UserId == userId).ToArrayAsync();
        foreach (Comment comment in comments) {
            comment.DeletedAt = DateTime.Now;
            comment.DeletedBy = admin.Id;
        }
        _db.Comments.UpdateRange(comments);
        
        CommentReply[] commentReplies = await _db.CommentReplies.Where(cr => cr.UserId == userId).ToArrayAsync();
        foreach (CommentReply commentReply in commentReplies) {
            commentReply.DeletedAt = DateTime.Now;
            commentReply.DeletedBy = admin.Id;
        }
        _db.CommentReplies.UpdateRange(commentReplies);
        
        await _db.SaveChangesAsync();
    }

    public async Task EmailUser(User admin, Guid userId, AdminEmailUserRequest request) {
        User? user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
            throw new InvalidDataException("Invalid user ID");

        var mail = new MailMessage {
            From = new MailAddress(_awazooEmail),
            To = { new MailAddress(user.Email) },
            Subject = request.Title,
            Body = request.EmailBody,
            IsBodyHtml = request.IsHtmlBody,
        };
        
        // Add to db log to retreive history
        AdminEmailLog log = new(_db) {
            Id = Guid.NewGuid(),
            AdminUserId = admin.Id,
            ToUserId = userId,
            Subject = request.Title,
            Body = request.EmailBody,
            BodyIsHtml = request.IsHtmlBody,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        try {
            _emailService.Send(mail);
            log.Delivered = true;
        } catch (Exception e) {
            log.Delivered = false;
            log.ErrorMessage = e.Message;
            throw;
        } finally {
            _db.AdminEmailLogs.Add(log);
            await _db.SaveChangesAsync();          
        }
    }

    #region admin podcast recommendations

    /// <summary>
    /// Creates a new Daily recommendation if the limit hasnt already been reached
    /// </summary>
    /// <param name="req"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<adminRecommendationResponse> CreateDailyPodcastRecomendationAsync(AdminPodcastRecommendationRequest req, string domainUrl)
    {     
        // Check how many podcasts are still a daily recommendation
        List<Podcast> oldRecommendations = await _db.Podcasts
            .Where(p => p.DailyAdminChoice == true)
            .ToListAsync();

        // Check if max 10 podcast
        if (MAX_ADMIN_PODCAST_RECOMMENDATIONS == oldRecommendations.Count)
        {
            throw new Exception("You can only have a maximum of 10 admin recommendations. Remove some recommendations before adding more");
        }

        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == req.podcastId) ?? throw new Exception("Podcast does not exist");
       
        // Set podcast values
        podcast.DailyAdminChoice = true;        
        if (req.description.IsNullOrEmpty())
        {
            podcast.CustomAdminDescription = string.Empty;
        }
        podcast.CustomAdminDescription = req.description;
        var response = new adminRecommendationResponse(podcast, domainUrl);

        _db.Podcasts.Update(podcast);
        await _db.SaveChangesAsync();

        return response;
    }

    /// <summary>
    /// Return all current admin recommendations
    /// </summary>
    /// <param name="domainUrl"> domainURL is required for responses</param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<List<adminRecommendationResponse>> GetDailyPodcastRecomendationsAsync(string domainUrl)
    {
        var currentRecommendations = await _db.Podcasts
            .Where(p => p.DailyAdminChoice == true)
            .Select(p => new adminRecommendationResponse(p, domainUrl))
            .ToListAsync() ?? throw new Exception("There exists no current admin recommendations");

        return currentRecommendations;
    }

    /// <summary>
    /// Removes all the daily Admin recommendations
    /// </summary>
    /// <param name="podcasts"> Old/current recommendations that are being removed</param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<bool> RemoveDailyPodcastRecomendationsAsync(List<Guid> podcasts)
    {
        List<Podcast> oldRecommendations = await _db.Podcasts
            .Where(p => p.DailyAdminChoice == true && podcasts.Contains(p.Id))
            .ToListAsync() ?? throw new Exception("Cannot find any podcasts with those Id");

        foreach (var oldRec in oldRecommendations)
        {
            oldRec.DailyAdminChoice = false;
            oldRec.CustomAdminDescription = string.Empty;
            _db.Podcasts.Update(oldRec);
        }

        return await _db.SaveChangesAsync() == oldRecommendations.Count;
    }

    /// <summary>
    /// Get the total amount of users in the database. This includes admins.
    /// </summary>
    /// <param name="withDeleted">Optional parameter to include softdeleted users</param>
    /// <returns></returns>
    public async Task<int> GetTotalUsersAsync(bool withDeleted = false)
    {
        int totalUserCount = 0;
        if (withDeleted)
        {
            totalUserCount = await _db.Users.IgnoreQueryFilters().CountAsync();
            return totalUserCount;
        }

        totalUserCount = await _db.Users.CountAsync();
        return totalUserCount;
    }

    /// <summary>
    /// Returns the amount of users created since a certain amount of days, counting admins as well
    /// </summary>
    /// <param name="daysSinceCreation">Threashold for the search, in terms of days</param>
    /// <returns></returns>
    public async Task<int> GetRecentlyCreatedUserCountAsync(int daysSinceCreation)
    {
        var totalUserCount = await _db.Users
            .Where(u => u.CreatedAt >= DateTime.Now.AddDays(-daysSinceCreation))
            .CountAsync();

        return totalUserCount;
    }

    /// <summary>
    /// Returns the amount of users who have created podcasts, IE podcasters
    /// </summary>
    /// <param name="withDeleted">Optional parameter to include softdeleted users</param>
    /// <returns></returns>
    public async Task<int> GetTotalAmountOfPodcastersAsync(bool withDeleted = false)
    {
        int uniquePodcasters = 0;

        if (withDeleted)
        {
            uniquePodcasters = await _db.Podcasts
                .IgnoreQueryFilters()
                .Select(p => p.PodcasterId)
                .Distinct()
                .CountAsync();
            return uniquePodcasters;
        }
        ;
        uniquePodcasters = await _db.Podcasts
            .Select(p => p.PodcasterId)
            .Distinct()
            .CountAsync();

        return uniquePodcasters;
    }

    #endregion

    public Task<AdminEmailLog[]> EmailLogs(User admin, int page) {
        return _db.AdminEmailLogs.Skip(page * EmailLogsPerPage).Take(EmailLogsPerPage).ToArrayAsync();
    }
    
}