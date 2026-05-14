//Họ và tên: Nguyễn Phi Hùng
//Mã số sinh viên: 2123110475
//version: 1.0
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên
    }
}

