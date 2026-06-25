// File: src/pages/cart/index.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../api/axiosClient';

function Cart({ cart = [], onUpdateQuantity, onRemoveFromCart }) {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCouponValid, setIsCouponValid] = useState(false);

  // Áp dụng mã giảm giá giả lập
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    
    if (code === 'HUNGMB2123') {
      setDiscount(500000); // Giảm 500.000đ
      setCouponMessage('Áp dụng thành công mã sinh viên HUNGMB2123: Giảm 500.000đ!');
      setIsCouponValid(true);
    } else if (code === 'GIAMSOC') {
      setDiscount(1000000); // Giảm 1.000.000đ
      setCouponMessage('Áp dụng thành công mã GIAMSOC: Giảm 1.000.000đ!');
      setIsCouponValid(true);
    } else {
      setDiscount(0);
      setCouponMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      setIsCouponValid(false);
    }
  };

  // Tính tổng tiền hàng
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = Math.max(0, subtotal - discount);

  // Định dạng tiền VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Xử lý link hình ảnh
  const getProductImage = (url) => {
    return getImageUrl(url);
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center my-5 bg-white rounded-lg shadow-sm">
        <div className="mb-4" style={{ fontSize: '72px', color: 'var(--secondary)' }}>
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
        <h4 className="font-weight-bold text-dark mb-2">Giỏ hàng của bạn đang trống!</h4>
        <p className="text-muted small">Hãy lấp đầy giỏ hàng bằng những siêu phẩm công nghệ đỉnh cao ngay.</p>
        <Link to="/shop" className="btn btn-primary btn-sm px-4 py-2 mt-3 font-weight-bold" style={{ borderRadius: '25px' }}>
          Quay lại Cửa Hàng ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Tiến độ mua hàng */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4 d-flex justify-content-around text-center" style={{ fontSize: '13.5px' }}>
        <div className="font-weight-bold text-primary">
          <span className="badge badge-primary mr-2" style={{ borderRadius: '50%' }}>1</span>
          Giỏ Hàng Của Bạn
        </div>
        <div className="text-muted">
          <span className="badge badge-secondary mr-2" style={{ borderRadius: '50%' }}>2</span>
          Địa Chỉ Thanh Toán
        </div>
        <div className="text-muted">
          <span className="badge badge-secondary mr-2" style={{ borderRadius: '50%' }}>3</span>
          Đặt Hàng Thành Công
        </div>
      </div>

      <div className="row">
        
        {/* CỘT TRÁI - DANH SÁCH GIỎ HÀNG */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
            <h5 className="font-weight-bold text-dark mb-4">Danh sách sản phẩm chọn mua ({cart.length})</h5>
            
            <div className="table-responsive">
              <table className="table table-align-middle" style={{ fontSize: '14px' }}>
                <thead>
                  <tr className="text-secondary">
                    <th>Sản phẩm</th>
                    <th>Phiên bản</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-right">Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={`${item.id}-${item.selectedColor}-${item.selectedStorage}`}>
                      
                      {/* Ảnh & Tên */}
                      <td style={{ minWidth: '220px' }}>
                        <div className="d-flex align-items-center">
                          <img 
                            src={getProductImage(item.imageUrl)} 
                            alt={item.name} 
                            className="mr-3 rounded border"
                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/60?text=Phone";
                            }}
                          />
                          <div>
                            <Link to={`/product/${item.id}`} className="text-dark font-weight-bold text-decoration-none d-block">
                              {item.name}
                            </Link>
                            <small className="text-muted d-block">{formatVND(item.price)}</small>
                          </div>
                        </div>
                      </td>

                      {/* Phân loại lựa chọn màu/dung lượng */}
                      <td>
                        <span className="badge badge-light border d-block mb-1 font-weight-normal text-left">Màu: {item.selectedColor}</span>
                        <span className="badge badge-light border d-block font-weight-normal text-left">Dung lượng: {item.selectedStorage}</span>
                      </td>

                      {/* Tăng giảm số lượng */}
                      <td className="text-center" style={{ width: '120px' }}>
                        <div className="input-group input-group-sm">
                          <div className="input-group-prepend">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.selectedStorage, -1)}
                            >-</button>
                          </div>
                          <input 
                            type="text" 
                            className="form-control text-center bg-white" 
                            value={item.quantity} 
                            readOnly 
                          />
                          <div className="input-group-append">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.selectedStorage, 1)}
                            >+</button>
                          </div>
                        </div>
                      </td>

                      {/* Tổng tiền của máy này */}
                      <td className="text-right font-weight-bold text-danger" style={{ minWidth: '110px' }}>
                        {formatVND(item.price * item.quantity)}
                      </td>

                      {/* Nút xóa */}
                      <td className="text-right">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm border-0"
                          onClick={() => onRemoveFromCart(item.id, item.selectedColor, item.selectedStorage)}
                          title="Xóa sản phẩm"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <Link to="/shop" className="btn btn-outline-primary btn-sm font-weight-bold" style={{ borderRadius: '20px' }}>
                <i className="fa-solid fa-arrow-left mr-2"></i>Tiếp tục mua hàng
              </Link>
            </div>

          </div>
        </div>

        {/* CỘT PHẢI - TÓM TẮT ĐƠN HÀNG & MÃ KHUYẾN MÃI */}
        <div className="col-lg-4">
          
          {/* Mã giảm giá */}
          <div className="card border-0 shadow-sm p-4 bg-white mb-4" style={{ borderRadius: '16px' }}>
            <h6 className="font-weight-bold text-dark mb-3"><i className="fa-solid fa-ticket text-danger mr-2"></i>Mã giảm giá (Voucher)</h6>
            <form onSubmit={handleApplyCoupon} className="input-group input-group-sm">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nhập HUNGMB2123, GIAMSOC..." 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <div className="input-group-append">
                <button className="btn btn-danger font-weight-bold" type="submit">Áp dụng</button>
              </div>
            </form>
            {couponMessage && (
              <div className={`mt-2 small font-weight-bold ${isCouponValid ? 'text-success' : 'text-danger'}`}>
                {couponMessage}
              </div>
            )}
            <small className="text-muted d-block mt-2">💡 Gợi ý: Gõ <b>HUNGMB2123</b> (Mã sinh viên của Hùng) để được tặng 500k.</small>
          </div>

          {/* Tóm tắt tiền */}
          <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
            <h6 className="font-weight-bold text-dark mb-4 pb-2 border-bottom">Thông tin thanh toán</h6>
            
            <div className="d-flex justify-content-between mb-3 text-secondary small">
              <span>Tổng tiền hàng:</span>
              <span className="font-weight-bold text-dark">{formatVND(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="d-flex justify-content-between mb-3 text-secondary small">
                <span>Giảm giá voucher:</span>
                <span className="font-weight-bold text-success">-{formatVND(discount)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-3 text-secondary small">
              <span>Phí vận chuyển:</span>
              <span className="font-weight-bold text-success">Miễn phí giao hàng</span>
            </div>

            <div className="d-flex justify-content-between mb-4 pt-3 border-top">
              <span className="font-weight-bold text-dark">Thành tiền cần trả:</span>
              <span className="font-weight-bold text-danger" style={{ fontSize: '20px' }}>{formatVND(grandTotal)}</span>
            </div>

            <button 
              type="button" 
              className="btn btn-danger btn-block btn-lg buy-now-btn-pulse font-weight-bold text-uppercase"
              style={{ borderRadius: '10px', fontSize: '15px' }}
              onClick={() => navigate('/checkout')}
            >
              Tiến hành thanh toán <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Cart;
