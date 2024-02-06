using Backend.Infrastructure;
using Backend.Models;

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
}