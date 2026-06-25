// File: Controllers/Api/ProductsApiController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;

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

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }
    }
}