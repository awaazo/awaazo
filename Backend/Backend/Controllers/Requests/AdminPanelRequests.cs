using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests;

[BindProperties]
public class AdminEmailUserRequest
{
    [Required] public string Title { get; set; } = string.Empty;

    [Required] public string EmailBody { get; set; } = string.Empty;
    
    [Required] public bool IsHtmlBody { get; set; } = false;
}