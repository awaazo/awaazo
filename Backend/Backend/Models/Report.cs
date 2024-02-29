using System.ComponentModel.DataAnnotations;
using Backend.Models.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Models;

[BindProperties]
public class Report : ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [MaxLength(50)] public string TargetEntityName { get; init; }
    
    public Guid TargetId { get; init; }
    
    public Guid ReportedBy { get; init; }

    [MaxLength(2000)] public string Reason { get; init; } = string.Empty;
    
    // Indicates if the report has been resolved or rejected 
    public ReportStatus Status { get; set; } = ReportStatus.Pending;
    
    public DateTime? DeletedAt { get; set; }
    public Guid DeletedBy { get; set; }
    
    public enum ReportStatus
    {
        Resolved, Rejected, Pending
    }
}