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

            // Get the total watch time of the audience for the podcast
            TimeSpan totalWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => uei.TotalListenTime.Seconds)
                .SumAsync());

            // Get the total amount of clicks for the podcast
            int totalClicks = await _db.UserEpisodeInteractions
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => uei.Clicks)
                .SumAsync();

            // Get the average watch time of the audience for the podcast
            avgWatchTime = totalWatchTime / totalClicks;
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
            .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
                throw new Exception("No audience data available for the given episode.");

            // Get the total watch time of the audience for the episode
            TimeSpan totalWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => uei.TotalListenTime.Seconds)
                .SumAsync());

            // Get the total amount of clicks for the episode
            int totalClicks = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => uei.Clicks)
                .SumAsync();

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

            // Get the total watch time of the audience for the podcast
            totalWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => uei.TotalListenTime.Seconds)
                .SumAsync());
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
                .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Check if there are any interactions for the episode
            if (await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
                throw new Exception("No audience data available for the given episode.");

            // Get the total watch time of the audience for the episode
            totalWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => uei.TotalListenTime.Seconds)
                .SumAsync());
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

            // Get the total watch time of the audience for the podcast
            totalWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => uei.TotalListenTime.Seconds)
                .SumAsync());

            // Get the total amount of clicks for the podcast
            totalClicks = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => uei.Clicks)
                .SumAsync();

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

            // Get the total watch time of the audience for the episode
            totalWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => uei.TotalListenTime.Seconds)
                .SumAsync());

            // Get the total amount of clicks for the episode
            totalClicks = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => uei.Clicks)
                .SumAsync();

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

        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
            .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        List<WatchTimeRangeResponse> watchTimeRangeResponses;
        int totalClicks = 0;
        TimeSpan totalWatchTime = TimeSpan.Zero;

        if(podcast is not null)
        {
            // Get the total watch time of the audience for the podcast
            totalWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => uei.TotalListenTime.Seconds)
                .SumAsync());

            // Get the total amount of clicks for the podcast
            totalClicks = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => uei.Clicks)
                .SumAsync();

            // Get the watch time range of the audience for the podcast
            watchTimeRangeResponses = await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .GroupBy(uei => (uei.TotalListenTime.TotalMinutes - (uei.TotalListenTime.TotalMinutes % timeInterval)) / timeInterval)
                .OrderByDescending(g => g.Count())
                .OrderBy(g => g.Key)
                .Select(g => new WatchTimeRangeResponse(g.ToList(), totalClicks, totalWatchTime))
                .ToListAsync();
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
                .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");
            
            // Get the total watch time of the audience for the episode
            totalWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => uei.TotalListenTime.Seconds)
                .SumAsync());
            
            // Get the total amount of clicks for the episode
            totalClicks = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => uei.Clicks)
                .SumAsync();

            // Get the watch time range of the audience for the episode
            watchTimeRangeResponses = await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .GroupBy(uei => (uei.TotalListenTime.TotalMinutes - (uei.TotalListenTime.TotalMinutes % timeInterval)) / timeInterval)
                .OrderByDescending(g => g.Count())
                .OrderBy(g => g.Key)
                .Select(g => new WatchTimeRangeResponse(g.ToList(), totalClicks, totalWatchTime))
                .ToListAsync();
        }

        return watchTimeRangeResponses;
    }

    #endregion Watch Time

}