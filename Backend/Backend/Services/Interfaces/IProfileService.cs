using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProfileService
{
    public UserProfileResponse GetProfile(User user, string domainUrl);

    public Task<bool> SetupProfileAsync(ProfileSetupRequest request, User user);

    public Task<bool> EditProfileAsync(ProfileEditRequest request, User user);

    public Task<bool> DeleteProfileAsync(User user);

}