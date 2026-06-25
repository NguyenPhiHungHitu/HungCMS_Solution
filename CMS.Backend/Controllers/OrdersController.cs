// File: Controllers/OrdersController.cs
// Chức năng: Quản lý Đơn hàng trên giao diện Admin
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    // ❌ KHÔNG dùng [ApiController] và [Route] ở đây
    public class OrdersController : Controller // Kế thừa Controller cho Admin
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Hiển thị danh sách toàn bộ Đơn hàng
        public async Task<IActionResult> Index()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return View(orders);
        }

        // 2. Hiển thị Chi tiết một Đơn hàng
        public async Task<IActionResult> Details(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (order == null) return NotFound("Không tìm thấy đơn hàng này.");

            return View(order);
        }

        // 3. Xử lý Cập nhật trạng thái
        // 3. Xử lý thao tác Cập nhật trạng thái từ form ở trang Chi tiết
        [HttpPost]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = status;
            await _context.SaveChangesAsync();

            // 🌟 ĐÃ SỬA: Thay vì quay lại trang Details(id), ta cho quay thẳng ra trang Index (Danh sách)
            return RedirectToAction(nameof(Index));
        }
    }
}