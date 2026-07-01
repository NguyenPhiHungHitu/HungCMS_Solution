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
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;

        public CustomersApiController(ApplicationDbContext context, Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email))
                return BadRequest(new { message = "Email không được để trống!" });

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == model.Email);
            if (customer == null)
            {
                return BadRequest(new { message = "Không tìm thấy tài khoản liên kết với Email này!" });
            }

            // Sinh mật khẩu mới ngẫu nhiên 8 ký tự
            string rawPassword = Guid.NewGuid().ToString().Substring(0, 8);
            customer.Password = PasswordHasher.HashPassword(rawPassword);
            await _context.SaveChangesAsync();

            // Gửi email khôi phục mật khẩu qua SMTP
            try
            {
                string subject = "[Hùng Mobile] Khôi phục mật khẩu tài khoản";
                string body = $"<h3>Kính chào {customer.FullName},</h3>" +
                              $"<p>Hệ thống Hùng Mobile nhận được yêu cầu khôi phục mật khẩu của quý khách.</p>" +
                              $"<p>Mật khẩu đăng nhập mới của quý khách là: <b style='color:red;font-size:16px;'>{rawPassword}</b></p>" +
                              $"<p>Vui lòng đăng nhập bằng mật khẩu này và thay đổi mật khẩu ngay để bảo mật tài khoản.</p>" +
                              $"<p>Trân trọng,<br/><b>Ban quản trị Hùng Mobile</b></p>";

                string smtpServer = _configuration["SmtpSettings:Server"] ?? "smtp.gmail.com";
                int smtpPort = int.TryParse(_configuration["SmtpSettings:Port"], out int port) ? port : 587;
                string senderEmail = _configuration["SmtpSettings:SenderEmail"] ?? "no-reply@hungmobile.com";
                string senderName = _configuration["SmtpSettings:SenderName"] ?? "Hùng Mobile";
                string smtpUser = _configuration["SmtpSettings:Username"] ?? "";
                string smtpPass = _configuration["SmtpSettings:Password"] ?? "";

                if (!string.IsNullOrEmpty(smtpUser) && !string.IsNullOrEmpty(smtpPass))
                {
                    using (var mail = new System.Net.Mail.MailMessage())
                    {
                        mail.From = new System.Net.Mail.MailAddress(senderEmail, senderName);
                        mail.To.Add(new System.Net.Mail.MailAddress(customer.Email));
                        mail.Subject = subject;
                        mail.Body = body;
                        mail.IsBodyHtml = true;

                        using (var smtp = new System.Net.Mail.SmtpClient(smtpServer, smtpPort))
                        {
                            smtp.Credentials = new System.Net.NetworkCredential(smtpUser, smtpPass);
                            smtp.EnableSsl = true;
                            smtp.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                            smtp.UseDefaultCredentials = false;
                            
                            smtp.Send(mail);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\n[{DateTime.Now}] Lỗi Mail ForgotPassword: {ex.Message}");
                // Trả về thẳng mật khẩu mới để dễ kiểm thử
                return Ok(new { message = "Lỗi gửi mail, mật khẩu mới của bạn tạm thời là: " + rawPassword, isEmailSent = false });
            }

            return Ok(new { message = "Một mật khẩu mới đã được gửi tới hộp thư của bạn. Vui lòng kiểm tra email!", isEmailSent = true });
        }

        [HttpPost("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.OldPassword) || string.IsNullOrEmpty(model.NewPassword))
                return BadRequest(new { message = "Mật khẩu cũ và mới không được để trống!" });

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy khách hàng!" });

            // Kiểm tra mật khẩu cũ (tương thích mật khẩu cũ băm hoặc chưa băm)
            if (!PasswordHasher.VerifyPassword(model.OldPassword, customer.Password))
            {
                if (customer.Password != model.OldPassword)
                {
                    return BadRequest(new { message = "Mật khẩu cũ không chính xác!" });
                }
            }

            // Mã hóa mật khẩu mới và lưu
            customer.Password = PasswordHasher.HashPassword(model.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thay đổi mật khẩu thành công!" });
        }
    }

    public class ChangePasswordModel
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class ForgotPasswordModel
    {
        public string Email { get; set; }
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