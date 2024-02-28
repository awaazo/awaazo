using System.Collections.Immutable;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class ReportService
{
    private readonly AppDbContext _db;
    private readonly ILogger<ReportService> _logger;
    private static readonly HashSet<string> AcceptableReportTargets = new() {
        nameof(User),
        nameof(Podcast),
        nameof(Episode),    
        nameof(Comment),
        nameof(CommentReply)
    };
    
    public ReportService(AppDbContext db, ILogger<ReportService> logger) {
        _db = db;
        _logger = logger;
    }
    
    public async Task<ISoftDeletable> Report(Report report) {
        // Check if entity is valid 
        if (!AcceptableReportTargets.Contains(report.TargetEntityName)) {
            throw new InvalidOperationException("Invalid report target");
        }
        
        // Check that reported by is valid 
        if (await _db.Users.FindAsync(report.ReportedBy) is null) {
            throw new InvalidOperationException("Invalid reporter");
        }
        
        // Check that target entity exists
        var target = await GetReportTargetFromId(report.TargetEntityName, report.TargetId);
        if (target is null) {
            throw new InvalidOperationException("Invalid target entity");
        }
        
        // Check if report already exists
        if (await _db.Reports.AnyAsync(r => r.TargetEntityName == report.TargetEntityName && r.TargetId == report.TargetId && r.ReportedBy == report.ReportedBy)) {
            throw new InvalidOperationException("Report already exists");
        }
        await _db.Reports.AddAsync(report);
        _db.Reports.Add(report);
        await _db.SaveChangesAsync();

        return target;
    }
    
    public Task<ImmutableArray<Report>> GetPendingReports() {
        return Task.Run(() => _db.Reports.ToImmutableArray()) ;
    }
    
    public async Task ResolveReport(User admin, Guid reportId) {
        Report? report = await _db.Reports.FindAsync(reportId);
        if (report is null) {
            throw new InvalidOperationException("Invalid report ID");
        }
        await DeleteReportedEntity(report.TargetEntityName, report.TargetId);
        report.Status = Models.Report.ReportStatus.Resolved;
        report.DeletedBy = admin.Id;       
        _db.Reports.Remove(report); // Soft deleted
        await _db.SaveChangesAsync();
    }
    
    public async Task RejectReport(User admin, Guid reportId) {
        Report? report = await _db.Reports.FindAsync(reportId);
        if (report is null) {
            throw new InvalidOperationException("Invalid report ID");
        }
        report.Status = Models.Report.ReportStatus.Rejected;
        report.DeletedBy = admin.Id;       
        _db.Reports.Remove(report); // Soft deleted report
        await _db.SaveChangesAsync();
    }
    
    private async Task<ISoftDeletable?> GetReportTargetFromId(string entityName, Guid id) {
        return entityName switch {
            nameof(User) => await _db.Users.FindAsync(id),
            nameof(Podcast) => await _db.Podcasts.FindAsync(id),
            nameof(Episode) => await _db.Episodes.FindAsync(id),
            nameof(Comment) => await _db.Comments.FindAsync(id),
            nameof(CommentReply) => await _db.CommentReplies.FindAsync(id),
            _ => null
        };
    }
    
    private async Task DeleteReportedEntity(string entityName, Guid id) {
        switch (entityName) {
            case nameof(User):
                User? user = await _db.Users.FindAsync(id);
                if (user is not null) {
                    user.DeletedAt = DateTime.Now;
                    _db.Users.Update(user);
                }
                break;
            case nameof(Podcast):
                Podcast? podcast = await _db.Podcasts.FindAsync(id);
                if (podcast is not null) {
                    podcast.DeletedAt = DateTime.Now;
                    _db.Podcasts.Update(podcast);
                }
                break;
            case nameof(Episode):
                Episode? episode = await _db.Episodes.FindAsync(id);
                if (episode is not null) {
                    episode.DeletedAt = DateTime.Now;
                    _db.Episodes.Update(episode);
                }
                break;
            case nameof(Comment):
                Comment? comment = await _db.Comments.FindAsync(id);
                if (comment is not null) {
                    comment.DeletedAt = DateTime.Now;
                    _db.Comments.Update(comment);
                }
                break;
            case nameof(CommentReply):
                CommentReply? commentReply = await _db.CommentReplies.FindAsync(id);
                if (commentReply is not null) {
                    commentReply.DeletedAt = DateTime.Now;
                    _db.CommentReplies.Update(commentReply);
                }
                break;
            default:
                throw new InvalidOperationException("Invalid entity name");
        }
    }

    public Task<Report[]> GetResolvedReports() {
        return _db.Reports.IgnoreQueryFilters().Where(r => r.Status == Models.Report.ReportStatus.Resolved)
            .ToArrayAsync();
    }

    public Task<Report[]> GetRejectedReports() {
        return _db.Reports.IgnoreQueryFilters().Where(r => r.Status == Models.Report.ReportStatus.Rejected)
            .ToArrayAsync();
    }
}