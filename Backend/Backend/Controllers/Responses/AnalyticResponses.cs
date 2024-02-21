using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Responses;


/// <summary>
/// Response for the average audience age
/// </summary>
[BindProperties]
public class AgeRangeResponse
{
    /// <summary>
    /// Default constructor
    /// </summary>
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