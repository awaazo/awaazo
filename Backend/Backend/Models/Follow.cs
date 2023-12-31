﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Models;
public class PodcastFollow
{
    public User User { get; set; } = null!;

    public Guid UserId { get; set; }

    [Key]
    public Guid Id { get; set; }

    public Guid PodcastId { get; set; }
}

public class UserFollow
{
    public User Follower { get; set; } = null!;

    public Guid FollowerId { get; set; }

    [Key]
    public Guid Id { get; set; }

    public Guid FollowingId { get; set; }
}

public class Subscription
{
    public User User { get; set; } = null!;

    public Guid UserId { get; set; }

    [Key]
    public Guid Id { get; set; }

    public SubType Type { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public enum SubType
    {
        Basic, Premium
    }
}

/// <summary>
/// Represents a rating for a podcast, which can be accompanied by a review.
/// </summary>
public class PodcastRating : BaseEntity
{
    public const uint MAX_RATING = 5;
    public const uint MIN_RATING = 1;

    /// <summary>
    /// Rating Id.
    /// </summary>
    /// <value></value>
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// User to whom the rating belongs.
    /// </summary>
    /// <value></value>
    public User User { get; set; } = null!;

    /// <summary>
    /// Id of the user who rated the podcast.
    /// </summary>
    /// <value></value>
    [Required]
    public Guid UserId { get; set; } = Guid.Empty;

    /// <summary>
    /// Podcast to which the rating belongs.
    /// </summary>
    public Podcast Podcast { get; set; } = null!;

    /// <summary>
    /// Id of the podcast.
    /// </summary>
    /// <value></value>
    [Required]
    public Guid PodcastId { get; set; } = Guid.Empty;

    /// <summary>
    /// Rating for the podcast.
    /// </summary>
    /// <value></value>
    [Required]
    public uint Rating { get; set; } = 0;

    /// <summary>
    /// Review for the podcast.
    /// </summary>
    /// <value></value>
    public string Review { get; set; } = "";
}
