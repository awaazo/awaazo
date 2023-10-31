using static System.IO.Directory;
using static System.IO.Path;
using static System.IO.File;

namespace Backend.Infrastructure;

public static class FileStorageHelper{

    public const string FILE_SPLIT_KEY = "|/|\\|";
    public const string BASE_DIR = "ServerFiles";
    public const string AVATARS_DIR_NAME = "Avatars";
    public const string PODCASTS_DIR_NAME = "Podcasts";

    

    #region User Profile

    public static string SaveUserAvatar(Guid userId, IFormFile avatarFile)
    {
        return SaveUserAvatar(userId.ToString(), avatarFile);
    }

    public static string SaveUserAvatar(string userId, IFormFile avatarFile)
    {
        // Filename stored on the server filesystem
        string avatarFileName = string.Format("{0}.{1}", userId, avatarFile.ContentType.Split('/')[1]);
        
        // Filename stored in the database
        string userAvatarName = string.Format("{0}{1}{2}", avatarFileName, FILE_SPLIT_KEY, avatarFile.ContentType);

        // Get the dir path
        string dirPath = Combine(GetCurrentDirectory(), BASE_DIR, AVATARS_DIR_NAME);

        // Make sure that the dir exists, otherwise create it
        if(!Directory.Exists(dirPath))
            CreateDirectory(dirPath);

        // Get the file path
        string filePath = Combine(dirPath, avatarFileName);

        // Save the file
        using FileStream fileStream = Create(filePath);
        avatarFile.CopyTo(fileStream);

        // Return the filename stored in the database
        return userAvatarName;
    }

    public static void RemoveUserAvatar(string userAvatarName)
    {
        // Get the file path
        string userAvatarFilePath = GetUserAvatarPath(userAvatarName);

        // Check if the file exists
        if(File.Exists(userAvatarFilePath))
        {
            // Delete the file
            File.Delete(userAvatarFilePath);
        }
    }

    public static string GetUserAvatarPath(string userAvatarName)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, AVATARS_DIR_NAME, userAvatarName.Split(FILE_SPLIT_KEY)[0]);
    }

    #endregion

    #region Podcast

    public static string SavePodcastCoverArt(Guid podcastId, IFormFile coverArtFile)
    {
        return SavePodcastCoverArt(podcastId.ToString(), coverArtFile);
    }

    public static string SavePodcastCoverArt(string podcastId, IFormFile coverArtFile)
    {
        // Filename stored on the server filesystem
        string coverArtFileName = string.Format("{0}.{1}", podcastId, coverArtFile.ContentType.Split('/')[1]);
        
        // Filename stored in the database
        string coverArtName = string.Format("{0}{1}{2}", coverArtFileName, FILE_SPLIT_KEY, coverArtFile.ContentType);

        // Get the dir path
        string dirPath = Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME);

        // Make sure that the dir exists, otherwise create it
        if(!Directory.Exists(dirPath))
            CreateDirectory(dirPath);

        // Get the dir path for that specific podcast
        dirPath = Combine(dirPath, podcastId);

        // Make sure that the dir exists, otherwise create it
        if(!Directory.Exists(dirPath))
            CreateDirectory(dirPath);

        // Get the file path
        string filePath = Combine(dirPath, coverArtFileName);

        // Save the file
        using FileStream fileStream = Create(filePath);
        coverArtFile.CopyTo(fileStream);

        // Return the filename stored in the database
        return coverArtName;
    }

    public static void RemovePodcastCoverArt(string coverArtName)
    {
        // Get the file path
        string podcastCoverArt = GetPodcastCoverArtPath(coverArtName);

        // Check if the file exists
        if(File.Exists(podcastCoverArt))
        {
            // Delete the file
            File.Delete(podcastCoverArt);
        }
    }
    
    public static string GetPodcastCoverArtPath(string coverArtName)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, coverArtName.Split(FILE_SPLIT_KEY)[0],coverArtName.Split(FILE_SPLIT_KEY)[0]);
    }

    public static string SavePodcastEpisodeAudio(Guid episodeId, Guid podcastId, IFormFile audioFile)
    {
        return SavePodcastEpisodeAudio(episodeId.ToString(), podcastId.ToString(), audioFile);
    }

    public static string SavePodcastEpisodeAudio(string episodeId, string podcastId, IFormFile audioFile)
    {
        // Filename stored on the server filesystem
        string audioFileName = string.Format("{0}.{1}", episodeId, audioFile.ContentType.Split('/')[1]);
        
        // Filename stored in the database
        string audioName = string.Format("{0}{1}{2}", audioFileName, FILE_SPLIT_KEY, audioFile.ContentType);

        // Get the dir path
        string dirPath = Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME);
        dirPath = Combine(dirPath, podcastId);

        // Make sure that the dir exists, otherwise create it
        if(!Directory.Exists(dirPath))
            CreateDirectory(dirPath);

        // Get the file path
        string filePath = Combine(dirPath, audioFileName);

        // Save the file
        using FileStream fileStream = Create(filePath);
        audioFile.CopyTo(fileStream);

        // Return the filename stored in the database
        return audioName;
    }

    public static void RemovePodcastEpisodeAudio(Guid episodeId, Guid podcastId)
    {
        RemovePodcastEpisodeAudio(episodeId.ToString(), podcastId.ToString());
    }

    public static void RemovePodcastEpisodeAudio(string episodeId, string podcastId)
    {
        // Get the file path
        string podcastEpisodeAudio = GetPodcastEpisodeAudioPath(episodeId, podcastId);

        // Check if the file exists
        if(File.Exists(podcastEpisodeAudio))
        {
            // Delete the file
            File.Delete(podcastEpisodeAudio);
        }
    }

    public static string GetPodcastEpisodeAudioPath(string audioName, Guid podcastId)
    {
        return GetPodcastEpisodeAudioPath(audioName, podcastId.ToString());
    }

    public static string GetPodcastEpisodeAudioPath(string audioName, string podcastId)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, PODCASTS_DIR_NAME, podcastId, audioName.Split(FILE_SPLIT_KEY)[0]);
    }

    #endregion

    public static string GetFileType(string filename) 
    {
        return filename.Split(FILE_SPLIT_KEY)[1];
    }

}
