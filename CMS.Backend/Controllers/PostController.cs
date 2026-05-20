using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. INDEX: Danh sách bài viết
        // ==========================================
        public async Task<IActionResult> Index()
        {
            var posts = _context.Posts.Include(p => p.Category);
            return View(await posts.ToListAsync());
        }

        // ==========================================
        // 2. CREATE: Thêm bài viết mới
        // ==========================================
        public IActionResult Create()
        {
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Post post)
        {
            // BỎ QUA KIỂM TRA LỖI cho thuộc tính Category và ImageUrl (nếu form không gửi lên)
            ModelState.Remove("Category");

            // Tùy chọn: Nếu ImageUrl không bắt buộc nhập, bỏ qua luôn lỗi của nó
            // ModelState.Remove("ImageUrl"); 

            if (ModelState.IsValid)
            {
                _context.Posts.Add(post);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // ==========================================
        // 3. EDIT: Sửa bài viết
        // ==========================================
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Post post)
        {
            if (id != post.Id) return NotFound();

            // BỎ QUA KIỂM TRA LỖI cho thuộc tính Category
            ModelState.Remove("Category");

            if (ModelState.IsValid)
            {
                _context.Posts.Update(post);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // ==========================================
        // 4. DELETE: Xóa bài viết
        // ==========================================
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var post = await _context.Posts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (post == null) return NotFound();

            return View(post);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}