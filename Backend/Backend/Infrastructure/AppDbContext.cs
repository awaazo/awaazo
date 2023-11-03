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

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Episode> Episodes { get; set; }
    public virtual DbSet<UserEpisodeInteraction>? UserEpisodeInteractions { get; set; }
    public virtual DbSet<Annotation>? Annotations { get; set; }
    public virtual DbSet<Podcast> Podcasts { get; set; }
    public virtual DbSet<UserFollow>? UserFollows { get; set; }
    public virtual DbSet<Sponsor>? Sponsors { get; set; }
    public virtual DbSet<MediaLink>? MediaLinks { get; set; }
    public virtual DbSet<PodcastRating>? PodcastRatings { get; set; }
    public virtual DbSet<PodcastFollow>? PodcastFollows { get; set; }
    public virtual DbSet<Subscription>? Subscriptions { get; set; }
    public virtual DbSet<Files>? File { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new UserConfiguration());


        modelBuilder.Entity<User>().Property(e => e.Interests).HasConversion(
            v => string.Join(",", v),
            v => v.Split(',', StringSplitOptions.RemoveEmptyEntries)
            );

        modelBuilder.Entity<Podcast>().Property(e => e.Tags).HasConversion(

            v => string.Join(",", v), v => v.Split(",", StringSplitOptions.RemoveEmptyEntries));
        
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
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Episode 1-to-many Bookmark
        modelBuilder.Entity<Episode>()
            .HasMany(e => e.Bookmarks)
            .WithOne(e => e.Episode)
            .HasForeignKey(e => e.EpisodeId)
            .OnDelete(DeleteBehavior.Restrict); 
        
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
        
        // Podcast follow many-to-1 User (podcast relation is not needed)
        modelBuilder.Entity<User>()
            .HasMany(e => e.PodcastFollows)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId)
            .IsRequired();
        
        // User follow follow many-to-1 User (podcast relation is not needed)
        modelBuilder.Entity<User>()
            .HasMany(e => e.UserFollows)
            .WithOne(e => e.Follower)
            .HasForeignKey(e => e.FollowerId)
            .IsRequired();
        
        // Subscription many-to-1 user
        modelBuilder.Entity<User>()
            .HasMany(e => e.Subscriptions)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId)
            .IsRequired();
        
        // Podcast rating many-to-1 user
        modelBuilder.Entity<User>()
            .HasMany(e => e.Ratings)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId)

            .IsRequired();
        
        // User 1-to-many UserEpisodeInteraction 
        modelBuilder.Entity<User>()
            .HasMany(e => e.EpisodeInteractions)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId)
            .IsRequired();

        



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