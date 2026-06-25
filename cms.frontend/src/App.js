// File: src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getImageUrl } from './api/axiosClient';

// 1. IMPORT COMPONENT DÙNG CHUNG
import Header from './components/Header';
import Footer from './components/Footer';

// 2. IMPORT CÁC TRANG GIAO DIỆN
import Home from './pages/home/index';
import Shop from './pages/shop/index';
import ProductDetail from './pages/product-detail/index';
import Cart from './pages/cart/index';
import Checkout from './pages/checkout/index';
import Compare from './pages/compare/index';
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog-detail/index';
import Profile from './pages/profile/index';
import About from './pages/about/index';
import Contact from './pages/contact/index';

function App() {
  // Trạng thái Giỏ hàng (Tự động phục hồi từ localStorage)
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
  });

  // Trạng thái So sánh (Tối đa 3 thiết bị)
  const [compareList, setCompareList] = useState([]);

  // Trạng thái Khách hàng đăng nhập (Lưu session)
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : null;
  });

  // Lịch sử Đơn hàng đã đặt
  const [orders, setOrders] = useState(() => {
    const localOrders = localStorage.getItem('orders');
    return localOrders ? JSON.parse(localOrders) : [];
  });

  // Trạng thái hiển thị nút cuộn lên đầu trang
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Theo dõi giỏ hàng để đồng bộ localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Theo dõi đơn hàng
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Theo dõi cuộn trang để hiện nút Scroll to Top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🌟 NGHIỆP VỤ: THÊM GIỎ HÀNG
  const handleAddToCart = (product, qty = 1) => {
    const color = product.selectedColor || 'Mặc định';
    const storage = product.selectedStorage || 'Mặc định';

    setCart((prevCart) => {
      // Tìm sản phẩm cùng ID, cùng màu, cùng dung lượng bộ nhớ
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor === color &&
          item.selectedStorage === storage
      );

      if (existingIdx > -1) {
        // Cộng dồn số lượng
        const updatedCart = [...prevCart];
        updatedCart[existingIdx].quantity += qty;
        return updatedCart;
      } else {
        // Thêm mới dòng hàng
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            selectedColor: color,
            selectedStorage: storage,
            quantity: qty,
            stockQuantity: product.stockQuantity
          }
        ];
      }
    });
  };

  // 🌟 NGHIỆP VỤ: CẬP NHẬT SỐ LƯỢNG MÁY TRONG GIỎ
  const handleUpdateQuantity = (id, color, storage, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (
            item.id === id &&
            item.selectedColor === color &&
            item.selectedStorage === storage
          ) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: Math.max(1, nextQty) };
          }
          return item;
        });
    });
  };

  // 🌟 NGHIỆP VỤ: XÓA SẢN PHẨM KHỎI GIỎ HÀNG
  const handleRemoveFromCart = (id, color, storage) => {
    setCart((prevCart) => {
      return prevCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === color &&
            item.selectedStorage === storage
          )
      );
    });
  };

  // 🌟 NGHIỆP VỤ: LÀM SẠCH GIỎ HÀNG (Khi đặt hàng thành công)
  const handleClearCart = () => {
    setCart([]);
  };

  // 🌟 NGHIỆP VỤ: SO SÁNH SẢN PHẨM (Tối đa 3 thiết bị)
  const handleAddToCompare = (product) => {
    setCompareList((prevList) => {
      const exists = prevList.some((item) => item.id === product.id);
      
      if (exists) {
        // Bấm lại lần 2 thì loại bỏ
        return prevList.filter((item) => item.id !== product.id);
      } else {
        if (prevList.length >= 3) {
          alert('Hệ thống chỉ cho phép so sánh tối đa 3 chiếc điện thoại cùng lúc.');
          return prevList;
        }
        return [...prevList, product];
      }
    });
  };

  const handleRemoveFromCompare = (id) => {
    setCompareList((prevList) => prevList.filter((item) => item.id !== id));
  };

  // 🌟 NGHIỆP VỤ: ĐĂNG NHẬP / ĐĂNG XUẤT
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 🌟 NGHIỆP VỤ: CẬP NHẬT THÔNG TIN HỒ SƠ
  const handleUpdateProfile = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  // 🌟 NGHIỆP VỤ: THÊM ĐƠN HÀNG VÀO LỊCH SỬ ĐÃ ĐẶT
  const handleAddOrder = (order) => {
    setOrders((prevOrders) => [order, ...prevOrders]);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-light">
        
        {/* Header toàn hệ thống */}
        <Header 
          cart={cart} 
          compareList={compareList} 
          user={user} 
          onLogout={handleLogout} 
        />

        {/* Nội dung chính của định tuyến các trang */}
        <main className="flex-grow-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  onAddToCart={handleAddToCart} 
                  onAddToCompare={handleAddToCompare} 
                  compareList={compareList} 
                />
              } 
            />
            <Route 
              path="/shop" 
              element={
                <Shop 
                  onAddToCart={handleAddToCart} 
                  onAddToCompare={handleAddToCompare} 
                  compareList={compareList} 
                />
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                <ProductDetail 
                  onAddToCart={handleAddToCart} 
                  onAddToCompare={handleAddToCompare} 
                  compareList={compareList} 
                />
              } 
            />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cart={cart} 
                  onUpdateQuantity={handleUpdateQuantity} 
                  onRemoveFromCart={handleRemoveFromCart} 
                />
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <Checkout 
                  cart={cart} 
                  user={user}
                  onClearCart={handleClearCart} 
                  onAddOrder={handleAddOrder} 
                />
              } 
            />
            <Route 
              path="/compare" 
              element={
                <Compare 
                  compareList={compareList} 
                  onRemoveFromCompare={handleRemoveFromCompare} 
                  onAddToCart={handleAddToCart} 
                  onAddToCompare={handleAddToCompare}
                />
              } 
            />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route 
              path="/profile" 
              element={
                <Profile 
                  user={user} 
                  onLogin={handleLogin} 
                  onUpdateProfile={handleUpdateProfile} 
                  orders={orders} 
                />
              } 
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Lỗi 404 */}
            <Route path="*" element={
              <div className="container text-center py-5 my-5 bg-white shadow-sm rounded-lg" style={{ borderRadius: '16px' }}>
                <h2 className="fw-bold text-secondary font-weight-bold">404 - KHÔNG TÌM THẤY TRANG</h2>
                <p className="text-muted small">Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển.</p>
                <Link to="/" className="btn btn-primary btn-sm mt-3 px-4 font-weight-bold" style={{ borderRadius: '20px' }}>Quay lại Trang Chủ</Link>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer chân trang */}
        <Footer />

        {/* 3. FLOAT COMPARE WIDGET (Hiển thị nổi khi đang lựa chọn so sánh máy) */}
        {compareList.length > 0 && (
          <div className="compare-widget-bar animated fadeInUp">
            <div className="d-flex align-items-center gap-2">
              <span className="small font-weight-bold mr-2"><i className="fa-solid fa-code-compare mr-1"></i> So sánh ({compareList.length}):</span>
              <div className="d-flex gap-2">
                {compareList.map(item => (
                  <div key={item.id} className="compare-widget-thumb" title={item.name}>
                    <img 
                      src={getImageUrl(item.imageUrl)} 
                      alt={item.name} 
                    />
                    <button 
                      type="button" 
                      className="btn-remove-compare" 
                      onClick={() => handleRemoveFromCompare(item.id)}
                    >&times;</button>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/compare" className="btn btn-warning btn-sm font-weight-bold ml-3 text-dark px-3" style={{ borderRadius: '20px' }}>
              So Sánh Ngay <i className="fa-solid fa-arrow-right ml-1"></i>
            </Link>
          </div>
        )}

        {/* 4. FLOATING CONTACT ACTIONS (Zalo, Hotline, Scroll to Top) */}
        <div className="floating-contact-widgets">
          {/* Hotline */}
          <a href="tel:0909888999" className="contact-widget-btn widget-hotline" title="Gọi Hotline: 0909.888.999">
            <i className="fa-solid fa-phone"></i>
          </a>
          
          {/* Chat Zalo giả lập */}
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Liên hệ hỗ trợ qua Zalo: 0909.888.999"); }} className="contact-widget-btn widget-zalo" title="Chat Zalo ngay">
            <i className="fa-solid fa-comment-sms"></i>
          </a>

          {/* Scroll to Top */}
          {showScrollBtn && (
            <button 
              type="button" 
              className="contact-widget-btn widget-scrolltop border-0 animated fadeIn" 
              onClick={scrollToTop} 
              title="Cuộn lên đầu trang"
            >
              <i className="fa-solid fa-angle-up"></i>
            </button>
          )}
        </div>

      </div>
    </Router>
  );
}

export default App;