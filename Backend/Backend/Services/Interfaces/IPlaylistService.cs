using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IPlaylistService
{
    public Task<bool> CreatePlaylistAsync(CreatePlaylistRequest request, User user);

    public Task<bool> EditPlaylistAsync(Guid playlistId,EditPlaylistRequest request, User user);

    public Task<bool> AddEpisodesToPlaylistAsync(Guid playlistId, Guid[] episodeIds, User user);

    public Task<PlaylistResponse> GetLikedEpisodesPlaylist(User user);

    public Task<List<PlaylistInfoResponse>> GetAllPlaylistsAsync(User user, string domainUrl);

    public Task<List<PlaylistInfoResponse>> GetUserPlaylistsAsync(Guid userId, User user, int page, int pageSize, string domainUrl);

    public Task<PlaylistResponse> GetPlaylistEpisodesAsync(Guid playlistId, User user, string domainUrl);

    public Task<bool> DeletePlaylistAsync(Guid playlistId, User user);

    public Task<bool> RemoveEpisodesFromPlaylistAsync(Guid playlistId, Guid[] episodeIds, User user);
}