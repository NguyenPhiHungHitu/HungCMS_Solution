using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        // Số lượng đã bán (dùng để xếp hạng "Bán chạy nhất")
        public int SoldQuantity { get; set; } = 0;

        // Lượt xem sản phẩm (dùng để xếp hạng "Sản phẩm Hot")
        public int ViewCount { get; set; } = 0;

        // Ngày tạo sản phẩm (dùng để sắp xếp "Sản phẩm mới nhất")
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; }

    }
}