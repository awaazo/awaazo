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
        if(podcast is not null)
        {
            // Check if there are any interactions for the podcast
            if(await _db.UserEpisodeInteractions.Include(uei=>uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcast.Id) == false)
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
            if(await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
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
        if(podcast is not null)
        {
            // Get the total interactions count for the podcast
            totalInteractionsCount = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .CountAsync();

            // Check if there are any interactions for the podcast
            if(totalInteractionsCount == 0)
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
            if(totalInteractionsCount == 0)
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

        // Get the average age of the audience for the podcast
        if(podcast is not null)
        {   
            // Get the total interactions count for the podcast
            totalInteractionsCount = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .CountAsync();

            // Check if there are any interactions for the podcast
            if(totalInteractionsCount == 0)
                throw new Exception("No audience data available for the given podcast.");
            
            // Get the age range distribution of the audience for the podcast
            ageRangeResponses = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .GroupBy(uei => (DateTime.Now.Year - uei.User.DateOfBirth.Year - ((DateTime.Now.Year-uei.User.DateOfBirth.Year)%ageInterval)) / ageInterval)
                .OrderByDescending(g=>g.Count())
                .OrderBy(g=>g.Key)
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
            if(totalInteractionsCount == 0)
                throw new Exception("No audience data available for the given episode.");

            // Get the age range distribution of the audience for the episode
            ageRangeResponses = await _db.UserEpisodeInteractions
                .Include(uei => uei.User)
                .Where(uei => uei.EpisodeId == episode.Id)
                .GroupBy(uei => (DateTime.Now.Year - uei.User.DateOfBirth.Year - ((DateTime.Now.Year-uei.User.DateOfBirth.Year)%ageInterval)) / ageInterval)
                .OrderByDescending(g=>g.Count())
                .OrderBy(g=>g.Key)
                .Select(g => new AgeRangeResponse(g.ToList(), (uint)totalInteractionsCount))
                .ToListAsync();
        }

        return ageRangeResponses;
    }

    #endregion Audience Age

    #region Watch Time

    public async Task<TimeSpan> GetAverageWatchTimeAsync(Guid podcastOrEpisodeId, User user)
    {
        // Check if the podcast exists and the user is the owner
        Podcast? podcast = await _db.Podcasts
        .FirstOrDefaultAsync(p => p.Id == podcastOrEpisodeId && p.PodcasterId == user.Id);

        TimeSpan avgWatchTime = TimeSpan.Zero;

/*
        // Get the average watch time of the audience for the podcast
        if(podcast is not null)
        {
            // Check if there are any interactions for the podcast
            if(await _db.UserEpisodeInteractions.Include(uei=>uei.Episode).AnyAsync(uei => uei.Episode.PodcastId == podcast.Id) == false)
                throw new Exception("No audience data available for the given podcast.");

            // Get the average watch time of the audience for the podcast
            avgWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Include(uei => uei.Episode)
                .Where(uei => uei.Episode.PodcastId == podcast.Id)
                .Select(uei => uei.WatchTime)
                .AverageAsync());
        }
        else
        {
            // Check if the episode exists and the user is the owner
            Episode episode = await _db.Episodes
            .FirstOrDefaultAsync(e => e.Id == podcastOrEpisodeId && e.Podcast.PodcasterId == user.Id) ?? throw new Exception("Podcast or Episode does not exist for the given ID.");

            // Check if there are any interactions for the episode
            if(await _db.UserEpisodeInteractions.AnyAsync(uei => uei.EpisodeId == episode.Id) == false)
                throw new Exception("No audience data available for the given episode.");

            // Get the average watch time of the audience for the episode
            avgWatchTime = TimeSpan.FromSeconds(await _db.UserEpisodeInteractions
                .Where(uei => uei.EpisodeId == episode.Id)
                .Select(uei => uei.WatchTime)
                .AverageAsync());
        }

        */
        
        return avgWatchTime;
    }

    public Task<TimeSpan> GetTotalWatchTimeAsync(Guid podcastOrEpisodeId, User user)
    {
        throw new NotImplementedException();
    }

    public Task<WatchTimeRangeResponse> GetWatchTimeRangeInfoAsync(Guid podcastOrEpisodeId, User user, DateTime start, DateTime end)
    {
        throw new NotImplementedException();
    }

    public Task<List<WatchTimeRangeResponse>> GetWatchTimeDistributionInfoAsync(Guid podcastOrEpisodeId, User user, uint timeInterval = 1, bool intervalIsInMinutes = true)
    {
        throw new NotImplementedException();
    }

    #endregion Watch Time

}