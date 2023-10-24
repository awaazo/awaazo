
using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProfileService
{
    public Task<User?> SetupProfileAsync(ProfileSetupRequest request, User? user);

    public Task<User?> EditProfileAsync(ProfileEditRequest request, User? user);

    public Task<bool> DeleteProfileAsync(User user);

}