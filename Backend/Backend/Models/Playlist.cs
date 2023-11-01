using System.ComponentModel.DataAnnotations;
using Backend.Infrastructure;

namespace Backend.Models
{
    public class Playlist : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        
        public Guid UserId { get; set; }

        public User? User => _context?.Users?.Where(u => u.Id == UserId).FirstOrDefault();
        
        public string Name { get; set; }

        public List<PlaylistElement>? Elements => _context?.PlaylistElements.Where(e => e.PlayerlistId == Id).ToList();

        private AppDbContext _context;
        public Playlist(AppDbContext context)
        {
            Name = string.Empty;
            _context = context;
        }
    }

    public class PlaylistElement
    {
        [Key]
        public Guid Id { get; set; }
        public Guid PlayerlistId { get; set; }
        
        public Guid EpisodeId { get; set; }

        public Episode? Episode => _context?.Episodes?.Where(e => e.Id == EpisodeId).FirstOrDefault();
        
        private AppDbContext _context;
        public PlaylistElement(AppDbContext context)
        {
            _context = context;
        }
    }
}

