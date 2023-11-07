using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProfileService
{

    // Current USER Profile
    public UserProfileResponse GetProfile(User user, string domainUrl);

    public Task<bool> SetupProfileAsync(ProfileSetupRequest request, User user);

    public Task<bool> EditProfileAsync(ProfileEditRequest request, User user);

    public Task<bool> DeleteProfileAsync(User user);

    // Other USER Profile

    public Task<string> GetUserAvatarNameAsync(Guid userId);

}