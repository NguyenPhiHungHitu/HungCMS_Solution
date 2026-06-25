// File: Controllers/Api/CategoriesApiController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/Categories")] // Đường dẫn này khớp chuẩn với axiosClient.get('/Categories')
    [ApiController]
    public class CategoriesApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Cấp danh sách các chủ đề bài viết cho Cột Trái của ReactJS
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }
    }
}