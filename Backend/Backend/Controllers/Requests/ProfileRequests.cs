using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
   [BindProperties]
   public class ChangePasswordRequest
   {
      [Required]
      public string OldPassword { get; set; } = string.Empty;
      
      [Required]
      public string NewPassword { get; set; } = string.Empty;
      
      [Required]
      public string ConfirmNewPassword { get; set; } = string.Empty;
   }

   [BindProperties]
   public class ForgotPasswordEmailRequest
   {
      [Required]
      [EmailAddress]
      public string Email { get; set; } = string.Empty;
   }

   [BindProperties]
   public class ResetPasswordRequest
   {
      [Required]
      [EmailAddress]
      public string Email { get; set; } = string.Empty;
      
      [Required]
      public string Token { get; set; } = string.Empty;
      
      [Required]
      public string NewPassword { get; set; } = string.Empty;
      
      [Required]
      public string ConfirmNewPassword { get; set; } = string.Empty;
   }

   [BindProperties]
   public record VerifyEmailRequest(
      [Required] string Token
      );
}

