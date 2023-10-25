using System.Security.Cryptography;
using Backend.Controllers.Requests;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

        // Set Avatar Name for Server file and db
        string avatarFileName = string.Format("{0}.{1}",user.Id, request.Avatar!.ContentType.Split('/')[1]);
        string userAvatarName = string.Format("{0}||{1}", avatarFileName, request.Avatar!.ContentType); 

        // Save Avatar to Server
        bool isSaved = SaveAvatar(avatarFileName, request.Avatar);

        // Update the user's profile
        user.Avatar = userAvatarName;
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

    public async Task<User?> EditProfileAsync(ProfileEditRequest request, User? user)
    {
        // Make sure the user exists
        if(user is null)
            return null;

        // Set Avatar Name for Server file and db
        string avatarFileName = string.Format("{0}.{1}",user.Id, request.Avatar!.ContentType.Split('/')[1]);
        string userAvatarName = string.Format("{0}||{1}", avatarFileName, request.Avatar!.ContentType); 

        // Save Avatar to Server
        bool isSaved = SaveAvatar(avatarFileName, request.Avatar);

        // Update the user's profile
        user.Avatar = userAvatarName;
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
        await _db.SaveChangesAsync();

        // Return the updated user
        return user;
    }

    public static bool SaveAvatar(string fileName, IFormFile file)
    {
        string dirName = "Avatars";

        string dirPath =Path.Combine(AppContext.BaseDirectory,dirName);

        if(!Directory.Exists(dirPath))
            Directory.CreateDirectory(dirPath);

        string filePath = Path.Combine(dirPath, fileName);
        
        using FileStream fs = new(filePath, FileMode.Create);
        file.CopyTo(fs);

        return File.Exists(filePath);
    }

    public static string GetAvatarType(string fileInfo)
    {
        return fileInfo.Split("||")[1];
    }

    public static string GetAvatarPath(string fileInfo)
    {
        return Path.Combine(AppContext.BaseDirectory, "Avatars", fileInfo.Split("||")[0]);
    }
}