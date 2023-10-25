using Azure.Core;
using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.Extensions;

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
        RemoveAvatar(user.Avatar);

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
        // Set Avatar Name for Server file and db
        string avatarFileName = string.Format("{0}.{1}", user.Id, request.Avatar!.ContentType.Split('/')[1]);
        string userAvatarName = string.Format("{0}||{1}", avatarFileName, request.Avatar!.ContentType);

        // Check if the avatar was changed
        if (userAvatarName != user.Avatar)
        {
            // Remove the old avatar from the server
            RemoveAvatar(user.Avatar);

            // Save the new avatar to the server
            SaveAvatar(avatarFileName, request.Avatar);
        }

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

            // Set Avatar Name for Server file and db
            string avatarFileName = string.Format("{0}.{1}", user.Id, request.Avatar!.ContentType.Split('/')[1]);
            string userAvatarName = string.Format("{0}||{1}", avatarFileName, request.Avatar!.ContentType);

            // Remove the old avatar from the server
            RemoveAvatar(user.Avatar);

            // Save the new avatar to the server
            SaveAvatar(avatarFileName, request.Avatar);

            // Update the user's avatar
            user.Avatar = userAvatarName;
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

    /// <summary>
    /// Saves the avatar file to the server
    /// </summary>
    /// <param name="fileName">file name</param>
    /// <param name="file">file</param>
    /// <returns>True if the file was saved successfully, otherwise false</returns>
    public static bool SaveAvatar(string fileName, IFormFile file)
    {
        // Get the directory path
        string dirName = "Avatars";
        string dirPath = Path.Combine(AppContext.BaseDirectory, dirName);

        // Create the directory if it doesn't exist
        if (!Directory.Exists(dirPath))
            Directory.CreateDirectory(dirPath);

        // Get the file path
        string filePath = Path.Combine(dirPath, fileName);

        // Save the file
        using FileStream fs = new(filePath, FileMode.Create);
        file.CopyTo(fs);

        // Return true if the file was saved successfully
        return File.Exists(filePath);
    }

    /// <summary>
    /// Deletes the avatar file from the server. 
    /// </summary>
    /// <param name="fileName">file name</param>
    /// <returns>True if deleted, otherwise false</returns>
    public static bool RemoveAvatar(string fileName)
    {
        // Get the directory path
        string dirName = "Avatars";
        string dirPath = Path.Combine(AppContext.BaseDirectory, dirName);

        // Get the file path
        string filePath = Path.Combine(dirPath, fileName);

        // Check if the file exists
        if (File.Exists(filePath))
        {
            // Delete the file
            File.Delete(filePath);
            return true;
        }
        else
        {
            return false;
        }
    }

    /// <summary>
    /// Returns the avatar file type
    /// </summary>
    /// <param name="fileInfo">Avatar file name and type</param>
    /// <returns>String of the avatar file type</returns>
    public static string GetAvatarType(string fileInfo)
    {
        return fileInfo.Split("||")[1];
    }

    /// <summary>
    /// Returns the path to the avatar file 
    /// </summary>
    /// <param name="fileInfo">Avatar file name and type</param>
    /// <returns>String of the path to the avatar file</returns>
    public static string GetAvatarPath(string fileInfo)
    {
        return Path.Combine(AppContext.BaseDirectory, "Avatars", fileInfo.Split("||")[0]);
    }
}