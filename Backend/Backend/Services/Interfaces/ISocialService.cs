using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces;

/// <summary>
/// Interface for social service.
/// </summary>
public interface ISocialService
{
    public Task<bool> AddCommentAsync(CommentRequest request, User user);
    public Task<List<CommentResponse>> GetEpisodeCommentsAsync(Guid episodeId);
    public Task<List<CommentResponse>> GetUserCommentsAsync(User user);
    public Task<bool> DeleteCommentAsync(Guid commentId, User user);
    public Task<bool> AddLikeToEpisodeAsync(Guid episodeId, User user);
    public Task<bool> AddLikeToCommentAsync(Guid commentId, User user);
    public Task<bool> RemoveEpisodeLikeAsync(Guid episodeId, User user);
    public Task<bool> RemoveCommentLikeAsync(Guid commentId, User user);
}