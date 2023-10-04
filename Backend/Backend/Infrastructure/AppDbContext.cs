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