using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
    [BindProperties]
    public class PlaylistCreateRequest
    {
        [Required]
        public string Name { get; set; }
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
}