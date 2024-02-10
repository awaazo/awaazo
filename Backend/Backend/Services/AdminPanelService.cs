using System.Net.Mail;
using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Models.stats;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AdminPanelService
{
    private readonly AppDbContext _db;
    private readonly EmailService _emailService;

    private readonly string _awazooEmail;
    public AdminPanelService(AppDbContext db, IConfiguration config, EmailService emailService) {
        _db = db;
        _emailService = emailService;
        
        // Insure that there's at least 1 admin for testing purpose 
        User? admin = db.Users.FirstOrDefault(u => u.IsAdmin);
        if (admin is null) {
            User newAdmin = new User() {
                Email = config["Admin:Email"],
                Password = config["Admin:Password"],
                Username = "admin",
                DisplayName = "Admin",
                IsAdmin = true,
            };
            db.Users.Add(newAdmin);
            db.SaveChanges();
        }

        _awazooEmail = config["Smtp:Username"];
    }

    public Task<User[]> GetAllUsers() {
        return _db.Users.ToArrayAsync();
    }

    public async Task BanUser(User admin, Guid userId) {
        User? user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
            throw new InvalidDataException("Invalid user ID");
        
        user.DeletedAt = DateTime.Now;
        user.DeletedBy = admin.Id;
        _db.Users.Update(user);
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

    private const int EmailLogsPerPage = 20;
    public Task<AdminEmailLog[]> EmailLogs(User admin, int page) {
        return _db.AdminEmailLogs.Skip(page * EmailLogsPerPage).Take(EmailLogsPerPage).ToArrayAsync();
    }
}