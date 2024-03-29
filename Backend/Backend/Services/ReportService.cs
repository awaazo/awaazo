﻿using System.Collections.Immutable;
using System.Text.Json;
using Backend.Controllers;
using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class ReportService
{
    private readonly AppDbContext _db;
    private readonly ILogger<ReportService> _logger;
    public static readonly HashSet<string> AcceptableReportTargets = new() {
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
    
    public async Task<Report> Report(ReportRequest request) {
        // Check if entity is valid 
        if (!AcceptableReportTargets.Contains(request.TargetEntityName)) {
            throw new InvalidOperationException("Invalid report target " + request.TargetEntityName);
        }
        
        // Check that reported by is valid 
        if (await _db.Users.FindAsync(request.ReportedBy) is null) {
            throw new InvalidOperationException("Invalid reporter");
        }
        
        // Check that target entity exists
        var target = await GetReportTargetFromId(request.TargetEntityName, request.TargetId);
        if (target is null) {
            throw new InvalidOperationException("Invalid target entity ID " + request.TargetId + " might be deleted?");
        }
        
        // Check if report already exists
        if (await _db.Reports.AnyAsync(r => r.TargetEntityName == request.TargetEntityName && r.TargetId == request.TargetId && r.ReportedBy == request.ReportedBy)) {
            throw new InvalidOperationException("Report already exists");
        }

        Report report = new Report {
            TargetEntityName = request.TargetEntityName,
            TargetId = request.TargetId,
            ReportedBy = request.ReportedBy,
            Reason = request.Reason,
        };
        await _db.Reports.AddAsync(report);
        _db.Reports.Add(report);
        await _db.SaveChangesAsync();

        return report;
    }
    
    public Task<ImmutableArray<Report>> GetPendingReports() {
        return Task.Run(() => _db.Reports.ToImmutableArray()) ;
    }
    
    public async Task ResolveReport(User admin, Guid reportId) {
        Report? report = await _db.Reports.FindAsync(reportId);
        if (report is null) {
            throw new InvalidOperationException("Invalid report ID");
        }
        await DeleteReportedEntity(admin.Id, report.TargetEntityName, report.TargetId);
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
    
    private async Task DeleteReportedEntity(Guid deletedBy, string entityName, Guid id) {
        switch (entityName) {
            case nameof(User):
                User? user = await _db.Users.FindAsync(id);
                if (user is not null) {
                    user.DeletedAt = DateTime.Now;
                    user.DeletedBy = deletedBy;
                    _db.Users.Remove(user);
                }
                break;
            case nameof(Podcast):
                Podcast? podcast = await _db.Podcasts.FindAsync(id);
                if (podcast is not null) {
                    podcast.DeletedAt = DateTime.Now;
                    podcast.DeletedBy = deletedBy;
                    _db.Podcasts.Remove(podcast);
                }
                break;
            case nameof(Episode):
                Episode? episode = await _db.Episodes.FindAsync(id);
                if (episode is not null) {
                    episode.DeletedAt = DateTime.Now;
                    episode.DeletedBy = deletedBy;
                    _db.Episodes.Remove(episode);
                }
                break;
            case nameof(Comment):
                Comment? comment = await _db.Comments.FindAsync(id);
                if (comment is not null) {
                    comment.DeletedAt = DateTime.Now;
                    comment.DeletedBy = deletedBy;
                    _db.Comments.Remove(comment);
                }
                break;
            case nameof(CommentReply):
                CommentReply? commentReply = await _db.CommentReplies.FindAsync(id);
                if (commentReply is not null) {
                    commentReply.DeletedAt = DateTime.Now;
                    commentReply.DeletedBy = deletedBy;
                    _db.CommentReplies.Remove(commentReply);
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