// ==========================================================
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: API Cung cấp dữ liệu Bài viết cho ReactJS (Buổi 6)
// Ghi chú: Xây dựng các Endpoint RESTful (GET) chuẩn JSON.
// ==========================================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    // Cấu hình đường dẫn chung cho toàn bộ API này là: /api/Posts
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase // Dùng ControllerBase vì không cần View HTML
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. API lấy Danh sách tất cả Bài viết
        // HTTP Method: GET
        // Đường dẫn test: https://localhost:xxxx/api/posts
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.Posts
                .OrderByDescending(p => p.Id) // Sắp xếp bài viết mới nhất lên đầu
                                              // Lọc dữ liệu ra một Object mới để ẩn đi các trường không cần thiết (Giúp load nhẹ hơn)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name // Kéo trực tiếp tên chuyên mục ra
                })
                .ToListAsync();

            return Ok(posts); // Lệnh Ok() sẽ tự động chuyển C# thành JSON với mã HTTP 200
        }

        // ==========================================
        // 2. API lấy Danh sách Bài viết theo Danh mục
        // HTTP Method: GET
        // Đường dẫn test: https://localhost:xxxx/api/posts/category/1
        // ==========================================
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

        // ==========================================
        // 3. API lấy Chi tiết 1 Bài viết để đọc
        // HTTP Method: GET
        // Đường dẫn test: https://localhost:xxxx/api/posts/1
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post); // Trả về toàn bộ nội dung (kể cả mã HTML trong bài viết)
        }
    }
}