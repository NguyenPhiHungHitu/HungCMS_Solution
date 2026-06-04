// ==========================================================
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// BÀI TẬP THỰC HÀNH MỞ RỘNG (NÂNG CAO) – BUỔI 6
// Chức năng: API Danh mục sản phẩm (CategoryProduct)
// ==========================================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // 1. Cấu hình định tuyến API
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 2. Tiêm ngữ cảnh dữ liệu (Constructor Injection)
        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 3. Phương thức GET: Kéo toàn bộ danh sách phân loại
        // Đường dẫn test: https://localhost:xxxx/api/CategoriesProducts
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Gọt dữ liệu: Chỉ lấy các thông tin cốt lõi để tối ưu JSON (bỏ qua liên kết rườm rà)
            var categories = await _context.CategoriesProducts
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}