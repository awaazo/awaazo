using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Infrastructure;

/// <summary>
/// Handles the Database Context.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    
    public AppDbContext(string connectionString) : base(new DbContextOptionsBuilder<AppDbContext>()
        .UseSqlServer(connectionString)
        .Options)
    {
    }

    public DbSet<User>? Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new UserConfiguration());

        // User 1-to-many Podcast
        modelBuilder.Entity<User>()
            .HasMany(e => e.Podcasts)
            .WithOne(e => e.Podcaster)
            .HasForeignKey(e => e.PodcasterId)
            .IsRequired();

        // Podcast 1-to-many Episode
        modelBuilder.Entity<Podcast>()
            .HasMany(e => e.Episodes)
            .WithOne(e => e.Podcast)
            .HasForeignKey(e => e.PodcastId)
            .IsRequired();
        
        // User 1-to-many Bookmark
        modelBuilder.Entity<User>()
            .HasMany(e => e.Bookmarks)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.User)
            .IsRequired();
        
        // Episode 1-to-many Bookmark
        modelBuilder.Entity<Episode>()
            .HasMany(e => e.Bookmarks)
            .WithOne(e => e.Episode)
            .HasForeignKey(e => e.EpisodeId)
            .IsRequired();
        
        // Episode 1-to-many Annotation
        modelBuilder.Entity<Episode>()
            .HasMany(e => e.Annotations)
            .WithOne(e => e.Episode)
            .HasForeignKey(e => e.EpisodeId)
            .IsRequired();
        
        // Annotation 1-to-1 Medialink
        modelBuilder.Entity<Annotation>()
            .HasOne(e => e.MediaLink)
            .WithOne(e => e.Annotation)
            .HasForeignKey<MediaLink>(e => e.AnnotationId);
    }
    
    public override int SaveChanges()
    {
        var currentTime = DateTime.UtcNow;
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                ((BaseEntity)entry.Entity).CreatedAt = currentTime;
            }

            ((BaseEntity)entry.Entity).UpdatedAt = currentTime;
        }

        return base.SaveChanges();
    }
}