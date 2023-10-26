using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IFileService
    {
        public Task<Files?> UploadFile(IFormFile file);
        public Task<bool> CleanUp(Guid? guid);
        public Task<Guid?> SaveFile(string Name, string MimeType);
        public string GetPath(string id);
        public Task<bool?> DeleteFile(string id);
        public bool Delete(string path);


    }
}
