// File: Controllers/Api/ProductsApiController.cs
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: API quản lý sản phẩm cho ReactJS Frontend
// Bổ sung: Endpoint lấy sản phẩm mới nhất, bán chạy nhất, hot nhất

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/Products")] // Viết rõ chữ Products để cố định tuyến đường, không dùng [controller] nữa
    [ApiController]
    public class ProductsApiController : ControllerBase // Đổi tên thành ProductsApiController để không trùng với Admin
    {
        private readonly ApplicationDbContext _context;

        public ProductsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products - Lấy tất cả sản phẩm (hỗ trợ lọc trực tiếp từ Database)
        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? categoryProductId = null,
            [FromQuery] string? search = null)
        {
            var query = _context.Products.AsQueryable();

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }
            if (categoryProductId.HasValue && categoryProductId.Value > 0)
            {
                query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
            }
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }

            var products = await query
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();
            return Ok(products);
        }

        // GET: api/Products/newest?count=3 - Sản phẩm MỚI NHẤT (theo ngày tạo giảm dần)
        [HttpGet("newest")]
        public async Task<IActionResult> GetNewestProducts([FromQuery] int count = 3)
        {
            var products = await _context.Products
                .OrderByDescending(p => p.CreatedDate)
                .Take(count)
                .ToListAsync();
            return Ok(products);
        }

        // GET: api/Products/bestseller?count=3 - Sản phẩm BÁN CHẠY NHẤT (theo SoldQuantity giảm dần)
        [HttpGet("bestseller")]
        public async Task<IActionResult> GetBestSellerProducts([FromQuery] int count = 3)
        {
            var products = await _context.Products
                .OrderByDescending(p => p.SoldQuantity)
                .ThenByDescending(p => p.CreatedDate)
                .Take(count)
                .ToListAsync();
            return Ok(products);
        }

        // GET: api/Products/hot?count=3 - Sản phẩm HOT (theo ViewCount giảm dần)
        [HttpGet("hot")]
        public async Task<IActionResult> GetHotProducts([FromQuery] int count = 3)
        {
            var products = await _context.Products
                .OrderByDescending(p => p.ViewCount)
                .ThenByDescending(p => p.SoldQuantity)
                .Take(count)
                .ToListAsync();
            return Ok(products);
        }

        // GET: api/Products/{id} - Lấy chi tiết sản phẩm & tự động tăng ViewCount
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            // Tự động tăng lượt xem mỗi khi khách xem chi tiết sản phẩm
            product.ViewCount++;
            await _context.SaveChangesAsync();

            return Ok(product);
        }
    }
}