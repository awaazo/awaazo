using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
    [BindProperties]
    public class PlaylistCreateRequest
    {
        [Required] public string Name { get; set; } = string.Empty;
    }

    [BindProperties]
    public class PlaylistAppendRequest
    {
        [Required]
        public Guid PlaylistId { get; set; }
        
        [Required]
        public Guid EpisodeId { get; set; }
    }

    [BindProperties]
    public class PlaylistElementsRequest
    {
        [Required]
        public Guid PlayListId { get; set; }
    }
    
    [BindProperties]
    public class PlaylistDeleteRequest
    {
        [Required]
        public Guid PlaylistId { get; set; }
    }
    
    [BindProperties]
    public class PlaylistElementDeleteRequest
    {
        [Required]
        public Guid PlaylistElementId { get; set; }
    }
}