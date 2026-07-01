// File: src/pages/profile/index.jsx
import React, { useState, useEffect } from 'react';
import customerService from '../../services/customerService';

function Profile({ user = null, onLogin, onUpdateProfile, orders = [] }) {
  const [activeTab, setActiveTab] = useState('INFO'); // 'INFO', 'ORDERS', 'PASSWORD'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Trạng thái Form
  const [profileName, setProfileName] = useState(user ? user.name : '');
  const [profilePhone, setProfilePhone] = useState(user ? user.phone : '');
  const [profileAddress, setProfileAddress] = useState(user ? user.address : '');
  const [updateMessage, setUpdateMessage] = useState('');

  // Trạng thái đổi mật khẩu
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  // Trạng thái Đăng ký (Register)
  const [isLoginView, setIsLoginView] = useState(true);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regMessage, setRegMessage] = useState('');

  // Trạng thái Quên mật khẩu
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      setForgotMessage('Đang xử lý yêu cầu khôi phục mật khẩu...');
      setForgotSuccess(false);
      const res = await customerService.forgotPassword(forgotEmail.trim());
      setForgotSuccess(true);
      setForgotMessage(res.message);
    } catch (err) {
      setForgotSuccess(false);
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi khôi phục mật khẩu. Vui lòng thử lại!';
      setForgotMessage(errorMsg);
    }
  };

  // Danh sách đơn hàng thực tế tải từ Database
  const [ordersList, setOrdersList] = useState([]);

  // Tải danh sách đơn hàng từ database khi có phiên đăng nhập của User
  useEffect(() => {
    if (user && user.id) {
      customerService.getOrders(user.id)
        .then(data => setOrdersList(data))
        .catch(err => {
          console.error("Lỗi lấy đơn hàng từ backend:", err);
          setOrdersList([]);
        });
    } else {
      setOrdersList([]);
    }
  }, [user, activeTab]);

  // Đăng nhập kết nối database
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim() && passwordInput.trim()) {
      customerService.login(emailInput, passwordInput)
        .then(res => {
          onLogin(res);
          setProfileName(res.name);
          setProfilePhone(res.phone || '');
          setProfileAddress(res.address || '');
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  // Đăng ký kết nối database
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setRegMessage('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    customerService.register(regName, regEmail, regPhone, regPassword)
      .then(res => {
        alert(res.message || "Đăng ký tài khoản thành công!");
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegMessage('');
        setIsLoginView(true);
      })
      .catch(err => {
        setRegMessage(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký!');
      });
  };

  // Cập nhật thông tin hồ sơ kết nối database
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (profileName.trim() && user?.id) {
      customerService.update(user.id, profileName, profilePhone, profileAddress)
        .then(res => {
          onUpdateProfile(res);
          setUpdateMessage('Cập nhật thông tin tài khoản thành công!');
          setTimeout(() => setUpdateMessage(''), 3000);
        })
        .catch(err => {
          setUpdateMessage('Không cập nhật được thông tin!');
          setTimeout(() => setUpdateMessage(''), 3000);
        });
    }
  };

  // Đổi mật khẩu thực tế từ Backend
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setPassMessage('Bạn cần đăng nhập để thực hiện đổi mật khẩu!');
      return;
    }
    if (newPass !== confirmPass) {
      setPassMessage('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    try {
      setPassMessage('Đang cập nhật mật khẩu mới...');
      const res = await customerService.changePassword(user.id, oldPass, newPass);
      setPassMessage(res.message || 'Đổi mật khẩu thành công!');
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!';
      setPassMessage(errorMsg);
    }
  };

  // Định dạng VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // NẾU CHƯA ĐĂNG NHẬP: Hiển thị form login/register chuyên nghiệp
  if (!user) {
    if (isForgotView) {
      return (
        <div className="container py-5">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '420px', borderRadius: '16px' }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="font-weight-bold text-primary"><i className="fa-solid fa-key mr-2"></i>QUÊN MẬT KHẨU</h3>
                <p className="text-muted small">Nhập email để nhận liên kết đặt lại mật khẩu</p>
              </div>

              {forgotMessage && (
                <div className={`alert ${forgotSuccess ? 'alert-success' : 'alert-danger'} py-2 small`}>
                  {forgotMessage}
                </div>
              )}

              <form onSubmit={handleForgotSubmit}>
                <div className="form-group mb-4">
                  <label className="small font-weight-bold text-secondary">Địa chỉ Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="nhapemail@gmail.com" 
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg font-weight-bold mb-3" style={{ borderRadius: '10px', fontSize: '15px' }}>
                  GỬI YÊU CẦU ĐẶT LẠI
                </button>
              </form>

              <div className="text-center small">
                <button type="button" className="btn btn-link p-0 font-weight-bold text-decoration-none" onClick={() => { setIsForgotView(false); setIsLoginView(true); setForgotMessage(''); setForgotSuccess(false); }}>
                  Quay lại Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isLoginView) {
      return (
        <div className="container py-5">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '420px', borderRadius: '16px' }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="font-weight-bold text-primary"><i className="fa-solid fa-user-lock mr-2"></i>ĐĂNG NHẬP</h3>
                <p className="text-muted small">Đăng nhập tài khoản Hùng Mobile của bạn</p>
              </div>
              
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group mb-3">
                  <label className="small font-weight-bold text-secondary">Địa chỉ Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="nhapemail@gmail.com" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required 
                  />
                </div>
  
                <div className="form-group mb-4">
                  <label className="small font-weight-bold text-secondary">Mật khẩu tài khoản</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required 
                  />
                </div>
  
                <button type="submit" className="btn btn-primary btn-block btn-lg font-weight-bold" style={{ borderRadius: '10px', fontSize: '15px' }}>
                  ĐĂNG NHẬP NGAY
                </button>
              </form>
  
              <div className="d-flex justify-content-between mt-3 small">
                <div>
                  <span>Chưa có tài khoản? </span>
                  <button type="button" className="btn btn-link p-0 font-weight-bold text-decoration-none" onClick={() => setIsLoginView(false)}>Đăng ký ngay</button>
                </div>
                <div>
                  <button type="button" className="btn btn-link p-0 font-weight-bold text-decoration-none text-danger" onClick={() => setIsForgotView(true)}>Quên mật khẩu?</button>
                </div>
              </div>
  
              <div className="text-center mt-4 border-top pt-3 small text-secondary">
                💡 Mẹo nhỏ: Bạn có thể tự đăng ký một tài khoản mới và sử dụng tài khoản đó để đăng nhập thử nghiệm.
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container py-5">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '420px', borderRadius: '16px' }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h3 className="font-weight-bold text-primary"><i className="fa-solid fa-user-plus mr-2"></i>ĐĂNG KÝ</h3>
                <p className="text-muted small">Tạo tài khoản mua sắm mới tại Hùng Mobile</p>
              </div>
              
              {regMessage && (
                <div className="alert alert-danger py-2 small">{regMessage}</div>
              )}
  
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group mb-3">
                  <label className="small font-weight-bold text-secondary">Họ và tên <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nhập họ và tên..." 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="small font-weight-bold text-secondary">Địa chỉ Email <span className="text-danger">*</span></label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="nhapemail@gmail.com" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="small font-weight-bold text-secondary">Số điện thoại <span className="text-danger">*</span></label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="Nhập số điện thoại..." 
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required 
                  />
                </div>
  
                <div className="form-group mb-3">
                  <label className="small font-weight-bold text-secondary">Mật khẩu <span className="text-danger">*</span></label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="small font-weight-bold text-secondary">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••" 
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
  
                <button type="submit" className="btn btn-primary btn-block btn-lg font-weight-bold" style={{ borderRadius: '10px', fontSize: '15px' }}>
                  ĐĂNG KÝ TÀI KHOẢN
                </button>
              </form>
  
              <div className="text-center mt-3 small">
                <span>Đã có tài khoản? </span>
                <button type="button" className="btn btn-link p-0 font-weight-bold text-decoration-none" onClick={() => setIsLoginView(true)}>Đăng nhập</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white shadow-sm" style={{ borderRadius: '8px' }}>
          <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Trang Chủ</a></li>
          <li className="breadcrumb-item active" aria-current="page">Trang Cá Nhân</li>
        </ol>
      </nav>

      <div className="row">
        
        {/* THANH MENU CỘT TRÁI TRANG CÁ NHÂN */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm bg-white overflow-hidden" style={{ borderRadius: '16px' }}>
            {/* Header Avatar thông tin SV */}
            <div className="bg-primary p-4 text-center text-white">
              <div className="bg-white text-primary rounded-circle font-weight-bold mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                PH
              </div>
              <h6 className="font-weight-bold m-0">{user.name}</h6>
              <small className="text-white-50">Mã sinh viên: {user.mssv}</small>
            </div>

            {/* List group menu */}
            <div className="list-group list-group-flush" style={{ fontSize: '14px' }}>
              <button 
                type="button" 
                className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'INFO' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('INFO')}
              >
                <i className="fa-solid fa-address-card mr-3"></i> Thông tin cá nhân
              </button>
              <button 
                type="button" 
                className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'ORDERS' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('ORDERS')}
              >
                <i className="fa-solid fa-box-archive mr-3"></i> Lịch sử đơn hàng
                {ordersList.length > 0 && <span className="badge badge-danger badge-pill ml-auto">{ordersList.length}</span>}
              </button>
              <button 
                type="button" 
                className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'PASSWORD' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('PASSWORD')}
              >
                <i className="fa-solid fa-key mr-3"></i> Thay đổi mật khẩu
              </button>
            </div>

          </div>
        </div>

        {/* CỘT PHẢI - NỘI DUNG CHI TIẾT THEO TAB */}
        <div className="col-lg-9">
          
          {/* TAB 1: Thông tin cá nhân */}
          {activeTab === 'INFO' && (
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
              <h5 className="font-weight-bold text-dark mb-4 pb-2 border-bottom">Hồ sơ thông tin cá nhân</h5>
              
              {updateMessage && (
                <div className="alert alert-success py-2">{updateMessage}</div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="small font-weight-bold text-secondary">Họ và tên của bạn</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="small font-weight-bold text-secondary">Mã số sinh viên (MSSV)</label>
                    <input 
                      type="text" 
                      className="form-control bg-light" 
                      value={user.mssv} 
                      disabled 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group">
                    <label className="small font-weight-bold text-secondary">Địa chỉ Email đăng nhập</label>
                    <input 
                      type="email" 
                      className="form-control bg-light" 
                      value={user.email} 
                      disabled 
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="small font-weight-bold text-secondary">Số điện thoại liên hệ</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={profilePhone} 
                      onChange={(e) => setProfilePhone(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="small font-weight-bold text-secondary">Địa chỉ nhận hàng mặc định</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profileAddress} 
                    onChange={(e) => setProfileAddress(e.target.value)} 
                  />
                </div>

                <button type="submit" className="btn btn-primary font-weight-bold px-4" style={{ borderRadius: '8px' }}>
                  Lưu thay đổi thông tin
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Lịch sử đơn hàng */}
          {activeTab === 'ORDERS' && (
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
              <h5 className="font-weight-bold text-dark mb-4 pb-2 border-bottom">Lịch sử đơn hàng mua sắm</h5>
              
              {ordersList.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover small" style={{ fontSize: '13px' }}>
                    <thead>
                      <tr className="text-secondary">
                        <th>Mã đơn hàng</th>
                        <th>Ngày đặt</th>
                        <th>Danh sách sản phẩm mua</th>
                        <th>Tổng tiền thanh toán</th>
                        <th>Trạng thái giao nhận</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersList.map((order) => (
                        <tr key={order.id}>
                          <td className="font-weight-bold text-primary">{order.id}</td>
                          <td>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <ul className="pl-3 mb-0" style={{ listStyleType: 'square' }}>
                              {order.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} ({item.selectedColor}, {item.selectedStorage}) x {item.quantity}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="font-weight-bold text-danger">{formatVND(order.totalAmount)}</td>
                          <td>
                            <span className="badge badge-warning text-dark py-1 px-2">{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <div className="mb-3" style={{ fontSize: '48px' }}><i className="fa-solid fa-box-open"></i></div>
                  <h6 className="font-weight-bold m-0">Bạn chưa mua sắm đơn hàng nào!</h6>
                  <p className="small mt-1">Hãy bắt đầu đặt hàng chiếc điện thoại yêu thích của bạn.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Đổi mật khẩu */}
          {activeTab === 'PASSWORD' && (
            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
              <h5 className="font-weight-bold text-dark mb-4 pb-2 border-bottom">Thay đổi mật khẩu đăng nhập</h5>
              
              {passMessage && (
                <div className={`alert ${passMessage.includes('thành công') ? 'alert-success' : 'alert-danger'} py-2`}>
                  {passMessage}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="small font-weight-bold text-secondary">Mật khẩu cũ của bạn</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Nhập mật khẩu hiện tại..." 
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="small font-weight-bold text-secondary">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Mật khẩu từ 6 ký tự trở lên..." 
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="small font-weight-bold text-secondary">Nhập lại mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Xác nhận lại mật khẩu mới..." 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary font-weight-bold px-4" style={{ borderRadius: '8px' }}>
                  Cập nhật mật khẩu mới
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Profile;
