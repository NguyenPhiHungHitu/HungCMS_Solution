// Họ và tên: Nguyễn Phi Hùng
// Mã số sinh viên: 2123110475
// File: HomeController.cs
// NHẬT KÝ BUỔI 3: Lấy 3 bài mới nhất ra trang chủ.

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;
        public HomeController(ApplicationDbContext context) { _context = context; }

        public IActionResult Index()
        {
            var latestPosts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Take(3).ToList();
            return View(latestPosts);
        }
    }
}