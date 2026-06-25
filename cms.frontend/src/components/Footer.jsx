// File: src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-dark text-light pt-5 mt-5 border-top">
      <div className="container pb-4">
        <div className="row">
          
          {/* Cột 1: Thông tin thương hiệu & Bản quyền sinh viên */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h4 className="font-weight-bold mb-3 text-primary d-flex align-items-center">
              <i className="fa-solid fa-mobile-screen-button mr-2"></i>
              <span>HUNG MOBILE</span>
            </h4>
            <p className="text-muted text-justify small" style={{ lineHeight: '1.6' }}>
              Hệ thống bán lẻ Smartphone & Phụ kiện công nghệ chính hãng hàng đầu.
              Chúng tôi cam kết mang đến những siêu phẩm công nghệ chất lượng cao, 
              mức giá cạnh tranh cùng chế độ bảo hành 1 đổi 1 tốt nhất thị trường.
            </p>
            <div className="mt-3 p-3 bg-secondary rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderLeft: '3px solid var(--primary)' }}>
              <div className="small font-weight-bold text-white mb-1">DỰ ÁN XÂY DỰNG FRONT-END:</div>
              <div className="small text-muted">Họ & Tên: <span className="text-light">Nguyễn Phi Hùng</span></div>
              <div className="small text-muted">Mã số sinh viên: <span className="text-light">2123110475</span></div>
            </div>
          </div>

          {/* Cột 2: Đường dẫn nhanh */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase font-weight-bold mb-3 text-white">Khám Phá</h6>
            <ul className="list-unstyled mb-0" style={{ fontSize: '14px' }}>
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none hover-text-primary"><i className="fa-solid fa-angle-right mr-1 small"></i> Trang Chủ</Link></li>
              <li className="mb-2"><Link to="/shop" className="text-muted text-decoration-none hover-text-primary"><i className="fa-solid fa-angle-right mr-1 small"></i> Cửa Hàng</Link></li>
              <li className="mb-2"><Link to="/blog" className="text-muted text-decoration-none hover-text-primary"><i className="fa-solid fa-angle-right mr-1 small"></i> Tin Công Nghệ</Link></li>
              <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none hover-text-primary"><i className="fa-solid fa-angle-right mr-1 small"></i> Giới Thiệu</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-muted text-decoration-none hover-text-primary"><i className="fa-solid fa-angle-right mr-1 small"></i> Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-uppercase font-weight-bold mb-3 text-white">Chính Sách Hỗ Trợ</h6>
            <ul className="list-unstyled mb-0" style={{ fontSize: '14px' }}>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none"><i className="fa-solid fa-circle-check mr-1 text-primary small"></i> Bảo hành 12 tháng chính hãng</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none"><i className="fa-solid fa-truck-fast mr-1 text-primary small"></i> Giao hàng siêu tốc 2H</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none"><i className="fa-solid fa-percent mr-1 text-primary small"></i> Trả góp lãi suất 0%</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none"><i className="fa-solid fa-shield-halved mr-1 text-primary small"></i> Đổi mới 30 ngày lỗi phần cứng</a></li>
            </ul>
            <div className="mt-3">
              <h7 className="text-white font-weight-bold small d-block mb-2">Liên kết mạng xã hội:</h7>
              <div className="d-flex gap-2">
                <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fab fa-youtube"></i></a>
                <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
          </div>

          {/* Cột 4: Đăng ký nhận tin tức & Kênh thanh toán */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-uppercase font-weight-bold mb-3 text-white">Đăng ký khuyến mãi</h6>
            <p className="text-muted small">Đăng ký để nhận những thông báo giảm giá sốc sớm nhất tại Hùng Mobile.</p>
            <form onSubmit={handleSubscribe} className="input-group mb-3">
              <input 
                type="email" 
                className="form-control form-control-sm" 
                placeholder="Email của bạn..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="input-group-append">
                <button className="btn btn-primary btn-sm" type="submit">Gửi</button>
              </div>
            </form>
            {subscribed && (
              <div className="alert alert-success py-1 px-2 small mb-3">Đăng ký thành công!</div>
            )}
            
            <h7 className="text-white font-weight-bold small d-block mb-2">Hình thức thanh toán:</h7>
            <div className="d-flex gap-2 flex-wrap text-muted" style={{ fontSize: '24px' }}>
              <i className="fab fa-cc-visa text-white-50" title="Visa"></i>
              <i className="fab fa-cc-mastercard text-white-50" title="Mastercard"></i>
              <i className="fa-solid fa-qrcode text-white-50" title="QR Pay"></i>
              <i className="fa-solid fa-wallet text-white-50" title="Ví điện tử MoMo / ZaloPay"></i>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="py-3 text-center" style={{ backgroundColor: '#16191c', fontSize: '13px' }}>
        <div className="container">
          <p className="m-0 text-muted">
            &copy; {new Date().getFullYear()} Hung Mobile. Thiết kế & phát triển bởi Nguyễn Phi Hùng (MSSV: 2123110475). Tất cả quyền lợi được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;