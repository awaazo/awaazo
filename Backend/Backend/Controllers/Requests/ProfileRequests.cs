using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
   [BindProperties]
   public class ChangePasswordRequest
   {
      [Required]
      public string OldPassword { get; set; }
      
      [Required]
      public string NewPassword { get; set; }
      
      [Required]
      public string ConfirmNewPassword { get; set; }
   }
}

