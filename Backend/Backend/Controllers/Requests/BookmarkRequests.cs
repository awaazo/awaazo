using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Requests
{
    [BindProperties]
    public class BookmarkAddRequest
    {
        
        public string Title { get; set; } = string.Empty;

        public string Note { get; set; } = string.Empty;

        public double Time { get; set; } = 0.0;
    }
}