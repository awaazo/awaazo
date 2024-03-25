using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers.Requests
{
    public class StripeAddCardRequest
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = String.Empty;

        [Required]
        public string Number { get; set; } = String.Empty;

        [Required]
        public string ExpiryYear { get; set; } = String.Empty;

        [Required]
        public string ExpiryMonth { get; set;} = String.Empty;

        [Required]
        public string Cvc { get; set;} = String.Empty;

    }
}
