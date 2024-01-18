using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Requests;

/// <summary>
/// Login Request.
/// </summary>
[BindProperties]
public class LoginRequest
{
    /// <summary>
    /// Email of the User.
    /// </summary>
    [Required]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Password of the User.
    /// </summary>
    [Required]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Google SSO Request.
/// </summary>
[BindProperties]
public class GoogleRequest
{
    /// <summary>
    /// Google Email.
    /// </summary>
    [Required]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Unique Identifier for the Google Account.
    /// </summary>
    [Required]
    public string Sub { get; set; } = string.Empty;

    /// <summary>
    /// Token provided by Google SSO.
    /// </summary>
    [Required]
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Avatar used by the User's Google Account.
    /// </summary>
    [Required]
    public string Avatar{get;set;} = User.DEFAULT_AVATAR_NAME;

    /// <summary>
    /// Given Name of the User.
    /// </summary>
    [Required]
    public string Name {get;set;} = string.Empty;
}

/// <summary>
/// Register Request.
/// </summary>
[BindProperties]
public class RegisterRequest : LoginRequest
{
    /// <summary>
    /// Date of Birth of the User.
    /// </summary>
    [Required]
    public DateTime DateOfBirth { get; set; } = DateTime.Now;

    /// <summary>
    /// Gender of the User.
    /// </summary>
    [Required]
    public string Gender { get; set; } = User.GetGenderEnumString(User.GenderEnum.None);

    /// <summary>
    /// Username of the User.
    /// </summary>
    [Required]
    public string Username { get; set; } = string.Empty;
}

/// <summary>
/// CheckEmailRequest
/// </summary>
[BindProperties]
public class CheckEmailRequest
{
    /// <summary>
    /// Email of the User to be Checked.
    /// </summary>
    [Required]
    public string Email { get; set; } = string.Empty;
}



