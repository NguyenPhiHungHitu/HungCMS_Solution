// ==========================================================
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Bài tập Nâng cao 3: API Quản lý Đơn hàng (Orders)
// ==========================================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Nhận đơn đặt hàng từ Frontend
        [HttpPost("checkout")]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null || order.CustomerId <= 0)
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ!" });

            order.OrderDate = DateTime.Now;
            order.Status = 0; // 0: Chờ duyệt

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt hàng thành công!", orderId = order.Id });
        }
    }
}