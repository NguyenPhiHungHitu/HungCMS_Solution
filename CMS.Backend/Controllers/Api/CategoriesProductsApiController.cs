// File: Controllers/Api/CategoriesProductsApiController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/categoriesproducts")] // Viết tường minh tuyến đường
    [ApiController]
    public class CategoriesProductsApiController : ControllerBase // Đổi tên thành CategoriesProductsApiController
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.CategoriesProducts.ToListAsync();
            return Ok(categories);
        }
    }
}