using static System.IO.Directory;
using static System.IO.Path;
using static System.IO.File;

namespace Backend.Infrastructure;

/// <summary>
/// Handles File interactions to/from the server.
/// </summary>
public static class FileStorageHelper
{

    /// <summary>
    /// Seperator key for the file name and file type from the filename stored in the db.
    /// </summary>
    public const string FILE_SPLIT_KEY = "|/|\\|";
    
    /// <summary>
    /// Identifies if the file is a thumbnail. I
    /// </summary>
    /// <returns></returns>
    public const string THUMBNAIL_ID = "()thumbnail()";

    /// <summary>
    /// Base dir where all server files are stored.
    /// </summary>
    public const string BASE_DIR = "ServerFiles";

    /// <summary>
    /// Dir where all user avatars are stored.
    /// </summary>
    public const string AVATARS_DIR_NAME = "Avatars";

    /// <summary>
    /// Dir where all podcast covers and episodes are stored. 
    /// </summary>
    public const string PODCASTS_DIR_NAME = "Podcasts";

    #region User Profile

    /// <summary>
    /// Saves a user avatar and returns the filename stored in the database.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="avatarFile"></param>
    /// <returns></returns>
    public static string SaveUserAvatar(Guid userId, IFormFile avatarFile)
    {
        return SaveUserAvatar(userId.ToString(), avatarFile);
    }

    /// <summary>
    /// Saves a user avatar and returns the filename stored in the database.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="avatarFile"></param>
    /// <returns></returns>
    public static string SaveUserAvatar(string userId, IFormFile avatarFile)
    {
        // Filename stored on the server filesystem
        string avatarFileName = string.Format("{0}.{1}", userId, avatarFile.ContentType.Split('/')[1]);

        // Filename stored in the database
        string userAvatarName = string.Format("{0}{1}{2}", avatarFileName, FILE_SPLIT_KEY, avatarFile.ContentType);

        // Get the dir path
        string dirPath = Combine(GetCurrentDirectory(), BASE_DIR, AVATARS_DIR_NAME);

        // Make sure that the dir exists, otherwise create it
        if (!Directory.Exists(dirPath))
            CreateDirectory(dirPath);

        // Get the file path
        string filePath = Combine(dirPath, avatarFileName);

        // Save the file
        using FileStream fileStream = Create(filePath);
        avatarFile.CopyTo(fileStream);

        // Return the filename stored in the database
        return userAvatarName;
    }

    /// <summary>
    /// Removes a user avatar.
    /// </summary>
    /// <param name="userAvatarName"></param>
    public static void RemoveUserAvatar(string userAvatarName)
    {
        // Get the file path
        string userAvatarFilePath = GetUserAvatarPath(userAvatarName);

        // Check if the file exists
        if (File.Exists(userAvatarFilePath))
        {
            // Delete the file
            File.Delete(userAvatarFilePath);
        }
    }

    /// <summary>
    /// Gets the path to a user avatar.
    /// </summary>
    /// <param name="userAvatarName"></param>
    /// <returns></returns>
    public static string GetUserAvatarPath(string userAvatarName)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, AVATARS_DIR_NAME, userAvatarName.Split(FILE_SPLIT_KEY)[0]);
    }

    #endregion

    #region Podcast

    /// <summary>
    /// Saves a podcast cover art and returns the filename stored in the database.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="coverArtFile"></param>
    /// <returns></returns>
    public static string SavePodcastCoverArt(Guid podcastId, IFormFile coverArtFile)
    {
        return SavePodcastCoverArt(podcastId.ToString(), coverArtFile);
    }

    /// <summary>
    /// Saves a podcast cover art and returns the filename stored in the database.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="coverArtFile"></param>
    /// <returns></returns>
    public static string SavePodcastCoverArt(string podcastId, IFormFile coverArtFile)
    {
        // Filename stored on the server filesystem
        string coverArtFileName = string.Format("{0}.{1}", podcastId, coverArtFile.ContentType.Split('/')[1]);

        // Filename stored in the database
        string coverArtName = string.Format("{0}{1}{2}", coverArtFileName, FILE_SPLIT_KEY, coverArtFile.ContentType);

        // Get the dir path
        string dirPath = Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, podcastId);

        // Make sure that the dir exists, otherwise create it
        if (!Directory.Exists(dirPath))
            CreateDirectory(dirPath);

        // Get the file path
        string filePath = Combine(dirPath, coverArtFileName);

        // Save the file
        using FileStream fileStream = Create(filePath);
        coverArtFile.CopyTo(fileStream);

        // Return the filename stored in the database
        return coverArtName;
    }

    /// <summary>
    /// Removes a podcast cover art.
    /// </summary>
    /// <param name="coverArtName"></param>
    public static void RemovePodcastCoverArt(string coverArtName)
    {
        // Get the file path
        string podcastCoverArt = GetPodcastCoverArtPath(coverArtName);

        // Get the parent folder path
        string podcastPath = GetPodcastPath(podcastCoverArt);

        // Check if the file exists
        if (File.Exists(podcastCoverArt))
        {
            // Delete the file
            File.Delete(podcastCoverArt);
        }

        // Check if the podcast dir is empty
        if(Directory.GetFiles(podcastPath).Length==0)
        {
            // Delete the dir
            Directory.Delete(podcastPath); 
        }
    }

    /// <summary>
    /// Gets the path to a podcast cover art.
    /// </summary>
    /// <param name="coverArtName"></param>
    /// <returns></returns>
    public static string GetPodcastCoverArtPath(string coverArtName)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, coverArtName.Split(FILE_SPLIT_KEY)[0].Split('.')[0], coverArtName.Split(FILE_SPLIT_KEY)[0]);
    }

    /// <summary>
    /// Gets the path to a podcast folder in which the coverArtName is saved.
    /// </summary>
    /// <param name="coverArtName"></param>
    /// <returns></returns>
    public static string GetPodcastPath(string coverArtName)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, coverArtName.Split(FILE_SPLIT_KEY)[0].Split('.')[0]);
    }

    /// <summary>
    /// Saves a podcast episode audio and returns the filename stored in the database.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="podcastId"></param>
    /// <param name="audioFile"></param>
    /// <returns></returns>
    public static async Task<string> SavePodcastEpisodeAudio(Guid episodeId, Guid podcastId, IFormFile audioFile)
    {
        return await SavePodcastEpisodeAudio(episodeId.ToString(), podcastId.ToString(), audioFile);
    }

    /// <summary>
    /// Saves a podcast episode audio and returns the filename stored in the database.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="podcastId"></param>
    /// <param name="audioFile"></param>
    /// <returns></returns>
    public static async Task<string> SavePodcastEpisodeAudio(string episodeId, string podcastId, IFormFile audioFile)
    {
        // Filename stored on the server filesystem
        string audioFileName = string.Format("{0}.{1}", episodeId, audioFile.ContentType.Split('/')[1]);

        // Filename stored in the database
        string audioName = string.Format("{0}{1}{2}", audioFileName, FILE_SPLIT_KEY, audioFile.ContentType);

        // Get the dir path
        string dirPath = Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, podcastId);

        // Make sure that the dir exists, otherwise create it
        if (!Directory.Exists(dirPath))
            CreateDirectory(dirPath);

        // Get the file path
        string filePath = Combine(dirPath, audioFileName);

        // Save the file
        using FileStream fileStream = Create(filePath);
        await audioFile.CopyToAsync(fileStream);

        // Return the filename stored in the database
        return audioName;
    }


    /// <summary>
    /// Removes a podcast episode audio.
    /// </summary>
    /// <param name="audioName"></param>
    /// <param name="podcastId"></param>
    public static void RemovePodcastEpisodeAudio(string audioName, Guid podcastId)
    {
        RemovePodcastEpisodeAudio(audioName, podcastId.ToString());
    }

    /// <summary>
    /// Removes a podcast episode audio.
    /// </summary>
    /// <param name="audioName"></param>
    /// <param name="podcastId"></param>
    public static void RemovePodcastEpisodeAudio(string audioName, string podcastId)
    {
        // Get the file path
        string podcastEpisodeAudio = GetPodcastEpisodeAudioPath(audioName, podcastId);

        // Check if the file exists
        if (File.Exists(podcastEpisodeAudio))
        {
            // Delete the file
            File.Delete(podcastEpisodeAudio);
        }
    }


    /// <summary>
    /// Gets the path to a podcast episode audio.
    /// </summary>
    /// <param name="audioName"></param>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    public static string GetPodcastEpisodeAudioPath(string audioName, Guid podcastId)
    {
        return GetPodcastEpisodeAudioPath(audioName, podcastId.ToString());
    }

    /// <summary>
    /// Gets the path to a podcast episode audio.
    /// </summary>
    /// <param name="audioName"></param>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    public static string GetPodcastEpisodeAudioPath(string audioName, string podcastId)
    {
        return Combine(Directory.GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, podcastId, audioName.Split(FILE_SPLIT_KEY)[0]);
    }

    /// <summary>
    /// Saves a podcast episode thumbnail and returns the filename stored in the database.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="podcastId"></param>
    /// <param name="thumbnailFile"></param>
    /// <returns></returns>
    public static string SavePodcastEpisodeThumbnail(Guid episodeId, Guid podcastId, IFormFile thumbnailFile)
    {
        return SavePodcastEpisodeThumbnail(episodeId.ToString(), podcastId.ToString(), thumbnailFile);
    }

    /// <summary>
    /// Saves a podcast episode thumbnail and returns the filename stored in the database.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="podcastId"></param>
    /// <param name="thumbnailFile"></param>
    /// <returns></returns>
    public static string SavePodcastEpisodeThumbnail(string episodeId, string podcastId, IFormFile thumbnailFile)
    {
        // Filename stored on the server filesystem
        string thumbnailFileName = string.Format("{0}{1}.{2}", episodeId, THUMBNAIL_ID, thumbnailFile.ContentType.Split('/')[1]);

        // Filename stored in the database
        string thumbnailName = string.Format("{0}{1}{2}", thumbnailFileName, FILE_SPLIT_KEY, thumbnailFile.ContentType);

        // Get the dir path
        string dirPath = Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, podcastId);

        // Make sure that the dir exists, otherwise create it
        if (!Directory.Exists(dirPath))
            CreateDirectory(dirPath);

        // Get the file path
        string filePath = Combine(dirPath, thumbnailFileName);

        // Save the file
        using FileStream fileStream = Create(filePath);
        thumbnailFile.CopyTo(fileStream);

        // Return the filename stored in the database
        return thumbnailName;
    }


    /// <summary>
    /// Removes a podcast episode thumbnail.
    /// </summary>
    /// <param name="thumbnailName"></param>
    /// <param name="podcastId"></param>
    public static void RemovePodcastEpisodeThumbnail(string thumbnailName, Guid podcastId)
    {
        RemovePodcastEpisodeThumbnail(thumbnailName, podcastId.ToString());
    }

    /// <summary>
    /// Removes a podcast episode thumbnail.
    /// </summary>
    /// <param name="thumbnailName"></param>
    /// <param name="podcastId"></param>
    public static void RemovePodcastEpisodeThumbnail(string thumbnailName, string podcastId)
    {
        // Get the file path
        string podcastEpisodeThumbnail = GetPodcastEpisodeThumbnailPath(thumbnailName, podcastId);

        // Check if the file exists
        if (File.Exists(podcastEpisodeThumbnail))
        {
            // Delete the file
            File.Delete(podcastEpisodeThumbnail);
        }
    }

    /// <summary>
    /// Gets the path to a podcast episode thumbnail.
    /// </summary>
    /// <param name="thumbnailName"></param>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    public static string GetPodcastEpisodeThumbnailPath(string thumbnailName, Guid podcastId)
    {
        return GetPodcastEpisodeThumbnailPath(thumbnailName, podcastId.ToString());
    }

    /// <summary>
    /// Gets the path to a podcast episode thumbnail.
    /// </summary>
    /// <param name="thumbnailName"></param>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    public static string GetPodcastEpisodeThumbnailPath(string thumbnailName, string podcastId)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, podcastId, thumbnailName.Split(FILE_SPLIT_KEY)[0]);
    }


    #endregion

    /// <summary>
    /// Gets the file type from the filename stored in the database.
    /// </summary>
    /// <param name="filename"></param>
    /// <returns></returns>
    public static string GetFileType(string filename)
    {
        return filename.Split(FILE_SPLIT_KEY)[1];
    }

}
