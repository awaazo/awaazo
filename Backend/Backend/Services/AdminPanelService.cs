using Backend.Infrastructure;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AdminPanelService
{
    private readonly AppDbContext _db;
    public AdminPanelService(AppDbContext db, IConfiguration config) {
        _db = db;
        
        // Insure that there's at least 1 admin for testing purpose 
        User? admin = db.Users.FirstOrDefault(u => u.IsAdmin);
        if (admin is null) {
            User newAdmin = new User() {
                Email = config["Admin:Email"],
                Password = config["Admin:Password"],
                Username = "admin",
                DisplayName = "Admin",
                IsAdmin = true,
            };
            db.Users.Add(newAdmin);
            db.SaveChanges();
        }
    }

    public Task<User[]> GetAllUsers() {
        return _db.Users.ToArrayAsync();
    }

    public async Task BanUser(User admin, Guid userId) {
        User? user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
            throw new InvalidDataException("Invalid user ID");
        
        user.DeletedAt = DateTime.Now;
        user.DeletedBy = admin.Id;
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
    }
}