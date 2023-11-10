using Azure.Core;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static Backend.Infrastructure.FileStorageHelper;

namespace Backend.Services;

/// <summary>
/// Handles all profile related operations.
/// </summary>
public class ProfileService : IProfileService
{   
    /// <summary>
    /// Current DB instance.
    /// </summary>
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
        // Remove the avatar from the server
        RemoveUserAvatar(user.Avatar);

        _db.Users!.Remove(user);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Setup the profile of a user.
    /// </summary>
    /// <param name="request">Profile Setup request</param>
    /// <param name="user">User for which the setup belongs</param>
    /// <returns></returns>
    public async Task<bool> SetupProfileAsync(ProfileSetupRequest request, User user)
    {
        // Remove the old avatar from the server
        RemoveUserAvatar(user.Avatar);

        // Save the new avatar to the server
        string userAvatarName = SaveUserAvatar(user.Id, request.Avatar!);

        // Update the user's profile
        user.Avatar = userAvatarName;
        user.DisplayName = request.DisplayName;
        user.Bio = request.Bio;
        user.Interests = request.Interests;

        // Update the UpdatedAt attribute
        user.UpdatedAt = DateTime.Now;

        // Save the changes to the database
        _db.Users!.Update(user);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Edit the profile of a user.
    /// </summary>
    /// <param name="request">Profile edit request</param>
    /// <param name="user">User for which the edit belongs</param>
    /// <returns></returns>
    public async Task<bool> EditProfileAsync(ProfileEditRequest request, User user)
    {
        // Only save the avatar if it was changed
        if (request.Avatar != null)
        {
            // Remove the old avatar from the server
            RemoveUserAvatar(user.Avatar);

            // Save the new avatar to the server
            user.Avatar = SaveUserAvatar(user.Id, request.Avatar);
        }

        // If username was changed, check if it is unique
        if (request.Username != user.Username)
        {
            User? existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (existingUser is not null)
                throw new Exception("Username already exists.");
        }

        // Update the user's profile
        user.Bio = request.Bio;
        user.Username = request.Username;
        user.Interests = request.Interests;
        user.DisplayName = request.DisplayName;
        user.TwitterUrl = request.TwitterUrl;
        user.GitHubUrl = request.GitHubUrl;
        user.LinkedInUrl = request.LinkedInUrl;
        user.WebsiteUrl = request.WebsiteUrl;

        // Update the UpdatedAt attribute
        user.UpdatedAt = DateTime.Now;

        // Save the changes to the database
        _db.Users!.Update(user);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Returns the profile of a user
    /// </summary>
    /// <param name="user">User for which the profile belongs</param>
    /// <param name="domainUrl">Url of the current domain (top level)</param>
    /// <returns>UserProfileResponse</returns>
    public UserProfileResponse GetProfile(User user, string domainUrl)
    {
        return new UserProfileResponse(user, domainUrl);
    }

    /// <summary>
    /// Gets the full user profile for a given user.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    public async Task<FullUserProfileResponse> GetUserProfile(Guid userId, string domainUrl)
    {
        // Check if the user exists
        User user = await _db.Users.
        Include(u => u.Podcasts).ThenInclude(p => p.Episodes)
        .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new Exception("No user was found for the given userId.");

        // If the user exists, return the profile
        return new FullUserProfileResponse(user, domainUrl);
    }

    /// <summary>
    /// Get all user profiles that match the given searchterm by sound.
    /// </summary>
    /// <param name="searchTerm"></param>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    public async Task<List<UserProfileResponse>> SearchUserProfiles(string searchTerm, int page, int pageSize, string domainUrl)
    {
        // Get the searched user profiles
        List<UserProfileResponse> userProfiles = await _db.Users
        .Where
        (
            u =>
            AppDbContext.Soundex(u.Username) == AppDbContext.Soundex(searchTerm) ||
            AppDbContext.Soundex(u.DisplayName) == AppDbContext.Soundex(searchTerm) ||
            AppDbContext.Soundex(u.Email) == AppDbContext.Soundex(searchTerm) ||
            AppDbContext.Soundex(u.Bio) == AppDbContext.Soundex(searchTerm)
        )
        .Skip(page * pageSize)
        .Take(pageSize)
        .Select(u => new UserProfileResponse(u, domainUrl))
        .ToListAsync();

        return userProfiles;
    }

    /// <summary>
    /// Returns the Avatar name of the user.
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public async Task<string> GetUserAvatarNameAsync(Guid userId)
    {
        // Check if the user exists
        User user = await _db.Users
        .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new Exception("No user was found for the given userId.");

        // If the user exists, return the Avatar name
        return user.Avatar;
    }
}