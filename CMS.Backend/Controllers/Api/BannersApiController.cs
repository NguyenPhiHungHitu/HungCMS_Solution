// File: Controllers/Api/BannersApiController.cs
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: API lấy danh sách Banner active cho trang chủ ReactJS

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/Banners")]
    [ApiController]
    public class BannersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // API lấy danh sách Banner đang kích hoạt (Dùng cho ReactJS hiển thị slideshow)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var banners = await _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.SortOrder)
                .ThenByDescending(b => b.CreatedDate)
                .Select(b => new {
                    b.Id,
                    b.Title,
                    b.Subtitle,
                    b.ImageUrl,
                    b.LinkUrl,
                    b.BtnText,
                    b.SortOrder
                })
                .ToListAsync();

            return Ok(banners);
        }
    }
}
