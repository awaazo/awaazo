using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

/// <summary>
/// The Analytic Service is responsible for handling all the logic for the analytic endpoints.
/// </summary>
public class AnalyticService : IAnalyticService
{
    private readonly AppDbContext _db;

    /// <summary>
    /// The constructor for the Analytic Service.
    /// </summary>
    /// <param name="db">AppDbContext to be injected.</param>
    public AnalyticService(AppDbContext db)
    {
        _db = db;
    }

    #region Audience Age

    /// <summary>
    /// Get the average age of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The average age of the audience.</returns>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist or the user is not the owner.</exception>
    /// <exception cref="Exception">Thrown when there is no audience data available for the given podcast or episode.</exception>
    public async Task<uint> GetAverageAudienceAgeAsync(Guid podcastOrEpisodeId, User user)
    {
        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
        .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        double avgAge = -1;

        // Get the average age of the audience for the podcast
        if (podcast is not null)
        {
            // Check if there are any interactions for the podcast
            if (await _db.UserEpisodeInteractions.Include(uei => uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcast.Id) == false)
                throw new Exception("No audience data available for the given podcast.");

            // Get the average age of the audience for the podcast
            avgAge = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => DateTime.Now.Year - uei.User.DateOfBirth.Year)
                .AverageAsync();
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
            .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
                throw new Exception("No audience data available for the given episode.");

            // Get the average age of the audience for the episode
            avgAge = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => DateTime.Now.Year - uei.User.DateOfBirth.Year)
                .AverageAsync();
        }

        // Return the average age
        return (uint)avgAge;
    }

    /// <summary>
    /// Get the age range of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="min">The minimum age of the audience.</param>
    /// <param name="max">The maximum age of the audience.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The age range of the audience.</returns>
    /// <exception cref="Exception">Thrown when the minimum age is greater than the maximum age.</exception>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist or the user is not the owner.</exception>
    /// <exception cref="Exception">Thrown when there is no audience data available for the given podcast or episode.</exception>
    public async Task<AgeRangeResponse> GetAgeRangeInfoAsync(Guid podcastOrEpisodeId, uint min, uint max, User user)
    {
        // Check if the minimum age is greater than the maximum age
        if (min > max)
            throw new Exception("Minimum age cannot be greater than maximum age.");

        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
        .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        AgeRangeResponse ageRangeResponse;
        int totalInteractionsCount = 0;

        // Get the average age of the audience for the podcast
        if (podcast is not null)
        {
            // Get the total interactions count for the podcast
            totalInteractionsCount = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .CountAsync();

            // Check if there are any interactions for the podcast
            if (totalInteractionsCount == 0)
                throw new Exception("No audience data available for the given podcast.");

            // Get the age range of the audience for the podcast
            ageRangeResponse = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id && ((DateTime.Now.Year - uei.User.DateOfBirth.Year) >= min) && ((DateTime.Now.Year - uei.User.DateOfBirth.Year) <= max))
                .ToListAsync()
                .ContinueWith(t => new AgeRangeResponse(t.Result, (uint)totalInteractionsCount));
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
            .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Get the total interactions count for the episode
            totalInteractionsCount = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Where(uei => uei.EpisodeId == episode.Id)
                .CountAsync();

            // Check if there are any interactions for the episode
            if (totalInteractionsCount == 0)
                throw new Exception("No audience data available for the given episode.");

            // Get the age range of the audience for the episode
            ageRangeResponse = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Where(uei => uei.EpisodeId == episode.Id && ((DateTime.Now.Year - uei.User.DateOfBirth.Year) >= min) && ((DateTime.Now.Year - uei.User.DateOfBirth.Year) <= max))
                .ToListAsync()
                .ContinueWith(t => new AgeRangeResponse(t.Result, (uint)totalInteractionsCount));
        }

        return ageRangeResponse;
    }

    /// <summary>
    /// Get the age range distribution of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId"> The ID of the podcast or episode.</param>
    /// <param name="ageInterval">The interval for the age range.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The age range distribution of the audience.</returns>
    /// <exception cref="Exception">Thrown when the age interval is 0.</exception>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist or the user is not the owner.</exception>
    /// <exception cref="Exception">Thrown when there is no audience data available for the given podcast or episode.</exception>
    public async Task<List<AgeRangeResponse>> GetAgeRangeDistributionInfoAsync(Guid podcastOrEpisodeId, uint ageInterval, User user)
    {
        // Check if the age interval is 0
        if (ageInterval == 0)
            throw new Exception("Age interval cannot be 0.");

        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
        .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        List<AgeRangeResponse> ageRangeResponses;
        int totalInteractionsCount = 0;

        if (podcast is not null)
        {
            // Get the total interactions count for the podcast
            totalInteractionsCount = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .CountAsync();

            // Check if there are any interactions for the podcast
            if (totalInteractionsCount == 0)
                throw new Exception("No audience data available for the given podcast.");

            // Get the age range distribution of the audience for the podcast
            ageRangeResponses = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .GroupBy(uei => (DateTime.Now.Year - uei.User.DateOfBirth.Year - ((DateTime.Now.Year - uei.User.DateOfBirth.Year) % ageInterval)) / ageInterval)
                .OrderByDescending(g => g.Count())
                .OrderBy(g => g.Key)
                .Select(g => new AgeRangeResponse(g.ToList(), (uint)totalInteractionsCount))
                .ToListAsync();
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
            .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Get the total interactions count for the episode
            totalInteractionsCount = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Where(uei => uei.EpisodeId == episode.Id)
                .CountAsync();

            // Check if there are any interactions for the episode
            if (totalInteractionsCount == 0)
                throw new Exception("No audience data available for the given episode.");

            // Get the age range distribution of the audience for the episode
            ageRangeResponses = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Where(uei => uei.EpisodeId == episode.Id)
                .GroupBy(uei => (DateTime.Now.Year - uei.User.DateOfBirth.Year - ((DateTime.Now.Year - uei.User.DateOfBirth.Year) % ageInterval)) / ageInterval)
                .OrderByDescending(g => g.Count())
                .OrderBy(g => g.Key)
                .Select(g => new AgeRangeResponse(g.ToList(), (uint)totalInteractionsCount))
                .ToListAsync();
        }

        return ageRangeResponses;
    }

    #endregion Audience Age

    #region Watch Time

    /// <summary>
    /// Get the average watch time of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The average watch time of the audience.</returns>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist or the user is not the owner.</exception>
    /// <exception cref="Exception">Thrown when there is no audience data available for the given podcast or episode.</exception>
    /// <exception cref="Exception">Thrown when the total watch time is 0.</exception>
    /// <exception cref="Exception">Thrown when the total clicks is 0.</exception>
    /// <exception cref="Exception">Thrown when the episode does not exist for the given ID.</exception>
    public async Task<TimeSpan> GetAverageWatchTimeAsync(Guid podcastOrEpisodeId, User user)
    {
        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
        .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        // Initialize the average watch time
        TimeSpan avgWatchTime = TimeSpan.Zero;

        // Get the average watch time of the audience for the podcast
        if (podcast is not null)
        {
            // Check if there are any interactions for the podcast
            if (await _db.UserEpisodeInteractions.Include(uei => uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcast.Id) == false)
                throw new Exception("No audience data available for the given podcast.");

            var interactions = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .ToListAsync();

            // Get the total watch time of the audience for the podcast
            TimeSpan totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());

            // Get the total amount of clicks for the podcast
            int totalClicks = interactions
                .Select(uei => uei.Clicks)
                .Sum();

            // Get the average watch time of the audience for the podcast
            avgWatchTime = TimeSpan.FromSeconds((double)totalWatchTime.TotalSeconds / totalClicks);
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
            .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
                throw new Exception("No audience data available for the given episode.");

            var interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .ToListAsync();

            // Get the total watch time of the audience for the episode
            TimeSpan totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());

            // Get the total amount of clicks for the episode
            int totalClicks =  interactions
                .Select(uei => uei.Clicks)
                .Sum();

            // Get the average watch time of the audience for the episode
            avgWatchTime = totalWatchTime / totalClicks;
        }

        return avgWatchTime;
    }

    /// <summary>
    /// Get the total watch time of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The total watch time of the audience.</returns>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist or the user is not the owner.</exception>
    /// <exception cref="Exception">Thrown when there is no audience data available for the given podcast or episode.</exception>
    /// <exception cref="Exception">Thrown when the episode does not exist for the given ID.</exception>
    /// <exception cref="Exception">Thrown when the total watch time is 0.</exception>
    public async Task<TimeSpan> GetTotalWatchTimeAsync(Guid podcastOrEpisodeId, User user)
    {
        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
            .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        TimeSpan totalWatchTime = TimeSpan.Zero;

        // Get the total watch time of the audience for the podcast
        if (podcast is not null)
        {
            // Check if there are any interactions for the podcast
            if (await _db.UserEpisodeInteractions.Include(uei => uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcast.Id) == false)
                throw new Exception("No audience data available for the given podcast.");

            var interactions = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .ToListAsync();

            // Get the total watch time of the audience for the podcast
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
                .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
                throw new Exception("No audience data available for the given episode.");

            var interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .ToListAsync();

            // Get the total watch time of the audience for the episode
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());
        }

        return totalWatchTime;
    }

    /// <summary>
    /// Get the watch time range of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="minTime">The minimum watch time.</param>
    /// <param name="maxTime">The maximum watch time.</param>
    /// <returns>The watch time range of the audience.</returns>
    /// <exception cref="Exception">Thrown when the minimum time is greater than the maximum time.</exception>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist or the user is not the owner.</exception>
    /// <exception cref="Exception">Thrown when there is no audience data available for the given podcast or episode.</exception>
    public async Task<WatchTimeRangeResponse> GetWatchTimeRangeInfoAsync(Guid podcastOrEpisodeId, User user, TimeSpan minTime, TimeSpan maxTime)
    {
        // Check if the min time is greater than the max time
        if (minTime > maxTime)
            throw new Exception("Minimum time cannot be greater than maximum time.");

        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
            .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        WatchTimeRangeResponse watchTimeRangeResponse;
        int totalClicks = 0;
        TimeSpan totalWatchTime = TimeSpan.Zero;

        // Get the total watch time of the audience for the podcast
        if (podcast is not null)
        {
            // Check if there are any interactions for the podcast
            if (await _db.UserEpisodeInteractions.Include(uei => uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcast.Id) == false)
                throw new Exception("No audience data available for the given podcast.");

            var interactions = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .ToListAsync();

            // Get the total watch time of the audience for the podcast
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());

            // Get the total amount of clicks for the podcast
            totalClicks = interactions
                .Select(uei => uei.Clicks)
                .Sum();

            // Get the watch time range of the audience for the podcast
            watchTimeRangeResponse = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id && (uei.TotalListenTime >= minTime) && (uei.TotalListenTime <= maxTime))
                .ToListAsync()
                .ContinueWith(t => new WatchTimeRangeResponse(t.Result, totalClicks, totalWatchTime));
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
                .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
                throw new Exception("No audience data available for the given episode.");

            var interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .ToListAsync();

            // Get the total watch time of the audience for the episode
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());

            // Get the total amount of clicks for the episode
            totalClicks = interactions
                .Select(uei => uei.Clicks)
                .Sum();

            // Get the watch time range of the audience for the episode
            watchTimeRangeResponse = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id && (uei.TotalListenTime >= minTime) && (uei.TotalListenTime <= maxTime))
                .ToListAsync()
                .ContinueWith(t => new WatchTimeRangeResponse(t.Result, totalClicks, totalWatchTime));
        }

        // Return the watch time range
        return watchTimeRangeResponse;
    }

    /// <summary>
    /// Get the watch time distribution of the audience for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="timeInterval">The time interval.</param>
    /// <param name="intervalIsInMinutes">Whether the time interval is in minutes.</param>
    /// <returns>The watch time distribution of the audience.</returns>
    /// <exception cref="Exception">Thrown when the time interval is 0.</exception>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist or the user is not the owner.</exception>
    /// <exception cref="Exception">Thrown when there is no audience data available for the given podcast or episode.</exception>
    /// <exception cref="Exception">Thrown when the episode does not exist for the given ID.</exception>
    public async Task<List<WatchTimeRangeResponse>> GetWatchTimeDistributionInfoAsync(Guid podcastOrEpisodeId, User user, uint timeInterval = 1, bool intervalIsInMinutes = true)
    {
        // Check that the time interval is not 0
        if (timeInterval == 0)
            throw new Exception("Time interval cannot be 0.");

        if (intervalIsInMinutes)
            timeInterval *= 60;

        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
            .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        List<WatchTimeRangeResponse> watchTimeRangeResponses;
        int totalClicks = 0;
        TimeSpan totalWatchTime = TimeSpan.Zero;

        if (podcast is not null)
        {
            // Check if there are any interactions for the podcast
            if (await _db.UserEpisodeInteractions.Include(uei => uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcast.Id) == false)
                throw new Exception("No audience data available for the given podcast.");

            var interactions = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .ToListAsync();

            // Get the total watch time of the audience for the podcast
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());

            // Get the total amount of clicks for the podcast
            totalClicks = interactions
                .Select(uei => uei.Clicks)
                .Sum();

            // Get the watch time range of the audience for the podcast
            watchTimeRangeResponses = interactions
                .GroupBy(uei => (uei.TotalListenTime.TotalSeconds - (uei.TotalListenTime.TotalSeconds % timeInterval)) / timeInterval)
                .OrderByDescending(g => g.Count())
                .OrderBy(g => g.Key)
                .Select(g => new WatchTimeRangeResponse(g.ToList(), totalClicks, totalWatchTime))
                .ToList(); 
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
                .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
                throw new Exception("No audience data available for the given episode.");

            var interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .ToListAsync();

            // Get the total watch time of the audience for the episode
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());

            // Get the total amount of clicks for the episode
            totalClicks = interactions
                .Select(uei => uei.Clicks)
                .Sum();

            // Get the watch time range of the audience for the episode
            watchTimeRangeResponses = interactions
                .GroupBy(uei => (uei.TotalListenTime.TotalSeconds - (uei.TotalListenTime.TotalSeconds % timeInterval)) / timeInterval)
                .OrderByDescending(g => g.Count())
                .OrderBy(g => g.Key)
                .Select(g => new WatchTimeRangeResponse(g.ToList(), totalClicks, totalWatchTime))
                .ToList();
        
        }

        return watchTimeRangeResponses;
    }

    #endregion Watch Time

    #region User Engagement Metrics

    /// <summary>
    /// Get the user engagement metrics for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The user engagement metrics for the podcast or episode.</returns>
    public async Task<UserEngagementMetricsResponse> GetUserEngagementMetricsAsync(Guid podcastOrEpisodeId, User user)
    {
        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
            .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        UserEngagementMetricsResponse userEngagementMetricsResponse;
        List<UserEpisodeInteraction> interactions;
        int commentsCount = 0;
        int likesCount = 0;

        if (podcast is not null)
        {
            // Get the number of comments for the podcast
            commentsCount = await _db.Comments
                .Include(c => c.Episode)
                .Where(c => c.Episode.PodcastId == podcast.Id)
                .CountAsync();

            // Get the number of likes for the podcast
            likesCount = await _db.EpisodeLikes
                .Include(l => l.Episode)
                .Where(l => l.Episode.PodcastId == podcast.Id)
                .CountAsync();

            // Get all the interactions for the podcast
            interactions = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .ToListAsync();

            // Set the user engagement metrics response
            userEngagementMetricsResponse = interactions.Count == 0 ?
                new UserEngagementMetricsResponse { TotalLikes = likesCount, TotalComments = commentsCount } :
                new UserEngagementMetricsResponse(interactions, commentsCount, likesCount);
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
                .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Get the number of comments for the episode
            commentsCount = await _db.Comments
                .Where(c => c.EpisodeId == episode.Id)
                .CountAsync();

            // Get the number of likes for the episode
            likesCount = await _db.EpisodeLikes
                .Where(l => l.EpisodeId == episode.Id)
                .CountAsync();

            // Get all the interactions for the episode
            interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .ToListAsync();

            // Set the user engagement metrics response
            userEngagementMetricsResponse = interactions.Count == 0 ?
                new UserEngagementMetricsResponse { TotalLikes = likesCount, TotalComments = commentsCount }
                : new UserEngagementMetricsResponse(interactions, commentsCount, likesCount);
        }

        return userEngagementMetricsResponse;
    }

    /// <summary>
    /// Get the top commented podcasts for a user.
    /// </summary>
    /// <param name="count">The number of podcasts to get.</param>
    /// <param name="getLessCommented">Whether to get the less commented podcasts.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top commented podcasts for the user.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    public async Task<List<PodcastResponse>> GetTopCommentedPodcastsAsync(int count, bool getLessCommented, User user, string domainUrl)
    {
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        if(getLessCommented)
        {
            var podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
                .Include(p => p.Ratings)
                .Where(p => p.PodcasterId == user.Id)
                .ToListAsync();

            return podcasts.OrderBy(p => p.Episodes.Sum(e => e.Comments.Count))
                .Take(count)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
        else
        {
            var podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.Comments).ThenInclude(c => c.User)
                .Include(p => p.Ratings)
                .Where(p => p.PodcasterId == user.Id)
                .ToListAsync();

            return podcasts.OrderByDescending(p => p.Episodes.Sum(e => e.Comments.Count))
                .Take(count)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
    }

    /// <summary>
    /// Get the top commented episodes for a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="count">The number of episodes to get.</param>
    /// <param name="getLessCommented">Whether to get the less commented episodes.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top commented episodes for the podcast.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    public async Task<List<EpisodeResponse>> GetTopCommentedEpisodesAsync(Guid podcastId, int count, bool getLessCommented, User user, string domainUrl)
    {
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        if(! await _db.Podcasts.AnyAsync(p => p.Id == podcastId && p.PodcasterId == user.Id))
            throw new Exception("Podcast does not exist for the given ID.");

        if (getLessCommented)
        {
            var episodes = await _db.Episodes
                .Include(e => e.Comments)
                .Include(e => e.Podcast)
                .Where(e => e.PodcastId == podcastId && e.Podcast.PodcasterId == user.Id)
                .ToListAsync();

            return episodes.OrderBy(e => e.Comments.Count)
                .Take(count)
                .Select(e => new EpisodeResponse(e, domainUrl, false))
                .ToList();
        }
        else
        {
            var episodes = await _db.Episodes
                .Include(e => e.Comments)
                .Include(e => e.Podcast)
                .Where(e => e.PodcastId == podcastId && e.Podcast.PodcasterId == user.Id)
                .ToListAsync();

            return episodes.OrderByDescending(e => e.Comments.Count)
                .Take(count)
                .Select(e => new EpisodeResponse(e, domainUrl, false))
                .ToList();
        }
    }

    /// <summary>
    /// Get the top liked podcasts for a user.
    /// </summary>
    /// <param name="count">The number of podcasts to get.</param>
    /// <param name="getLessLiked">Whether to get the less liked podcasts.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top liked podcasts for the user.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    public async Task<List<PodcastResponse>> GetTopLikedPodcastsAsync(int count, bool getLessLiked, User user, string domainUrl)
    {
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        if(getLessLiked)
        {
            var podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.Likes)
                .Where(p => p.PodcasterId == user.Id)
                .ToListAsync();

            return podcasts.OrderBy(p => p.Episodes.Sum(e => e.Likes.Count))
                .Take(count)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
        else
        {
            var podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.Likes)
                .Where(p => p.PodcasterId == user.Id)
                .ToListAsync();

            return podcasts.OrderByDescending(p => p.Episodes.Sum(e => e.Likes.Count))
                .Take(count)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
    }

    /// <summary>
    /// Get the top liked episodes for a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="count">The number of episodes to get.</param>
    /// <param name="getLessLiked">Whether to get the less liked episodes.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top liked episodes for the podcast.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    public async Task<List<EpisodeResponse>> GetTopLikedEpisodesAsync(Guid podcastId, int count, bool getLessLiked, User user, string domainUrl)
    {
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        if (!await _db.Podcasts.AnyAsync(p => p.Id == podcastId && p.PodcasterId == user.Id))
            throw new Exception("Podcast does not exist for the given ID.");

        if(getLessLiked)
        {
            var episodes = await _db.Episodes
                .Include(e => e.Likes)
                .Include(e => e.Podcast)
                .Where(e => e.PodcastId == podcastId && e.Podcast.PodcasterId == user.Id)
                .ToListAsync();

            return episodes.OrderBy(e => e.Likes.Count)
                .Take(count)
                .Select(e => new EpisodeResponse(e, domainUrl,false))
                .ToList();
        }
        else
        {
            var episodes = await _db.Episodes
                .Include(e => e.Likes)
                .Include(e => e.Podcast)
                .Where(e => e.PodcastId == podcastId && e.Podcast.PodcasterId == user.Id)
                .ToListAsync();

            return episodes.OrderByDescending(e => e.Likes.Count)
                .Take(count)
                .Select(e => new EpisodeResponse(e, domainUrl,false))
                .ToList();
        }
    }

    /// <summary>
    /// Get the top clicked podcasts for a user.
    /// </summary>
    /// <param name="count">The number of podcasts to get.</param>
    /// <param name="getLessClicked">Whether to get the less clicked podcasts.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top clicked podcasts for the user.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    public async Task<List<PodcastResponse>> GetTopClickedPodcastsAsync(int count, bool getLessClicked, User user, string domainUrl)
    {
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        if(getLessClicked)
        {
            var podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.UserEpisodeInteractions)
                .Where(p => p.PodcasterId == user.Id)
                .ToListAsync();

            return podcasts.OrderBy(p => p.Episodes.Sum(e => e.UserEpisodeInteractions.Sum(uei => uei.Clicks)))
                .Take(count)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
        else
        {
            var podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.UserEpisodeInteractions)
                .Where(p => p.PodcasterId == user.Id)
                .ToListAsync();

            return podcasts.OrderByDescending(p => p.Episodes.Sum(e => e.UserEpisodeInteractions.Sum(uei => uei.Clicks)))
                .Take(count)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
    }

    /// <summary>
    /// Get the top clicked episodes for a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="count">The number of episodes to get.</param>
    /// <param name="getLessClicked">Whether to get the less clicked episodes.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top clicked episodes for the podcast.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    /// <exception cref="Exception">Thrown when the podcast does not exist for the given ID.</exception>
    public async Task<List<EpisodeResponse>> GetTopClickedEpisodesAsync(Guid podcastId, int count, bool getLessClicked, User user, string domainUrl)
    {
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        if (!await _db.Podcasts.AnyAsync(p => p.Id == podcastId && p.PodcasterId == user.Id))
            throw new Exception("Podcast does not exist for the given ID.");

        if(getLessClicked)
        {
            var episodes = await _db.Episodes
                .Include(e => e.UserEpisodeInteractions)
                .Include(e => e.Podcast)
                .Where(e => e.PodcastId == podcastId && e.Podcast.PodcasterId == user.Id)
                .ToListAsync();

            return episodes.OrderBy(e => e.UserEpisodeInteractions.Sum(uei => uei.Clicks))
                .Take(count)
                .Select(e => new EpisodeResponse(e, domainUrl,false))
                .ToList();
        }
        else
        {
            var episodes = await _db.Episodes
                .Include(e => e.UserEpisodeInteractions)
                .Include(e => e.Podcast)
                .Where(e => e.PodcastId == podcastId && e.Podcast.PodcasterId == user.Id)
                .ToListAsync();

            return episodes.OrderByDescending(e => e.UserEpisodeInteractions.Sum(uei => uei.Clicks))
                .Take(count)
                .Select(e => new EpisodeResponse(e, domainUrl,false))
                .ToList();
        }
    }

    /// <summary>
    /// Get the top watched podcasts for a user.
    /// </summary>
    /// <param name="count">The number of podcasts to get.</param>
    /// <param name="getLessWatched">Whether to get the less watched podcasts.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top watched podcasts for the user.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    public async Task<List<PodcastResponse>> GetTopWatchedPodcastsAsync(int count, bool getLessWatched, User user, string domainUrl)
    {
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        if(getLessWatched)
        {
            var podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.UserEpisodeInteractions)
                .Where(p => p.PodcasterId == user.Id)
                .ToListAsync();
            
            return podcasts.OrderBy(p => p.Episodes.Sum(e => e.UserEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds)))
                .Take(count)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
        else
        {
            var podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.UserEpisodeInteractions)
                .Where(p => p.PodcasterId == user.Id)
                .ToListAsync();

            return podcasts.OrderByDescending(p => p.Episodes.Sum(e => e.UserEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds)))
                .Take(count)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
    }

    /// <summary>
    /// Get the top watched episodes for a podcast.
    /// </summary>
    /// <param name="podcastId">The ID of the podcast.</param>
    /// <param name="count">The number of episodes to get.</param>
    /// <param name="getLessWatched">Whether to get the less watched episodes.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top watched episodes for the podcast.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    /// <exception cref="Exception">Thrown when the podcast does not exist for the given ID.</exception>
    public async Task<List<EpisodeResponse>> GetTopWatchedEpisodesAsync(Guid podcastId, int count, bool getLessWatched, User user, string domainUrl)
    {
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        if (!await _db.Podcasts.AnyAsync(p => p.Id == podcastId && p.PodcasterId == user.Id))
            throw new Exception("Podcast does not exist for the given ID.");

        if(getLessWatched)
        {
            var episodes = await _db.Episodes
                .Include(e => e.UserEpisodeInteractions)
                .Include(e => e.Podcast)
                .Where(e => e.PodcastId == podcastId && e.Podcast.PodcasterId == user.Id)
                .ToListAsync();

            return episodes.OrderBy(e => e.UserEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds))
                .Take(count)
                .Select(e => new EpisodeResponse(e, domainUrl,false))
                .ToList();
        }
        else
        {
            var episodes = await _db.Episodes
                .Include(e => e.UserEpisodeInteractions)
                .Include(e => e.Podcast)
                .Where(e => e.PodcastId == podcastId && e.Podcast.PodcasterId == user.Id)
                .ToListAsync();

            return episodes.OrderByDescending(e => e.UserEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds))
                .Take(count)
                .Select(e => new EpisodeResponse(e, domainUrl,false))
                .ToList();
        }
    }

    #endregion User Engagement Metrics
    
    /// <summary>
    /// Get the average watch time of a user for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The average watch time of the user for the podcast or episode.</returns>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given podcast or episode.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given user.</exception>
    public async Task<TimeSpan> GetUserAverageWatchTimeAsync(Guid? podcastOrEpisodeId, User user)
    {
        // Check if the podcast or episode exists
        bool isPodcast = await _db.Podcasts.AnyAsync(p => p.Id == podcastOrEpisodeId);
        bool isEpisode = await _db.Episodes.AnyAsync(e => e.Id == podcastOrEpisodeId);

        TimeSpan avgWatchTime = TimeSpan.Zero;
        int totalClicks = 0;
        TimeSpan totalWatchTime = TimeSpan.Zero;

        if(isPodcast)
        {
            // Check if there are any interactions for the podcast
            if (await _db.UserEpisodeInteractions.Include(uei => uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcastOrEpisodeId) == false)
                throw new Exception("No data available for the given podcast.");

            var interactions = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcastOrEpisodeId && uei.UserId == user.Id)
                .ToListAsync();

            // Get the total watch time of the user for the podcast
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());

            // Get the total amount of clicks for the podcast   
            totalClicks = interactions
                .Select(uei => uei.Clicks)
                .Sum();
        }
        else if(isEpisode)
        {
            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == podcastOrEpisodeId && uei.Clicks!=0 && uei.UserId == user.Id) == false)
                throw new Exception("No data available for the given episode.");

            var interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == podcastOrEpisodeId && uei.UserId == user.Id)
                .ToListAsync();

            // Get the total watch time of the user for the episode
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());    

            // Get the total amount of clicks for the episode
            totalClicks = interactions
                .Select(uei => uei.Clicks)
                .Sum();
        }
        else
        {
            // Check if the user has any interactions
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.UserId == user.Id && uei.Clicks!=0) == false)
                throw new Exception("No data available for the given user.");

            var interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.UserId == user.Id)
                .ToListAsync();

            // Get the total watch time of the user
            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());

            // Get the total amount of clicks for the user
            totalClicks = interactions
                .Select(uei => uei.Clicks)
                .Sum();
        }

        // Calculate the average watch time
        avgWatchTime = TimeSpan.FromSeconds(totalWatchTime.TotalSeconds / totalClicks);

        return avgWatchTime;
    }

    /// <summary>
    /// Get the total watch time of a user for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The total watch time of the user for the podcast or episode.</returns>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given podcast or episode.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given user.</exception>
    public async Task<TimeSpan> GetUserTotalWatchTimeAsync(Guid? podcastOrEpisodeId, User user)
    {
        // Check if the podcast or episode exists
        bool isPodcast = await _db.Podcasts.AnyAsync(p => p.Id == podcastOrEpisodeId);
        bool isEpisode = await _db.Episodes.AnyAsync(e => e.Id == podcastOrEpisodeId);

        TimeSpan totalWatchTime = TimeSpan.Zero;

        if(isPodcast)
        {
            // Check if there are any interactions for the podcast
            if (await _db.UserEpisodeInteractions.Include(uei => uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcastOrEpisodeId) == false)
                throw new Exception("No data available for the given podcast.");

            var interactions = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcastOrEpisodeId && uei.UserId == user.Id)
                .ToListAsync();

            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());
        }
        else if(isEpisode)
        {
            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == podcastOrEpisodeId) == false)
                throw new Exception("No data available for the given episode.");

            var interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == podcastOrEpisodeId && uei.UserId == user.Id)
                .ToListAsync();

            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());
        }
        else
        {
            // Check if the user has any interactions
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.UserId == user.Id) == false)
                throw new Exception("No data available for the given user.");

            var interactions = await _db.UserEpisodeInteractions
                .Where(uei => uei.UserId == user.Id)
                .ToListAsync(); 

            totalWatchTime = TimeSpan.FromSeconds(interactions
                .Select(uei => uei.TotalListenTime.TotalSeconds)
                .Sum());
        }

        return totalWatchTime;
    }

    /// <summary>
    /// Get the total watch time of a user for a podcast or episode.
    /// </summary>
    /// <param name="podcastOrEpisodeId">The ID of the podcast or episode.</param>
    /// <param name="user">The user making the request.</param>
    /// <returns>The total watch time of the user for the podcast or episode.</returns>
    /// <exception cref="Exception">Thrown when the podcast or episode does not exist.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given podcast or episode.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given user.</exception>
    public async Task<List<EpisodeResponse>> GetTopWatchedEpisodesByUserAsync(int count, bool getLessWatched, User user, string domainUrl, int page, int pageSize)
    {
        // Check if the count is less than or equal to 0
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        List<EpisodeResponse> topWatchedEpisodes;

        if (getLessWatched)
        {
            List<Episode> episodes = await _db.Episodes
                .Include(e=>e.Podcast)
                .Include(e => e.UserEpisodeInteractions)
                .Where(e => e.UserEpisodeInteractions.Any(uei => uei.UserId == user.Id))
                .ToListAsync();
            
            topWatchedEpisodes = episodes
                .OrderBy(e => e.UserEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds))
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(e => new EpisodeResponse(e, domainUrl,false))
                .ToList();
        }
        else
        {
            List<Episode> episodes = await _db.Episodes
                .Include(e => e.UserEpisodeInteractions)
                .Include(e => e.Podcast)
                .Where(e => e.UserEpisodeInteractions.Any(uei => uei.UserId == user.Id))
                .ToListAsync();

            topWatchedEpisodes = episodes
                .OrderByDescending(e => e.UserEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds))
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(e => new EpisodeResponse(e, domainUrl,false))
                .ToList();
        }

        return topWatchedEpisodes;
    }

    /// <summary>
    /// Get the top watched podcasts for a user.
    /// </summary>
    /// <param name="count">The number of podcasts to get.</param>
    /// <param name="getLessWatched">Whether to get the less watched podcasts.</param>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <returns>The top watched podcasts for the user.</returns>
    /// <exception cref="Exception">Thrown when the count is less than or equal to 0.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given user.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given podcast or episode.</exception>
    public async Task<List<PodcastResponse>> GetTopWatchedPodcastsByUserAsync(int count, bool getLessWatched, User user, string domainUrl, int page, int pageSize)
    {
        // Check if the count is less than or equal to 0
        if (count <= 0)
            throw new Exception("Count cannot be less than or equal to 0.");

        List<PodcastResponse> topWatchedPodcasts;

        if (getLessWatched)
        {
            List<Podcast> podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.UserEpisodeInteractions)
                .Where(p => p.Episodes.Any(e => e.UserEpisodeInteractions.Any(uei => uei.UserId == user.Id)))
                .ToListAsync();

            topWatchedPodcasts = podcasts
                .OrderBy(p => p.Episodes.Sum(e => e.UserEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds)))
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();
        }
        else
        {
            List<Podcast> podcasts = await _db.Podcasts
                .Include(p => p.Episodes).ThenInclude(e => e.UserEpisodeInteractions)
                .Where(p => p.Episodes.Any(e => e.UserEpisodeInteractions.Any(uei => uei.UserId == user.Id)))
                .ToListAsync();

            topWatchedPodcasts = podcasts
                .OrderByDescending(p => p.Episodes.Sum(e => e.UserEpisodeInteractions.Sum(uei => uei.TotalListenTime.TotalSeconds)))
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(p => new PodcastResponse(p, domainUrl))
                .ToList();

        }

        return topWatchedPodcasts;
    }

    /// <summary>
    /// Get the top Genre by user.
    /// </summary>
    /// <param name="user">The user making the request.</param>
    /// <returns>The top genre by user.</returns>
    /// <exception cref="Exception">Thrown when there is no data available for the given user.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given podcast or episode.</exception>
    public async Task<GenreUserEngagementResponse> GetTopGenreByUserAsync(User user)
    {
        // Get all the interactions for the user
        List<UserEpisodeInteraction> interactions = await _db.UserEpisodeInteractions
            .Include(uei => uei.Episode).ThenInclude(e => e.Podcast)
            .Where(uei => uei.UserId == user.Id)
            .ToListAsync();

        // Check if the user has any interactions
        if (interactions.Count == 0)
            throw new Exception("No data available for the given user.");
        
        // Get the top genre by user
        return new GenreUserEngagementResponse(interactions);
    }

    /// <summary>
    /// Get the user listening history.
    /// </summary>
    /// <param name="user">The user making the request.</param>
    /// <param name="domainUrl">The domain URL.</param>
    /// <param name="page">The page number.</param>
    /// <param name="pageSize">The page size.</param>
    /// <returns>The user listening history.</returns>
    /// <exception cref="Exception">Thrown when there is no data available for the given user.</exception>
    /// <exception cref="Exception">Thrown when there is no data available for the given podcast or episode.</exception>
    public async Task<List<EpisodeResponse>> GetUserListeningHistoryAsync(User user, string domainUrl, int page, int pageSize)
    {
        return await _db.UserEpisodeInteractions
            .Include(uei => uei.Episode).ThenInclude(e => e.Podcast)
            .Where(uei => uei.UserId == user.Id)
            .OrderByDescending(uei => uei.DateListened)
            .Skip(page * pageSize)
            .Take(pageSize)
            .Select(uei => new EpisodeResponse(uei.Episode, domainUrl,false))
            .ToListAsync();
    }
}