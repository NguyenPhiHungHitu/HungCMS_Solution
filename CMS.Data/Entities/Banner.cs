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
    public class Banner
    {
        public int Id { get; set; }
        public string Title { get; set; } // Tiêu đề banner
        public string? Subtitle { get; set; } // Mô tả phụ
        public string ImageUrl { get; set; } // Đường dẫn hình ảnh
        public string? LinkUrl { get; set; } // Đường dẫn khi click
        public string? BtnText { get; set; } // Text nút CTA (ví dụ: "Mua ngay")
        public int SortOrder { get; set; } = 0; // Thứ tự hiển thị
        public bool IsActive { get; set; } = true; // Trạng thái kích hoạt
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
