using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using static Backend.Models.Podcast;
using static Backend.Infrastructure.FileStorageHelper;
using System.Net;
using Microsoft.IdentityModel.Tokens;
using System.Linq;

namespace Backend.Services;

/// <summary>
/// Handles API requests for podcasts and episodes.
/// </summary>
public class PodcastService : IPodcastService
{
    /// <summary>
    /// Current database instance
    /// </summary>
    private readonly AppDbContext _db;

    private readonly INotificationService _notificationService;

    /// <summary>
    /// Python Server Base Url
    /// </summary>
    private readonly string _pyBaseUrl;

    /// <summary>
    /// Accepted file types for cover art and thumbnail
    /// </summary>
    private static readonly string[] ALLOWED_IMG_FILES = { "image/jpeg", "image/png", "image/svg+xml" };

    /// <summary>
    /// Accepted file types for audio files
    /// </summary>
    private static readonly string[] ALLOWED_AUDIO_FILES = { "audio/mpeg", "audio/mp3", "audio/x-wav", "audio/mp4", "audio/wav" };

    /// <summary>
    /// Maximum image file is 5MB
    /// </summary>
    private const int MAX_IMG_SIZE = 5242880;

    /// <summary>
    /// Maximum audio file is 1GB
    /// </summary>
    private const int MAX_AUDIO_SIZE = 1000000000;

    /// <summary>
    /// Maximum request size
    /// </summary>
    public const int MAX_REQUEST_SIZE = 1005242880;

    /// <summary>
    /// Maximum duration of a highlight
    /// </summary>
    public const int MAX_HIGHLIGHT_DURATION = 15;


    public PodcastService(AppDbContext db, INotificationService notificationService, IConfiguration configuration)
    {
        _db = db;
        _notificationService = notificationService;

        // Set the default url for the python server
        _pyBaseUrl = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true" ?
            configuration["PyServer:DockerUrl"]! :
            configuration["PyServer:DefaultUrl"]!;
    }

    #region Podcast

    /// <summary>
    /// Creates a new Podcast.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> CreatePodcastAsync(CreatePodcastRequest request, User user)
    {
        // Check if a podcast with the same name already exists
        if (await _db.Podcasts.AnyAsync(p => p.Name == request.Name))
            throw new Exception("A podcast with the same name already exists");

        // Check if the cover art was provided
        if (request.CoverImage == null)
            throw new Exception("Cover art is required.");

        // Check if the cover art is an image
        if (!ALLOWED_IMG_FILES.Contains(request.CoverImage.ContentType))
            throw new Exception("Cover art must be a JPEG, PNG, or SVG.");

        // Check if the cover art is smaller than 5MB
        if (request.CoverImage.Length > MAX_IMG_SIZE)
            throw new Exception("Cover art must be smaller than 5MB.");

        // Create the new Podcast
        Podcast podcast = new()
        {
            Id = Guid.NewGuid(),
            PodcasterId = user.Id,
            Name = request.Name,
            Description = request.Description,
            Tags = request.Tags,
            UpdatedAt = DateTime.Now,
            CreatedAt = DateTime.Now,
            IsExplicit = false
        };

        // Save the new cover art to the server
        podcast.CoverArt = SavePodcastCoverArt(podcast.Id, request.CoverImage!);

        // Add Podcaster flag to user
        user.IsPodcaster = true;
        user.UpdatedAt = DateTime.Now;
        _db.Users.Update(user);

        // Add the Podcast to the database and return status
        await _db.Podcasts.AddAsync(podcast);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Edits an existing Podcast.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> EditPodcastAsync(EditPodcastRequest request, User user)
    {
        // Get the podcast
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == request.Id && p.PodcasterId == user.Id) ?? throw new Exception("Podcast does not exist and/or it is not owned by user.");

        // Check if a podcast with the same name already exists if it was changed
        if (request.Name != podcast.Name && await _db.Podcasts.AnyAsync(p => p.Name == request.Name))
            throw new Exception("A podcast with the same name already exists");

        // Update the podcast with the new values
        podcast.Name = request.Name;
        podcast.Description = request.Description;
        podcast.Tags = request.Tags;
        podcast.UpdatedAt = DateTime.Now;

        // Update the cover art if it was changed
        if (request.CoverImage != null)
        {
            // Check if the cover art is an image
            if (!ALLOWED_IMG_FILES.Contains(request.CoverImage.ContentType))
                throw new Exception("Cover art must be a JPEG, PNG, or SVG.");

            // Check if the cover art is smaller than 5MB
            if (request.CoverImage.Length > MAX_IMG_SIZE)
                throw new Exception("Cover art must be smaller than 5MB.");

            // Remove the old cover art from the server
            RemovePodcastCoverArt(podcast.CoverArt);

            // Save the new cover art to the server
            string coverArtName = SavePodcastCoverArt(podcast.Id, request.CoverImage);

            // Update the Podcast object with the cover art name
            podcast.CoverArt = coverArtName;
        }

        // Save the changes to the database and return status
        _db.Podcasts.Update(podcast);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Gets the cover art name for the given podcast.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<string> GetPodcastCoverArtNameAsync(Guid podcastId)
    {
        // If the podcast does not exist, throw an exception, otherwise return the cover art name
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == podcastId) ?? throw new Exception("Podcast does not exist.");
        return podcast.CoverArt;
    }

    /// <summary>
    /// Gets a podcast by ID.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<PodcastResponse> GetPodcastByIdAsync(string domainUrl, Guid podcastId)
    {
        // Check if the podcast exists, if it does retrieve it.
        PodcastResponse podcastResponse = await _db.Podcasts
        .Include(p => p.Podcaster)
        .Include(p => p.Episodes).ThenInclude(e => e.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Points)
        .Include(p => p.Ratings).ThenInclude(r => r.User)
        .Where(p => p.Id == podcastId)
        .Select(p => new PodcastResponse(p, domainUrl))
        .FirstOrDefaultAsync() ?? throw new Exception("Podcast does not exist.");

        return podcastResponse;
    }

    /// <summary>
    /// Gets all podcasts for the given user.
    /// </summary>
    /// <param name="domainUrl">Domain URL</param>
    /// <param name="user">User</param>
    /// <param name="page">Page Number</param>
    /// <param name="pageSize">Page Size</param>
    /// <returns> List of Podcasts </returns>
    public async Task<List<PodcastResponse>> GetUserPodcastsAsync(int page, int pageSize, string domainUrl, User user)
    {
        return await GetUserPodcastsAsync(page, pageSize, domainUrl, user.Id);
    }

    /// <summary>
    /// Gets all podcasts for the given user.
    /// </summary>
    /// <param name="domainUrl">Domain URL</param>
    /// <param name="userId">User ID</param>
    /// <param name="page">Page Number</param>
    /// <param name="pageSize">Page Size</param>
    /// <returns> List of Podcasts </returns>
    public async Task<List<PodcastResponse>> GetUserPodcastsAsync(int page, int pageSize, string domainUrl, Guid userId)
    {
        // Check if the user has any podcasts, if they do retrieve them.
        List<PodcastResponse> podcastResponses = await _db.Podcasts
        .Include(p => p.Podcaster)
        .Include(p => p.Episodes).ThenInclude(e => e.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Points)
        .Include(p => p.Ratings).ThenInclude(r => r.User)
        .Where(p => p.PodcasterId == userId)
        .Skip(page * pageSize)
        .Take(pageSize)
        .Select(p => new PodcastResponse(p, domainUrl))
        .ToListAsync() ?? throw new Exception("User doesnt have any podcasts.");

        return podcastResponses;
    }

    /// <summary>
    /// Gets all podcasts for the given search term.
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="domainUrl"></param>
    /// <param name="filter"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<List<PodcastResponse>> GetSearchPodcastsAsync(int page, int pageSize, string domainUrl, PodcastFilter filter)
    {
        // Get the podcasts from the database, where the podcast name sounds like the searchTerm
        List<Podcast> podcastResponses = await _db.Podcasts
        .Include(p => p.Podcaster)
        .Include(p => p.Episodes).ThenInclude(e => e.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Points)
        .Include(p => p.Ratings).ThenInclude(r => r.User)
        .Where(p => AppDbContext.Soundex(p.Name) == AppDbContext.Soundex(filter.SearchTerm))
        .ToListAsync() ?? throw new Exception("No podcasts found.");

        // Logic to filter Podcasts Based on Tags
        if (filter.Tags != null)
        {
            List<Podcast> podcasts = new List<Podcast>();

            // Filter if any Tag Exist
            foreach (var tag in filter.Tags)
            {
                podcasts.AddRange(podcastResponses.FindAll(u => u.Tags.Contains(tag)));
            }

            podcastResponses = podcasts.Distinct().ToList();



        }
        // Logic to Filter Podcasts Based on Explicit Content
        if (filter.IsExplicit != null)
        {
            podcastResponses = podcastResponses.FindAll(u => u.IsExplicit == filter.IsExplicit).ToList();

        }

        // Logic to filter Based on Type
        if (filter.Type != null)
        {
            podcastResponses = podcastResponses.FindAll(u => u.Type == GetPodcastType(filter.Type)).ToList();

        }

        // Logic to filter Based on release Date
        if (filter.ReleaseDate != null)
        {
            // Filter Last week
            if (filter.ReleaseDate == "lastWeek")
            {
                DateTime lastWeek = DateTime.UtcNow.Subtract(new TimeSpan(7, 0, 0, 0, 0));
                podcastResponses = podcastResponses.FindAll(u => u.CreatedAt >= lastWeek);
            }
            // Filter last month
            if (filter.ReleaseDate == "lastMonth")
            {
                DateTime lastMonth = DateTime.UtcNow.Subtract(new TimeSpan(30, 0, 0, 0, 0));
                podcastResponses = podcastResponses.FindAll(u => u.CreatedAt >= lastMonth);

            }
            // Filter Last Year
            if (filter.ReleaseDate == "lastYear")
            {
                DateTime lastYear = DateTime.UtcNow.Subtract(new TimeSpan(365, 0, 0, 0, 0));
                podcastResponses = podcastResponses.FindAll(u => u.CreatedAt >= lastYear);

            }


        }
        // Cast the podcast to PodcastResponse Object
        List<PodcastResponse> response = podcastResponses.Select(u => new PodcastResponse(u, domainUrl)).ToList();
        //Logic to Filter based on Rating
        if (filter.RatingGreaterThen != null)
        {
            response = response.FindAll(u => u.AverageRating >= filter.RatingGreaterThen).ToList();
        }
        // Paginate the results
        response = response.Skip(page * pageSize).Take(pageSize).ToList();


        return response;
    }

    /// <summary>
    /// Gets all podcasts.
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<List<PodcastResponse>> GetAllPodcastsAsync(int page, int pageSize, string domainUrl)
    {
        // Get the podcasts from the database
        List<PodcastResponse> podcastResponses = await _db.Podcasts
        .Include(p => p.Podcaster)
        .Include(p => p.Episodes).ThenInclude(e => e.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Points)
        .Include(p => p.Ratings).ThenInclude(r => r.User)

        .Skip(page * pageSize)
        .Take(pageSize)
        .Select(p => new PodcastResponse(p, domainUrl))
        .ToListAsync() ?? throw new Exception("No podcasts found.");

        return podcastResponses;
    }

    /// <summary>
    /// Gets all podcasts for the given genres/tags.
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="domainUrl"></param>
    /// <param name="tags"></param>
    /// <returns></returns>
    public async Task<List<PodcastResponse>> GetPodcastsByTagsAsync(int page, int pageSize, string domainUrl, string[] tags)
    {
        // Add conditions to find each tag
        List<string> tagQueries = new();
        foreach (string tag in tags)
            tagQueries.Add(string.Format(" LOWER(Tags) like '%{0}%' ", tag));

        // Build the query
        string query = " WHERE " + string.Join(" OR ", tagQueries);

        // Execute the query
        List<PodcastResponse> podcastResponses = await _db.Podcasts
            .FromSqlRaw($"SELECT * FROM dbo.Podcasts {query}")
            .Include(p => p.Podcaster)
            .Include(p => p.Episodes)
            .Include(p => p.Ratings).ThenInclude(r => r.User)
            .Include(p => p.Episodes).ThenInclude(r => r.Points)
            .Skip(page * pageSize)
            .Take(pageSize)
            .Select(p => new PodcastResponse(p, domainUrl))
            .ToListAsync();

        // Remove all tags that dont belong
        podcastResponses
            .RemoveAll(p => !p.Tags.Any(t => tags.Contains(t)));

        return podcastResponses;
    }

    public async Task<PodcastMetricsResponse> GetMetrics(User user, Guid podcastId, string domainUrl)
    {
        // Check that user owns podcast
        Podcast? podcast = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.Likes)
                .Include(p => p.Episodes).ThenInclude(e => e.Points)
                .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(comment => comment.Likes)
                .FirstOrDefaultAsync(p => p.Id == podcastId);
        if (podcast is null)
            throw new Exception("Invalid podcast Id " + podcast);

        if (podcast.PodcasterId != user.Id)
            throw new UnauthorizedAccessException($"User {user.Email} does not own podcast {podcast.Name} ({podcast.Id})");

        // Otherwise all good, get podcast related metrics
        int totalLikes = podcast.Episodes.Select(e => e.Likes.Count()).Sum();
        Episode? mostLikes = podcast.Episodes.MaxBy(e => e.Likes.Count());

        var podcastIdParameter = new SqlParameter("@PodcastId", podcast.Id);
        var query = "SELECT uei.* " +
                    "FROM dbo.UserEpisodeInteractions uei " +
                    "JOIN Episodes e ON uei.EpisodeId = e.Id " +
                    "WHERE e.PodcastId = @PodcastId";
        var totalWatched = await _db.UserEpisodeInteractions!
            .FromSqlRaw(query, podcastIdParameter).SumAsync(e => e.LastListenPosition);

        long totalPlayCount = podcast.Episodes.Select(e => (long)e.PlayCount).Sum();
        Episode? mostPlayed = podcast.Episodes.MaxBy(e => e.PlayCount);

        int totalComments = podcast.Episodes.Select(ep => ep.Comments.Count()).Sum();
        Episode? mostCommented = podcast.Episodes.MaxBy(ep => ep.Comments.Count);

        Comment? mostLikedComment =
            podcast.Episodes.Select(ep => ep.Comments.MaxBy(comment => comment.Likes.Count()))
                            .FirstOrDefault();

        // Get demographic related metrics
        var userPodscastInteraction = await _db.UserEpisodeInteractions
            .Include(inter => inter.Episode)
            .Include(inter => inter.User)
            .Where(inter => inter.Episode.PodcastId == podcastId).ToListAsync();

        var genderMetrics = new PodcastMetricsResponse.GenderMetrics();
        Dictionary<string, uint> ageGroupHistorgram = new();
        ageGroupHistorgram["0-12"] = 0;
        ageGroupHistorgram["13-18"] = 0;
        ageGroupHistorgram["19-30"] = 0;
        ageGroupHistorgram["31-45"] = 0;
        ageGroupHistorgram["46-65"] = 0;
        ageGroupHistorgram["65+"] = 0;

        foreach (var interaction in userPodscastInteraction)
        {
            switch (interaction.User.Gender)
            {
                case User.GenderEnum.Male: genderMetrics.TotalMale++; break;
                case User.GenderEnum.Female: genderMetrics.TotalFemale++; break;
                case User.GenderEnum.Other: genderMetrics.TotalOther++; break;
                case User.GenderEnum.None: genderMetrics.TotalUnknown++; break;
            }

            uint age = (uint)(DateTime.Now.Year - interaction.User.DateOfBirth.Year);
            if (age <= 12) ageGroupHistorgram["0-12"]++;
            else if (age <= 18) ageGroupHistorgram["13-18"]++;
            else if (age <= 30) ageGroupHistorgram["19-30"]++;
            else if (age <= 45) ageGroupHistorgram["31-45"]++;
            else if (age <= 65) ageGroupHistorgram["46-65"]++;
            else ageGroupHistorgram["65+"]++;
        }

        return new PodcastMetricsResponse(domainUrl)
        {
            TotalEpisodesLikes = (uint)totalLikes,
            MostLikedEpisode = EpisodeResponse.FromEpisode(mostLikes, domainUrl),
            TotalTimeWatched = totalWatched,
            TotalPlayCount = (uint)totalPlayCount,
            MostPlayedEpisode = EpisodeResponse.FromEpisode(mostPlayed, domainUrl),
            TotalCommentsCount = (uint)totalComments,
            MostCommentedOnEpisode = EpisodeResponse.FromEpisode(mostCommented, domainUrl),
            MostLikedComment = CommentResponse.FromComment(mostLikedComment, domainUrl),
            DemographicsGender = genderMetrics,
            DemographicsAge = ageGroupHistorgram
        };
    }

    public async Task<List<PodcastResponse>> GetRecentPodcasts(int page, int pageSize, string domainUrl)
    {
        // Get the podcasts from the database
        List<PodcastResponse> podcastResponses = await _db.Podcasts
        .OrderByDescending(p => p.CreatedAt)
        .Include(p => p.Podcaster)
        .Include(p => p.Episodes).ThenInclude(e => e.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.Likes)
        .Include(p => p.Episodes).ThenInclude(e => e.Points)
        .Include(p => p.Ratings).ThenInclude(r => r.User)
        .Skip(page * pageSize)
        .Take(pageSize)
        .Select(p => new PodcastResponse(p, domainUrl))
        .ToListAsync() ?? throw new Exception("No podcasts found.");

        return podcastResponses;
    }

    #endregion Podcast

    #region Episode

    /// <summary>
    /// Creates a new episode for the specified podcast.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="podcastId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<Guid> CreateEpisodeAsync(CreateEpisodeRequest request, Guid podcastId, User user)
    {
        // Check if the podcast exists
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == podcastId && p.PodcasterId == user.Id) ?? throw new Exception("Podcast does not exist and/or it is not owned by user.");

        // Check if the episode name already exists for the podcast
        if (await _db.Episodes.AnyAsync(e => e.PodcastId == podcastId && e.EpisodeName == request.EpisodeName))
            throw new Exception("An episode with the same name already exists for this podcast.");

        // Check if the episode audio was provided
        if (request.AudioFile == null)
            throw new Exception("Audio file is required.");

        // Check if the episode audio is an audio file
        if (!ALLOWED_AUDIO_FILES.Contains(request.AudioFile.ContentType))
            throw new Exception("Audio file must be an MP3, WAV, MP4, or MPEG.");

        // Check if the episode audio is smaller than 1GB
        if (request.AudioFile.Length > MAX_AUDIO_SIZE)
            throw new Exception("Audio file must be smaller than 1GB.");

        // Check if the episode thumbnail was provided
        if (request.Thumbnail == null)
            throw new Exception("Thumbnail is required.");

        // Check if the episode thumbnail is an image
        if (!ALLOWED_IMG_FILES.Contains(request.Thumbnail.ContentType))
            throw new Exception("Thumbnail must be a JPEG, PNG, or SVG.");

        // Check if the episode thumbnail is smaller than 5MB
        if (request.Thumbnail.Length > MAX_IMG_SIZE)
            throw new Exception("Thumbnail must be smaller than 5MB.");

        // Create the new episode
        Episode episode = new()
        {
            Id = Guid.NewGuid(),
            PodcastId = podcastId,
            EpisodeName = request.EpisodeName,
            Description = request.Description,
            IsExplicit = request.IsExplicit,
            ReleaseDate = DateTime.Now,
            UpdatedAt = DateTime.Now,
            CreatedAt = DateTime.Now,
        };

        // Check if the episode is explicit and the podcast is not
        if (episode.IsExplicit && !podcast.IsExplicit)
        {
            podcast.IsExplicit = true;
            _db.Podcasts.Update(podcast);
        }

        // Save the episode audio to the server
        episode.Audio = await SavePodcastEpisodeAudio(episode.Id, podcastId, request.AudioFile!);

        // Save the episode thumbnail to the server
        episode.Thumbnail = SavePodcastEpisodeThumbnail(episode.Id, podcastId, request.Thumbnail!);

        try
        {
            if (request.IsFullEpisode())
            {

                // Send request to PY server to generate a transcript
                var url = _pyBaseUrl + "/stt_ingest";
                var json = $@"{{
                ""podcast_id"": ""{episode.PodcastId}"",
                ""episode_id"": ""{episode.Id}""
                }}";

                using var httpClient = new HttpClient();
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                await httpClient.PostAsync(url, content);
            }
        }
        catch (Exception)
        {
            // ADD log here
        }

        // Find and Save the duration of the audio in seconds
        var mediaInfo = await GetMediaAnalysis(episode.Audio, podcastId);
        episode.Duration = mediaInfo.Duration.TotalSeconds;

        // Add the episode to the database and return status
        await _db.Episodes.AddAsync(episode);

        // Send Notification to All the Subscribed Users
        await _notificationService.AddEpisodeNotification(podcastId, episode, _db);

        await _db.SaveChangesAsync();

        return episode.Id;
    }

    /// <summary>
    /// Edits an existing episode for the specified podcast.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="episodeId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> EditEpisodeAsync(EditEpisodeRequest request, Guid episodeId, User user)
    {
        // Get the episode
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");

        // Check if the podcast exists
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == episode.PodcastId && p.PodcasterId == user.Id) ?? throw new Exception("Podcast does not exist and/or it is not owned by user.");

        // Check if the episode name already exists for the podcast
        if (request.EpisodeName != episode.EpisodeName && await _db.Episodes.AnyAsync(e => e.PodcastId == episode.PodcastId && e.EpisodeName == request.EpisodeName))
            throw new Exception("An episode with the same name already exists for this podcast.");

        // Update the episode with the new values
        episode.EpisodeName = request.EpisodeName;
        episode.Description = request.Description;
        episode.IsExplicit = request.IsExplicit;
        episode.UpdatedAt = DateTime.Now;

        // Update the episode audio if it was changed
        if (request.AudioFile != null)
        {
            // Check if the episode audio is an audio file
            if (!ALLOWED_AUDIO_FILES.Contains(request.AudioFile.ContentType))
                throw new Exception("Audio file must be an MP3, WAV, MP4, or MPEG.");

            // Check if the episode audio is smaller than 1GB
            if (request.AudioFile.Length > MAX_AUDIO_SIZE)
                throw new Exception("Audio file must be smaller than 1GB.");

            try
            {
                // Remove the old episode audio from the server
                RemovePodcastEpisodeAudio(episode.Audio, episode.PodcastId);

            }
            catch (Exception)
            {
                // TODO: Log if any error happens here
            }
            finally
            {
                // Save the new episode audio to the server
                episode.Audio = await SavePodcastEpisodeAudio(episode.Id, episode.PodcastId, request.AudioFile);
            }

            try
            {
                if (request.IsFullEpisode())
                {
                    // Remove the old episode transcript
                    RemoveTranscript(episodeId, episode.PodcastId);

                    // Send request to PY server to generate a transcript
                    var url = _pyBaseUrl + "/stt_ingest";
                    var json = $@"{{
                    ""podcast_id"": ""{episode.PodcastId}"",
                    ""episode_id"": ""{episode.Id}""
                    }}";

                    using var httpClient = new HttpClient();
                    var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                    await httpClient.PostAsync(url, content);
                }
            }
            catch (Exception)
            {
                // TODO: Log if any error happens here
            }


            // Find and Save the duration of the audio in seconds
            var mediaInfo = await GetMediaAnalysis(episode.Audio, episode.PodcastId);
            episode.Duration = mediaInfo.Duration.TotalSeconds;
        }

        // Update the episode thumbnail if it was changed
        if (request.Thumbnail != null)
        {
            // Check if the episode thumbnail is an image
            if (!ALLOWED_IMG_FILES.Contains(request.Thumbnail.ContentType))
                throw new Exception("Thumbnail must be a JPEG, PNG, or SVG.");

            // Check if the episode thumbnail is smaller than 5MB
            if (request.Thumbnail.Length > MAX_IMG_SIZE)
                throw new Exception("Thumbnail must be smaller than 5MB.");

            try
            {
                // Remove the old episode thumbnail from the server
                RemovePodcastEpisodeThumbnail(episode.Thumbnail, episode.PodcastId);
            }
            catch (Exception)
            {
                // TODO: Log if any error happens here
            }
            finally
            {
                // Save the new episode thumbnail to the server
                episode.Thumbnail = SavePodcastEpisodeThumbnail(episode.Id, episode.PodcastId, request.Thumbnail);
            }
        }

        // Check if the episode is explicit and the podcast is not
        if (episode.IsExplicit && !podcast.IsExplicit)
        {
            podcast.IsExplicit = true;
            _db.Podcasts.Update(podcast);
        }

        // Save the changes to the database and return status
        _db.Episodes.Update(episode);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Adds audio to an existing episode for the specified podcast.
    /// </summary>
    /// <param name="request"> The request object </param>
    /// <param name="episodeId"> The episode ID </param>
    /// <param name="user"> The user object </param>
    /// <returns> A boolean indicating success </returns>
    /// <exception cref="Exception"> Throws an exception if the episode does not exist or is not owned by the user </exception>
    /// <exception cref="Exception"> Throws an exception if the audio file is not provided </exception>
    /// <exception cref="Exception"> Throws an exception if the audio file is not an audio file </exception>
    /// <exception cref="Exception"> Throws an exception if the audio file is larger than 1GB </exception>
    public async Task<bool> AddEpisodeAudioAsync(AddEpisodeAudioRequest request, Guid episodeId, User user)
    {
        // Get the episode and make sure its owned by the user
        Episode episode = await _db.Episodes
            .Include(e => e.Podcast)
            .FirstOrDefaultAsync(e => e.Id == episodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Episode does not exist and/or it is not owned by user.");

        // Check if the episode audio was provided
        if (request.AudioFile == null)
            throw new Exception("Audio file is required.");

        // Check if the episode audio is an audio file
        if (!ALLOWED_AUDIO_FILES.Contains(request.AudioFile.ContentType))
            throw new Exception("Audio file must be an MP3, WAV, MP4, or MPEG.");

        // Check if the episode audio is smaller than 1GB
        if (request.AudioFile.Length > MAX_AUDIO_SIZE)
            throw new Exception($"Audio file must be smaller than {MAX_AUDIO_SIZE}GB.");

        // Append the new audio to the episode audio
        episode.Audio = await AppendPodcastEpisodeAudio(episode.PodcastId, episode.Audio, request.AudioFile);

        try
        {
            if (request.IsFullEpisode())
            {
                // Remove the old episode transcript
                RemoveTranscript(episodeId, episode.PodcastId);

                // Send request to PY server to generate a transcript
                var url = _pyBaseUrl + "/stt_ingest";
                var json = $@"{{
                    ""podcast_id"": ""{episode.PodcastId}"",
                    ""episode_id"": ""{episode.Id}""
                    }}";

                using var httpClient = new HttpClient();
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                await httpClient.PostAsync(url, content);
            }
        }
        catch (Exception)
        {
            // TODO: Log if any error happens here
        }


        // Find and Save the duration of the audio in seconds
        var mediaInfo = await GetMediaAnalysis(episode.Audio, episode.PodcastId);
        episode.Duration = mediaInfo.Duration.TotalSeconds;

        // Save the changes to the database and return status
        _db.Episodes.Update(episode);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Removes a Podcast from the database and the server, including all its episodes.
    /// </summary>
    /// <param name="podcastId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> DeletePodcastAsync(Guid podcastId, User user)
    {
        // Check if the podcast exists
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == podcastId && p.PodcasterId == user.Id) ?? throw new Exception("Podcast does not exist and/or it is not owned by user.");

        // Get the episodes for the podcast
        List<Episode> episodes = await _db.Episodes.Where(e => e.PodcastId == podcastId).ToListAsync();

        // Remove each podcast episode
        foreach (Episode episode in episodes)
            await DeleteEpisodeAsync(episode.Id, user);

        try
        {
            // Remove the cover art from the server
            RemovePodcastCoverArt(podcast.CoverArt);
        }
        catch (Exception)
        {
            // TODO: Log if any error happens here
        }

        // TODO: Remove dependent entities as well
        // ===================================

        // ===================================

        // Remove the podcast from the database
        _db.Podcasts.Remove(podcast);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Removes an episode from the database and the server.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> DeleteEpisodeAsync(Guid episodeId, User user)
    {
        // Check if the episode exists and is owned by the user
        Episode episode = await _db.Episodes
            .Include(e => e.UserEpisodeInteractions)
            .FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");

        // Check if the podcast exists
        Podcast podcast = await _db.Podcasts.FirstOrDefaultAsync(p => p.Id == episode.PodcastId && p.PodcasterId == user.Id) ?? throw new Exception("Episode podcast does not exist and/or it is not owned by user.");

        // Remove audio and thumbnail from server
        try
        {
            RemovePodcastEpisodeThumbnail(episode.Thumbnail, podcast.Id);
        }
        catch (Exception)
        {
            // TODO: Log if any error happens here
        }

        try
        {
            RemovePodcastEpisodeAudio(episode.Audio, podcast.Id);
        }
        catch (Exception)
        {
            // TODO: Log if any error happens here
        }

        try
        {
            RemoveTranscript(episodeId, episode.PodcastId);
        }
        catch (Exception)
        {
            // TODO: Log if any error happens here
        }

        // TODO: Remove dependent entities as well
        // ===================================

        // ===================================

        // Remove episode from database
        _db.Episodes.Remove(episode);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Retrieves an episode by ID.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<EpisodeResponse> GetEpisodeByIdAsync(Guid episodeId, string domainUrl)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes
            .Include(e => e.Podcast)
            .Include(e => e.Likes)
            .Include(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(e => e.Comments).ThenInclude(c => c.User)
            .Include(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(e => e.Comments).ThenInclude(c => c.Likes)
            .Include(e => e.Points)
            .FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist for the given ID.");


        // Return the episode response
        return new EpisodeResponse(episode, domainUrl);
    }

    /// <summary>
    /// Gets the audio name for the given episode.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<string> GetEpisodeAudioNameAsync(Guid episodeId)
    {
        // If the episode does not exist, throw an exception, otherwise return the audio name
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");
        return episode.Audio;
    }

    /// <summary>
    /// Gets the thumbnail name for the given episode.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<string> GetEpisodeThumbnailNameAsync(Guid episodeId)
    {
        // If the episode does not exist, throw an exception, otherwise return the thumbnail name
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist.");
        return episode.Thumbnail;
    }

    #region Watch History

    /// <summary>
    /// Saves the watch history for the given episode.
    /// </summary>
    /// <param name="user">Current user watching the episode</param>
    /// <param name="episodeId">Id of the episode being watched</param>
    /// <param name="listenPosition">The position in the episode the user is at</param>
    /// <returns>True if the watch history was saved successfully, false otherwise</returns>
    public async Task<bool> SaveWatchHistory(User user, Guid episodeId, double listenPosition)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("No episode exist for the given ID.");

        // Make sure the listen position is not negative
        if (listenPosition < 0)
            throw new Exception("Listen position cannot be negative.");

        // Make sure the listen position is not greater than the duration of the episode
        if (listenPosition > episode.Duration)
            throw new Exception("Listen position cannot be greater than the duration of the episode.");

        // Check if the User Episode Interaction exists, if it does retrieve it.
        UserEpisodeInteraction? interaction = await _db.UserEpisodeInteractions
            .FirstOrDefaultAsync(uei => uei.EpisodeId == episodeId && uei.UserId == user.Id);

        // If the interaction does not exist, create a new one.
        if (interaction is null)
        {
            interaction = new()
            {
                EpisodeId = episode.Id,
                UserId = user.Id,
                DateListened = DateTime.Now,
                LastListenPosition = listenPosition,
                HasListened = true,
                Clicks = 1,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                TotalListenTime = TimeSpan.FromSeconds(listenPosition)
            };

            // Add the interaction to the database
            await _db.UserEpisodeInteractions.AddAsync(interaction);
        }
        else
        {
            interaction.TotalListenTime = interaction.TotalListenTime.Add(TimeSpan.FromSeconds(Math.Abs(listenPosition - interaction.LastListenPosition)));
            interaction.DateListened = DateTime.Now;
            interaction.LastListenPosition = listenPosition;
            interaction.HasListened = true;
            interaction.UpdatedAt = DateTime.Now;

            // Update the interaction in the database
            _db.UserEpisodeInteractions.Update(interaction);
        }

        // Save the changes to the database
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Gets the watch history for the given episode.
    /// </summary>
    /// <param name="user">Current user watching the episode</param>
    /// <param name="episodeId">Id of the episode being watched</param>
    /// <returns>ListenPositionResponse object containing the listen position</returns>
    public async Task<ListenPositionResponse> GetWatchHistory(User user, Guid episodeId)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("No episode exist for the given ID.");

        // Check if the User Episode Interaction exists, if it does retrieve it.
        UserEpisodeInteraction? interaction = await _db.UserEpisodeInteractions
            .FirstOrDefaultAsync(uei => uei.EpisodeId == episodeId && uei.UserId == user.Id);

        // If the interaction does not exist, create a new one.
        if (interaction is null)
        {
            interaction = new()
            {
                EpisodeId = episode.Id,
                UserId = user.Id,
                DateListened = DateTime.Now,
                LastListenPosition = 0,
                HasListened = false,
                Clicks = 1,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            // Add the interaction to the database   
            await _db.UserEpisodeInteractions.AddAsync(interaction);
        }
        else
        {
            interaction.DateListened = DateTime.Now;
            interaction.HasListened = true;
            interaction.Clicks++;
            interaction.UpdatedAt = DateTime.Now;

            // Update the interaction in the database
            _db.UserEpisodeInteractions.Update(interaction);
        }

        // Save the changes to the database
        await _db.SaveChangesAsync();

        // Return the listen position
        return new() { ListenPosition = interaction.LastListenPosition };
    }

    /// <summary>
    /// Gets LoggedIn Users History
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<List<History>> GetUserWatchHistory(int page, int pageSize, User user)
    {
        // Gets User Interaction from the db and cast it to History
        List<History> history = await _db.UserEpisodeInteractions.Where(u => u.UserId == user.Id).Skip(page * pageSize).Take(pageSize).Select(u => new History(u)).ToListAsync();

       
        // Return the List
        return history;

    }

    /// <summary>
    /// Deletes the Watch History for the User
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="user"></param>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    public async Task<bool> DeleteWatchHistory( User user, Guid episodeId)
    {
        UserEpisodeInteraction? userEpisodeInteraction = await _db.UserEpisodeInteractions.FirstOrDefaultAsync( u => u.UserId == user.Id &&  u.EpisodeId == episodeId);
        
        // If the History doesnot Exist throw an error
        if(userEpisodeInteraction == null)
        {
            throw new Exception("History Does not Exist");
        }

        // If all the checks have passed then remove the object from DB
        _db.UserEpisodeInteractions.Remove(userEpisodeInteraction);

        // return whether the history have been successfully deleted  or not
        return await _db.SaveChangesAsync() > 0;

   
    }
    /// <summary>
    /// Clears whole history of a user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> DeleteAllWatchHistory(User user) 
    {
        List<UserEpisodeInteraction> userEpisodeInteractions = await _db.UserEpisodeInteractions.Where(u => u.UserId == user.Id).ToListAsync();

        _db.UserEpisodeInteractions.RemoveRange(userEpisodeInteractions);

        return await _db.SaveChangesAsync() > 0;

    }
    #endregion Watch History

    #region Transcription

    /// <summary>
    /// Gets the transcript for the given episode.
    /// </summary>
    /// <param name="episodeId">Id of the episode for which to get the transcript</param>
    /// <param name="seekTime">The time to seek to in the transcript</param>
    /// <param name="includeWords">Whether or not to include the words in the transcript</param>
    /// <returns>EpisodeTranscriptResponse object containing the transcript and status</returns>
    public async Task<EpisodeTranscriptResponse> GetEpisodeTranscriptAsync(Guid episodeId, float? seekTime = null, bool includeWords = false)
    {
        if (seekTime != null && seekTime < 0)
            throw new Exception("Seek time cannot be negative.");

        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes
        .FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist for the given ID.");

        // Get the transcription status
        TranscriptStatus status = GetTranscriptStatus(episodeId, episode.PodcastId);

        // If the transcript is not ready, return its current status
        if (status != TranscriptStatus.Ready)
            return status == TranscriptStatus.InProgress ?
                new EpisodeTranscriptResponse() { EpisodeId = episodeId, Status = "In Progess" } :
                new EpisodeTranscriptResponse() { EpisodeId = episodeId, Status = "An Error Occured while generating the transcription" };

        // Otherwise, get the transcript lines from the json file
        using StreamReader reader = new(GetTranscriptPath(episodeId, episode.PodcastId));
        var jsonTranscript = reader.ReadToEnd();
        List<TranscriptLineResponse> lines = JsonConvert.DeserializeObject<List<TranscriptLineResponse>>(jsonTranscript) ?? new List<TranscriptLineResponse>();
        reader.Close();

        // If the words are not requested, remove them from the lines
        if (!includeWords)
            lines.ForEach(l => l.Words = new());

        // If the seek time is requested, filter the lines to only include those that start after the seek time
        // Those that start up to 60 seconds after the seek time are included
        if (seekTime != null)
            lines = lines
            .Where(l => l.Start >= seekTime && l.Start <= seekTime + 60)
            .ToList();

        // Create the episode transcript response object and set the lines if they exist.
        // Otherwise, set the lines to an empty list.
        EpisodeTranscriptResponse transcript = new()
        {
            EpisodeId = episodeId,
            Status = "Ready",
            Lines = lines
        };

        // Return the episode transcript response
        return transcript;
    }

    /// <summary>
    /// Gets the transcript text for the given episode.
    /// </summary>
    /// <param name="episodeId">Id of the episode for which to get the transcript</param>
    /// <returns>EpisodeTranscriptTextResponse object containing the transcript text and status</returns>
    public async Task<EpisodeTranscriptTextResponse> GetEpisodeTranscriptTextAsync(Guid episodeId)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes
        .FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist for the given ID.");

        // Get the transcription status
        TranscriptStatus status = GetTranscriptStatus(episodeId, episode.PodcastId);

        // If the transcript is not ready, return its current status
        if (status != TranscriptStatus.Ready)
            return status == TranscriptStatus.InProgress ?
                new EpisodeTranscriptTextResponse() { EpisodeId = episodeId, Status = "In Progess" } :
                new EpisodeTranscriptTextResponse() { EpisodeId = episodeId, Status = "An Error Occured while generating the transcription" };

        // Otherwise, get the transcript lines from the json file
        using StreamReader reader = new(GetTranscriptPath(episodeId, episode.PodcastId));
        var jsonTranscript = reader.ReadToEnd();
        List<TranscriptLineResponse> lines = JsonConvert.DeserializeObject<List<TranscriptLineResponse>>(jsonTranscript) ?? new List<TranscriptLineResponse>();
        reader.Close();

        EpisodeTranscriptTextResponse transcript = new()
        {
            EpisodeId = episodeId,
            Status = "Ready",
            Text = string.Join(" ", lines.Select(l => l.Text))
        };

        // Return the episode transcript response   
        return transcript;
    }

    /// <summary>
    /// Edits the transcript lines for the given episode.
    /// </summary>
    /// <param name="user">User who is editing the transcript</param>
    /// <param name="episodeId">Id of the episode for which to edit the transcript</param>
    /// <param name="lines">The new lines to replace the old ones</param>
    /// <returns>True if the transcript was edited successfully, false otherwise</returns>
    public async Task<bool> EditEpisodeTranscriptLinesAsync(User user, Guid episodeId, TranscriptLineResponse[] lines)
    {
        // Check if the episode exists, if it does retrieve it. Also check if the user owns the podcast.
        Episode episode = await _db.Episodes
        .FirstOrDefaultAsync(e => e.Id == episodeId && e.Podcast.Podcaster.Id == user.Id) ?? throw new Exception("Episode does not exist for the given ID.");

        // Get the transcription status
        TranscriptStatus status = GetTranscriptStatus(episodeId, episode.PodcastId);

        // If the transcript is not ready, return false
        if (status != TranscriptStatus.Ready)
            return false;

        // Otherwise, get the transcript lines from the json file
        using StreamReader reader = new(GetTranscriptPath(episodeId, episode.PodcastId));
        var jsonTranscript = reader.ReadToEnd();
        List<TranscriptLineResponse> prevLines = JsonConvert.DeserializeObject<List<TranscriptLineResponse>>(jsonTranscript) ?? new List<TranscriptLineResponse>();
        reader.Close();

        // Update the lines
        foreach (TranscriptLineResponse line in lines)
        {
            // Check if the line exists
            TranscriptLineResponse? prevLine = prevLines.FirstOrDefault(l => l.Id == line.Id);
            if (prevLine is null)
                continue;

            // Update the line
            prevLine.Start = line.Start;
            prevLine.End = line.End;
            prevLine.Text = line.Text;
            prevLine.Words = line.Words;

        }

        // Save the updated lines to the json file
        using StreamWriter writer = new(GetTranscriptPath(episodeId, episode.PodcastId), false);
        await writer.WriteAsync(JsonConvert.SerializeObject(prevLines));
        writer.Close();

        return true;
    }

    /// <summary>
    /// Generates a transcript for the given episode.
    /// </summary>
    /// <param name="episodeId">Id of the episode for which to generate the transcript</param>
    /// <param name="user">User who is generating the transcript</param>
    /// <returns>True if the transcript was generated successfully, false otherwise</returns>
    /// <exception cref="Exception"></exception>
    public async Task<bool> GenerateEpisodeTranscriptAsync(Guid episodeId, User user)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes
        .FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist for the given ID.");

        // Check if the user owns the podcast of the episode
        if (await _db.Podcasts.AnyAsync(p => p.Id == episode.PodcastId && p.PodcasterId == user.Id))
        {
            // Send request to PY server to generate a transcript
            var url = _pyBaseUrl + "/stt";
            var json = $@"{{
                ""podcast_id"": ""{episode.PodcastId}"",
                ""episode_id"": ""{episode.Id}""
            }}";

            using var httpClient = new HttpClient();
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            var resp = await httpClient.PostAsync(url, content);

            return resp.StatusCode == HttpStatusCode.OK;
        }
        else
            throw new Exception("User does not have permission to generate transcript for this episode.");
    }



    #endregion Transcription

    /// <summary>
    /// Checks for previous and next uploaded Episodes
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<AdjecentEpisodeResponse> GetAdjecentEpisodeAsync(Guid episodeId)
    {
        // Check if Episode Exist
        Episode episode = await _db.Episodes!.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("No episode exist for the given ID.");

        // Check For Next Episode
        AdjecentEpisodeResponse adjecentEpisode = new AdjecentEpisodeResponse();

        // Order the list by Release Date
        List<Episode> EpisodeList = await _db.Episodes!.OrderBy(e => e.ReleaseDate).ToListAsync();

        var index = EpisodeList.IndexOf(episode);


        if (index - 1 >= 0)
        {
            adjecentEpisode.Previous = EpisodeList[index - 1].Id;

        }

        if (index + 1 < EpisodeList.Count)
        {
            adjecentEpisode.Next = EpisodeList[index + 1].Id;
        }


        return adjecentEpisode;


    }

    /// <summary>
    /// Search Episode with search Term and filters
    /// </summary>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="episodeFilter"></param>
    /// <param name="domainUrl"></param>
    /// <returns></returns>
    public async Task<List<EpisodeResponse>> SearchEpisodeAsync(int page, int pageSize, EpisodeFilter episodeFilter, string domainUrl)
    {

        List<Episode> episode = await _db.Episodes
            .Include(e => e.Podcast)
            .Include(e => e.Likes)
            .Include(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
            .Include(e => e.Comments).ThenInclude(c => c.User)
            .Include(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
            .Include(e => e.Points)
            .Include(e => e.Comments).ThenInclude(c => c.Likes).Where(p => AppDbContext.Soundex(p.EpisodeName) == AppDbContext.Soundex(episodeFilter.SearchTerm)).ToListAsync();

        // Filter on Episode Length
        if (episodeFilter.MinEpisodeLength != null)
        {
            episode = episode.Where(u => u.Duration >= episodeFilter.MinEpisodeLength).ToList();
        }
        // Filter on basis of Episode length
        if (episodeFilter.IsExplicit != null)
        {
            episode = episode.Where(u => u.IsExplicit == episodeFilter.IsExplicit).ToList();

        }
        // Filter on basis of Release Data
        if (episodeFilter.ReleaseDate != null)
        {
            // Filter Last week
            if (episodeFilter.ReleaseDate == "lastWeek")
            {
                DateTime lastWeek = DateTime.UtcNow.Subtract(new TimeSpan(7, 0, 0, 0, 0));
                episode = episode.FindAll(u => u.CreatedAt >= lastWeek);
            }
            // Filter last month
            if (episodeFilter.ReleaseDate == "lastMonth")
            {
                DateTime lastMonth = DateTime.UtcNow.Subtract(new TimeSpan(30, 0, 0, 0, 0));
                episode = episode.FindAll(u => u.CreatedAt >= lastMonth);

            }
            // Filter Last Year
            if (episodeFilter.ReleaseDate == "lastYear")
            {
                DateTime lastYear = DateTime.UtcNow.Subtract(new TimeSpan(365, 0, 0, 0, 0));
                episode = episode.FindAll(u => u.CreatedAt >= lastYear);

            }
        }



        // Cast it to Episode Reponse
        List<EpisodeResponse> response = episode.Select(u => new EpisodeResponse(u, domainUrl)).Skip(page * pageSize).Take(pageSize).ToList();


        return response;
    }

    public async Task<List<EpisodeResponse>> GetRecentEpisodes(int page, int pageSize, string domainUrl)
    {
        // Get the episodes from the database
        List<EpisodeResponse> episodeResponses = await _db.Episodes
        .OrderByDescending(p => p.CreatedAt)
        .Include(e => e.Podcast)
        .Include(e => e.Likes)
        .Include(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.User)
        .Include(e => e.Comments).ThenInclude(c => c.User)
        .Include(e => e.Comments).ThenInclude(c => c.Comments).ThenInclude(c => c.Likes)
        .Include(e => e.Comments).ThenInclude(c => c.Likes)
        .Include(e => e.Points)
        .Skip(page * pageSize)
        .Take(pageSize)
        .Select(e => new EpisodeResponse(e, domainUrl, true))
        .ToListAsync() ?? throw new Exception("No Episodes found.");

        return episodeResponses;
    }

    #region Highlights

    public async Task<bool> CreateHighlightAsync(CreateHighlightRequest request, Guid episodeId, User user)
    {       
        var currentEpisodeHighlights = await _db.Highlights.Where(h => episodeId == h.EpisodeId).ToListAsync();
        var episode = await _db.Episodes!.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("No episode exist for the given ID.");

        // Check if StartTime is valid (with a bit of leeway)
        if (Math.Floor(request.StartTime) < 0 || request.StartTime >= Math.Floor(episode.Duration))
        {
            throw new Exception("Invalid startTime for Highlight");
        }

        // Check if EndTime is valid (with a bit of leeway)
        if (request.EndTime < 1 || request.EndTime > episode.Duration)
        {
            throw new Exception("Invalid Endtime for Highlight");
        }

        // Check if the Highlight Length is more than max duration
        if (Math.Floor(request.EndTime - request.StartTime) > MAX_HIGHLIGHT_DURATION)
        {
            throw new Exception($"Your highlight length is over {MAX_HIGHLIGHT_DURATION} seconds");
        }

        // Check if user already made 3 highlights for this episode
        if (currentEpisodeHighlights.Count >= 3)
        {
            throw new Exception("You have already created 3 highlights on this episode");
        }

        // Check if Highlight name already exists for the current Episode
        foreach (var _highlight in currentEpisodeHighlights)
        {
            if (_highlight.Title == request.Title)
            {
                throw new Exception("There already exists a Highlight with that name attached to this episode");
            }
        }

        // Get path of the audio
        string inputFilePath = GetPodcastEpisodeAudioPath(episode.Audio, episode.PodcastId);

        // Get path where Highlights will be stored
        var highlightId = Guid.NewGuid();
        string highlightFilePath = GetHighlightPath(episodeId.ToString(),
                                                    highlightId.ToString(),
                                                    user.Id.ToString());

        // Create Highlight
        var highlight = new Highlight()
        {
            HighlightId = highlightId,
            EpisodeId = episodeId,
            UserId = user.Id,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Title = request.Title,
            Description = request.Description,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        highlight.Audio = SaveHighlightFile(highlight, episode);

        // Save Highlight
        await _db.Highlights.AddAsync(highlight);
        return await _db.SaveChangesAsync() > 0;
    }

    public async Task<bool> EditHighlightAsync(EditHighlightRequest request, Guid highlightId, User user)
    {
        var highlight = await _db.Highlights.FirstOrDefaultAsync(h => h.HighlightId == highlightId) ?? throw new Exception("Could not find any highlights with that given ID");
        var updatedHighlight = highlight;

        // Users can only edit their own highlights
        if (user.Id != highlight!.UserId)
        {
            throw new Exception("Users can only edit their own highlights");
        }
        
        // Title is changed
        if (request.Title != "No Title Given" || request.Title != highlight.Title)
        {
            updatedHighlight.Title = request.Title ?? throw new Exception("Title on request was somehow null");
        }

        // Description is changed
        if (request.Description != highlight.Description || !request.Description.IsNullOrEmpty())
        {
            updatedHighlight.Description = request.Description ?? throw new Exception("Description on request was somehow null");
        }

        _db.Highlights.Update(updatedHighlight);
        return await _db.SaveChangesAsync() > 0;
    }

    public async Task<bool> RemoveHighlightAsync(Guid highlightId, User user)
    {
        var highlight = await _db.Highlights.FirstOrDefaultAsync(h => h.HighlightId == highlightId) ?? throw new Exception("Could not find any highlights with that given ID");
        
        // Users can only delete their own highlights
        if (user.Id != highlight!.UserId)
        {
            throw new Exception("Users can only delete their own highlights");
        }
        
        // Remove from FileStorage
        RemoveHighlightFile(highlight);

        _db.Highlights.Remove(highlight);
        return await _db.SaveChangesAsync() > 0;
    }

    public async Task<List<HighlightResponse>> GetAllUserHighlightsAsync(Guid userId)
    {
        var highlights = await _db.Highlights
                                    .Where(h => h.UserId == userId)
                                    .Select(h => new HighlightResponse(h))
                                    .ToListAsync() ?? throw new Exception("User has no Highlights");

        return highlights;
    }

    public async Task<List<HighlightResponse>> GetAllEpisodeHighlightsAsync(Guid episodeId)
    {
        var highlights = await _db.Highlights
                                    .Where(h => h.EpisodeId == episodeId)
                                    .Select(h => new HighlightResponse(h))
                                    .ToListAsync() ?? throw new Exception("Epsiode has no Highlights");

        return highlights;
    }

    public async Task<Dictionary<string, string>> GetHighlightAudioAysnc(Guid highlightId)
    {
        var highlight = await _db.Highlights.FirstOrDefaultAsync(h => h.HighlightId == highlightId) ?? throw new Exception("Highlight does not exist");

        var guids = new Dictionary<string, string>()
        {
            {nameof(Episode), highlight.EpisodeId.ToString()},
            {nameof(User), highlight.UserId.ToString()}
        };

        return guids;
    }


    #endregion


    #endregion Episode

    #region Private Methods

    private async Task<FFMpegCore.IMediaAnalysis> GetMediaAnalysis(string audioName, Guid podcastId)
    {
        return await FFMpegCore.FFProbe.AnalyseAsync(GetPodcastEpisodeAudioPath(audioName, podcastId));
    }

    #region Episode Chat

    /// <summary>
    /// Get the episode chat for the given episode.
    /// </summary>
    /// <param name="page"> The page of the chat to get.</param>
    /// <param name="pageSize"> The size of the page to get.</param>
    /// <param name="episodeId"> The episode ID to get the chat for.</param>
    /// <param name="user"> The user that is requesting the chat.</param>
    /// <param name="domainUrl"> The domain URL to use for the response.</param>
    /// <returns> The episode chat response.</returns>
    /// <exception cref="Exception"> Throws an exception if the episode does not exist.</exception>
    public async Task<EpisodeChatResponse> GetEpisodeChatAsync(int page, int pageSize, Guid episodeId, User user, string domainUrl)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist for the given ID.");

        // Get the episode chat messages
        List<EpisodeChatMessage> chatMessages = await _db.EpisodeChatMessages
            .Where(m => m.EpisodeId == episodeId)
            .OrderBy(m => m.CreatedAt)
            .Skip(page * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Return the chat with the messages
        return new EpisodeChatResponse(chatMessages, user, episodeId, domainUrl);
    }

    /// <summary>
    /// Prompt the episode chat with a question and get a response.
    /// </summary>
    /// <param name="episodeId"> The episode ID to prompt the chat for.</param>
    /// <param name="user"> The user that is prompting the chat.</param>
    /// <param name="prompt"> The question to prompt the chat with.</param>
    /// <param name="domainUrl"> The domain URL to use for the response.</param>
    /// <returns> The response from the chat.</returns>
    /// <exception cref="Exception"> Throws an exception if the episode does not exist.</exception>
    public async Task<EpisodeChatMessageResponse> PromptEpisodeChatAsync(Guid episodeId, User user, string prompt, string domainUrl)
    {
        // Check if the episode exists, if it does retrieve it.
        Episode episode = await _db.Episodes.FirstOrDefaultAsync(e => e.Id == episodeId) ?? throw new Exception("Episode does not exist for the given ID.");

        // Create the prompt message
        EpisodeChatMessage promptMessage = new()
        {
            Id = Guid.NewGuid(),
            EpisodeId = episodeId,
            UserId = user.Id,
            Message = prompt,
            IsPrompt = true,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };


        string defaultErrorMsg = "Sorry, but I can't answer your question right now. Please try again later.";

        // Send request to PY server to chat with the episode
        var url = _pyBaseUrl + "/chat";
        var json = $@"{{
            ""podcast_id"": ""{episode.PodcastId}"",
            ""episode_id"": ""{episodeId}"",
            ""prompt"": ""{prompt}""
        }}";

        // Response text from PY server
        string responseText = string.Empty;

        try
        {
            // Send request to PY server to generate a chat response
            using var httpClient = new HttpClient();
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync(url, content);

            // If the response is not successful, return the default error message
            if (!response.IsSuccessStatusCode)
                responseText = defaultErrorMsg;
            else
                responseText = await response.Content.ReadAsStringAsync();
        }
        catch (Exception)
        {
            throw;
        }

        // Create the response message
        EpisodeChatMessage responseMessage = new()
        {
            Id = Guid.NewGuid(),
            EpisodeId = episodeId,
            UserId = user.Id,
            Message = responseText,
            IsPrompt = false,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // Add the messages to the database
        await _db.EpisodeChatMessages.AddAsync(promptMessage);
        await _db.EpisodeChatMessages.AddAsync(responseMessage);

        // Save the changes to the database
        await _db.SaveChangesAsync();

        // Return the chat with the messages
        return new EpisodeChatMessageResponse(responseMessage, user, domainUrl);
    }

    #endregion Episode Chat

    #endregion

}