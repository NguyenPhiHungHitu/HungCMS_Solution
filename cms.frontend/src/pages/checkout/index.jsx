// File: src/pages/checkout/index.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient, { getImageUrl } from '../../api/axiosClient';

function Checkout({ cart = [], user = null, onClearCart, onAddOrder }) {
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [address, setAddress] = useState(user ? user.address : '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'BANK', 'MOMO'
  
  // Trạng thái thành công
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Tính tiền
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Hỗ trợ giảm giá voucher mặc định từ giỏ hàng nếu có (ta xem như không đổi hoặc giả lập coupon giảm giá từ giỏ hàng)
  // Để đồng bộ, nếu giỏ hàng lớn hơn 20 triệu, tự động giảm thêm 500k cho khách hàng
  const discount = subtotal > 20000000 ? 500000 : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  // Xử lý gửi đơn hàng
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    const orderId = "HUNGMB-" + Math.floor(100000 + Math.random() * 900000);
    
    // Tạo cấu trúc chi tiết đơn hàng cho backend
    const orderDetailsPayload = cart.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.price
    }));

    const orderPayload = {
      customerId: user ? user.id : 1, // Lấy ID tài khoản thật của khách hàng trong DB
      notes: notes || "Đặt hàng từ ReactJS",
      orderDetails: orderDetailsPayload
    };

    // Gọi API lưu đơn hàng vào SQL Server
    axiosClient.post('/Orders/checkout', orderPayload)
      .then(res => {
        const backendOrder = res.data ? res.data : res;
        const details = {
          id: backendOrder.orderId ? String(backendOrder.orderId) : orderId,
          date: new Date().toISOString(),
          fullName,
          phone,
          address,
          notes,
          paymentMethod,
          items: [...cart],
          discount,
          totalAmount: grandTotal,
          status: "Chờ duyệt"
        };
        
        onAddOrder(details);
        setCreatedOrder(details);
        setIsSuccess(true);
        onClearCart();
      })
      .catch(err => {
        console.error("Lỗi đồng bộ đặt hàng lên Database, chuyển sang chế độ Offline:", err);
        // Chế độ dự phòng offline khi backend chưa chạy
        const details = {
          id: orderId,
          date: new Date().toISOString(),
          fullName,
          phone,
          address,
          notes,
          paymentMethod,
          items: [...cart],
          discount,
          totalAmount: grandTotal,
          status: "Đang xử lý (Chờ xác nhận)"
        };
        onAddOrder(details);
        setCreatedOrder(details);
        setIsSuccess(true);
        onClearCart();
      });
  };

  // Format tiền VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Yêu cầu đăng nhập trước để lấy CustomerId thật
  if (!user && !isSuccess) {
    return (
      <div className="container py-5 text-center my-5 bg-white rounded shadow-sm" style={{ borderRadius: '16px', maxWidth: '600px' }}>
        <div className="text-warning mb-4" style={{ fontSize: '64px' }}>
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h4 className="font-weight-bold text-dark mb-2">Yêu cầu đăng nhập tài khoản!</h4>
        <p className="text-muted small">Quý khách vui lòng đăng nhập hoặc tạo tài khoản mới để đặt hàng và liên kết với hệ thống quản trị Admin.</p>
        <Link to="/profile" className="btn btn-primary btn-sm mt-3 px-4 py-2 font-weight-bold" style={{ borderRadius: '25px' }}>
          Đăng nhập / Đăng ký tài khoản ngay
        </Link>
      </div>
    );
  }

  // Giao diện khi đặt hàng thành công
  if (isSuccess && createdOrder) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow p-5 bg-white text-center mx-auto" style={{ maxWidt: '600px', borderRadius: '16px' }}>
          <div className="text-success mb-4" style={{ fontSize: '72px' }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h3 className="font-weight-bold text-dark mb-3">ĐẶT HÀNG THÀNH CÔNG!</h3>
          <p className="text-secondary small mb-4">
            Cảm ơn quý khách <b>{createdOrder.fullName}</b> đã mua sắm tại Hùng Mobile.<br />
            Mã đơn hàng của quý khách là: <span className="text-primary font-weight-bold">{createdOrder.id}</span>
          </p>

          <div className="p-4 bg-light rounded text-left mb-4 small" style={{ fontSize: '13.5px' }}>
            <div className="font-weight-bold mb-2">Thông tin đơn hàng của bạn:</div>
            <div className="mb-1"><b>Người nhận:</b> {createdOrder.fullName} - {createdOrder.phone}</div>
            <div className="mb-1"><b>Địa chỉ nhận hàng:</b> {createdOrder.address}</div>
            <div className="mb-1"><b>Hình thức thanh toán:</b> {
              createdOrder.paymentMethod === 'COD' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' :
              createdOrder.paymentMethod === 'BANK' ? 'Chuyển khoản qua ngân hàng' : 'Ví điện tử Momo'
            }</div>
            <div><b>Tổng số tiền thanh toán:</b> <span className="text-danger font-weight-bold">{formatVND(createdOrder.totalAmount)}</span></div>
          </div>

          <p className="text-muted small mb-4">
            💡 Nhân viên chăm sóc khách hàng của Hùng Mobile sẽ liên hệ lại qua số điện thoại của bạn trong vòng 15 phút để xác nhận lại thông tin giao hàng.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/shop" className="btn btn-outline-primary font-weight-bold" style={{ borderRadius: '20px' }}>
              Tiếp tục mua sắm
            </Link>
            <Link to="/profile" className="btn btn-primary font-weight-bold" style={{ borderRadius: '20px' }}>
              Kiểm tra đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Nếu giỏ hàng trống và chưa đặt hàng thành công
  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center my-5 bg-white rounded shadow-sm">
        <h4 className="font-weight-bold text-secondary">Bạn không có sản phẩm nào để thanh toán!</h4>
        <Link to="/shop" className="btn btn-primary btn-sm mt-3 px-4 font-weight-bold">Quay lại Cửa Hàng</Link>
      </div>
    );
  }

  // Đường link tạo VietQR thật sự
  // Ngân hàng VietinBank (970415), Số tài khoản 1133668899, Tên tài khoản NGUYEN PHI HUNG
  const qrUrl = `https://api.vietqr.io/image/970415-1133668899-qr_only.png?amount=${grandTotal}&addInfo=HUNGMB%20PAYMENT&accountName=NGUYEN%20PHI%20HUNG`;

  return (
    <div className="container mt-4">
      {/* Tiến độ mua hàng */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4 d-flex justify-content-around text-center" style={{ fontSize: '13.5px' }}>
        <div className="text-muted">
          <span className="badge badge-secondary mr-2" style={{ borderRadius: '50%' }}>1</span>
          Giỏ Hàng Của Bạn
        </div>
        <div className="font-weight-bold text-primary">
          <span className="badge badge-primary mr-2" style={{ borderRadius: '50%' }}>2</span>
          Địa Chỉ Thanh Toán
        </div>
        <div className="text-muted">
          <span className="badge badge-secondary mr-2" style={{ borderRadius: '50%' }}>3</span>
          Đặt Hàng Thành Công
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="row">
          
          {/* CỘT TRÁI - NHẬP THÔNG TIN VÀ CHỌN THANH TOÁN */}
          <div className="col-lg-7 mb-4">
            
            {/* Nhập địa chỉ nhận hàng */}
            <div className="card border-0 shadow-sm p-4 bg-white mb-4" style={{ borderRadius: '16px' }}>
              <h5 className="font-weight-bold text-dark mb-4 pb-2 border-bottom">
                <i className="fa-solid fa-map-location-dot text-primary mr-2"></i>Thông tin nhận hàng
              </h5>
              
              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Họ và tên người nhận <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nhập đầy đủ họ và tên..." 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Số điện thoại liên hệ <span className="text-danger">*</span></label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="Nhập số điện thoại nhận hàng..." 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Địa chỉ giao hàng <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Ghi chú giao hàng (Không bắt buộc)</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Ví dụ: Giao hàng vào giờ hành chính, gọi trước khi đến..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Chọn hình thức thanh toán */}
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
              <h5 className="font-weight-bold text-dark mb-4 pb-2 border-bottom">
                <i className="fa-solid fa-credit-card text-primary mr-2"></i>Phương thức thanh toán
              </h5>

              <div className="list-group list-group-flush mb-4">
                
                {/* COD */}
                <label className="list-group-item d-flex align-items-center cursor-pointer border-0 py-3 mb-2 rounded bg-light" style={{ borderLeft: paymentMethod === 'COD' ? '4px solid var(--primary)' : 'none' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="mr-3" 
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div>
                    <span className="font-weight-bold text-dark small d-block">COD - Nhận hàng rồi mới thanh toán tiền mặt</span>
                    <span className="text-muted small">Phù hợp khi bạn muốn kiểm tra máy trước rồi mới đưa tiền cho Shipper.</span>
                  </div>
                </label>

                {/* Chuyển khoản ngân hàng (Hiện QR VietQR động) */}
                <label className="list-group-item d-flex align-items-center cursor-pointer border-0 py-3 mb-2 rounded bg-light" style={{ borderLeft: paymentMethod === 'BANK' ? '4px solid var(--primary)' : 'none' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="mr-3" 
                    checked={paymentMethod === 'BANK'}
                    onChange={() => setPaymentMethod('BANK')}
                  />
                  <div>
                    <span className="font-weight-bold text-dark small d-block">Chuyển khoản qua tài khoản ngân hàng (Có VietQR)</span>
                    <span className="text-muted small">Quét mã QR chuyển khoản nhanh 24/7 siêu tiện lợi.</span>
                  </div>
                </label>

                {/* Ví Momo */}
                <label className="list-group-item d-flex align-items-center cursor-pointer border-0 py-3 rounded bg-light" style={{ borderLeft: paymentMethod === 'MOMO' ? '4px solid var(--primary)' : 'none' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="mr-3" 
                    checked={paymentMethod === 'MOMO'}
                    onChange={() => setPaymentMethod('MOMO')}
                  />
                  <div>
                    <span className="font-weight-bold text-dark small d-block">Thanh toán bằng Ví điện tử Momo</span>
                    <span className="text-muted small">Hỗ trợ quét qua ứng dụng ví điện tử Momo nhanh chóng.</span>
                  </div>
                </label>

              </div>

              {/* Giao diện phụ khi chọn Chuyển khoản BANK */}
              {paymentMethod === 'BANK' && (
                <div className="qr-payment-box animated fadeIn">
                  <h6 className="font-weight-bold text-dark mb-2">QUÉT MÃ QR ĐỂ THANH TOÁN ĐƠN HÀNG</h6>
                  <p className="text-secondary small">
                    Hãy sử dụng ứng dụng Ngân hàng (Mobile Banking) quét mã VietQR bên dưới để thực hiện chuyển khoản.
                  </p>
                  
                  {/* Mã QR sinh tự động */}
                  <div className="qr-code-placeholder">
                    <img src={qrUrl} alt="VietQR VietinBank Nguyễn Phi Hùng" />
                  </div>
                  
                  <div className="text-left font-weight-normal text-secondary small bg-white p-3 rounded border">
                    <div><b>Tên ngân hàng:</b> VietinBank (Ngân hàng Công Thương Việt Nam)</div>
                    <div><b>Số tài khoản:</b> <span className="text-primary font-weight-bold">1133668899</span></div>
                    <div><b>Chủ tài khoản:</b> NGUYEN PHI HUNG</div>
                    <div><b>Nội dung chuyển khoản:</b> HUNGMB PAYMENT</div>
                  </div>
                </div>
              )}

              {/* Giao diện phụ khi chọn MOMO */}
              {paymentMethod === 'MOMO' && (
                <div className="qr-payment-box animated fadeIn">
                  <h6 className="font-weight-bold text-dark mb-2"><i className="fa-solid fa-wallet text-danger mr-2"></i>Ví điện tử MoMo</h6>
                  <p className="text-secondary small">Quét mã QR Momo dưới đây để chuyển khoản thanh toán:</p>
                  <div className="qr-code-placeholder" style={{ maxWidth: '180px', maxHeight: '180px' }}>
                    {/* QR Momo mẫu */}
                    <img src="https://api.vietqr.io/image/970415-1133668899-qr_only.png?amount=1&addInfo=MOMO" alt="Momo QR code" />
                  </div>
                  <div className="small text-secondary">
                    <b>Số điện thoại Momo:</b> 0909.888.999<br />
                    <b>Chủ tài khoản ví:</b> NGUYỄN PHI HÙNG
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* CỘT PHẢI - TÓM TẮT GIỎ HÀNG & NÚT ĐẶT HÀNG */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 bg-white sticky-top" style={{ borderRadius: '16px', top: '100px' }}>
              <h5 className="font-weight-bold text-dark mb-4 pb-2 border-bottom">Tóm tắt đơn hàng</h5>
              
              {/* Danh sách máy */}
              <div className="mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {cart.map((item) => (
                  <div className="d-flex align-items-center mb-3 border-bottom pb-2" key={`${item.id}-${item.selectedColor}-${item.selectedStorage}`}>
                    <img 
                      src={getImageUrl(item.imageUrl)} 
                      alt={item.name} 
                      className="rounded mr-2 border"
                      style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                    />
                    <div className="flex-grow-1 min-width-0">
                      <h7 className="font-weight-bold text-dark small text-truncate d-block">{item.name}</h7>
                      <small className="text-muted">{item.selectedColor} | {item.selectedStorage} x {item.quantity}</small>
                    </div>
                    <span className="font-weight-bold text-danger small ml-2">{formatVND(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Tính tiền chi tiết */}
              <div className="d-flex justify-content-between mb-2 text-secondary small">
                <span>Tổng tiền hàng:</span>
                <span className="font-weight-bold text-dark">{formatVND(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-secondary small">
                  <span>Khuyến mãi giảm giá:</span>
                  <span className="font-weight-bold text-success">-{formatVND(discount)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-3 text-secondary small">
                <span>Phí vận chuyển:</span>
                <span className="font-weight-bold text-success">Miễn phí</span>
              </div>

              <div className="d-flex justify-content-between mb-4 pt-3 border-top">
                <span className="font-weight-bold text-dark">Tổng tiền cần thanh toán:</span>
                <span className="font-weight-bold text-danger" style={{ fontSize: '18px' }}>{formatVND(grandTotal)}</span>
              </div>

              <button 
                type="submit" 
                className="btn btn-danger btn-block btn-lg buy-now-btn-pulse font-weight-bold text-uppercase"
                style={{ borderRadius: '10px', fontSize: '15px' }}
              >
                Xác nhận đặt hàng ngay
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

export default Checkout;
