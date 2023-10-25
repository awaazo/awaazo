using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IFileService
    {
        public Task<Files?> UploadFile(IFormFile file, string type);
        public Task<bool> CleanUp(Guid? guid);
        public Task<Guid?> SaveFile(string Name, string MimeType);


    }
}
