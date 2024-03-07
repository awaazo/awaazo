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
    public Task<List<WatchTimeRangeResponse>> GetWatchTimeDistributionInfoAsync(Guid podcastOrEpisodeId, User user, uint timeInterval = 1, bool intervalIsInMinutes = true);

    // User Engagement Metrics
    public Task<UserEngagementMetricsResponse> GetUserEngagementMetricsAsync(Guid podcastOrEpisodeId, User user);
    public Task<List<PodcastResponse>>  GetTopCommentedPodcastsAsync(int count, bool getLessCommented,User user, string domainUrl);
    public Task<List<EpisodeResponse>>  GetTopCommentedEpisodesAsync(Guid podcastId, int count, bool getLessCommented, User user, string domainUrl);
    public Task<List<PodcastResponse>>  GetTopLikedPodcastsAsync(int count, bool getLessLiked, User user, string domainUrl);
    public Task<List<EpisodeResponse>>  GetTopLikedEpisodesAsync(Guid podcastId, int count, bool getLessLiked, User user, string domainUrl);
    public Task<List<PodcastResponse>>  GetTopClickedPodcastsAsync(int count, bool getLessClicked, User user, string domainUrl);
    public Task<List<EpisodeResponse>>  GetTopClickedEpisodesAsync(Guid podcastId, int count, bool getLessClicked, User user, string domainUrl);
    public Task<List<PodcastResponse>>  GetTopWatchedPodcastsAsync(int count, bool getLessWatched, User user, string domainUrl);
    public Task<List<EpisodeResponse>>  GetTopWatchedEpisodesAsync(Guid podcastId, int count, bool getLessWatched, User user, string domainUrl);

    // User Watch Time 
    public Task<TimeSpan> GetUserAverageWatchTimeAsync(Guid? podcastOrEpisodeId, User user);
    public Task<TimeSpan> GetUserTotalWatchTimeAsync(Guid? podcastOrEpisodeId, User user);
    public Task<List<EpisodeResponse>> GetTopWatchedEpisodesByUserAsync(int count, bool getLessWatched, User user, string domainUrl, int page = 1, int pageSize = 10);
    public Task<List<PodcastResponse>> GetTopWatchedPodcastsByUserAsync(int count, bool getLessWatched, User user, string domainUrl, int page = 1, int pageSize = 10);

    // User Listening Habits
    public Task<bool> GetTopGenreByUserAsync(User user, string domainUrl);

    // User Listening History
    public Task<List<EpisodeResponse>> GetUserListeningHistoryAsync(User user, string domainUrl, int page = 1, int pageSize = 10);



}