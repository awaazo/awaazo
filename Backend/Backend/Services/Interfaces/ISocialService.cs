using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces;

/// <summary>
/// Interface for social service.
/// </summary>
public interface ISocialService
{
    // Comment
    public Task<bool> AddCommentAsync(Guid episodeOrCommentId, User user, string commentText);
    public Task<bool> AddCommentToEpisodeAsync(Guid episodeId, User user, string commentText);
    public Task<bool> AddCommentToCommentAsync(Guid commentId, User user, string commentText);
    public Task<bool> RemoveCommentAsync(Guid commentId, User user);

    // Like
    public Task<bool> AddLikeAsync(Guid episodeOrCommentId, User user);
    public Task<bool> AddLikeToEpisodeAsync(Guid episodeId, User user);
    public Task<bool> AddLikeToCommentAsync(Guid commentId, User user);
    public Task<bool> RemoveLikeAsync(Guid episodeOrCommentId, User user);
    public Task<bool> IsLikedAsync(Guid episodeOrCommentId, User user);

    // RATINGS

    public Task<bool> AddRatingToPodcastAsync(Guid podcastId, User user, uint rating);
    public Task<bool> RemoveRatingFromPodcastAsync(Guid podcastId, User user);

    // REVIEWS

    public Task<bool> AddReviewToPodcastAsync(Guid podcastId, User user, string review);
    public Task<bool> RemoveReviewFromPodcastAsync(Guid podcastId, User user);

}