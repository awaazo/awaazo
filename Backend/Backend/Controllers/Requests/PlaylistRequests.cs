﻿using System.ComponentModel.DataAnnotations;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using static Backend.Models.Playlist;

namespace Backend.Controllers.Requests;

[BindProperties]
public class EditPlaylistRequest
{
    [Required] 
    public string Name { get; set; } = string.Empty;

    public string Description {get;set;} = string.Empty;

    public string Privacy {get;set;} = GetPrivacyEnumString(DEFAULT_PRIVACY);

    public virtual IFormFile? CoverArt { get; set;}
}

[BindProperties]
public class CreatePlaylistRequest : EditPlaylistRequest
{
    public Guid[] EpisodeIds {get;set;} = Array.Empty<Guid>();

    [Required]
    public override IFormFile? CoverArt { get; set; }
}

[BindProperties]
public class PlaylistCreateRequest
{
    [Required] public string Name { get; set; } = string.Empty;
}

[BindProperties]
public class PlaylistAppendRequest
{
    [Required]
    public Guid PlaylistId { get; set; }

    [Required]
    public Guid EpisodeId { get; set; }
}

[BindProperties]
public class PlaylistElementsRequest
{
    [Required]
    public Guid PlayListId { get; set; }
}

[BindProperties]
public class PlaylistDeleteRequest
{
    [Required]
    public Guid PlaylistId { get; set; }
}

[BindProperties]
public class PlaylistElementDeleteRequest
{
    [Required]
    public Guid PlaylistElementId { get; set; }
}
