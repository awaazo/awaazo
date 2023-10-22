using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class File : BaseEntity
    {

        public File() {

            Name = string.Empty;
            MimeType = string.Empty;
        

        }

        public Guid FileId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string MimeType { get; set; }

        [Required]
        public float Size { get; set; } = 0;

        [Required]
        public Byte[] Data { get; set; } = Array.Empty<Byte>();


    }
}
