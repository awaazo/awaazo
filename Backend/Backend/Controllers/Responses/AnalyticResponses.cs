using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace Backend.Controllers.Responses;

/// <summary>
/// Response for the average audience age
/// </summary>
[BindProperties]
public class AgeRangeResponse
{
    /// <summary>
    /// Constructor for the age range response
    /// </summary>
    /// <param name="interactions">The interactions to get the age range from</param>
    /// <param name="totalCount">The total count of the interactions</param>
    /// <returns>The age range response</returns>
    /// <remarks>Calculates the age range, average, count, and percentage of the interactions</remarks>
    public AgeRangeResponse(List<UserEpisodeInteraction> interactions, uint totalCount)
    {
        Count = (uint)interactions.Count;
        Min = (uint)interactions.Min(i => DateTime.Now.Year - i.User.DateOfBirth.Year);
        Max = (uint)interactions.Max(i => DateTime.Now.Year - i.User.DateOfBirth.Year);
        Average = (uint)Math.Round(interactions.Average(i => DateTime.Now.Year - i.User.DateOfBirth.Year));
        Percentage = (double)Count / totalCount * 100;
    }

    /// <summary>
    /// Default empty constructor
    /// </summary>
    public AgeRangeResponse()
    {
    }

    /// <summary>
    /// The minimum age of the audience in the range
    /// </summary>
    public uint Min { get; set; } = 0;

    /// <summary>
    /// The maximum age of the audience in the range
    /// </summary>
    public uint Max { get; set; } = 0;

    /// <summary>
    /// The average age of the audience in the range
    /// </summary>
    public uint Average { get; set; } = 0;

    /// <summary>
    /// The count of the audience in the range
    /// </summary>
    public uint Count { get; set; } = 0;

    /// <summary>
    /// The percentage out of the total audience that falls in this range
    /// </summary>
    public double Percentage { get; set; } = 0;
}

/// <summary>
/// Response for the watch time range
/// </summary>
[BindProperties]
public class WatchTimeRangeResponse
{

    /// <summary>
    /// Default empty constructor
    /// </summary>
    public WatchTimeRangeResponse()
    {
    }

    /// <summary>
    /// Constructor for the watch time range response
    /// </summary>
    /// <param name="interactions">The interactions to get the watch time range from</param>
    /// <param name="totalClicks">The total clicks of the interactions</param>
    /// <param name="totalWatchTime">The total watch time of the interactions</param>
    public WatchTimeRangeResponse(List<UserEpisodeInteraction> interactions, int totalClicks, TimeSpan totalWatchTime)
    {
        // Set the min and max watch time 
        MinWatchTime = interactions.Min(i => i.TotalListenTime);
        MaxWatchTime = interactions.Max(i => i.TotalListenTime);

        // Set the total watch time and clicks
        TotalWatchTime = TimeSpan.FromTicks(interactions.Sum(i => i.TotalListenTime.Ticks));
        TotalClicks = interactions.Sum(i => i.Clicks);

        // Set the watch time and clicks percentage
        ClicksPercentage = (double)TotalClicks / totalClicks * 100;
        WatchTimePercentage = (double)TotalWatchTime.TotalMinutes / totalWatchTime.TotalMinutes * 100;

        // Set the average watch time and clicks
        AverageWatchTime = TotalWatchTime / interactions.Count;
        AverageClicks = (double)TotalClicks / interactions.Count;
    }

    /// <summary>
    /// The minimum watch time of the interactions
    /// </summary>
    public TimeSpan MinWatchTime { get; set; } = TimeSpan.Zero;

    /// <summary>
    /// The maximum watch time of the interactions
    /// </summary> 
    public TimeSpan MaxWatchTime { get; set; } = TimeSpan.Zero;

    /// <summary>
    /// The average watch time of the interactions
    /// </summary>
    public TimeSpan AverageWatchTime { get; set; } = TimeSpan.Zero;

    /// <summary>
    /// The average clicks of the interactions
    /// </summary>
    public double AverageClicks { get; set; } = 0;

    /// <summary>
    /// The total watch time of the interactions
    /// </summary>
    public TimeSpan TotalWatchTime { get; set; } = TimeSpan.Zero;
    
    /// <summary>
    /// The total clicks of the interactions
    /// </summary>
    public int TotalClicks { get; set; } = 0;

    /// <summary>
    /// The percentage of the total clicks
    /// </summary>
    public double ClicksPercentage { get; set; } = 0;

    /// <summary>
    /// The percentage of the total watch time
    /// </summary>
    public double WatchTimePercentage { get; set; } = 0;
}

/// <summary>
/// Response for the user engagement metrics
/// </summary>
[BindProperties]
public class UserEngagementMetricsResponse
{   
    /// <summary>
    /// Default empty constructor
    /// </summary>
    public UserEngagementMetricsResponse()
    {
    }

    /// <summary>
    /// Constructor for the user engagement metrics response
    /// </summary>
    /// <param name="interactions">The interactions to get the user engagement metrics from</param>
    /// <param name="commentsCount">The total comments count</param>
    /// <param name="likesCount">The total likes count</param>
    /// <returns>The user engagement metrics response</returns>
    /// <remarks>Calculates the total clicks, watch time, comments, and likes, as well as the average clicks, watch time, comments, and likes</remarks>
    public UserEngagementMetricsResponse(List<UserEpisodeInteraction> interactions, int commentsCount, int likesCount)
    {
        // Set the total clicks, watch time, comments, and likes
        TotalClicks = interactions.Sum(i => i.Clicks);
        TotalWatchTime = TimeSpan.FromTicks(interactions.Sum(i => i.TotalListenTime.Ticks));
        TotalComments = commentsCount;
        TotalLikes = likesCount;

        // Set the total listeners
        TotalListeners = interactions.Select(i => i.UserId).Distinct().Count();

        // Set the average clicks, watch time, comments, and likes
        AverageClicks = (double)TotalClicks / TotalListeners;
        AverageWatchTime = TotalWatchTime / TotalListeners;
        CommentsPercentage = (double)TotalComments / TotalListeners * 100;
        LikesPercentage = (double)TotalLikes / TotalListeners * 100;
    }

    /// <summary>
    /// The total clicks of the interactions
    /// </summary>
    public int TotalClicks { get; set; } = 0;

    /// <summary>
    /// The average clicks per user.
    /// </summary>
    public double AverageClicks { get; set; } = 0;

    /// <summary>
    /// The total watch time of the interactions
    /// </summary>
    public TimeSpan TotalWatchTime { get; set; } = TimeSpan.Zero;

    /// <summary>
    /// The average watch time per user.
    /// </summary>
    public TimeSpan AverageWatchTime { get; set; } = TimeSpan.Zero;

    /// <summary>
    /// The total number of comments.
    /// </summary>
    public int TotalComments { get; set; } = 0;

    /// <summary>
    /// The percentage of viewers who dropped a comment.
    /// </summary>
    public double CommentsPercentage { get; set; } = 0;
    
    /// <summary>
    /// The total number of likes.
    /// </summary>
    public int TotalLikes { get; set; } = 0;

    /// <summary>
    /// The percentage of viewers who dropped a like.
    /// </summary>
    public double LikesPercentage { get; set; } = 0;

    /// <summary>
    /// The total number of listeners.
    /// </summary>
    public int TotalListeners { get; set; } = 0;
}

[BindProperties]
public class GenreUserEngagementResponse
{
    public GenreUserEngagementResponse()
    {
    }

    public GenreUserEngagementResponse(List<UserEpisodeInteraction> interactions)
    {
        // Set the total clicks, watch time, and episodes watched
        int totalClicks = interactions.Sum(i => i.Clicks);
        int totalWatchTime = (int)interactions.Sum(i => i.TotalListenTime.TotalSeconds);

        Dictionary<string,int> genreOccurences = new();

        // Get the occurences of each genre in the interactions
        foreach (UserEpisodeInteraction interaction in interactions)
        {
            string[] tags = interaction.Episode.Podcast.Tags;

            foreach (string tag in tags)
                if (genreOccurences.ContainsKey(tag))
                    genreOccurences[tag] += 1;
                else
                    genreOccurences.Add(tag,1);
        }

        // Get the number of occurences of the most popular genre
        int maxOccurences = genreOccurences.Values.Max();

        // Set the genre to the most popular genre
        Genre = genreOccurences.FirstOrDefault(x => x.Value == maxOccurences).Key;

        // Set the Clicks, WatchTime, Number of Likes and Number of Episodes Watched for the most popular genre
        Clicks = interactions.Where(i => i.Episode.Podcast.Tags.Contains(Genre)).Sum(i => i.Clicks);
        WatchTime = TimeSpan.FromSeconds(interactions.Where(i => i.Episode.Podcast.Tags.Contains(Genre)).Sum(i => i.TotalListenTime.TotalSeconds));
        NumberOfLikes = interactions.Where(i => i.Episode.Podcast.Tags.Contains(Genre) && i.HasLiked).Sum(i =>1);
        NumberOfEpisodesWatched = interactions.Where(i => i.Episode.Podcast.Tags.Contains(Genre)).Count();

        // Set the percentage of total clicks and watch time for the most popular genre
        PercentageOfTotalClicks = (double)Clicks / totalClicks * 100;
        PercentageOfTotalWatchTime = (double)WatchTime.TotalSeconds / totalWatchTime * 100;
    }

    public string Genre { get; set; } = "";
    public int Clicks { get; set; } = 0;
    public double PercentageOfTotalClicks { get; set; }
    public TimeSpan WatchTime { get; set; } = TimeSpan.Zero;
    public double PercentageOfTotalWatchTime { get; set; }
    public int NumberOfEpisodesWatched { get; set; } = 0;
    public int NumberOfLikes { get; set; } = 0;
}