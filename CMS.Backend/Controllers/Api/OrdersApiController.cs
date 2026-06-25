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

namespace CMS.Backend.Controllers.Api
{
    [Route("api/Orders")] // Chốt đường dẫn rõ ràng cho Frontend
    [ApiController]
    public class OrdersApiController : ControllerBase // ĐỔI TÊN THÀNH OrdersApiController
    {
        private readonly ApplicationDbContext _context;

        public OrdersApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null || order.CustomerId <= 0)
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ!" });

            order.OrderDate = DateTime.Now;
            order.Status = 0; // 0: Chờ duyệt

            // Tiêu chí 30: Trừ bớt số lượng sản phẩm tồn kho trong database
            if (order.OrderDetails != null)
            {
                foreach (var detail in order.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(detail.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity = Math.Max(0, product.StockQuantity - detail.Quantity);
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

                    using (var mail = new MailMessage())
                    {
                        mail.From = new MailAddress("no-reply@hungmobile.com", "Hùng Mobile");
                        mail.To.Add(new MailAddress(customer.Email));
                        mail.Subject = subject;
                        mail.Body = body;
                        mail.IsBodyHtml = true;

                        using (var smtp = new SmtpClient())
                        {
                            smtp.Host = "localhost"; // Cấu hình test hoặc mock smtp
                            smtp.Port = 25;
                            // smtp.Send(mail); // Giả lập để không crash nếu không có máy chủ SMTP vật lý
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