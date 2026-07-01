// File: Controllers/Api/OrdersApiController.cs
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: Nhận đơn đặt hàng từ ReactJS (Frontend)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Linq;

using Microsoft.Extensions.Configuration;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/Orders")] // Chốt đường dẫn rõ ràng cho Frontend
    [ApiController]
    public class OrdersApiController : ControllerBase // ĐỔI TÊN THÀNH OrdersApiController
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public OrdersApiController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null || order.CustomerId <= 0)
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ!" });

            order.OrderDate = DateTime.Now;
            order.Status = 0; // 0: Chờ duyệt

            // Kiểm tra số lượng tồn kho trước khi thực hiện đặt hàng
            if (order.OrderDetails != null)
            {
                foreach (var detail in order.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product == null)
                    {
                        return BadRequest(new { message = $"Sản phẩm có mã #{detail.ProductId} không tồn tại!" });
                    }
                    if (detail.Quantity > product.StockQuantity)
                    {
                        return BadRequest(new { message = $"Sản phẩm '{product.Name}' hiện chỉ còn {product.StockQuantity} sản phẩm trong kho. Quý khách vui lòng giảm số lượng đặt hàng xuống hoặc quay lại giỏ hàng để cập nhật!" });
                    }
                }

                // Khấu trừ tồn kho + Cộng số lượng đã bán
                foreach (var detail in order.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity -= detail.Quantity;  // Trừ tồn kho
                        product.SoldQuantity += detail.Quantity;   // Cộng số lượng đã bán (hiển thị trên trang chủ)
                    }
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Tiêu chí 31: Gửi email thông tin đơn hàng cho khách (HTML)
            try
            {
                var customer = await _context.Customers.FindAsync(order.CustomerId);
                if (customer != null && !string.IsNullOrEmpty(customer.Email))
                {
                    var detailsWithProducts = await _context.OrderDetails
                        .Where(od => od.OrderId == order.Id)
                        .Include(od => od.Product)
                        .ToListAsync();

                    string subject = $"[Hùng Mobile] Xác nhận đơn hàng thành công #{order.Id}";
                    string body = $"<h3>Kính chào {customer.FullName},</h3>" +
                                  $"<p>Cảm ơn quý khách đã mua sắm tại <b>Hùng Mobile</b>! Đơn đặt hàng của quý khách đã được lưu thành công.</p>" +
                                  $"<p><b>Mã đơn hàng:</b> #{order.Id}</p>" +
                                  $"<p><b>Ngày đặt hàng:</b> {order.OrderDate:dd/MM/yyyy HH:mm}</p>" +
                                  $"<h4>Chi tiết các sản phẩm đã chọn:</h4>" +
                                  $"<table border='1' cellpadding='10' cellspacing='0' style='border-collapse:collapse;'>" +
                                  $"  <tr style='background-color:#f2f2f2;'>" +
                                  $"    <th>Tên điện thoại</th>" +
                                  $"    <th>Số lượng</th>" +
                                  $"    <th>Đơn giá</th>" +
                                  $"    <th>Thành tiền</th>" +
                                  $"  </tr>";

                    decimal totalAmount = 0;
                    foreach (var od in detailsWithProducts)
                    {
                        string prodName = od.Product?.Name ?? "Điện thoại";
                        decimal itemTotal = od.UnitPrice * od.Quantity;
                        totalAmount += itemTotal;
                        body += $"  <tr>" +
                                $"    <td>{prodName}</td>" +
                                $"    <td align='center'>{od.Quantity}</td>" +
                                $"    <td align='right'>{od.UnitPrice:N0} đ</td>" +
                                $"    <td align='right'>{itemTotal:N0} đ</td>" +
                                $"  </tr>";
                    }

                    body += $"  <tr>" +
                            $"    <td colspan='3' align='right'><b>Tổng tiền thanh toán:</b></td>" +
                            $"    <td align='right' style='color:red;font-weight:bold;'>{totalAmount:N0} đ</td>" +
                            $"  </tr>" +
                            $"</table>" +
                            $"<p>Hùng Mobile sẽ liên hệ trực tiếp qua số điện thoại <b>{customer.Phone}</b> để xác nhận giao hàng.</p>" +
                            $"<p>Trân trọng cảm ơn,<br/><b>Ban quản trị Hùng Mobile</b></p>";

                    // Đọc cấu hình SMTP động từ appsettings.json
                    string smtpServer = _configuration["SmtpSettings:Server"] ?? "smtp.gmail.com";
                    int smtpPort = int.TryParse(_configuration["SmtpSettings:Port"], out int port) ? port : 587;
                    string senderEmail = _configuration["SmtpSettings:SenderEmail"] ?? "no-reply@hungmobile.com";
                    string senderName = _configuration["SmtpSettings:SenderName"] ?? "Hùng Mobile";
                    string smtpUser = _configuration["SmtpSettings:Username"] ?? "";
                    string smtpPass = _configuration["SmtpSettings:Password"] ?? "";

                    if (!string.IsNullOrEmpty(smtpUser) && !string.IsNullOrEmpty(smtpPass))
                    {
                        using (var mail = new MailMessage())
                        {
                            mail.From = new MailAddress(senderEmail, senderName);
                            mail.To.Add(new MailAddress(customer.Email));
                            mail.Subject = subject;
                            mail.Body = body;
                            mail.IsBodyHtml = true;

                            using (var smtp = new SmtpClient(smtpServer, smtpPort))
                            {
                                smtp.Credentials = new NetworkCredential(smtpUser, smtpPass);
                                smtp.EnableSsl = true;
                                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                                smtp.UseDefaultCredentials = false;
                                
                                smtp.Send(mail); // Gửi email thực tế cho khách hàng
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Ghi lỗi log âm thầm, không crash luồng checkout chính
                System.IO.File.AppendAllText(@"c:\Disk D\NguyenPhiHung_ASP\HungCMS_Solution\upload_debug.txt", $"\n[{DateTime.Now}] Lỗi Mail: {ex.Message}");
            }

            return Ok(new { message = "Đặt hàng thành công!", orderId = order.Id });
        }
    }
}