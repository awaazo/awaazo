using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IFileService
    {
        public Task<Files?> UploadFile(IFormFile file);
        public Task<bool> CleanUp(Guid? guid);
        public Task<Guid?> SaveFile(string Name, string MimeType);
        public string GetPath(string id);
        public bool? DeleteFile(string id);
    
        public bool? EditFile(Files file1,IFormFile file);
       
    }
}
