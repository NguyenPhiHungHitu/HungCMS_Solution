// ==========================================================
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Bài tập Nâng cao 2: API Quản lý Khách hàng (Customers)
// ==========================================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Đăng ký tài khoản từ Frontend
        [HttpPost("register")]
        public async Task<IActionResult> RegisterCustomer([FromBody] Customer customer)
        {
            var checkExist = await _context.Customers.AnyAsync(c => c.Email == customer.Email);
            if (checkExist) return BadRequest(new { message = "Email này đã được sử dụng!" });

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!", customerId = customer.Id });
        }
    }
}