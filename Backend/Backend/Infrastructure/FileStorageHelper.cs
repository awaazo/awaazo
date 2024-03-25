using static System.IO.Directory;
using static System.IO.Path;
using static System.IO.File;
using System;
using FFMpegCore;
using Backend.Controllers.Requests;
using Backend.Models;

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

    /// <summary>
    /// Dir where all the covers are saved for playlisty
    /// </summary>
    public const string PLAYLIST_DIR_NAME = "Playlist";

    /// <summary>
    /// Dir where all highlights are stored. 
    /// </summary>
    public const string HIGHLIGHT_DIR_NAME = "Highlight";

    /// <summary>
    /// Identifies if the file is a transcription status file.
    /// </summary>
    public const string STATUS_ID = "_status.txt";

    /// <summary>
    /// Identifies the file type for transcript files.
    /// </summary>
    public const string TRANSCRIPT_FILE_TYPE = ".json";

    /// <summary>
    /// Identifies the file type for Highlights
    /// </summary>
    public const string HIGHLIGHT_FILE_TYPE = ".mp3";

    /// <summary>
    /// This is for use with the File Content type
    /// </summary>
    public const string FORMATTED_HIGHLIGHT_FILE_TYPE = "audio/mp3";


    public static readonly string[] AVATAR_EXTENSIONS = new[] { ".jpg", ".png", ".jpeg", ".gif"};

    public enum TranscriptStatus 
    {
        InProgress=0,
        Failed=1,
        Ready=2,
        None=3
    };

    #region User Profile
    
    public static bool ValidateAvatar(IFormFile? file, out object? errorObject) {
        errorObject = null;
        if (file is null)
            return true;
        
        string extension = Path.GetExtension(file.FileName);

        if (AVATAR_EXTENSIONS.Contains(extension))
            return true;
        else {
            errorObject = new { Errors = new[] { $"Invalid file extension {extension}" } };
            return false;
        }
    }

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
        string podcastPath = GetPodcastPath(coverArtName);

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
    /// Appends an audio chunk to a podcast episode audio and returns the filename stored in the database.
    /// </summary>
    /// <param name="podcastId"> The podcast id. </param>
    /// <param name="audioName"> The audio name. </param>
    /// <param name="audioFile"> The audio file. </param>
    /// <returns> The filename stored in the database. </returns>
    public static async Task<string> AppendPodcastEpisodeAudio(Guid podcastId, string audioName, IFormFile audioFile)
    {
        // Get the audio path
        string audioPath = GetPodcastEpisodeAudioPath(audioName, podcastId);
        
        // Create a temp file path
        string audioPath_temp = audioPath + ".temp";

        // Check if the file exists
        if (File.Exists(audioPath))
        {   
            // Open the file and the memory stream
            using FileStream fileStream = Create(audioPath_temp);
            using MemoryStream memoryStream = new ();

            // Append the audio file to the memory stream and then to the file stream
            await audioFile.CopyToAsync(memoryStream);
            byte[] buff = await ReadAllBytesAsync(audioPath);
            await fileStream.WriteAsync(buff);
            buff = memoryStream.ToArray();
            await fileStream.WriteAsync(buff);

            // Close both streams
            fileStream.Close();
            memoryStream.Close();

            // Delete the original file
            File.Delete(audioPath);

            // Rename the temp file to the original file
            File.Move(audioPath_temp, audioPath);

            // Delete the temp file
            File.Delete(audioPath_temp);
        }

        return string.Format("{0}{1}{2}", audioName, FILE_SPLIT_KEY, audioFile.ContentType);
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

    #region Transcript

    /// <summary>
    /// Deletes a transcript.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="podcastId"></param>
    public static void RemoveTranscript(Guid episodeId,Guid podcastId)
    {
        // Get the file path
        string transcriptPath = GetTranscriptPath(episodeId, podcastId);

        // Check if the file exists
        if (File.Exists(transcriptPath))
        {
            // Delete the file
            File.Delete(transcriptPath);
        }
    }

    /// <summary>
    /// Get the transcription status.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    public static TranscriptStatus GetTranscriptStatus(Guid episodeId, Guid podcastId)
    {
        if (File.Exists(GetTranscriptPath(episodeId, podcastId)))
            return TranscriptStatus.Ready;
        if(File.Exists(GetTranscriptStatusPath(episodeId,podcastId)))
        {
            string fileContent = ReadAllText(GetTranscriptStatusPath(episodeId, podcastId)).ToLower();

            if(fileContent.Contains("progress"))
                return TranscriptStatus.InProgress;
            else
                return TranscriptStatus.Failed;
        }
        return TranscriptStatus.None;
    }

    /// <summary>
    /// Gets the transcript file path for the given episode id.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    public static string GetTranscriptPath(Guid episodeId, Guid podcastId)
    {
        return Combine(GetCurrentDirectory(),BASE_DIR,PODCASTS_DIR_NAME,podcastId.ToString(),episodeId.ToString()+TRANSCRIPT_FILE_TYPE);
    }

    /// <summary>
    /// Get the transcript status file path
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    public static string GetTranscriptStatusPath(Guid episodeId, Guid podcastId)
    {
        return Combine(GetCurrentDirectory(),BASE_DIR,PODCASTS_DIR_NAME,podcastId.ToString(),episodeId.ToString()+STATUS_ID);
    }

    #endregion


    #endregion


    #region Playlist

    public static string SavePlaylistCoverArt(string playlistId, IFormFile coverArtFile)
    {
        // Filename stored on the server filesystem
        string coverArtFileName = string.Format("{0}.{1}", playlistId, coverArtFile.ContentType.Split('/')[1]);

        // Filename stored in the database
        string coverArtName = string.Format("{0}{1}{2}", coverArtFileName, FILE_SPLIT_KEY, coverArtFile.ContentType);

        // Get the dir path
        string dirPath = Combine(GetCurrentDirectory(), BASE_DIR, PLAYLIST_DIR_NAME, playlistId);

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

    public static string SavePlaylistCoverArt(Guid playlistId, IFormFile coverArtFile)
    {
        return SavePlaylistCoverArt(playlistId.ToString(), coverArtFile);
    }


    public static void RemovePlaylistCoverArt(string coverArtName)
    {
        // Get the file path
        string playlistCoverFilePath = GetPlaylistCoverArtPathFile(coverArtName);

        // Get Directory Path
        string playlistCoverDirectoryPath = GetPlaylistCoverArtPath(coverArtName);


        // Check if the file exists
        if (File.Exists(playlistCoverFilePath))
        {
            // Delete the file
            File.Delete(playlistCoverFilePath);
        }

        if (Directory.GetFiles(playlistCoverDirectoryPath).Length == 0)
        {
            // Delete the dir
            Directory.Delete(playlistCoverDirectoryPath);
        }


    }

    public static string GetPlaylistCoverArtPath(string playlistCoverArtName)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, PLAYLIST_DIR_NAME, playlistCoverArtName.Split(FILE_SPLIT_KEY)[0].Split(".")[0]);
    }

    public static string GetPlaylistCoverArtPathFile(string playlistCoverArtName)
    {
        
        return Combine(GetCurrentDirectory(), BASE_DIR, PLAYLIST_DIR_NAME, playlistCoverArtName.Split(FILE_SPLIT_KEY)[0].Split(".")[0], playlistCoverArtName.Split(FILE_SPLIT_KEY)[0]);

    }


    #endregion

    #region Highlights

    /// <summary>
    /// Saves a given highlight to the file System. Reuquires both the highlight model and its associated
    /// episode model. Stores files C:\backend_server\ServerFiles\Highlight\{episodeId}\{userId}\{HighlightId}.mp3 format
    /// </summary>
    /// <param name="highlight"></param>
    /// <param name="episode"></param>
    /// <returns></returns>
    public static string SaveHighlightFile(Highlight highlight, Episode episode)
    {
        var highlightId = highlight.HighlightId.ToString();

        // File name in the file System ex: C:\backend_server\ServerFiles\Highlight\{episodeId}\{userId}\FileName
        string highlightFileFullPath = GetHighlightPath(highlight.EpisodeId.ToString(),
                                                    highlight.UserId.ToString(),
                                                    highlight.HighlightId.ToString());

        var highlightFileName = highlightId + highlightFileFullPath.Split(highlight.HighlightId.ToString()).Last();

        string dirPath = highlightFileFullPath.Split(highlight.HighlightId.ToString())[0];

        string episodeFilePath = GetPodcastEpisodeAudioPath(episode.Audio, episode.PodcastId);


        // Create directory should it not exist
        if (!Directory.Exists(dirPath))
        {
            CreateDirectory(dirPath);
        }

        // Create the Highlight File
        FFMpegArguments.FromFileInput(episodeFilePath)
               .OutputToFile(highlightFileFullPath, true, options => options
                   .Seek(TimeSpan.FromSeconds(highlight.StartTime))
                   .EndSeek(TimeSpan.FromSeconds(highlight.EndTime))).ProcessSynchronously();

        return highlightFileName;
    }

    /// <summary>
    /// Removes the given Highlight File from the file directory.
    /// </summary>
    /// <param name="highlight"></param>
    public static void RemoveHighlightFile(Highlight highlight)
    {
        var filePath = GetHighlightPath(highlight.EpisodeId, highlight.UserId, highlight.HighlightId);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }

    /// <summary>
    /// Generates/Gets the Highlight File Path storage path with Guid values
    /// FileFormat: C:\backend_server\ServerFiles\Highlight\{episodeId}\{userId}\{HighlightId}.mp3
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="userId"></param>
    /// <param name="highlightId"></param>
    /// <returns></returns>
    public static string GetHighlightPath(Guid episodeId, Guid userId, Guid highlightId)
    {
        return GetHighlightPath(episodeId.ToString(), userId.ToString(), highlightId.ToString());
    }

    /// <summary>
    /// Generates/Gets the Highlight File Path storage path with string values
    /// FileFormat: C:\backend_server\ServerFiles\Highlight\{episodeId}\{userId}\{HighlightId}.mp3
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="userId"></param>
    /// <param name="highlightId"></param>
    /// <returns></returns>
    public static string GetHighlightPath(string episodeId, string userId, string highlightId)
    {
        return Combine(GetCurrentDirectory(), BASE_DIR, HIGHLIGHT_DIR_NAME, episodeId, userId, highlightId + HIGHLIGHT_FILE_TYPE);
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
