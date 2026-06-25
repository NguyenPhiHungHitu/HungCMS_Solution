// File: src/pages/about/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white shadow-sm" style={{ borderRadius: '8px' }}>
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang Chủ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Giới Thiệu Hùng Mobile</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm p-5 bg-white mb-5" style={{ borderRadius: '16px' }}>
        
        {/* Tiêu đề */}
        <div className="text-center mb-5">
          <h2 className="font-weight-bold text-primary text-uppercase mb-3">
            HỆ THỐNG BÁN LẺ CÔNG NGHỆ HÙNG MOBILE
          </h2>
          <div className="mx-auto bg-primary mb-4" style={{ height: '3px', width: '80px' }}></div>
          <p className="text-muted leading-relaxed" style={{ fontSize: '1.1rem' }}>
            Uy tín tạo niềm tin - Mang siêu phẩm công nghệ chính hãng tới mọi người.
          </p>
        </div>

        {/* Lịch sử và Giới thiệu chung */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img 
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80" 
              alt="Hùng Mobile Showroom" 
              className="w-100 rounded shadow-sm"
              style={{ objectFit: 'cover', height: '300px' }}
            />
          </div>
          <div className="col-lg-6 pl-lg-5 text-secondary text-justify" style={{ lineHeight: '1.8' }}>
            <h4 className="font-weight-bold text-dark mb-3">Lịch sử phát triển</h4>
            <p>
              Được thành lập từ năm 2018, **Hùng Mobile** khởi đầu từ một cửa hàng nhỏ chuyên cung cấp điện thoại xách tay uy tín tại TP. Hồ Chí Minh.
              Nhờ sự tin yêu của quý khách hàng và nỗ lực nâng cao dịch vụ không ngừng nghỉ, chúng tôi tự hào đã phát triển thành hệ thống phân phối smartphone & phụ kiện chính hãng có quy mô lớn.
            </p>
            <p>
              Chúng tôi là đối tác đại lý ủy quyền của các thương hiệu hàng đầu: **Apple, Samsung, Xiaomi, Oppo**. 
              Hùng Mobile cam kết mang lại giá bán tốt nhất đi kèm chế độ bảo hành vàng độc quyền tốt nhất thị trường Việt Nam.
            </p>
          </div>
        </div>

        {/* Tầm nhìn - Sứ mệnh - Giá trị cốt lõi */}
        <div className="row text-center mb-5">
          <div className="col-md-4 mb-4">
            <div className="p-4 bg-light rounded-lg h-100">
              <div className="text-primary mb-3" style={{ fontSize: '32px' }}><i className="fa-solid fa-eye"></i></div>
              <h5 className="font-weight-bold text-dark mb-2">Tầm Nhìn</h5>
              <p className="text-secondary small mb-0 text-justify">
                Trở thành hệ thống bán lẻ smartphone số 1 khu vực miền Nam, tiên phong cung cấp giải pháp mua sắm trực tuyến kết hợp showroom trải nghiệm đẳng cấp 5 sao.
              </p>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="p-4 bg-light rounded-lg h-100">
              <div className="text-primary mb-3" style={{ fontSize: '32px' }}><i className="fa-solid fa-bullhorn"></i></div>
              <h5 className="font-weight-bold text-dark mb-2">Sứ Mệnh</h5>
              <p className="text-secondary small mb-0 text-justify">
                Đưa những sản phẩm công nghệ tiên tiến nhất tiếp cận người tiêu dùng với chi phí tối ưu nhất, đồng thời kiến tạo dịch vụ chăm sóc khách hàng trọn đời chu đáo nhất.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4 bg-light rounded-lg h-100">
              <div className="text-primary mb-3" style={{ fontSize: '32px' }}><i className="fa-solid fa-heart"></i></div>
              <h5 className="font-weight-bold text-dark mb-2">Giá Trị Cốt Lõi</h5>
              <p className="text-secondary small mb-0 text-justify">
                **Chính trực - Chuyên nghiệp - Khách hàng là trọng tâm**. Mọi hành động của nhân viên Hùng Mobile đều hướng tới bảo vệ lợi ích và sự an tâm tuyệt đối của khách hàng.
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin nhà phát triển đồ án */}
        <div className="bg-light p-4 rounded-lg border-left border-primary text-secondary">
          <h5 className="font-weight-bold text-dark mb-2"><i className="fa-solid fa-graduation-cap text-primary mr-2"></i>Dự án phát triển Front-end Web</h5>
          <p className="small mb-0" style={{ lineHeight: '1.6' }}>
            Trang web bán điện thoại Hùng Mobile được thiết kế và thực hiện hoàn thiện bởi sinh viên: **Nguyễn Phi Hùng** (Mã số sinh viên: **2123110475**), 
            như một phần đồ án xây dựng ứng dụng web thương mại điện tử chuyên nghiệp, đồng bộ cấu trúc API với Backend ASP.NET Core kết hợp ReactJS.
          </p>
        </div>

      </div>
    </div>
  );
}

export default About;
