using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Files : BaseEntity
    {

        public Files() {

            Name = string.Empty;
            MimeType = string.Empty;
            Path = string.Empty;
        

        }
        [Key]
        public Guid FileId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string MimeType { get; set; }

        public string? Path { get; set; } 


    }
}
