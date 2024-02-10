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
        Min = (uint)interactions.Min(i => DateTime.Now.Year-i.User.DateOfBirth.Year);
        Max = (uint)interactions.Max(i => DateTime.Now.Year-i.User.DateOfBirth.Year);
        Average = (uint)Math.Round(interactions.Average(i => DateTime.Now.Year-i.User.DateOfBirth.Year));
        Percentage = (double) Count / totalCount * 100;
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
    public DateTime Start { get; set; } = DateTime.Now;
    public DateTime End { get; set; } = DateTime.Now;
    public TimeSpan Average { get; set; } = TimeSpan.Zero;
    public TimeSpan Total { get; set; } = TimeSpan.Zero;
    public int Clicks { get; set; } = 0;
    public double ClicksPercentage { get; set; } = 0;
    public double WatchTimePercentage { get; set; } = 0;
}