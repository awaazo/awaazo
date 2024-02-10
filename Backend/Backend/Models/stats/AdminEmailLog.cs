using System.Diagnostics.CodeAnalysis;
using Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.stats;

public class AdminEmailLog : BaseEntity
{

    private readonly AppDbContext _db;
    public AdminEmailLog(AppDbContext db) {
        _db = db;
    }
    
    public Guid AdminUserId { get; set; } = Guid.Empty;
    
    public string Subject { get; set; } = String.Empty;

    public string Body { get; set; } = string.Empty;

    public bool BodyIsHtml { get; set; } = false;

    /// <summary>
    /// Was the email sent successfully?
    /// </summary>
    public bool Delivered { get; set; } = false;

    /// <summary>
    /// This field will be filled with Exception.Message if Delivered is false
    /// </summary>
    public string? ErrorMessage { get; set; } = string.Empty;
    
    public Guid ToUserId { get; set; } = Guid.Empty;

    public Task<User?> From => _db.Users.FirstOrDefaultAsync(u => u.Id == AdminUserId);

    public Task<User?> To => _db.Users.FirstOrDefaultAsync(u => u.Id == ToUserId);
}