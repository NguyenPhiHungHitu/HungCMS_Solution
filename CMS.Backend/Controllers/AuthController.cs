// ==========================================================
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: Đăng nhập & Đăng xuất (Buổi 5)
// Ghi chú: Cấp phát Cookie bảo mật dựa trên CSDL Users.
// ==========================================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Hiển thị giao diện đăng nhập
        [HttpGet]
        public IActionResult Login()
        {
            // Nếu phát hiện đã đăng nhập rồi thì "đá" thẳng vào trang quản trị Bài viết luôn
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Post");
            }
            return View();
        }

        // POST: Xử lý dữ liệu khi bấm nút Đăng nhập
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            // 1. Tìm trong Database xem có User nào khớp cả tên và mật khẩu không
            var user = _context.Users.FirstOrDefault(u => u.Username == username && u.PasswordHash == password);

            if (user != null)
            {
                // 2. Nếu đúng, tạo các thẻ ghi nhớ (Claims) để lưu thông tin người dùng vào phiên làm việc
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Lưu ID
                    new Claim(ClaimTypes.Name, user.Username),                // Lưu Username
                    new Claim("FullName", user.FullName),                     // Lưu Họ tên
                    new Claim(ClaimTypes.Role, user.Role)                     // Lưu Quyền hạn (Admin/Editor) - Rất quan trọng!
                };

                // 3. Đóng gói Claims và cấp phát Cookie
                var claimsIdentity = new ClaimsIdentity(claims, "CMSAuthCookie");
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true // Cho phép nhớ đăng nhập (sống 1 ngày như cấu hình ở Program.cs)
                };

                await HttpContext.SignInAsync("CMSAuthCookie", new ClaimsPrincipal(claimsIdentity), authProperties);

                // 4. Cấp thẻ thành công thì cho vào nhà (chuyển hướng đến trang quản lý Bài viết)
                return RedirectToAction("Index", "Post");
            }

            // Nếu sai tài khoản hoặc mật khẩu
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không chính xác!";
            return View();
        }

        // GET: Xử lý Đăng xuất
        // GET: Xử lý Đăng xuất
        public async Task<IActionResult> Logout()
        {
            // 1. Xóa sạch thẻ Cookie đăng nhập trên trình duyệt để thoát phiên làm việc
            await HttpContext.SignOutAsync("CMSAuthCookie");

            // 2. SỬA DÒNG NÀY: Thay vì về "Login" của Auth, mình chuyển hướng về trang chủ công khai
            return RedirectToAction("Index", "Home");
        }
    }
}