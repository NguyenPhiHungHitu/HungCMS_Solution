// File: Controllers/CategoriesProductsController.cs
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: CRUD Danh mục sản phẩm (có upload ảnh đại diện)

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using System.IO;

namespace CMS.Backend.Controllers
{
    // ViewModel cho upload ảnh danh mục
    public class CategoryProductViewModel
    {
        public int Id { get; set; }

        [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Tên danh mục không được để trống")]
        [System.ComponentModel.DataAnnotations.StringLength(100)]
        public string Name { get; set; }

        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageUpload { get; set; } // Upload ảnh đại diện danh mục
    }

    public class CategoriesProductsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CategoriesProductsController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // 1. Danh sách
        public async Task<IActionResult> Index()
        {
            return View(await _context.CategoriesProducts.ToListAsync());
        }

        // 2. Thêm mới
        public IActionResult Create()
        {
            return View(new CategoryProductViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryProductViewModel vm)
        {
            ModelState.Remove("Products");

            if (ModelState.IsValid)
            {
                var category = new CategoryProduct
                {
                    Name = vm.Name,
                    Description = vm.Description
                };

                // Upload ảnh đại diện danh mục
                if (vm.ImageUpload != null && vm.ImageUpload.Length > 0)
                {
                    string webRootPath = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                    string uploadsFolder = Path.Combine(webRootPath, "images", "categories");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(vm.ImageUpload.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await vm.ImageUpload.CopyToAsync(fileStream);
                    }
                    category.ImageUrl = "/images/categories/" + uniqueFileName;
                }
                else
                {
                    category.ImageUrl = "/images/categories/default-category.png";
                }

                _context.Add(category);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(vm);
        }

        // 3. Sửa
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null) return NotFound();

            var vm = new CategoryProductViewModel
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ImageUrl = category.ImageUrl
            };
            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CategoryProductViewModel vm)
        {
            if (id != vm.Id) return NotFound();
            ModelState.Remove("Products");

            if (ModelState.IsValid)
            {
                try
                {
                    var category = await _context.CategoriesProducts.FindAsync(id);
                    if (category == null) return NotFound();

                    category.Name = vm.Name;
                    category.Description = vm.Description;

                    // Upload ảnh mới (nếu có)
                    if (vm.ImageUpload != null && vm.ImageUpload.Length > 0)
                    {
                        string webRootPath = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                        string uploadsFolder = Path.Combine(webRootPath, "images", "categories");
                        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                        string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(vm.ImageUpload.FileName);
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await vm.ImageUpload.CopyToAsync(fileStream);
                        }
                        category.ImageUrl = "/images/categories/" + uniqueFileName;
                    }
                    // Nếu không upload ảnh mới, giữ ảnh cũ

                    _context.Update(category);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.CategoriesProducts.Any(e => e.Id == vm.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(vm);
        }

        // 4. Xóa
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var category = await _context.CategoriesProducts.FirstOrDefaultAsync(m => m.Id == id);
            if (category == null) return NotFound();
            return View(category);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}