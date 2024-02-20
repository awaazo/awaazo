using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces;

/// <summary>
/// Interface for the analytic service.
/// </summary>
public interface IAnalyticService
{
    // Audience Age
    public Task<uint> GetAverageAudienceAgeAsync(Guid podcastOrEpisodeId, User user);
    public Task<AgeRangeResponse> GetAgeRangeInfoAsync(Guid podcastOrEpisodeId, uint min, uint max, User user);
    public Task<List<AgeRangeResponse>> GetAgeRangeDistributionInfoAsync(Guid podcastOrEpisodeId, uint ageInterval, User user);

    // Watch Time
    public Task<TimeSpan> GetAverageWatchTimeAsync(Guid podcastOrEpisodeId, User user);
    public Task<TimeSpan> GetTotalWatchTimeAsync(Guid podcastOrEpisodeId, User user);
    public Task<WatchTimeRangeResponse> GetWatchTimeRangeInfoAsync(Guid podcastOrEpisodeId, User user, TimeSpan minTime, TimeSpan maxTime);
    public Task<List<WatchTimeRangeResponse>> GetWatchTimeDistributionInfoAsync(Guid podcastOrEpisodeId, User user, uint timeInterval = 1,bool intervalIsInMinutes = true);

}