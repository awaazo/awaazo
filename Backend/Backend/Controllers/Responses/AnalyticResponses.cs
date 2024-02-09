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