using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProfileService
{

    // Current USER Profile

    public Task<UserProfileResponse> GetProfileAsync(User user, string domainUrl);

    public Task<bool> SetupProfileAsync(ProfileSetupRequest request, User user);

    public Task<bool> EditProfileAsync(ProfileEditRequest request, User user);

    public Task<bool> DeleteProfileAsync(User user);

    // Other USER Profile

    public Task<FullUserProfileResponse> GetUserProfile(Guid userId, string domainUrl);
    public Task<List<UserProfileResponse>> SearchUserProfiles(string searchTerm, int page, int pageSize, string domainUrl);
    public Task<string> GetUserAvatarNameAsync(Guid userId);

}