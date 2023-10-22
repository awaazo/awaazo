using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class FileService : IFileService
    {

        private readonly AppDbContext _db;
        public FileService(AppDbContext db) {
            _db = db;
        }

        public async Task<Files?> UploadFile(IFormFile file)
        {
            if (file != null && file.Length > 0) {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);

                    var uploadFile = new Files();
                    uploadFile.Name = file.Name;
                    uploadFile.MimeType = file.ContentType;
                    uploadFile.Data = memoryStream.ToArray();
                    await _db.File!.AddAsync(uploadFile);
                    await _db.SaveChangesAsync();

                    return uploadFile;

                }
                
            }
            else { return null; }
        }
    } 

}
