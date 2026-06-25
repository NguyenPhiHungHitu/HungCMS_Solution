// File: Controllers/Api/PostsApiController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/Posts")]
    [ApiController]
    public class PostsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API lấy Danh sách tất cả Bài viết (Dùng cho ReactJS)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryId = p.CategoryId, // 🔥 BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ REACTJS LỌC ĐƯỢC
                    CategoryName = p.Category.Name
                })
                .ToListAsync();

            return Ok(posts);
        }

        // 2. API lấy Danh sách Bài viết theo Danh mục
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var posts = await _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToListAsync();
            return Ok(posts);
        }

        // 3. API lấy Chi tiết 1 Bài viết
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);
            if (post == null) return NotFound(new { message = "Không tìm thấy bài viết" });
            return Ok(post);
        }
    }
}