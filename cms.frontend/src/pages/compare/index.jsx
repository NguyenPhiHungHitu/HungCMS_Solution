// File: src/pages/compare/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import { getImageUrl } from '../../api/axiosClient';

function Compare({ compareList = [], onRemoveFromCompare, onAddToCart, onAddToCompare }) {
  const [allProducts, setAllProducts] = useState([]);

  // Load tất cả sản phẩm để cho phép thêm nhanh từ trang so sánh
  useEffect(() => {
    productService.getAll()
      .then(data => setAllProducts(data))
      .catch(err => console.error(err));
  }, []);

  // Danh sách các máy có sẵn để thêm so sánh (không nằm trong compareList)
  const availableToCompare = allProducts.filter(p => 
    !compareList.some(item => item.id === p.id)
  );

  // Định dạng VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Link hình ảnh
  const getProductImage = (url) => {
    return getImageUrl(url);
  };

  if (compareList.length === 0) {
    return (
      <div className="container py-5 text-center my-5 bg-white rounded-lg shadow-sm">
        <div className="text-secondary mb-4" style={{ fontSize: '72px' }}>
          <i className="fa-solid fa-code-compare"></i>
        </div>
        <h4 className="font-weight-bold text-dark mb-2">Chưa chọn sản phẩm so sánh!</h4>
        <p className="text-muted small">Hãy bấm vào biểu tượng so sánh ở góc thẻ sản phẩm để thêm vào bảng đối chiếu.</p>
        <Link to="/shop" className="btn btn-primary btn-sm px-4 py-2 mt-3 font-weight-bold" style={{ borderRadius: '25px' }}>
          Quay lại Cửa Hàng chọn điện thoại
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white shadow-sm" style={{ borderRadius: '8px' }}>
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang Chủ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">So sánh sản phẩm</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm p-4 bg-white mb-5" style={{ borderRadius: '16px' }}>
        
        {/* Tiêu đề & Chọn thêm sản phẩm nhanh */}
        <div className="row align-items-center mb-4 pb-3 border-bottom">
          <div className="col-md-6">
            <h4 className="font-weight-bold text-dark m-0">
              <i className="fa-solid fa-code-compare text-primary mr-2"></i>
              Bảng so sánh thông số kỹ thuật ({compareList.length}/3)
            </h4>
          </div>
          <div className="col-md-6 text-md-right mt-3 mt-md-0">
            {compareList.length < 3 && availableToCompare.length > 0 && (
              <div className="d-inline-block">
                <span className="text-secondary small font-weight-bold mr-2">Thêm nhanh máy khác:</span>
                <select 
                  className="form-control form-control-sm d-inline-block font-weight-bold"
                  style={{ width: '220px', borderRadius: '6px' }}
                  onChange={(e) => {
                    const matched = allProducts.find(p => String(p.id) === String(e.target.value));
                    if (matched) {
                      onAddToCompare(matched);
                    }
                    e.target.value = ''; // Reset select
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>-- Chọn điện thoại --</option>
                  {availableToCompare.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Bảng so sánh ma trận */}
        <div className="table-responsive">
          <table className="table table-bordered compare-matrix-table">
            <thead>
              <tr>
                <th style={{ width: '20%', minWidth: '150px' }} className="font-weight-bold text-secondary text-left">
                  Tiêu chí so sánh
                </th>
                {compareList.map(p => (
                  <th key={p.id} style={{ width: `${80 / compareList.length}%`, minWidth: '220px' }}>
                    <div className="position-relative text-center">
                      {/* Nút xóa khỏi so sánh */}
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-danger border-0 position-absolute" 
                        style={{ top: '-10px', right: '-10px' }}
                        onClick={() => onRemoveFromCompare(p.id)}
                        title="Bỏ so sánh"
                      >
                        <i className="fa-solid fa-xmark" style={{ fontSize: '16px' }}></i>
                      </button>

                      {/* Hình ảnh */}
                      <img 
                        src={getProductImage(p.imageUrl)} 
                        alt={p.name} 
                        className="mb-3"
                        style={{ height: '110px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/110?text=Phone";
                        }}
                      />
                      
                      {/* Tên */}
                      <h6 className="font-weight-bold text-dark text-truncate mb-2" title={p.name}>
                        {p.name}
                      </h6>
                      
                      {/* Giá */}
                      <div className="text-danger font-weight-bold small mb-2">
                        {formatVND(p.price)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              
              {/* RAM */}
              <tr>
                <td className="font-weight-bold text-secondary bg-light">Bộ nhớ RAM</td>
                {compareList.map(p => (
                  <td key={p.id} className="text-center font-weight-bold text-dark">{p.specs?.ram || 'N/A'}</td>
                ))}
              </tr>

              {/* ROM */}
              <tr>
                <td className="font-weight-bold text-secondary bg-light">Bộ nhớ trong (ROM)</td>
                {compareList.map(p => (
                  <td key={p.id} className="text-center font-weight-bold text-dark">{p.specs?.rom || 'N/A'}</td>
                ))}
              </tr>

              {/* Màn hình */}
              <tr>
                <td className="font-weight-bold text-secondary bg-light">Màn hình hiển thị</td>
                {compareList.map(p => (
                  <td key={p.id} className="small text-center text-dark">{p.specs?.screen || 'N/A'}</td>
                ))}
              </tr>

              {/* CPU */}
              <tr>
                <td className="font-weight-bold text-secondary bg-light">Bộ vi xử lý (CPU)</td>
                {compareList.map(p => (
                  <td key={p.id} className="small text-center font-weight-bold text-primary">{p.specs?.cpu || 'N/A'}</td>
                ))}
              </tr>

              {/* Camera */}
              <tr>
                <td className="font-weight-bold text-secondary bg-light">Camera sau/trước</td>
                {compareList.map(p => (
                  <td key={p.id} className="small text-center text-dark">{p.specs?.camera || 'N/A'}</td>
                ))}
              </tr>

              {/* Dung lượng Pin */}
              <tr>
                <td className="font-weight-bold text-secondary bg-light">Dung lượng Pin</td>
                {compareList.map(p => (
                  <td key={p.id} className="text-center text-dark">{p.specs?.battery || 'N/A'}</td>
                ))}
              </tr>

              {/* Hệ điều hành */}
              <tr>
                <td className="font-weight-bold text-secondary bg-light">Hệ điều hành</td>
                {compareList.map(p => (
                  <td key={p.id} className="text-center text-dark">{p.specs?.os || 'N/A'}</td>
                ))}
              </tr>

              {/* Khả năng mua hàng */}
              <tr>
                <td className="font-weight-bold text-secondary bg-light">Mua sắm</td>
                {compareList.map(p => (
                  <td key={p.id} className="text-center">
                    <button 
                      type="button" 
                      className="btn btn-success btn-sm px-3 font-weight-bold"
                      style={{ borderRadius: '20px' }}
                      onClick={() => {
                        onAddToCart(p, 1);
                        alert(`Đã thêm nhanh ${p.name} vào giỏ hàng!`);
                      }}
                    >
                      <i className="fa-solid fa-cart-plus mr-1"></i>Thêm giỏ hàng
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Compare;
