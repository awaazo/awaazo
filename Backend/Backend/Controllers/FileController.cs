using Backend.Infrastructure;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("file")]
    public class FileController : Controller
    {
        private readonly AppDbContext _db;
        private readonly IFileService _fileService;
        public FileController(AppDbContext db,IFileService fileService)
        {
            _db = db;
            _fileService = fileService;

        }

        [Authorize]
        [HttpGet("GetById")]
        public async Task<PhysicalFileResult> GetCoverById(string id)
        {
            Guid guid = Guid.Parse(id);
            Files? file = await _db.File!.FirstOrDefaultAsync(u => u.FileId == guid);


            return PhysicalFile(_fileService.GetPath(file!.Path!), file!.MimeType,true);



        }
    }
}
