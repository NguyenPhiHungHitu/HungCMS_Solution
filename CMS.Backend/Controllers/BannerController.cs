// ==========================================================
// Tên sinh viên: Nguyễn Phi Hùng
// Mã số sinh viên: 2123110475
// File: BannerController.cs
// Chức năng: Quản lý Banner (CRUD) cho trang quản trị Admin
// ==========================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    // =======================================================
    // VIEWMODEL cho Banner
    // =======================================================
    public class BannerViewModel
    {
        public int Id { get; set; }

        [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Tiêu đề banner không được để trống")]
        public string Title { get; set; } = string.Empty;

        public string? Subtitle { get; set; }
        public string? LinkUrl { get; set; }
        public string? BtnText { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public string? ImageUrl { get; set; }
        public IFormFile? ImageUpload { get; set; } // Hứng file ảnh từ laptop
    }

    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public BannerController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: Danh sách banner
        public async Task<IActionResult> Index()
        {
            var banners = await _context.Banners
                .OrderBy(b => b.SortOrder)
                .ThenByDescending(b => b.CreatedDate)
                .ToListAsync();
            return View(banners);
        }

        // GET: Giao diện Thêm banner
        public IActionResult Create()
        {
            return View(new BannerViewModel());
        }

        // POST: Xử lý Thêm banner
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(BannerViewModel vm)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var banner = new Banner
                    {
                        Title = vm.Title,
                        Subtitle = vm.Subtitle,
                        LinkUrl = vm.LinkUrl,
                        BtnText = vm.BtnText,
                        SortOrder = vm.SortOrder,
                        IsActive = vm.IsActive,
                        CreatedDate = DateTime.Now
                    };

                    // XỬ LÝ UPLOAD HÌNH ẢNH TỪ LAPTOP
                    if (vm.ImageUpload != null && vm.ImageUpload.Length > 0)
                    {
                        string webRootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
                        string uploadsFolder = Path.Combine(webRootPath, "images", "banners");

                        if (!Directory.Exists(uploadsFolder))
                        {
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        string extension = Path.GetExtension(vm.ImageUpload.FileName);
                        string uniqueFileName = Guid.NewGuid().ToString() + extension;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await vm.ImageUpload.CopyToAsync(fileStream);
                        }

                        banner.ImageUrl = "/images/banners/" + uniqueFileName;
                    }
                    else
                    {
                        banner.ImageUrl = "/images/banners/default-banner.jpg";
                    }

                    _context.Banners.Add(banner);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    string errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    ModelState.AddModelError(string.Empty, "🔥 LỖI HỆ THỐNG: " + errorMsg);
                }
            }

            return View(vm);
        }

        // GET: Giao diện Sửa banner
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            var vm = new BannerViewModel
            {
                Id = banner.Id,
                Title = banner.Title,
                Subtitle = banner.Subtitle,
                LinkUrl = banner.LinkUrl,
                BtnText = banner.BtnText,
                SortOrder = banner.SortOrder,
                IsActive = banner.IsActive,
                ImageUrl = banner.ImageUrl
            };

            return View(vm);
        }

        // POST: Xử lý Sửa banner
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, BannerViewModel vm)
        {
            if (id != vm.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var banner = await _context.Banners.FindAsync(id);
                    if (banner == null) return NotFound();

                    banner.Title = vm.Title;
                    banner.Subtitle = vm.Subtitle;
                    banner.LinkUrl = vm.LinkUrl;
                    banner.BtnText = vm.BtnText;
                    banner.SortOrder = vm.SortOrder;
                    banner.IsActive = vm.IsActive;

                    // XỬ LÝ UPLOAD HÌNH ẢNH MỚI (TỪ LAPTOP)
                    if (vm.ImageUpload != null && vm.ImageUpload.Length > 0)
                    {
                        string webRootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
                        string uploadsFolder = Path.Combine(webRootPath, "images", "banners");
                        if (!Directory.Exists(uploadsFolder))
                        {
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        // Xóa ảnh cũ nếu có và không phải là ảnh mặc định
                        if (!string.IsNullOrEmpty(banner.ImageUrl) && !banner.ImageUrl.Contains("default-banner.jpg"))
                        {
                            string oldFilePath = Path.Combine(webRootPath, banner.ImageUrl.TrimStart('/'));
                            if (System.IO.File.Exists(oldFilePath))
                            {
                                try { System.IO.File.Delete(oldFilePath); } catch { }
                            }
                        }

                        string extension = Path.GetExtension(vm.ImageUpload.FileName);
                        string uniqueFileName = Guid.NewGuid().ToString() + extension;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await vm.ImageUpload.CopyToAsync(fileStream);
                        }

                        banner.ImageUrl = "/images/banners/" + uniqueFileName;
                    }

                    _context.Banners.Update(banner);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    string errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    ModelState.AddModelError(string.Empty, "🔥 LỖI HỆ THỐNG: " + errorMsg);
                }
            }
            return View(vm);
        }

        // GET: Giao diện Xác nhận xóa
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var banner = await _context.Banners.FirstOrDefaultAsync(b => b.Id == id);
            if (banner == null) return NotFound();
            return View(banner);
        }

        // POST: Thực hiện xóa banner
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner != null)
            {
                // Xóa file ảnh nếu có
                if (!string.IsNullOrEmpty(banner.ImageUrl) && !banner.ImageUrl.Contains("default-banner.jpg"))
                {
                    string webRootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(_webHostEnvironment.ContentRootPath, "wwwroot");
                    string oldFilePath = Path.Combine(webRootPath, banner.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        try { System.IO.File.Delete(oldFilePath); } catch { }
                    }
                }

                _context.Banners.Remove(banner);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
