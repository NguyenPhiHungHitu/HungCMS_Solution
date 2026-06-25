// File: Controllers/CustomersController.cs
// Chức năng: Quản lý Khách hàng trên giao diện Admin
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    // ❌ KHÔNG dùng [ApiController] hay [Route] ở đây
    public class CustomersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách khách hàng
        public async Task<IActionResult> Index()
        {
            // Lấy danh sách khách hàng và kèm theo thông tin các đơn hàng họ đã đặt
            var customers = await _context.Customers
                .Include(c => c.Orders)
                .OrderByDescending(c => c.Id)
                .ToListAsync();

            return View(customers);
        }
    }
}