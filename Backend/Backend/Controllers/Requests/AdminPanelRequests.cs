﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests;

[BindProperties]
public class AdminEmailUserRequest
{
    [Required] public string Title { get; set; } = string.Empty;

    [Required] public string EmailBody { get; set; } = string.Empty;
    
    [Required] public bool IsHtmlBody { get; set; } = false;
}

//[BindProperties]
public readonly record struct ReportRequest(
    [property: Required] Guid TargetId,
    [property: ReportTargetEntity] string TargetEntityName,
    [property: Required] Guid ReportedBy,
    [property: Required] string Reason);
    
    
internal class ReportTargetEntityAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var val = value.ToString();
        if (ReportService.AcceptableReportTargets.Contains(val))
            return ValidationResult.Success;
        return new ValidationResult($"{val} is not a valid report entity target type. Valid types are {string.Join(", ", ReportService.AcceptableReportTargets)}");
    }
}

[BindProperties]
public class AdminPodcastRecommendationRequest
{
    [Required]
    public Guid podcastId { get; set; } = Guid.Empty;

    public string description { get; set; } = string.Empty;
}

[BindProperties]
public class AdminPodcastRecommendationRemovalRequest
{

    [Required]
    public List<Guid> podcastsToRemove { get; set; } = new List<Guid>();
}