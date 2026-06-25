// File: src/services/mockData.js

export const mockCategories = [
  { id: 1, name: "Apple", description: "Các dòng điện thoại iPhone chính hãng từ Apple" },
  { id: 2, name: "Samsung", description: "Smartphone Galaxy cao cấp, màn hình gập đột phá" },
  { id: 3, name: "Xiaomi", description: "Điện thoại cấu hình khủng, giá cực tốt từ Xiaomi" },
  { id: 4, name: "Oppo", description: "Chuyên gia selfie, thiết kế thời thượng và sạc siêu nhanh" }
];

export const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    description: "iPhone 15 Pro Max là siêu phẩm cao cấp nhất năm 2024 của Apple. Máy sở hữu khung viền Titan siêu nhẹ và bền bỉ, nút Action Button tiện dụng, và chip A17 Pro tối tân cho hiệu năng vượt trội chiến mọi tựa game đồ họa khủng. Camera Zoom quang học 5x chất lượng cực cao giúp bạn bắt trọn mọi khoảnh khắc từ khoảng cách xa một cách sắc nét nhất.",
    price: 29490000,
    originalPrice: 34990000,
    stockQuantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    categoryProductId: 1,
    rating: 5,
    specs: {
      screen: "6.7 inch, Super Retina XDR OLED, 120Hz",
      cpu: "Apple A17 Pro (3nm)",
      ram: "8 GB",
      rom: "256 GB",
      camera: "Chính 48 MP & Phụ 12 MP, 12 MP",
      battery: "4441 mAh, Sạc nhanh 25W",
      os: "iOS 17 (Hỗ trợ cập nhật lâu dài)"
    },
    variants: {
      colors: ["Titan Tự Nhiên", "Titan Xanh", "Titan Đen", "Titan Trắng"],
      colorImages: {
        "Titan Tự Nhiên": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
        "Titan Xanh": "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=600&q=80",
        "Titan Đen": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
        "Titan Trắng": "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=600&q=80"
      },
      storages: [
        { size: "256GB", priceModifier: 0 },
        { size: "512GB", priceModifier: 5500000 },
        { size: "1TB", priceModifier: 11000000 }
      ]
    },
    reviews: [
      { id: 1, author: "Trần Anh Tuấn", rating: 5, date: "2026-05-12", comment: "Máy dùng mượt mà, cầm nhẹ hơn nhiều so với bản 14 Pro Max. Pin trâu bò." },
      { id: 2, author: "Lê Thị Hồng", rating: 5, date: "2026-06-01", comment: "Màu Titan tự nhiên đẹp xuất sắc! Camera zoom 5x nét căng đét." }
    ]
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 256GB",
    description: "Galaxy S24 Ultra mở ra kỷ nguyên quyền năng di động với hệ thống trí tuệ nhân tạo Galaxy AI tiên tiến. Máy đi kèm bút S Pen đa năng tích hợp sâu vào hệ thống, khung viền Titanium cứng cáp, màn hình phẳng tràn viền độ sáng tối đa 2600 nits chống chói xuất sắc ngoài trời và cảm biến camera chính lên tới 200 MP.",
    price: 26990000,
    originalPrice: 31990000,
    stockQuantity: 12,
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    categoryProductId: 2,
    rating: 4.8,
    specs: {
      screen: "6.8 inch, Dynamic AMOLED 2X, 120Hz, QHD+",
      cpu: "Snapdragon 8 Gen 3 for Galaxy",
      ram: "12 GB",
      rom: "256 GB",
      camera: "Chính 200 MP & Phụ 50 MP, 12 MP, 10 MP",
      battery: "5000 mAh, Sạc siêu nhanh 45W",
      os: "Android 14 (One UI 6.1)"
    },
    variants: {
      colors: ["Xám Titanium", "Vàng Titanium", "Tím Titanium", "Đen Titanium"],
      colorImages: {
        "Xám Titanium": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
        "Vàng Titanium": "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
        "Tím Titanium": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
        "Đen Titanium": "https://images.unsplash.com/photo-1565849906660-bf97efec2cd0?auto=format&fit=crop&w=600&q=80"
      },
      storages: [
        { size: "256GB", priceModifier: 0 },
        { size: "512GB", priceModifier: 4000000 },
        { size: "1TB", priceModifier: 9000000 }
      ]
    },
    reviews: [
      { id: 1, author: "Nguyễn Văn Hùng", rating: 5, date: "2026-04-20", comment: "Galaxy AI dịch thuật trực tiếp cực hay. Màn hình chống chói rất tốt." },
      { id: 2, author: "Phạm Minh Trí", rating: 4, date: "2026-05-18", comment: "Bút S Pen viết mượt, chụp ảnh đêm cực kỳ đỉnh cao." }
    ]
  },
  {
    id: 3,
    name: "iPhone 14 Pro 128GB",
    description: "iPhone 14 Pro sở hữu màn hình Dynamic Island đột phá thay thế cho tai thỏ truyền thống. Được trang bị chip xử lý A16 Bionic vô địch phân khúc cùng cụm camera nâng cấp lên 48MP cho phép chụp ảnh ProRAW siêu chi tiết và quay phim Cinematic 4K mượt mà như máy ảnh chuyên dụng.",
    price: 21990000,
    originalPrice: 25490000,
    stockQuantity: 8,
    imageUrl: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=600&q=80",
    categoryProductId: 1,
    rating: 4.7,
    specs: {
      screen: "6.1 inch, Super Retina XDR OLED, 120Hz",
      cpu: "Apple A16 Bionic (4nm)",
      ram: "6 GB",
      rom: "128 GB",
      camera: "Chính 48 MP & Phụ 12 MP, 12 MP",
      battery: "3200 mAh, Sạc nhanh 20W",
      os: "iOS 16"
    },
    variants: {
      colors: ["Tím Đậm", "Vàng", "Bạc", "Đen Không Gian"],
      storages: [
        { size: "128GB", priceModifier: 0 },
        { size: "256GB", priceModifier: 3000000 },
        { size: "512GB", priceModifier: 7500000 }
      ]
    },
    reviews: [
      { id: 1, author: "Ngô Quốc Bảo", rating: 5, date: "2026-03-10", comment: "Kích thước 6.1 inch cầm vừa tay, Dynamic Island tiện lợi." }
    ]
  },
  {
    id: 4,
    name: "Samsung Galaxy Z Fold 5 512GB",
    description: "Samsung Galaxy Z Fold 5 là chiếc điện thoại màn hình gập cao cấp, mỏng nhẹ hơn thế hệ tiền nhiệm nhờ bản lề Flex cải tiến mới giúp gập khít hoàn toàn. Biến điện thoại thành máy tính bảng mini chỉ trong tích tắc, hỗ trợ xử lý đa nhiệm cực đỉnh phục vụ đắc lực cho công việc.",
    price: 32990000,
    originalPrice: 40990000,
    stockQuantity: 5,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    categoryProductId: 2,
    rating: 4.9,
    specs: {
      screen: "Chính 7.6 inch & Phụ 6.2 inch, Dynamic AMOLED 2X, 120Hz",
      cpu: "Snapdragon 8 Gen 2 for Galaxy",
      ram: "12 GB",
      rom: "512 GB",
      camera: "Chính 50 MP & Phụ 12 MP, 10 MP",
      battery: "4400 mAh, Sạc nhanh 25W",
      os: "Android 13 (One UI 5.1.1)"
    },
    variants: {
      colors: ["Xanh Icy", "Kem Ivory", "Đen Phantom"],
      storages: [
        { size: "256GB", priceModifier: -3000000 },
        { size: "512GB", priceModifier: 0 }
      ]
    },
    reviews: [
      { id: 1, author: "Đặng Hoàng Long", rating: 5, date: "2026-05-30", comment: "Gập mở không còn kẽ hở nhìn sang xịn mịn hơn hẳn bản cũ. Xem phim chơi game siêu sướng." }
    ]
  },
  {
    id: 5,
    name: "Xiaomi 14 Ultra 512GB",
    description: "Xiaomi 14 Ultra đánh dấu bước tiến lịch sử trong nhiếp ảnh di động nhờ sự hợp tác chiến lược với hãng ống kính Leica lừng danh. Máy được trang bị cụm camera ống kính Summilux quang học biến thiên khẩu độ lớn, cảm biến 1 inch siêu lớn giúp chụp đêm sáng rõ như ban ngày và cấu hình phần cứng Snapdragon 8 Gen 3 mạnh mẽ hàng đầu thế giới.",
    price: 25990000,
    originalPrice: 29990000,
    stockQuantity: 9,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    categoryProductId: 3,
    rating: 4.8,
    specs: {
      screen: "6.73 inch, LTPO AMOLED, 120Hz, WQHD+",
      cpu: "Snapdragon 8 Gen 3 (4nm)",
      ram: "16 GB",
      rom: "512 GB",
      camera: "Cụm 4 camera Leica 50 MP",
      battery: "5000 mAh, Sạc nhanh 90W (Không dây 80W)",
      os: "Android 14 (Xiaomi HyperOS)"
    },
    variants: {
      colors: ["Đen (Da sinh học)", "Trắng (Da sinh học)"],
      storages: [
        { size: "512GB", priceModifier: 0 }
      ]
    },
    reviews: [
      { id: 1, author: "Bùi Tiến Đạt", rating: 5, date: "2026-06-11", comment: "Camera Leica chụp màu retro chất chơi thực sự. Sạc pin 90W nhanh khủng khiếp." }
    ]
  },
  {
    id: 6,
    name: "Xiaomi Redmi Note 13 Pro 256GB",
    description: "Redmi Note 13 Pro định nghĩa lại phân khúc smartphone tầm trung. Máy sở hữu màn hình OLED 1.5K cực nét tần số quét 120Hz, camera độ phân giải siêu cao 200MP chống rung OSD và viên pin dung lượng lớn kèm sạc siêu tốc 67W trong hộp.",
    price: 6890000,
    originalPrice: 7990000,
    stockQuantity: 25,
    imageUrl: "https://images.unsplash.com/photo-1565849906660-bf97efec2cd0?auto=format&fit=crop&w=600&q=80",
    categoryProductId: 3,
    rating: 4.6,
    specs: {
      screen: "6.67 inch, AMOLED, 1.5K, 120Hz",
      cpu: "Helio G99-Ultra (6nm)",
      ram: "8 GB",
      rom: "256 GB",
      camera: "Chính 200 MP & Phụ 8 MP, 2 MP",
      battery: "5000 mAh, Sạc nhanh 67W",
      os: "Android 13 (MIUI 14)"
    },
    variants: {
      colors: ["Đen bán dạ", "Xanh rừng sâu", "Cầu vồng độc độc"],
      storages: [
        { size: "128GB", priceModifier: -800000 },
        { size: "256GB", priceModifier: 0 }
      ]
    },
    reviews: [
      { id: 1, author: "Lê Hoàng Quân", rating: 4, date: "2026-06-15", comment: "Giá rẻ mà có camera 200MP chụp nét. Màn hình sáng đẹp long lanh." }
    ]
  },
  {
    id: 7,
    name: "Oppo Find X7 Ultra 256GB",
    description: "Oppo Find X7 Ultra là smartphone đầu tiên trên thế giới trang bị camera tiềm vọng kép (Dual-periscope), hợp tác cân chỉnh màu sắc cùng Hasselblad danh tiếng. Thiết kế mặt lưng da kết hợp kính độc đáo, sang trọng mang phong cách cổ điển và đẳng cấp.",
    price: 21900000,
    originalPrice: 24900000,
    stockQuantity: 7,
    imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    categoryProductId: 4,
    rating: 4.8,
    specs: {
      screen: "6.82 inch, LTPO AMOLED, 120Hz, 2K+",
      cpu: "Snapdragon 8 Gen 3 (4nm)",
      ram: "12 GB",
      rom: "256 GB",
      camera: "4 camera 50 MP (Hasselblad)",
      battery: "5000 mAh, SuperVOOC 100W",
      os: "Android 14 (ColorOS 14)"
    },
    variants: {
      colors: ["Xanh Đại Dương (Mặt lưng da)", "Nâu Đất Sét", "Đen Tuyển Chọn"],
      storages: [
        { size: "256GB", priceModifier: 0 },
        { size: "512GB", priceModifier: 2500000 }
      ]
    },
    reviews: [
      { id: 1, author: "Nguyễn Tuấn Kiệt", rating: 5, date: "2026-05-25", comment: "Hai ống kính zoom chụp chân dung xóa phông cực nghệ thuật. Sạc 100W nhanh dã man." }
    ]
  },
  {
    id: 8,
    name: "Oppo Reno11 5G 256GB",
    description: "Oppo Reno11 5G khẳng định vị thế 'Chuyên gia chân dung' thế hệ mới. Máy sở hữu thiết kế mặt lưng ánh kim bắt mắt, camera tele 32MP chuyên chụp chân dung xóa phông tự nhiên và chip xử lý MediaTek mạnh mẽ, tiết kiệm điện năng tốt.",
    price: 9490000,
    originalPrice: 10990000,
    stockQuantity: 20,
    imageUrl: "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&w=600&q=80",
    categoryProductId: 4,
    rating: 4.5,
    specs: {
      screen: "6.7 inch, Curved AMOLED, 120Hz",
      cpu: "Dimensity 7050 (6nm)",
      ram: "8 GB",
      rom: "256 GB",
      camera: "Chính 50 MP & Phụ 32 MP, 8 MP",
      battery: "5000 mAh, SuperVOOC 67W",
      os: "Android 14 (ColorOS 14)"
    },
    variants: {
      colors: ["Xanh Sóng Biển", "Xám San Hô"],
      storages: [
        { size: "256GB", priceModifier: 0 }
      ]
    },
    reviews: [
      { id: 1, author: "Nguyễn Hải Yến", rating: 5, date: "2026-06-20", comment: "Máy thiết kế mỏng nhẹ, cầm rất ôm tay. Chụp hình tự sướng auto đẹp không cần chỉnh app." }
    ]
  }
];

export const mockPostCategories = [
  { id: 1, name: "Đánh giá công nghệ", description: "Các bài đánh giá chi tiết điện thoại mới nhất" },
  { id: 2, name: "Thủ thuật & Mẹo hay", description: "Hướng dẫn sử dụng smartphone hiệu quả" },
  { id: 3, name: "Tin tức sự kiện", description: "Tin tức nóng hổi về thế giới công nghệ di động" }
];

export const mockPosts = [
  {
    id: 1,
    title: "Đánh giá chi tiết iPhone 15 Pro Max sau 6 tháng sử dụng: Khung Titan có thực sự đáng tiền?",
    content: "Sau nửa năm đồng hành cùng chiếc iPhone 15 Pro Max, điều khiến người dùng ấn tượng nhất chính là trọng lượng của máy. Nhờ sử dụng khung viền Titan thay thế cho thép không gỉ, máy nhẹ hơn khoảng 20g, tạo cảm giác cầm nắm thoải mái hơn rõ rệt khi sử dụng trong thời gian dài.\n\nHiệu năng của chip Apple A17 Pro là điều không cần bàn cãi. Máy chiến mượt mà tất cả các tựa game nặng như Genshin Impact ở mức đồ họa cao nhất mà không gặp hiện tượng giật lag, mặc dù nhiệt độ tỏa ra vẫn tương đối ấm ở phần mặt lưng.\n\nCụm camera zoom quang học 5x hoạt động cực tốt trong điều kiện đủ sáng. Tuy nhiên, khi chụp đêm, cảm biến zoom 5x đôi lúc vẫn tự chuyển về camera chính để đảm bảo thu sáng tốt hơn, đây là điểm người dùng cần lưu ý. Nhìn chung, iPhone 15 Pro Max vẫn là lựa chọn hàng đầu cho những ai tìm kiếm chiếc smartphone hoàn hảo nhất từ Apple.",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    createdDate: "2026-06-15T08:30:00Z",
    categoryId: 1
  },
  {
    id: 2,
    title: "Galaxy AI trên dòng Samsung S24 Series làm được những gì? Hướng dẫn sử dụng chi tiết",
    content: "Samsung Galaxy S24 Series đánh dấu bước nhảy vọt lớn nhờ sự xuất hiện của Galaxy AI. Công nghệ trí tuệ nhân tạo được tích hợp sâu vào hệ thống mang lại nhiều tính năng vô cùng hữu ích cho cuộc sống hàng ngày.\n\nĐầu tiên là tính năng 'Khoanh vùng search đa năng' (Circle to Search). Bạn chỉ cần giữ nút Home, khoanh tròn vào bất kỳ vật thể nào trên màn hình, trí tuệ nhân tạo của Google sẽ lập tức phân tích và đưa ra kết quả tìm kiếm chỉ trong 1 giây.\n\nThứ hai là 'Dịch thuật trực tiếp cuộc gọi' (Live Translate) hỗ trợ đàm thoại đa ngôn ngữ thời gian thực. AI có khả năng nhận dạng giọng nói, dịch sang ngôn ngữ đích và phát âm trực tiếp cho cả hai đầu dây nghe, giúp bạn tự tin giao tiếp quốc tế ngay cả khi không thạo ngoại ngữ.\n\nNgoài ra, các công cụ chỉnh ảnh thông minh như xóa vật thể thừa, tự động căn chỉnh khung hình và điền đầy nền trống bằng AI cũng giúp người dùng có được những bức ảnh hoàn hảo một cách dễ dàng nhất.",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    createdDate: "2026-06-20T10:15:00Z",
    categoryId: 2
  },
  {
    id: 3,
    title: "Rò rỉ thông số cấu hình siêu phẩm màn hình gập thế hệ mới: Mỏng hơn, nếp gập vô hình",
    content: "Những thông tin rò rỉ mới nhất từ các nhà cung ứng chuỗi linh kiện cho biết, các dòng điện thoại gập flagship sắp ra mắt vào nửa cuối năm 2026 sẽ có những đột phá lớn về công nghệ bản lề.\n\nĐộ dày khi gập của thiết bị dự kiến sẽ giảm xuống chỉ còn khoảng dưới 11mm, tức là tiệm cận với độ dày của một chiếc điện thoại thanh thông thường. Bản lề giọt nước cải tiến mới không chỉ giúp hai nửa màn hình khít hoàn toàn mà còn kéo căng tấm nền OLED linh hoạt khi mở ra, giúp nếp gập ở giữa màn hình giảm tới 80% độ hằn, mang lại trải nghiệm vuốt chạm hoàn toàn liền mạch.\n\nBên cạnh đó, dung lượng pin cũng sẽ được nâng lên khoảng 4800mAh nhờ công nghệ pin Silicon-Carbon mật độ năng lượng cao mới, giải quyết triệt để điểm yếu pin yếu kinh niên của dòng smartphone gập.",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    createdDate: "2026-06-24T14:00:00Z",
    categoryId: 3
  }
];
