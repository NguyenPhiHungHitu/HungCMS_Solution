// File: src/pages/contact/index.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setTitle('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white shadow-sm" style={{ borderRadius: '8px' }}>
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang Chủ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Liên Hệ Hùng Mobile</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm p-4 bg-white mb-5" style={{ borderRadius: '16px' }}>
        
        {/* Tiêu đề */}
        <div className="text-center mb-5 pb-3 border-bottom">
          <h2 className="font-weight-bold text-primary text-uppercase mb-2">LIÊN HỆ VỚI CHÚNG TÔI</h2>
          <p className="text-muted small">Mọi ý kiến đóng góp, phản hồi hoặc hỗ trợ kỹ thuật xin gửi theo thông tin bên dưới.</p>
        </div>

        <div className="row">
          
          {/* CỘT TRÁI - THÔNG TIN CHI NHÁNH & HOTLINE */}
          <div className="col-lg-5 mb-4 mb-lg-0 border-right">
            <h5 className="font-weight-bold text-dark mb-4"><i className="fa-solid fa-building text-primary mr-2"></i>Kênh liên hệ trực tiếp</h5>
            
            <div className="mb-4">
              <h6 className="font-weight-bold text-dark mb-1 small"><i className="fa-solid fa-map-location-dot mr-2 text-danger"></i>Địa chỉ trụ sở chính:</h6>
              <p className="text-secondary small mb-0 pl-4">Quận 9, TP. Hồ Chí Minh, Việt Nam</p>
            </div>

            <div className="mb-4">
              <h6 className="font-weight-bold text-dark mb-1 small"><i className="fa-solid fa-phone-volume mr-2 text-success"></i>Số điện thoại Hotline mua hàng:</h6>
              <p className="text-secondary small mb-0 pl-4"><b>0909.888.999</b> (Tư vấn miễn phí từ 8h00 - 21h30)</p>
            </div>

            <div className="mb-4">
              <h6 className="font-weight-bold text-dark mb-1 small"><i className="fa-solid fa-envelope-open-text mr-2 text-warning"></i>Email hỗ trợ dịch vụ:</h6>
              <p className="text-secondary small mb-0 pl-4">support@hungmobile.com</p>
            </div>

            <div className="mb-4">
              <h6 className="font-weight-bold text-dark mb-2 small"><i className="fa-solid fa-clock mr-2 text-info"></i>Thời gian mở cửa Showroom:</h6>
              <p className="text-secondary small mb-0 pl-4">Thứ 2 - Chủ Nhật: 8h30 - 21h00 (Kể cả ngày lễ tết)</p>
            </div>

            {/* Embed Google Map iframe */}
            <div className="rounded overflow-hidden shadow-sm" style={{ height: '220px', border: '1px solid #eee' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4854586938927!2d106.77259461141444!3d10.850632389255743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1d3918.4854586938927!2d106.77259461141444!3d10.850632389255743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f03f7e53%3A0xd32a9a7a9cc5f2c4!2sHCMC%20University%20of%20Technology%20and%20Education!5e0!3m2!1sen!2s!4v1719234567890!5m2!1sen!2s"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ chỉ đường Hùng Mobile"
              ></iframe>
            </div>
          </div>

          {/* CỘT PHẢI - FORM GỬI THƯ GÓP Ý */}
          <div className="col-lg-7 pl-lg-4">
            <h5 className="font-weight-bold text-dark mb-4"><i className="fa-solid fa-paper-plane text-primary mr-2"></i>Gửi phản hồi cho chúng tôi</h5>
            
            {submitted && (
              <div className="alert alert-success py-2 font-weight-bold animated fadeIn">
                Gửi câu hỏi thành công! Ban biên trị Hùng Mobile sẽ liên hệ phản hồi lại bạn sớm nhất.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Họ và tên <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Nhập họ tên của bạn..." 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Địa chỉ Email liên hệ <span className="text-danger">*</span></label>
                <input 
                  type="email" 
                  className="form-control form-control-sm" 
                  placeholder="nhapemail@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Tiêu đề phản hồi</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Hỏi về bảo hành, trả góp, giá cả..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label className="small font-weight-bold text-secondary">Nội dung câu hỏi <span className="text-danger">*</span></label>
                <textarea 
                  className="form-control form-control-sm" 
                  rows="5" 
                  placeholder="Gõ nội dung câu hỏi chi tiết..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary font-weight-bold px-4" style={{ borderRadius: '8px' }}>
                Gửi liên hệ phản hồi
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Contact;
