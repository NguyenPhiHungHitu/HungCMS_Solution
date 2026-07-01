// File: src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/axiosClient';

const ProductCard = ({ product, onAddToCart, onAddToCompare, isCompared }) => {
  const { id, name, price, originalPrice, imageUrl, specs, rating } = product;

  // Tính phần trăm giảm giá
  const discountPercent = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Xử lý link hình ảnh
  const getProductImage = (url) => {
    return getImageUrl(url);
  };

  // Định dạng tiền tệ VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="product-card-premium">
      {/* Huy hiệu giảm giá nếu có */}
      {discountPercent > 0 && (
        <span className="badge-discount"> Giảm {discountPercent}% </span>
      )}

      {/* Nút so sánh nhanh */}
      <button 
        type="button"
        className={`btn-compare-add ${isCompared ? 'active' : ''}`}
        title={isCompared ? "Xóa khỏi danh sách so sánh" : "Thêm vào danh sách so sánh"}
        onClick={(e) => {
          e.preventDefault();
          onAddToCompare(product);
        }}
      >
        <i className="fa-solid fa-code-compare"></i>
      </button>

      {/* Ảnh sản phẩm */}
      <Link to={`/product/${id}`} className="text-decoration-none">
        <div className="phone-img-wrapper">
          <img 
            src={getProductImage(imageUrl)} 
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/200?text=HungMobile";
            }}
          />
        </div>
      </Link>

      {/* Nội dung sản phẩm */}
      <div className="product-card-info">
        {/* Tên sản phẩm */}
        <Link to={`/product/${id}`} className="text-decoration-none">
          <h5 className="product-card-name" title={name}>{name}</h5>
        </Link>

        {/* Thông số kỹ thuật tóm tắt */}
        <div className="product-card-specs">
          {specs?.ram && <span className="spec-pill">{specs.ram} RAM</span>}
          {specs?.rom && <span className="spec-pill">{specs.rom} ROM</span>}
          {specs?.battery && <span className="spec-pill">{specs.battery.split(',')[0]}</span>}
        </div>

        {/* Đánh giá sao */}
        <div className="rating-row">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            return (
              <i 
                key={index} 
                className={
                  starValue <= rating 
                    ? "fa-solid fa-star" 
                    : starValue - 0.5 <= rating 
                      ? "fa-solid fa-star-half-stroke" 
                      : "fa-regular fa-star"
                }
              ></i>
            );
          })}
          <span className="rating-count">({product.reviews?.length || 1 * 5 + 3})</span>
        </div>

        {/* Giá bán */}
        <div className="product-card-price-row">
          <span className="current-price">{formatVND(price)}</span>
          {discountPercent > 0 && (
            <span className="old-price">{formatVND(originalPrice)}</span>
          )}
        </div>

        {/* Hàng nút hành động */}
        <div className="d-flex gap-2 mt-auto">
          <Link to={`/product/${id}`} className="btn btn-outline-primary btn-sm flex-grow-1 font-weight-bold" style={{ borderRadius: '6px' }}>
            Xem chi tiết
          </Link>
          <button 
            type="button" 
            className="btn btn-success btn-sm px-3" 
            style={{ borderRadius: '6px' }}
            title="Thêm nhanh vào giỏ hàng"
            onClick={() => onAddToCart(product, 1)}
          >
            <i className="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
