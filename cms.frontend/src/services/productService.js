// File: src/services/productService.js
import axiosClient from '../api/axiosClient';
import { mockProducts } from './mockData';

const productService = {
  getAll: () => {
    return axiosClient.get('/Products')
      .then(res => {
        // Lấy dữ liệu thực tế từ axios
        const data = res.data ? res.data : res;
        const finalData = Array.isArray(data) ? data : (data?.value || data?.$values || []);
        
        // Nếu API trả về trống hoặc không phải mảng, dùng mock
        if (finalData.length === 0) {
          console.warn("API Products rỗng, sử dụng dữ liệu Mock.");
          return mockProducts;
        }
        
        // Trộn dữ liệu backend với cấu hình chi tiết từ mock (nếu trùng ID hoặc trùng Tên)
        // để trang trí thêm các thông số kỹ thuật (RAM, ROM, Camera) không có ở DB
        return finalData.map(p => {
          const matchedMock = mockProducts.find(m => m.name.toLowerCase() === p.name.toLowerCase() || m.id === p.id);
          return {
            ...matchedMock, // Lấy các trường cấu hình nâng cao ở Mock
            ...p,           // Đè dữ liệu thật từ DB lên (Name, Price, ImageUrl...)
            id: p.id,
            price: p.price || matchedMock?.price || 0,
            originalPrice: p.price ? p.price * 1.15 : matchedMock?.originalPrice || 0, // Giả lập giá gốc
            specs: p.specs || matchedMock?.specs || {
              screen: "6.7 inch, OLED",
              cpu: "Chipset 8 nhân mạnh mẽ",
              ram: "8 GB",
              rom: "256 GB",
              camera: "Chính 48 MP & Phụ 12 MP",
              battery: "5000 mAh",
              os: "Android/iOS"
            },
            variants: matchedMock?.variants || {
              colors: ["Đen", "Trắng"],
              storages: [{ size: "256GB", priceModifier: 0 }]
            },
            reviews: matchedMock?.reviews || []
          };
        });
      })
      .catch(err => {
        console.error("Lỗi kết nối API Products, chuyển sang dữ liệu Mock:", err);
        return mockProducts;
      });
  },

  getById: async (id) => {
    try {
      // Vì controller backend không có getById cụ thể, ta lấy tất cả rồi tìm
      const list = await productService.getAll();
      const item = list.find(p => String(p.id) === String(id));
      if (item) return item;
      throw new Error("Không tìm thấy sản phẩm");
    } catch (err) {
      console.warn("Lỗi tìm kiếm sản phẩm theo ID, sử dụng Mock dữ liệu:", err);
      return mockProducts.find(p => String(p.id) === String(id)) || mockProducts[0];
    }
  }
};

export default productService;