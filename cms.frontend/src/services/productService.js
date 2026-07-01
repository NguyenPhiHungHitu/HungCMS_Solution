// File: src/services/productService.js
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: Service kết nối API Products cho ReactJS
// Bổ sung: Endpoint lấy sản phẩm mới nhất, bán chạy nhất, hot nhất từ Backend

import axiosClient from '../api/axiosClient';
import { mockProducts } from './mockData';

// Hàm chung xử lý response từ API Products
const parseProductResponse = (res) => {
  const data = res.data ? res.data : res;
  return Array.isArray(data) ? data : (data?.value || data?.$values || []);
};

// Hàm chung enrich dữ liệu API với mock data (thêm specs, variants, reviews)
const enrichProducts = (apiProducts) => {
  return apiProducts.map(p => {
    const matchedMock = mockProducts.find(m => m.name.toLowerCase() === p.name.toLowerCase() || m.id === p.id);
    return {
      ...matchedMock, // Lấy các trường cấu hình nâng cao ở Mock
      ...p,           // Đè dữ liệu thật từ DB lên (Name, Price, ImageUrl...)
      id: p.id,
      price: p.price || matchedMock?.price || 0,
      originalPrice: p.price ? p.price * 1.15 : matchedMock?.originalPrice || 0,
      soldQuantity: p.soldQuantity || 0,
      viewCount: p.viewCount || 0,
      createdDate: p.createdDate || new Date().toISOString(),
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
};

const productService = {
  // Lấy TẤT CẢ sản phẩm (hỗ trợ truyền filter params)
  getAll: (params = {}) => {
    let queryStr = '';
    const parts = [];
    if (params.minPrice) parts.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice) parts.push(`maxPrice=${params.maxPrice}`);
    if (params.categoryProductId && params.categoryProductId !== 'ALL') parts.push(`categoryProductId=${params.categoryProductId}`);
    if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
    
    if (parts.length > 0) {
      queryStr = '?' + parts.join('&');
    }

    return axiosClient.get(`/Products${queryStr}`)
      .then(res => {
        const finalData = parseProductResponse(res);
        if (finalData.length === 0) {
          console.warn("API Products rỗng, sử dụng dữ liệu Mock.");
          return mockProducts;
        }
        return enrichProducts(finalData);
      })
      .catch(err => {
        console.error("Lỗi kết nối API Products, chuyển sang dữ liệu Mock:", err);
        return mockProducts;
      });
  },

  // Lấy 3 sản phẩm MỚI NHẤT (theo ngày tạo từ Backend)
  getNewest: (count = 3) => {
    return axiosClient.get(`/Products/newest?count=${count}`)
      .then(res => {
        const finalData = parseProductResponse(res);
        if (finalData.length === 0) return mockProducts.slice(0, count);
        return enrichProducts(finalData);
      })
      .catch(err => {
        console.error("Lỗi API Newest Products:", err);
        return mockProducts.slice(0, count);
      });
  },

  // Lấy 3 sản phẩm BÁN CHẠY NHẤT (theo SoldQuantity từ Backend)
  getBestSeller: (count = 3) => {
    return axiosClient.get(`/Products/bestseller?count=${count}`)
      .then(res => {
        const finalData = parseProductResponse(res);
        if (finalData.length === 0) return mockProducts.slice(0, count);
        return enrichProducts(finalData);
      })
      .catch(err => {
        console.error("Lỗi API BestSeller Products:", err);
        return mockProducts.slice(0, count);
      });
  },

  // Lấy 3 sản phẩm HOT NHẤT (theo ViewCount từ Backend)
  getHot: (count = 3) => {
    return axiosClient.get(`/Products/hot?count=${count}`)
      .then(res => {
        const finalData = parseProductResponse(res);
        if (finalData.length === 0) return mockProducts.slice(0, count);
        return enrichProducts(finalData);
      })
      .catch(err => {
        console.error("Lỗi API Hot Products:", err);
        return mockProducts.slice(0, count);
      });
  },

  // Lấy chi tiết sản phẩm theo ID (tự động tăng ViewCount ở Backend)
  getById: async (id) => {
    try {
      const res = await axiosClient.get(`/Products/${id}`);
      const data = res.data ? res.data : res;
      if (data && data.id) {
        return enrichProducts([data])[0];
      }
      throw new Error("Không tìm thấy sản phẩm");
    } catch (err) {
      console.warn("Lỗi tìm kiếm sản phẩm theo ID, sử dụng Mock dữ liệu:", err);
      return mockProducts.find(p => String(p.id) === String(id)) || mockProducts[0];
    }
  }
};

export default productService;