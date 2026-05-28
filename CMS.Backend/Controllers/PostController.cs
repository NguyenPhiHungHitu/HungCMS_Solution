// ==========================================================
// Tên sinh viên: Nguyễn Phi Hùng
// Mã số sinh viên: 2123110475
// File: PostController.cs
// NHẬT KÝ THỰC HÀNH: Sử dụng đường dẫn ImageUrl (Bản ổn định tuyệt đối, chống lỗi SQL NULL)
// ==========================================================

// ==========================================================
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: Quản lý Bài viết (Buổi 4)
// Ghi chú: Xử lý thêm, sửa, xóa bài viết. Khắc phục lỗi NOT NULL của ImageUrl.
// ==========================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using System;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Danh sách bài viết
        public async Task<IActionResult> Index(int? id)
        {
            var query = _context.Posts.Include(p => p.Category).AsQueryable();
            if (id.HasValue) query = query.Where(p => p.CategoryId == id.Value);
            query = query.OrderByDescending(p => p.CreatedDate);
            return View(await query.ToListAsync());
        }

        // GET: Xem chi tiết bài viết
        [AllowAnonymous]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();
            var post = await _context.Posts.Include(p => p.Category).FirstOrDefaultAsync(m => m.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // GET: Giao diện Thêm bài viết
        public IActionResult Create()
        {
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        // POST: Xử lý Thêm bài viết
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Post post)
        {
            // Xóa bỏ kiểm tra tự động của ModelState đối với các trường hệ thống tự xử lý
            ModelState.Remove("Category");
            ModelState.Remove("CreatedDate");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                try
                {
                    // FIX LỖI NULL DATABASE: Nếu ô ImageUrl để trống, gán chuỗi rỗng "" để SQL chấp nhận
                    if (string.IsNullOrEmpty(post.ImageUrl))
                    {
                        post.ImageUrl = "";
                    }

                    post.CreatedDate = DateTime.Now;
                    _context.Posts.Add(post);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    string errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    ModelState.AddModelError(string.Empty, "🔥 LỖI HỆ THỐNG: " + errorMsg);
                }
            }

            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // GET: Giao diện Sửa bài viết
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: Xử lý Sửa bài viết
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Post post)
        {
            if (id != post.Id) return NotFound();

            ModelState.Remove("Category");
            ModelState.Remove("CreatedDate");
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                try
                {
                    // FIX LỖI NULL DATABASE KHI SỬA
                    if (string.IsNullOrEmpty(post.ImageUrl))
                    {
                        post.ImageUrl = "";
                    }

                    _context.Posts.Update(post);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    string errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    ModelState.AddModelError(string.Empty, "🔥 LỖI HỆ THỐNG: " + errorMsg);
                }
            }
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // GET: Giao diện Xác nhận xóa
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var post = await _context.Posts.Include(p => p.Category).FirstOrDefaultAsync(m => m.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // POST: Thực thi Xóa bài viết
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