using System;
using System.Security.Cryptography;
using System.Text;

namespace CMS.Backend.Helpers
{
    public static class PasswordHasher
    {
        // Băm mật khẩu bằng thuật toán SHA256
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password)) return string.Empty;
            
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var builder = new StringBuilder();
                foreach (var b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        // So khớp mật khẩu đăng nhập với mật khẩu lưu trong DB (Hỗ trợ mật khẩu thô cũ)
        public static bool VerifyPassword(string inputPassword, string storedPassword)
        {
            if (string.IsNullOrEmpty(inputPassword) || string.IsNullOrEmpty(storedPassword)) 
                return false;

            // Nếu mật khẩu trùng khớp trực tiếp (mật khẩu thô cũ), trả về true
            if (inputPassword == storedPassword) 
                return true;

            // So khớp mật khẩu đã băm
            string hashedInput = HashPassword(inputPassword);
            return hashedInput.Equals(storedPassword, StringComparison.OrdinalIgnoreCase);
        }
    }
}
