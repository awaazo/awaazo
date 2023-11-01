using Azure.Core;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.Extensions;
using static Backend.Infrastructure.FileStorageHelper;

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
            user.Avatar = SaveUserAvatar(user.Id,request.Avatar);
        }

        // Update the user's profile
        user.Bio = request.Bio;
        user.Interests = request.Interests;
        user.Username = request.Username;
        user.TwitterUrl = request.TwitterUrl;
        user.GitHubUrl = request.GitHubUrl;
        user.LinkedInUrl = request.LinkedInUrl;

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
    /// <param name="httpContext">Current HttpContext</param>
    /// <returns>UserProfileResponse</returns>
    public UserProfileResponse GetProfile(User user, HttpContext httpContext)
    {
        UserProfileResponse profile = (UserProfileResponse)user;
        string url = httpContext.Request.GetDisplayUrl().ToString();
        url = url[..^3];
        profile.AvatarUrl = url + "avatar";

        return profile;
    }

}