using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces;

/// <summary>
/// Interface for the analytic service.
/// </summary>
public interface IAnalyticService
{

    public Task<uint> GetAverageAudienceAgeAsync(Guid podcastOrEpisodeId, User user);
    public Task<AgeRangeResponse> GetAgeRangeInfoAsync(Guid podcastOrEpisodeId, uint min, uint max, User user);
    public Task<List<AgeRangeResponse>> GetAgeRangeDistributionInfoAsync(Guid podcastOrEpisodeId, uint ageInterval, User user);

}