using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.ComponentModel.DataAnnotations;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    // =======================================================
    // 1. LỚP "THẾ THÂN" (VIEWMODEL) ĐỂ BẢO VỆ ENTITY GỐC
    // =======================================================
    public class ProductViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, 100000000000, ErrorMessage = "Giá bán không hợp lệ")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }
        public int CategoryProductId { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageUpload { get; set; } // Hứng file ảnh từ laptop

        // Trường bổ sung cho tính năng sắp xếp sản phẩm
        public int SoldQuantity { get; set; } = 0;  // Số lượng đã bán
        public int ViewCount { get; set; } = 0;      // Lượt xem sản phẩm
    }

    // =======================================================
    // 2. CONTROLLER CHÍNH XỬ LÝ DỮ LIỆU
    // =======================================================
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<IActionResult> Index()
        {
            var products = await _context.Products.Include(p => p.CategoryProduct).ToListAsync();
            return View(products);
        }

        public async Task<IActionResult> Create()
        {
            ViewBag.CategoryList = new SelectList(await _context.CategoriesProducts.ToListAsync(), "Id", "Name");
            return View(new ProductViewModel());
        }

        // POST: Xử lý lưu dữ liệu & Hình ảnh (Đã tối ưu hóa đường dẫn và chống crash SQL)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProductViewModel vm)
        {
            // Tắt kiểm tra ngầm để tránh lỗi Validation khóa ngoại điều hướng
            ModelState.Remove("CategoryProduct");

            if (ModelState.IsValid)
            {
                try
                {
                    System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\n[{DateTime.Now}] --- CREATE PRODUCT ---");
                    // Chuyển đổi dữ liệu từ ViewModel sang Entity gốc
                    var product = new Product
                    {
                        Name = vm.Name,
                        Description = vm.Description,
                        Price = vm.Price,
                        StockQuantity = vm.StockQuantity,
                        CategoryProductId = vm.CategoryProductId,
                        SoldQuantity = vm.SoldQuantity,
                        ViewCount = vm.ViewCount,
                        CreatedDate = DateTime.Now // Tự động gán ngày tạo
                    };

                    // XỬ LÝ UPLOAD FILE ẢNH TỪ LAPTOP
                    if (vm.ImageUpload != null && vm.ImageUpload.Length > 0)
                    {
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nFile selected: {vm.ImageUpload.FileName}, size: {vm.ImageUpload.Length} bytes");
                        // Định nghĩa đường dẫn lưu: wwwroot/images/products
                        string webRootPath = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                        string uploadsFolder = Path.Combine(webRootPath, "images", "products");
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nTarget folder: {uploadsFolder}");

                        // Tự động tạo thư mục con 'products' nếu chưa có
                        if (!Directory.Exists(uploadsFolder))
                        {
                            System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nCreating folder...");
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        // Tạo tên file độc nhất tránh trùng lặp bằng mã GUID
                        string extension = Path.GetExtension(vm.ImageUpload.FileName);
                        string uniqueFileName = Guid.NewGuid().ToString() + extension;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nFile path: {filePath}");

                        // Thực hiện ghi file vật lý vào ổ đĩa laptop
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nCopying file to stream...");
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await vm.ImageUpload.CopyToAsync(fileStream);
                        }
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nFile copied successfully");

                        // Lưu đường dẫn tương đối chuẩn vào cơ sở dữ liệu
                        product.ImageUrl = "/images/products/" + uniqueFileName;
                    }
                    else
                    {
                        System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nNo file selected, using default");
                        // NẾU KHÔNG CHỌN ẢNH: Gán ảnh sản phẩm mặc định để tránh lỗi database NOT NULL
                        product.ImageUrl = "/images/products/default-product.jpg";
                    }

                    _context.Add(product);
                    System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nSaving changes to database...");
                    await _context.SaveChangesAsync();
                    System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", "\nProduct saved successfully!");
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    string innerErr = ex.InnerException != null ? " -> Chi tiết: " + ex.InnerException.Message : "";
                    System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nEXCEPTION: {ex.ToString()}");
                    ModelState.AddModelError(string.Empty, "Hệ thống từ chối lưu: " + ex.Message + innerErr);
                }
            }
            else
            {
                var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\nModelState is INVALID: {errors}");
            }

            // Load lại danh mục nếu form nhập liệu bị lỗi Validation
            ViewBag.CategoryList = new SelectList(await _context.CategoriesProducts.ToListAsync(), "Id", "Name", vm.CategoryProductId);
            return View(vm);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            var vm = new ProductViewModel
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                CategoryProductId = product.CategoryProductId,
                ImageUrl = product.ImageUrl,
                SoldQuantity = product.SoldQuantity,
                ViewCount = product.ViewCount
            };

            ViewBag.CategoryList = new SelectList(await _context.CategoriesProducts.ToListAsync(), "Id", "Name", product.CategoryProductId);
            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ProductViewModel vm)
        {
            if (id != vm.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    // Lấy sản phẩm cũ để giữ CreatedDate gốc
                    var existingProd = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == vm.Id);
                    var product = new Product
                    {
                        Id = vm.Id,
                        Name = vm.Name,
                        Description = vm.Description,
                        Price = vm.Price,
                        StockQuantity = vm.StockQuantity,
                        CategoryProductId = vm.CategoryProductId,
                        ImageUrl = vm.ImageUrl, // Giữ lại ảnh cũ tạm thời
                        SoldQuantity = vm.SoldQuantity,
                        ViewCount = vm.ViewCount,
                        CreatedDate = existingProd?.CreatedDate ?? DateTime.Now // Giữ nguyên ngày tạo gốc
                    };

                    if (vm.ImageUpload != null && vm.ImageUpload.Length > 0)
                    {
                        string webRootPath = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
                        string uploadsFolder = Path.Combine(webRootPath, "images", "products");
                        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                        // Xoá ảnh cũ nếu có và không phải ảnh mặc định
                        var existingProduct = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == vm.Id);
                        if (existingProduct != null && !string.IsNullOrEmpty(existingProduct.ImageUrl) && !existingProduct.ImageUrl.Contains("default-product.jpg"))
                        {
                            string oldFilePath = Path.Combine(webRootPath, existingProduct.ImageUrl.TrimStart('/'));
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

                        product.ImageUrl = "/images/products/" + uniqueFileName;
                    }

                    _context.Update(product);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, "Lỗi: " + ex.Message);
                }
            }

            ViewBag.CategoryList = new SelectList(await _context.CategoriesProducts.ToListAsync(), "Id", "Name", vm.CategoryProductId);
            return View(vm);
        }

        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();
            var product = await _context.Products.Include(p => p.CategoryProduct).FirstOrDefaultAsync(m => m.Id == id);
            if (product == null) return NotFound();
            return View(product);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}