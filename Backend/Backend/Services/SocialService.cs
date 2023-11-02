using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

/// <summary>
/// Handles all services for the Social Controller.
/// </summary>
public class SocialService : ISocialService
{
    /// <summary>
    /// Current DB instance
    /// </summary>
    private readonly AppDbContext _db;

    /// <summary>
    /// Default Constructor
    /// </summary>
    /// <param name="db"></param>
    public SocialService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Adds a Comment to the DB.
    /// </summary>
    /// <param name="request">Comment Request</param>
    /// <param name="user">Current User</param>
    /// <returns></returns>
    public async Task<bool> AddCommentAsync(CommentRequest request, User user)
    {
        // Check if the episode exists
        Episode episode = await _db.Episodes!.FirstOrDefaultAsync(episode => episode.Id.Equals(request.EpisodeId)) ?? throw new Exception("Episode does not exist with the given ID.");

        // If the comment is a reply to a comment, check if the comment exists
        if (request.ReplyToCommentId is not null)
        {
            Comment parentComment = await _db.Comments.FirstOrDefaultAsync(comment => comment.Id.Equals(request.ReplyToCommentId)) ?? throw new Exception("Comment does not exist");
        }

        // Create the Comment
        Comment comment = new()
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            EpisodeId = request.EpisodeId,
            ReplyToCommentId = request.ReplyToCommentId,
            Text = request.Text,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        // Add the Comment to the DB and return the status
        await _db.Comments.AddAsync(comment);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Gets all Comments for an Episode.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <returns></returns>
    public async Task<List<CommentResponse>> GetEpisodeCommentsAsync(Guid episodeId)
    {
        // Get the comments for the episode
        List<CommentResponse> comments = await _db.Comments.Where(comment => comment.EpisodeId.Equals(episodeId)).Select(c => new CommentResponse(c)).ToListAsync();

        // Get the likes for each comment
        foreach (CommentResponse comment in comments)
        {
            comment.Likes = await _db.Likes.Where(like => like.CommentId.Equals(comment.Id)).CountAsync();
        }

        // Return the comments
        return comments;
    }

    /// <summary>
    /// Gets all Comments for a User.
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<List<CommentResponse>> GetUserCommentsAsync(User user)
    {
        // Get the comments for the user
        List<CommentResponse> comments = await _db.Comments.Where(comment => comment.UserId.Equals(user.Id)).Select(c => new CommentResponse(c)).ToListAsync();

        // Get the likes for each comment
        foreach (CommentResponse comment in comments)
        {
            comment.Likes = await _db.Likes.Where(like => like.CommentId.Equals(comment.Id)).CountAsync();
        }

        // Return the comments
        return comments;
    }

    /// <summary>
    /// Deletes a Comment from the DB.
    /// </summary>
    /// <param name="commentId">Comment to be deleted.</param>
    /// <param name="user">User that is deleting the comment</param>
    /// <returns></returns>
    public async Task<bool> DeleteCommentAsync(Guid commentId, User user)
    {
        // Get the comment from the DB if it exists
        Comment comment = await _db.Comments.FirstOrDefaultAsync(comment => comment.Id.Equals(commentId)) ?? throw new Exception("Comment does not exist for the given ID.");
        // Get the episode from the DB if it exists
        Episode episode = await _db.Episodes!.FirstOrDefaultAsync(episode => episode.Id.Equals(comment!.EpisodeId)) ?? throw new Exception("Error finding episode.");
        // Get the podcast from the DB if it exists
        Podcast podcast = await _db.Podcasts!.FirstOrDefaultAsync(podcast => podcast.Id.Equals(episode.PodcastId)) ?? throw new Exception("Error finding podcast.");
        // Find all subcomments of the comment
        List<Comment> subcomments = await _db.Comments.Where(comment => comment.ReplyToCommentId.Equals(commentId)).ToListAsync();
        // Get all likes for the comment
        List<Like> likes = await _db.Likes.Where(like => like.CommentId.Equals(commentId)).ToListAsync();

        // If the user is the owner of the comment or of the episode, 
        // delete it and return the status
        if (comment.UserId.Equals(user.Id) || podcast.PodcasterId.Equals(user.Id))
        {
            // Update all subcomments so that they don't point to the deleted one
            foreach (Comment subcomment in subcomments)
            {
                subcomment.ReplyToCommentId = comment.ReplyToCommentId;
                _db.Comments.Update(subcomment);
            }

            // Delete all likes for the comment
            foreach (Like like in likes)
            {
                _db.Likes.Remove(like);
            }

            // Delete the comment and return the status
            _db.Comments.Remove(comment);
            return await _db.SaveChangesAsync() > 0;
        }
        else
        {
            return false;
        }
    }

    /// <summary>
    /// Adds a like to an Episode.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> AddLikeToEpisodeAsync(Guid episodeId, User user)
    {
        // Create the Like
        Like like = new()
        {
            UserId = user.Id,
            EpisodeId = episodeId,
            CommentId = Guid.Empty,
            UpdatedAt = DateTime.Now,
            CreatedAt = DateTime.Now
        };

        // Make sure its not a duplicate like
        if(await _db.Likes.CountAsync(l=>l.UserId.Equals(like.UserId) && l.EpisodeId.Equals(like.EpisodeId) && l.CommentId.Equals(like.CommentId))>0)
            throw new Exception("Episode has already been liked.");

        // Add the Like to the DB and return the status
        await _db.Likes.AddAsync(like);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Adds a like to a comment.
    /// </summary>
    /// <param name="commentId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> AddLikeToCommentAsync(Guid commentId, User user)
    {
        // Create the Like
        Like like = new()
        {
            UserId = user.Id,
            EpisodeId = Guid.Empty,
            CommentId = commentId,
            UpdatedAt = DateTime.Now,
            CreatedAt = DateTime.Now
        };

        // Make sure its not a duplicate like
        if(await _db.Likes.CountAsync(l=>l.UserId.Equals(like.UserId) && l.EpisodeId.Equals(like.EpisodeId) && l.CommentId.Equals(like.CommentId))>0)
            throw new Exception("Comment has already been liked.");

        // Add the Like to the DB and return the status
        await _db.Likes.AddAsync(like);
        return await _db.SaveChangesAsync() > 0;
    }

    /// <summary>
    /// Removes a like from an episode.
    /// </summary>
    /// <param name="episodeId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> RemoveEpisodeLikeAsync(Guid episodeId, User user)
    {
        // Find if the like exists
        Like? like = await _db.Likes.FirstOrDefaultAsync(like => like.EpisodeId.Equals(episodeId) && like.UserId.Equals(user.Id));

        // If the like exists, remove it from the DB and return the status
        if (like != null)
        {
            _db.Likes.Remove(like);
            return await _db.SaveChangesAsync() > 0;
        }
        else
        {
            return false;
        }
    }

    /// <summary>
    /// Removes a like from a comment.
    /// </summary>
    /// <param name="commentId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<bool> RemoveCommentLikeAsync(Guid commentId, User user)
    {
        // Find if the like exists
        Like? like = await _db.Likes.FirstOrDefaultAsync(like => like.CommentId.Equals(commentId) && like.UserId.Equals(user.Id));

        // If the like exists, remove it from the DB and return the status
        if (like != null)
        {
            _db.Likes.Remove(like);
            return await _db.SaveChangesAsync() > 0;
        }
        else
        {
            return false;
        }
    }

}