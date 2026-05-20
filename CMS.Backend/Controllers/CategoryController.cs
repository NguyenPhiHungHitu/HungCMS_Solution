using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        // Khai báo ApplicationDbContext để kết nối Database
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. INDEX: Hiển thị danh sách danh mục
        // ==========================================
        public async Task<IActionResult> Index()
        {
            // Lấy toàn bộ dữ liệu từ bảng Categories
            var categories = await _context.Categories.ToListAsync();
            return View(categories);
        }

        // ==========================================
        // 2. CREATE: Thêm mới danh mục
        // ==========================================
        // GET: Hiển thị giao diện Form thêm mới
        public IActionResult Create()
        {
            return View();
        }

        // POST: Nhận dữ liệu từ Form và lưu xuống Database
        [HttpPost]
        [ValidateAntiForgeryToken] // Chống tấn công giả mạo (CSRF)
        public async Task<IActionResult> Create(Category category)
        {
            if (ModelState.IsValid)
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync(); // Lưu vào SQL
                return RedirectToAction(nameof(Index)); // Quay về trang danh sách
            }
            return View(category); // Nếu lỗi thì trả lại form
        }

        // ==========================================
        // 3. EDIT: Sửa danh mục
        // ==========================================
        // GET: Tìm danh mục cần sửa và hiển thị lên Form
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            return View(category);
        }

        // POST: Nhận dữ liệu đã sửa và cập nhật Database
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Category category)
        {
            if (id != category.Id) return NotFound();

            if (ModelState.IsValid)
            {
                _context.Categories.Update(category);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        // ==========================================
        // 4. DELETE: Xóa danh mục
        // ==========================================
        // GET: Hiển thị trang hỏi xác nhận có chắc chắn xóa không
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.Categories.FirstOrDefaultAsync(m => m.Id == id);
            if (category == null) return NotFound();

            return View(category);
        }

        // POST: Xử lý xóa thực sự trong Database
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}