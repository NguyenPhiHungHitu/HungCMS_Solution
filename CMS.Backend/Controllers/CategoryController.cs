// Họ và tên: Nguyễn Phi Hùng
// Mã số sinh viên: 2123110475
// File: CategoryController.cs
// NHẬT KÝ BUỔI 3: Sửa lỗi Update danh mục (ModelState.Remove), sửa lỗi Delete 404 (dùng HttpGet).

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context) { _context = context; }

        public async Task<IActionResult> Index() => View(await _context.Categories.ToListAsync());

        [HttpGet] public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(Category model)
        {
            _context.Categories.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            return View(category);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Category category)
        {
            if (id != category.Id) return NotFound();

            // Xóa bắt lỗi các trường không gửi lên để update thành công
            ModelState.Remove("Posts");
            ModelState.Remove("Description");

            if (ModelState.IsValid)
            {
                _context.Categories.Update(category);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        [HttpGet] // Bắt buộc dùng HttpGet cho thẻ <a> ngoài Index
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}