// ==========================================================
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Bài tập Nâng cao 1: API Quản lý Sản phẩm (Products)
// ==========================================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả sản phẩm
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new { p.Id, p.Name, p.Price, p.ImageUrl, p.StockQuantity })
                .ToListAsync();
            return Ok(products);
        }

        // Lấy chi tiết 1 sản phẩm
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetail(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });
            return Ok(product);
        }
    }
}