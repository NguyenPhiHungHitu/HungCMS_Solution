// File: Controllers/Api/CustomersApiController.cs
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: API Quản lý Khách hàng (Dành cho ReactJS)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Threading.Tasks;
using System.Linq;
using System;
using CMS.Backend.Helpers;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/Customers")] // Chốt cứng đường dẫn này
    [ApiController]
    public class CustomersApiController : ControllerBase // ĐỔI TÊN CLASS THÊM CHỮ Api
    {
        private readonly ApplicationDbContext _context;

        public CustomersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterCustomer([FromBody] Customer customer)
        {
            if (customer == null || string.IsNullOrEmpty(customer.Email))
                return BadRequest(new { message = "Dữ liệu đăng ký không hợp lệ!" });

            var checkExist = await _context.Customers.AnyAsync(c => c.Email == customer.Email);
            if (checkExist) return BadRequest(new { message = "Email này đã được sử dụng!" });

            // Tiêu chí 34: Tự động mã hóa mật khẩu trước khi lưu
            customer.Password = PasswordHasher.HashPassword(customer.Password);

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!", customerId = customer.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                return BadRequest(new { message = "Email và mật khẩu không được để trống!" });

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == model.Email);

            if (customer == null)
            {
                // Tự động đăng ký một khách hàng mặc định nếu chưa tồn tại
                customer = new Customer
                {
                    FullName = model.Email.Contains("@") ? model.Email.Split('@')[0] : "Nguyễn Phi Hùng",
                    Email = model.Email,
                    Password = PasswordHasher.HashPassword(model.Password),
                    Phone = "0909.888.999",
                    Address = "Quận 9, TP. Hồ Chí Minh"
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }
            else if (!PasswordHasher.VerifyPassword(model.Password, customer.Password))
            {
                return Unauthorized(new { message = "Mật khẩu không chính xác!" });
            }

            // Nếu đăng nhập bằng mật khẩu trơn cũ thành công, nâng cấp băm mật khẩu
            if (customer.Password == model.Password)
            {
                customer.Password = PasswordHasher.HashPassword(model.Password);
                await _context.SaveChangesAsync();
            }

            return Ok(new { 
                id = customer.Id, 
                fullName = customer.FullName, 
                email = customer.Email, 
                phone = customer.Phone, 
                address = customer.Address 
            });
        }

        [HttpPost("update/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] CustomerUpdateModel customerData)
        {
            if (customerData == null) return BadRequest(new { message = "Dữ liệu không hợp lệ!" });

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy khách hàng!" });

            customer.FullName = customerData.FullName;
            customer.Phone = customerData.Phone;
            customer.Address = customerData.Address;

            await _context.SaveChangesAsync();
            return Ok(new { 
                message = "Cập nhật thành công!", 
                fullName = customer.FullName, 
                phone = customer.Phone, 
                address = customer.Address 
            });
        }

        [HttpGet("{id}/orders")]
        public async Task<IActionResult> GetCustomerOrders(int id)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == id)
                .Include(o => o.OrderDetails!)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    id = o.Id.ToString(),
                    date = o.OrderDate,
                    status = o.Status == 0 ? "Chờ duyệt" : o.Status == 1 ? "Đang giao" : "Đã xong",
                    totalAmount = o.OrderDetails != null ? o.OrderDetails.Sum(od => od.UnitPrice * od.Quantity) : 0,
                    items = o.OrderDetails != null ? o.OrderDetails.Select(od => new {
                        productId = od.ProductId,
                        name = od.Product != null ? od.Product.Name : "Điện thoại",
                        price = od.UnitPrice,
                        quantity = od.Quantity,
                        selectedColor = "Mặc định",
                        selectedStorage = "Mặc định"
                    }) : null
                })
                .ToListAsync();

            return Ok(orders);
        }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class CustomerUpdateModel
    {
        public string FullName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}