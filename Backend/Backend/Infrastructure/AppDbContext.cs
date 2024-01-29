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
    public virtual DbSet<UserEpisodeInteraction> UserEpisodeInteractions { get; set; }
    public virtual DbSet<Annotation> Annotations { get; set; }
    public virtual DbSet<Bookmark> Bookmarks { get; set; }
    public virtual DbSet<Podcast> Podcasts { get; set; }
    public virtual DbSet<UserFollow>? UserFollows { get; set; }
    public virtual DbSet<Sponsor> Sponsors { get; set; }
    public virtual DbSet<MediaLink> MediaLinks { get; set; }
    public virtual DbSet<PodcastRating> PodcastRatings { get; set; }
    public virtual DbSet<PodcastFollow>? PodcastFollows { get; set; }
    public virtual DbSet<Subscription>? Subscriptions { get; set; }
    public virtual DbSet<EpisodeLike> EpisodeLikes  { get; set; }
    public virtual DbSet<CommentLike> CommentLikes {get;set;}
    public virtual DbSet<CommentReplyLike> CommentReplyLikes {get;set;}
    //public virtual DbSet<PlaylistElement> PlaylistElements { get; set; }
    public virtual DbSet<Playlist> Playlists { get; set; }
    public virtual DbSet<PlaylistEpisode> PlaylistEpisodes {get;set;}
    public virtual DbSet<Notification>? Notifications { get; set; }
    public virtual DbSet<Comment> Comments { get; set; }
    public virtual DbSet<CommentReply> CommentReplies { get; set; }
    public virtual DbSet<EpisodeSections> EpisodeSections { get; set; }
 
    public virtual DbSet<ForgetPasswordToken> ForgetPasswordTokens { get; set; }
    public virtual DbSet<EpisodeChatMessage> EpisodeChatMessages { get; set; }
    
    /// <summary>
    /// Maps to the Soundex function in the database.
    /// No need to implement on server as it will be used in db.
    /// </summary>
    /// <param name="keyTerm"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    [DbFunction("SoundEx", IsBuiltIn = true)]
    public static string Soundex(string keyTerm)
    {
        throw new NotImplementedException();
    }

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

        modelBuilder.Entity<UserEpisodeInteraction>()
            .HasKey(uei => new { uei.UserId, uei.EpisodeId });

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
            .IsRequired()
            .OnDelete(DeleteBehavior.ClientCascade);

        modelBuilder.Entity<User>()
            .HasMany(e => e.Bookmarks)
            .WithOne(b => b.User)
            .HasForeignKey(b => b.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.ClientCascade);

        // Episode 1-to-many EpisodeLikes
        modelBuilder.Entity<Episode>()
            .HasMany(e => e.Likes)
            .WithOne(l => l.Episode)
            .HasForeignKey(l => l.EpisodeId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Episode>()
            .HasMany(e => e.Bookmarks)
            .WithOne(b => b.Episode)
            .HasForeignKey(b => b.EpisodeId)
            .IsRequired()
            .OnDelete(DeleteBehavior.ClientCascade);

        // Comment 1-to-many CommentLikes
        modelBuilder.Entity<Comment>()
            .HasMany(e => e.Likes)
            .WithOne(l => l.Comment)
            .HasForeignKey(l => l.CommentId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // CommentReply 1-to-many CommentReplyLikes
        modelBuilder.Entity<CommentReply>()
            .HasMany(e => e.Likes)
            .WithOne(l => l.CommentReply)
            .HasForeignKey(l => l.CommentReplyId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);        

        // Comment 1-to-many CommentReply
        modelBuilder.Entity<Comment>()
            .HasMany(c => c.Comments)
            .WithOne(c1=>c1.ReplyToComment)
            .HasForeignKey(c1=>c1.ReplyToCommentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Episode 1-to-many Comments
        modelBuilder.Entity<Episode>()
            .HasMany(e => e.Comments)
            .WithOne(c=>c.Episode)
            .HasForeignKey(c=>c.EpisodeId)
            .IsRequired();

        // User 1-to-many Comments
        modelBuilder.Entity<User>()
            .HasMany(u => u.Comments)
            .WithOne(c=>c.User)
            .HasForeignKey(c=>c.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.NoAction);

        // User 1-to-many CommentReplies
        modelBuilder.Entity<User>()
            .HasMany(u => u.CommentReplies)
            .WithOne(c=>c.User)
            .HasForeignKey(c=>c.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.NoAction);

        // Rating many-to-1 podcast
        modelBuilder.Entity<Podcast>()
            .HasMany(e => e.Ratings)
            .WithOne(e => e.Podcast)
            .HasForeignKey(e => e.PodcastId)
            .OnDelete(DeleteBehavior.Cascade);

        // Rating many-to-1 user
        modelBuilder.Entity<User>()
            .HasMany(e => e.Ratings)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.NoAction);


        // Episode 1-to-many Com
        modelBuilder.Entity<Episode>()
            .HasMany(e => e.episodeSections)
            .WithOne(e => e.Episode)
            .HasForeignKey(e => e.EpisodeId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);






        // PLAYLIST RELATIONSHIPS

        // Playlist 1-to-many PlaylistEpisodes
        modelBuilder.Entity<Playlist>()
            .HasMany(e => e.PlaylistEpisodes)
            .WithOne(pe => pe.Playlist)
            .HasForeignKey(pe => pe.PlaylistId)
            .IsRequired()
            .OnDelete(DeleteBehavior.ClientCascade);

        // Episode 1-to-many PlaylistEpisodes
        modelBuilder.Entity<Episode>()
            .HasMany(e => e.PlaylistEpisodes)
            .WithOne(pe=>pe.Episode)
            .HasForeignKey(pe=>pe.EpisodeId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // User 1-to-many Playlist
        modelBuilder.Entity<User>()
            .HasMany(u => u.Playlists)
            .WithOne(p => p.User)
            .HasForeignKey(p => p.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

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