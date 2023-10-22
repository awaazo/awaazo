using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IFileService
    {
        public Task<Files?> UploadFile(IFormFile file);
    }
}
