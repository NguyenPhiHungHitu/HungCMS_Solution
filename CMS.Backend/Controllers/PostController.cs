// ==========================================================
// Tên sinh viên: Nguyễn Phi Hùng
// Mã số sinh viên: 2123110475
// File: PostController.cs
// NHẬT KÝ THỰC HÀNH: Nâng cấp tính năng Upload ảnh trực tiếp từ Laptop
// ==========================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using System;
using System.IO; // Thêm thư viện này để xử lý File/Thư mục
using Microsoft.AspNetCore.Http; // Thêm thư viện này để dùng IFormFile
using Microsoft.AspNetCore.Hosting; // Thêm thư viện này để dùng IWebHostEnvironment
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    // =======================================================
    // 1. LỚP "THẾ THÂN" (VIEWMODEL) ĐỂ BẢO VỆ ENTITY GỐC
    // =======================================================
    public class PostViewModel
    {
        public int Id { get; set; }

        [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Tiêu đề bài viết không được để trống")]
        public string Title { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Nội dung bài viết không được để trống")]
        public string Content { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageUpload { get; set; } // Hứng file ảnh từ laptop
    }

    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment; // Khai báo dịch vụ quản lý môi trường web

        // Tiêm cả DbContext và WebHostEnvironment vào đây
        public PostController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
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
            return View(new PostViewModel());
        }

        // POST: Xử lý Thêm bài viết (Sử dụng PostViewModel)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(PostViewModel vm)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\n[{DateTime.Now}] --- CREATE POST ---");
                    var post = new Post
                    {
                        Title = vm.Title,
                        Content = vm.Content,
                        CategoryId = vm.CategoryId,
                        CreatedDate = DateTime.Now
                    };

                    // XỬ LÝ UPLOAD HÌNH ẢNH TỪ LAPTOP
                    if (vm.ImageUpload != null && vm.ImageUpload.Length > 0)
                    {
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nFile selected: {vm.ImageUpload.FileName}, size: {vm.ImageUpload.Length} bytes");
                        // 1. Định nghĩa thư mục lưu ảnh: wwwroot/images/posts
                        string webRootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
                        string uploadsFolder = Path.Combine(webRootPath, "images", "posts");
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nTarget folder: {uploadsFolder}");

                        // Tự động tạo thư mục nếu chưa có
                        if (!Directory.Exists(uploadsFolder))
                        {
                            System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nCreating folder...");
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        // 2. Tạo tên file duy nhất bằng GUID
                        string extension = Path.GetExtension(vm.ImageUpload.FileName);
                        string uniqueFileName = Guid.NewGuid().ToString() + extension;

                        // 3. Đường dẫn vật lý đầy đủ để lưu file
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nFile path: {filePath}");

                        // 4. Tiến hành lưu file
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nCopying file to stream...");
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await vm.ImageUpload.CopyToAsync(fileStream);
                        }
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nFile copied successfully");

                        // 5. Lưu đường dẫn tương đối vào database
                        post.ImageUrl = "/images/posts/" + uniqueFileName;
                    }
                    else
                    {
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nNo file selected, using default");
                        post.ImageUrl = "/images/posts/default-post.jpg";
                    }

                    _context.Posts.Add(post);
                    System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nSaving changes to database...");
                    await _context.SaveChangesAsync();
                    System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nPost saved successfully!");
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    string errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nEXCEPTION: {ex.ToString()}");
                    ModelState.AddModelError(string.Empty, "🔥 LỖI HỆ THỐNG: " + errorMsg);
                }
            }
            else
            {
                var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nModelState is INVALID: {errors}");
            }

            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", vm.CategoryId);
            return View(vm);
        }

        // GET: Giao diện Sửa bài viết
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            var vm = new PostViewModel
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CategoryId = post.CategoryId,
                ImageUrl = post.ImageUrl
            };

            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(vm);
        }

        // POST: Xử lý Sửa bài viết
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, PostViewModel vm)
        {
            if (id != vm.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var post = await _context.Posts.FindAsync(id);
                    if (post == null) return NotFound();

                    post.Title = vm.Title;
                    post.Content = vm.Content;
                    post.CategoryId = vm.CategoryId;

                    // XỬ LÝ UPLOAD HÌNH ẢNH MỚI (TỪ LAPTOP)
                    if (vm.ImageUpload != null && vm.ImageUpload.Length > 0)
                    {
                        string webRootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
                        string uploadsFolder = Path.Combine(webRootPath, "images", "posts");
                        if (!Directory.Exists(uploadsFolder))
                        {
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        // Xóa ảnh cũ nếu có và không phải là ảnh mặc định
                        if (!string.IsNullOrEmpty(post.ImageUrl) && !post.ImageUrl.Contains("default-post.jpg"))
                        {
                            string oldFilePath = Path.Combine(webRootPath, post.ImageUrl.TrimStart('/'));
                            if (System.IO.File.Exists(oldFilePath))
                            {
                                try { System.IO.File.Delete(oldFilePath); } catch {}
                            }
                        }

                        string extension = Path.GetExtension(vm.ImageUpload.FileName);
                        string uniqueFileName = Guid.NewGuid().ToString() + extension;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await vm.ImageUpload.CopyToAsync(fileStream);
                        }

                        post.ImageUrl = "/images/posts/" + uniqueFileName;
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
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", vm.CategoryId);
            return View(vm);
        }

        // GET: Giao diện Xác nhận xóa
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var post = await _context.Posts.Include(p => p.Category).FirstOrDefaultAsync(m => m.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // POST: Executing Delete
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

        // POST: api upload ảnh từ CKEditor
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> UploadImage(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
            {
                return Json(new { uploaded = false, error = new { message = "Không có file nào được tải lên!" } });
            }

            try
            {
                string webRootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
                string uploadsFolder = Path.Combine(webRootPath, "images", "uploads");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string extension = Path.GetExtension(upload.FileName);
                string uniqueFileName = Guid.NewGuid().ToString() + extension;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.CopyToAsync(fileStream);
                }

                string fileUrl = "/images/uploads/" + uniqueFileName;
                return Json(new { uploaded = true, url = fileUrl });
            }
            catch (Exception ex)
            {
                return Json(new { uploaded = false, error = new { message = "Lỗi hệ thống: " + ex.Message } });
            }
        }
    }
}