// File: src/services/bannerService.js
// Sinh viên: Nguyễn Phi Hùng (2123110475)
// Chức năng: Service gọi API Banner cho trang chủ slideshow

import axiosClient from '../api/axiosClient';

// Mock data dự phòng khi API chưa sẵn sàng
const mockBanners = [
  {
    id: 1,
    title: "IPHONE 15 PRO MAX - TITAN TỰ NHIÊN",
    subtitle: "Siêu phẩm đỉnh cao từ Apple. Trả góp 0%. Khung viền Titan siêu bền nhẹ.",
    btnText: "Mua ngay",
    linkUrl: "/product/1",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "GALAXY S24 ULTRA - AI QUYỀN NĂNG",
    subtitle: "Kỷ nguyên Galaxy AI đã tới. Tích hợp S-Pen, Camera 200MP chống rung cực đỉnh.",
    btnText: "Đặt hàng ngay",
    linkUrl: "/product/2",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "XIAOMI 14 ULTRA - ỐNG KÍNH LEICA",
    subtitle: "Cảm biến ảnh 1 inch biến thiên khẩu độ. Đẳng cấp nhiếp ảnh di động chuyên nghiệp.",
    btnText: "Khám phá ngay",
    linkUrl: "/product/5",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80"
  }
];

const bannerService = {
  getAllBanners: () => {
    return axiosClient.get('/Banners')
      .then(res => {
        const data = res.data ? res.data : res;
        const finalData = Array.isArray(data) ? data : (data?.value || data?.$values || []);

        if (finalData.length === 0) {
          console.warn("API Banners rỗng, dùng banner Mock.");
          return mockBanners;
        }
        return finalData;
      })
      .catch(err => {
        console.error("Lỗi kết nối API Banners, dùng mock:", err);
        return mockBanners;
      });
  }
};

export default bannerService;
