// ==========================================================
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: Quản trị Thành viên (Phần Bổ sung Buổi 4)
// Ghi chú: Xử lý Thêm, Sửa, Xóa tài khoản, tự động giữ mật khẩu cũ.
// ==========================================================
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin,Administrator")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Hiển thị danh sách thành viên
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // GET: Hiển thị form Thêm thành viên
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Xử lý Thêm thành viên
        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            if (ModelState.IsValid)
            {
                _context.Users.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // GET: Hiển thị form Sửa dữ liệu cũ
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // POST: Thực hiện lưu thay đổi
        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            // 1. Tìm User gốc trong Database để lấy lại mật khẩu cũ nếu cần
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);
            if (existingUser == null) return NotFound();

            // 2. Xử lý mật khẩu: Nếu nhập mới thì lấy cái mới, nếu trống thì lấy cái cũ
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword;
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            // 3. Cập nhật vào Database
            _context.Users.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // Xóa thành viên trực tiếp
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}