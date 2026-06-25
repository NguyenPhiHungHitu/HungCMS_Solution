// File: src/pages/home/index.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import postService from '../../services/postService';
import ProductCard from '../../components/ProductCard';

function Home({ onAddToCart, onAddToCompare, compareList = [] }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('BEST_SELLER');
  const navigate = useNavigate();

  // Banner slide index
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    {
      id: 1,
      title: "IPHONE 15 PRO MAX - TITAN TỰ NHIÊN",
      subtitle: "Siêu phẩm đỉnh cao từ Apple. Trả góp 0%. Khung viền Titan siêu bền nhẹ.",
      btnText: "Mua ngay",
      link: "/product/1",
      bgColor: "#1a1c1e",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      title: "GALAXY S24 ULTRA - AI QUYỀN NĂNG",
      subtitle: "Kỷ nguyên Galaxy AI đã tới. Tích hợp S-Pen, Camera 200MP chống rung cực đỉnh.",
      btnText: "Đặt hàng ngay",
      link: "/product/2",
      bgColor: "#0f1626",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      title: "XIAOMI 14 ULTRA - ỐNG KÍNH LEICA",
      subtitle: "Cảm biến ảnh 1 inch biến thiên khẩu độ. Đẳng cấp nhiếp ảnh di động chuyên nghiệp.",
      btnText: "Khám phá ngay",
      link: "/product/5",
      bgColor: "#050505",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Countdown timer cho Flash Sale (giả lập đếm ngược 8 tiếng)
  const [timeLeft, setTimeLeft] = useState(28800); // 8 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 28800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  const time = formatTime(timeLeft);

  // Auto slide banner
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [banners.length]);

  // Load dữ liệu
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const prodData = await productService.getAll();
        const catData = await categoryProductService.getAllCategoryProducts();
        const postData = await postService.getAllPosts();

        setProducts(prodData);
        setCategories(catData);
        setPosts(postData.slice(0, 3)); // Lấy tối đa 3 bài viết
        setLoading(false);
      } catch (err) {
        console.error("Lỗi nạp dữ liệu trang chủ:", err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const selectBrand = (brandId) => {
    navigate(`/shop?brand=${brandId}`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
        <p className="mt-3 text-muted font-weight-bold">Đang nạp trải nghiệm mua sắm chuyên nghiệp...</p>
      </div>
    );
  }

  // Lọc sản phẩm cho Flash Sale (giảm giá nhiều nhất)
  const flashSaleProducts = products.slice(0, 4);

  // Tiêu chí 36: Lọc 3 sản phẩm mới nhất (theo ID giảm dần)
  const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 3);

  // Tiêu chí 37: Lọc 3 sản phẩm bán chạy nhất (theo đánh giá)
  const topSellingProducts = [...products].sort((a, b) => b.rating - a.rating || b.id - a.id).slice(0, 3);

  // Lọc sản phẩm nổi bật theo Tabs
  const getTabProducts = () => {
    if (activeTab === 'BEST_SELLER') {
      return products.filter(p => p.rating >= 4.8);
    } else if (activeTab === 'NEW_ARRIVAL') {
      return products.filter(p => p.id % 2 !== 0);
    } else { // GIÁ TỐT NHẤT
      return [...products].sort((a, b) => a.price - b.price).slice(0, 4);
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* 1. HERO SLIDER BANNER (AUTOPLAY) */}
      <section className="container mt-4">
        <div className="hero-carousel position-relative" style={{ backgroundColor: banners[currentSlide].bgColor }}>
          <div className="row no-gutters align-items-center">
            <div className="col-md-6 p-5 text-white order-2 order-md-1">
              <h2 className="font-weight-bold mb-3 animated fadeInDown">{banners[currentSlide].title}</h2>
              <p className="lead mb-4 text-white-50 animated fadeInUp" style={{ fontSize: '16px' }}>{banners[currentSlide].subtitle}</p>
              <Link to={banners[currentSlide].link} className="btn btn-primary btn-lg px-4 buy-now-btn-pulse font-weight-bold" style={{ borderRadius: '30px' }}>
                {banners[currentSlide].btnText} <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>
            <div className="col-md-6 order-1 order-md-2" style={{ height: '380px', overflow: 'hidden' }}>
              <img 
                src={banners[currentSlide].image} 
                alt="Banner phone" 
                className="w-100 h-100" 
                style={{ objectFit: 'cover' }} 
              />
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="position-absolute d-flex gap-2" style={{ bottom: '15px', left: '40px', zIndex: 10 }}>
            {banners.map((_, idx) => (
              <button 
                key={idx}
                className="border-0 rounded-circle"
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: idx === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer' 
                }}
                onClick={() => setCurrentSlide(idx)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CHÍNH SÁCH CAM KẾT (4 CỘT) */}
      <section className="container mt-4 py-3 bg-white rounded-lg shadow-sm">
        <div className="row text-center">
          <div className="col-md-3 col-6 py-2 border-right">
            <div className="text-primary mb-2" style={{ fontSize: '26px' }}><i className="fa-solid fa-truck-fast"></i></div>
            <h6 className="font-weight-bold mb-1" style={{ fontSize: '14px' }}>Giao hàng nhanh 2H</h6>
            <p className="text-muted small mb-0">Miễn phí giao hàng nội thành</p>
          </div>
          <div className="col-md-3 col-6 py-2 border-right">
            <div className="text-primary mb-2" style={{ fontSize: '26px' }}><i className="fa-solid fa-shield-halved"></i></div>
            <h6 className="font-weight-bold mb-1" style={{ fontSize: '14px' }}>Chất lượng cam kết</h6>
            <p className="text-muted small mb-0">100% hàng chính hãng Apple/Samsung</p>
          </div>
          <div className="col-md-3 col-6 py-2 border-right">
            <div className="text-primary mb-2" style={{ fontSize: '26px' }}><i className="fa-solid fa-arrows-rotate"></i></div>
            <h6 className="font-weight-bold mb-1" style={{ fontSize: '14px' }}>Đổi trả dễ dàng</h6>
            <p className="text-muted small mb-0">1 đổi 1 trong 30 ngày nếu có lỗi</p>
          </div>
          <div className="col-md-3 col-6 py-2">
            <div className="text-primary mb-2" style={{ fontSize: '26px' }}><i className="fa-solid fa-headphones-simple"></i></div>
            <h6 className="font-weight-bold mb-1" style={{ fontSize: '14px' }}>Hỗ trợ 24/7 chuyên nghiệp</h6>
            <p className="text-muted small mb-0">Liên hệ hotline hỗ trợ bất cứ lúc nào</p>
          </div>
        </div>
      </section>

      {/* 3. DANH MỤC CÁC HÃNG THƯƠNG HIỆU */}
      <section className="container mt-5">
        <div className="section-heading mb-4">
          <h5 className="font-weight-bold text-uppercase m-0 d-flex align-items-center">
            <span className="bg-primary mr-2" style={{ width: '4px', height: '18px', display: 'inline-block' }}></span>
            Tìm kiếm theo thương hiệu
          </h5>
        </div>
        <div className="row">
          {categories.map((cat) => (
            <div className="col-md-3 col-6 mb-3" key={cat.id} onClick={() => selectBrand(cat.id)}>
              <div className="category-badge-item">
                <div className="category-badge-icon">
                  {cat.name.toLowerCase() === 'apple' && <i className="fa-brands fa-apple"></i>}
                  {cat.name.toLowerCase() === 'samsung' && <i className="fa-solid fa-mobile-screen"></i>}
                  {cat.name.toLowerCase() === 'xiaomi' && <i className="fa-solid fa-bolt"></i>}
                  {cat.name.toLowerCase() === 'oppo' && <i className="fa-solid fa-camera-retro"></i>}
                </div>
                <h6 className="font-weight-bold text-dark mb-1">{cat.name}</h6>
                <span className="text-muted small">Xem các sản phẩm</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FLASH SALE GIỜ VÀNG ĐẾM NGƯỢC */}
      <section className="container mt-5">
        <div className="flash-sale-wrapper">
          <div className="row align-items-center mb-4">
            <div className="col-lg-6 col-12 d-flex align-items-center flex-wrap gap-3">
              <h3 className="font-weight-bold text-uppercase m-0 text-white mr-3">
                <i className="fa-solid fa-fire-flame-curved mr-2 animated flash infinite text-warning"></i>
                Flash Sale Giờ Vàng
              </h3>
              <div className="d-flex align-items-center gap-1">
                <span className="timer-box">{time.h}</span>
                <span className="text-white font-weight-bold px-1">:</span>
                <span className="timer-box">{time.m}</span>
                <span className="text-white font-weight-bold px-1">:</span>
                <span className="timer-box">{time.s}</span>
              </div>
            </div>
            <div className="col-lg-6 col-12 text-lg-right text-left mt-3 mt-lg-0">
              <Link to="/shop" className="btn btn-warning btn-sm font-weight-bold text-dark px-3 py-2" style={{ borderRadius: '20px' }}>
                Xem tất cả Flash Sale <i className="fa-solid fa-arrow-trend-up ml-1"></i>
              </Link>
            </div>
          </div>

          <div className="row">
            {flashSaleProducts.map((p) => (
              <div className="col-lg-3 col-md-6 mb-4" key={p.id}>
                <ProductCard 
                  product={p} 
                  onAddToCart={onAddToCart}
                  onAddToCompare={onAddToCompare}
                  isCompared={compareList.some(item => item.id === p.id)}
                />
                <div className="px-2 mt-2">
                  <div className="flash-progress">
                    <div 
                      className="flash-progress-bar" 
                      style={{ width: `${Math.max(20, (p.stockQuantity / 30) * 100)}%` }}
                    ></div>
                    <span className="flash-progress-text">VỪA MỞ BÁN - KHO CÒN {p.stockQuantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.1. SẢN PHẨM MỚI NHẤT (TIÊU CHÍ 36) */}
      <section className="container mt-5">
        <div className="section-heading mb-4 border-bottom pb-2">
          <h4 className="font-weight-bold text-uppercase m-0 text-dark">
            <span className="bg-success mr-2" style={{ width: '4px', height: '18px', display: 'inline-block' }}></span>
            Siêu phẩm mới nhất (Newest Smartphone)
          </h4>
        </div>
        <div className="row">
          {latestProducts.map((p) => (
            <div className="col-lg-4 col-md-6 mb-4" key={p.id}>
              <ProductCard 
                product={p} 
                onAddToCart={onAddToCart}
                onAddToCompare={onAddToCompare}
                isCompared={compareList.some(item => item.id === p.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4.2. SẢN PHẨM BÁN CHẠY (TIÊU CHÍ 37) */}
      <section className="container mt-5">
        <div className="section-heading mb-4 border-bottom pb-2">
          <h4 className="font-weight-bold text-uppercase m-0 text-dark">
            <span className="bg-danger mr-2" style={{ width: '4px', height: '18px', display: 'inline-block' }}></span>
            Sản phẩm bán chạy nhất (Top Best Sellers)
          </h4>
        </div>
        <div className="row">
          {topSellingProducts.map((p) => (
            <div className="col-lg-4 col-md-6 mb-4" key={p.id}>
              <ProductCard 
                product={p} 
                onAddToCart={onAddToCart}
                onAddToCompare={onAddToCompare}
                isCompared={compareList.some(item => item.id === p.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. CÁC SIÊU PHẨM SMARTPHONE (TABBED SECTIONS) */}
      <section className="container mt-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Menu chọn tabs */}
          <div className="row border-bottom pb-3 mb-4 align-items-center">
            <div className="col-md-6 col-12">
              <h4 className="font-weight-bold text-dark m-0 d-flex align-items-center">
                <i className="fa-solid fa-store text-primary mr-2"></i>
                Sản phẩm nổi bật
              </h4>
            </div>
            <div className="col-md-6 col-12 mt-3 mt-md-0">
              <ul className="nav nav-pills justify-content-md-end justify-content-start font-weight-bold" style={{ fontSize: '13px' }}>
                <li className="nav-item">
                  <button 
                    className={`nav-link border-0 mr-2 py-2 px-3 ${activeTab === 'BEST_SELLER' ? 'active btn-primary' : 'bg-light text-dark'}`}
                    onClick={() => setActiveTab('BEST_SELLER')}
                    style={{ borderRadius: '20px' }}
                  >
                    Bán Chạy Nhất
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link border-0 mr-2 py-2 px-3 ${activeTab === 'NEW_ARRIVAL' ? 'active btn-primary' : 'bg-light text-dark'}`}
                    onClick={() => setActiveTab('NEW_ARRIVAL')}
                    style={{ borderRadius: '20px' }}
                  >
                    Hàng Mới Về
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link border-0 py-2 px-3 ${activeTab === 'HOT_PRICE' ? 'active btn-primary' : 'bg-light text-dark'}`}
                    onClick={() => setActiveTab('HOT_PRICE')}
                    style={{ borderRadius: '20px' }}
                  >
                    Giá Sốc
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Grid hiển thị sản phẩm */}
          <div className="row">
            {getTabProducts().map((p) => (
              <div className="col-lg-3 col-md-6 mb-4" key={p.id}>
                <ProductCard 
                  product={p} 
                  onAddToCart={onAddToCart}
                  onAddToCompare={onAddToCompare}
                  isCompared={compareList.some(item => item.id === p.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ĐÁNH GIÁ CỦA KHÁCH HÀNG */}
      <section className="container mt-5">
        <div className="section-heading mb-4 text-center">
          <h4 className="font-weight-bold text-dark">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</h4>
          <p className="text-muted small">Sự hài lòng của khách hàng là kim chỉ nam cho sự phát triển của Hùng Mobile.</p>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm p-4 h-100 bg-white">
              <div className="text-warning mb-2" style={{ fontSize: '14px' }}>
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="text-secondary small italic text-justify">
                "Tôi đã mua chiếc iPhone 15 Pro Max tại Hùng Mobile. Nhân viên tư vấn rất tận tâm, 
                đặc biệt là chế độ bảo hành 1 đổi 1 trong 30 ngày làm tôi cực kỳ an tâm khi sử dụng. Sẽ tiếp tục ủng hộ!"
              </p>
              <div className="d-flex align-items-center mt-3">
                <div className="bg-primary text-white rounded-circle font-weight-bold d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>KV</div>
                <div className="ml-3">
                  <h6 className="mb-0 font-weight-bold small text-dark">Kiều Quốc Vinh</h6>
                  <small className="text-muted">Quận 9, TP. HCM</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm p-4 h-100 bg-white">
              <div className="text-warning mb-2" style={{ fontSize: '14px' }}>
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="text-secondary small italic text-justify">
                "Thủ tục trả góp 0% cực kỳ nhanh chóng. Chỉ mất 10 phút là tôi đã nhận được máy Samsung S24 Ultra.
                Mức giá ở đây rẻ hơn thị trường vài triệu đồng mà chất lượng vẫn cam kết chính hãng."
              </p>
              <div className="d-flex align-items-center mt-3">
                <div className="bg-success text-white rounded-circle font-weight-bold d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>MH</div>
                <div className="ml-3">
                  <h6 className="mb-0 font-weight-bold small text-dark">Minh Hằng</h6>
                  <small className="text-muted">Quận Thủ Đức, TP. HCM</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm p-4 h-100 bg-white">
              <div className="text-warning mb-2" style={{ fontSize: '14px' }}>
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
              </div>
              <p className="text-secondary small italic text-justify">
                "Tôi đặt giao hàng nhanh chiếc Oppo Reno11 5G. Nhận được hàng trong vòng đúng 1 tiếng rưỡi kể từ lúc ấn đặt mua.
                Đóng gói cẩn thận, sản phẩm nguyên seal, nhân viên giao hàng lịch sự."
              </p>
              <div className="d-flex align-items-center mt-3">
                <div className="bg-warning text-dark rounded-circle font-weight-bold d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>TD</div>
                <div className="ml-3">
                  <h6 className="mb-0 font-weight-bold small text-dark">Tiến Dũng</h6>
                  <small className="text-muted">Quận Bình Thạnh, TP. HCM</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TIN TỨC CÔNG NGHỆ NỔI BẬT */}
      <section className="container mt-5 mb-5">
        <div className="section-heading mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
          <h4 className="font-weight-bold text-uppercase m-0 text-dark">
            <i className="fa-solid fa-newspaper text-success mr-2"></i>
            Tin Tức & Cẩm Nang Công Nghệ
          </h4>
          <Link to="/blog" className="btn btn-outline-success btn-sm font-weight-bold" style={{ borderRadius: '20px' }}>
            Tất cả tin tức <i className="fa-solid fa-arrow-right ml-1"></i>
          </Link>
        </div>
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4 mb-4" key={post.id}>
              <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden bg-white">
                <div style={{ height: '170px', overflow: 'hidden' }}>
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                <div className="card-body p-3">
                  <span className="badge badge-light border mb-2 text-success" style={{ fontSize: '11px' }}>
                    <i className="fa-regular fa-calendar-days mr-1"></i>
                    {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                  </span>
                  <h6 className="font-weight-bold text-dark mb-2 text-justify" style={{ lineHeight: '1.4', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {post.title}
                  </h6>
                  <p className="card-text text-secondary small text-justify text-truncate mb-3">
                    Bấm vào chi tiết để cập nhật các công nghệ di động mới nhất...
                  </p>
                  <Link to={`/blog/${post.id}`} className="btn btn-link text-success p-0 font-weight-bold small text-decoration-none">
                    Xem chi tiết <i className="fa-solid fa-circle-chevron-right ml-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;