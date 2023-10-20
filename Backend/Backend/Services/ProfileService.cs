using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class ProfileService : IProfileService
{
    private readonly AppDbContext _db;
    
    public ProfileService(AppDbContext db)
    {   
        _db = db;
    }

    /// <summary>
    /// Delete a user's profile
    /// </summary>
    /// <param name="user">User to be deleted.</param>
    /// <returns>True if success, otherwise false.</returns>
    public async Task<bool> DeleteProfileAsync(User user)
    {
        _db.Users!.Remove(user);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Setup the profile of a user.
    /// </summary>
    /// <param name="request">Profile Setup request</param>
    /// <param name="user">User for which the setup belongs</param>
    /// <returns></returns>
    public async Task<User?> SetupProfileAsync(ProfileSetupRequest request, User? user)
    {
        // Make sure the user exists
        if(user is null)
            return null;

        // Update the user's profile
        user.Avatar = request.Avatar;
        user.Bio = request.Bio;
        user.Interests = request.Interests;

        // Update the UpdatedAt attribute
        user.UpdatedAt = DateTime.Now;

        // Save the changes to the database
        _db.Users!.Update(user);
        await _db.SaveChangesAsync();

        // Return the updated user
        return user;
    }
}