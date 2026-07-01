// File: src/pages/product-detail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { getImageUrl } from '../../api/axiosClient';
import ProductCard from '../../components/ProductCard';

function ProductDetail({ onAddToCart, onAddToCompare, compareList = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chọn tùy chọn mua hàng
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('DESCRIPTION'); // 'DESCRIPTION' hoặc 'SPECS'
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  // Đồng bộ ảnh chính khi người dùng đổi màu hoặc sản phẩm thay đổi
  useEffect(() => {
    if (product) {
      if (selectedColor && product.variants?.colorImages && product.variants.colorImages[selectedColor]) {
        setActiveImage(product.variants.colorImages[selectedColor]);
      } else {
        setActiveImage(product.imageUrl);
      }
    }
  }, [selectedColor, product]);

  // Trạng thái bình luận / đánh giá
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sản phẩm liên quan
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Load chi tiết sản phẩm và các sản phẩm cùng hãng
  useEffect(() => {
    const loadProductDetail = async () => {
      try {
        setLoading(true);
        const item = await productService.getById(id);
        setProduct(item);
        setReviewsList(item.reviews || []);
        
        // Mặc định chọn màu đầu tiên và dung lượng đầu tiên
        if (item.variants?.colors?.length > 0) {
          setSelectedColor(item.variants.colors[0]);
        }
        if (item.variants?.storages?.length > 0) {
          setSelectedStorage(item.variants.storages[0]);
        }

        // Lấy sản phẩm liên quan (cùng hãng)
        const allList = await productService.getAll();
        const related = allList.filter(p => 
          String(p.categoryProductId) === String(item.categoryProductId) && String(p.id) !== String(item.id)
        ).slice(0, 4);
        setRelatedProducts(related);

        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setLoading(false);
      }
    };

    loadProductDetail();
    // Reset cuộn trang lên đầu khi chuyển sản phẩm
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang nạp...</span>
        </div>
        <p className="mt-3 text-muted">Đang nạp thông tin chi tiết siêu phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center my-5">
        <h3 className="font-weight-bold text-danger">Không tìm thấy sản phẩm!</h3>
        <p className="text-muted">Sản phẩm có thể đã ngừng bán hoặc đường dẫn không đúng.</p>
        <Link to="/shop" className="btn btn-primary btn-sm mt-3 px-4">Quay lại Cửa Hàng</Link>
      </div>
    );
  }

  // Tính giá động dựa trên Storage Variant
  const basePrice = product.price;
  const priceModifier = selectedStorage ? selectedStorage.priceModifier : 0;
  const currentPrice = basePrice + priceModifier;
  const originalPrice = (product.originalPrice || basePrice * 1.15) + priceModifier;

  // Xử lý link hình ảnh
  const getProductImage = (url) => {
    return getImageUrl(url);
  };

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= 1) {
      setQuantity(newQty);
    }
  };

  // Submit đánh giá mới
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewName.trim() && reviewComment.trim()) {
      const newReview = {
        id: reviewsList.length + 1,
        author: reviewName,
        rating: Number(reviewRating),
        date: new Date().toISOString().split('T')[0],
        comment: reviewComment
      };
      setReviewsList([newReview, ...reviewsList]);
      setReviewName('');
      setReviewComment('');
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    }
  };

  // Xử lý Mua Ngay (Add to cart & go to Cart Page)
  const handleBuyNow = () => {
    if (quantity > product.stockQuantity) {
      alert("Số lượng sản phẩm trong kho không đủ!");
      return;
    }
    const cartItem = {
      ...product,
      price: currentPrice, // Sử dụng giá đã chọn dung lượng
      selectedColor,
      selectedStorage: selectedStorage ? selectedStorage.size : 'Mặc định'
    };
    onAddToCart(cartItem, quantity);
    navigate('/cart');
  };

  // Xử lý Thêm Giỏ Hàng bình thường
  const handleAddCart = () => {
    if (quantity > product.stockQuantity) {
      alert("Số lượng sản phẩm trong kho không đủ!");
      return;
    }
    const cartItem = {
      ...product,
      price: currentPrice,
      selectedColor,
      selectedStorage: selectedStorage ? selectedStorage.size : 'Mặc định'
    };
    onAddToCart(cartItem, quantity);
    alert(`Đã thêm ${quantity} sản phẩm ${product.name} (${selectedColor}, ${selectedStorage ? selectedStorage.size : ''}) vào giỏ hàng!`);
  };

  // Format tiền tệ VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const isCompared = compareList.some(item => item.id === product.id);

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white shadow-sm" style={{ borderRadius: '8px' }}>
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang Chủ</Link></li>
          <li className="breadcrumb-item"><Link to="/shop" className="text-decoration-none">Cửa Hàng</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* Thông tin chính chi tiết sản phẩm */}
      <div className="card border-0 shadow-sm p-4 bg-white mb-4" style={{ borderRadius: '16px' }}>
        <div className="row">
          
          {/* CỘT TRÁI: Gallery & Cam kết */}
          <div className="col-lg-5 mb-4">
            <div className="detail-gallery-main mb-3">
              <img 
                src={getProductImage(activeImage || product.imageUrl)} 
                alt={product.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400?text=HungMobile";
                }}
              />
            </div>
            {/* Ảnh thu nhỏ (Thumbnails) */}
            <div className="d-flex gap-2 justify-content-center mb-4">
              {(() => {
                const list = [product.imageUrl];
                if (product.variants?.colorImages) {
                  Object.values(product.variants.colorImages).forEach(img => {
                    if (img && !list.includes(img)) {
                      list.push(img);
                    }
                  });
                }
                if (list.length === 1) {
                  list.push("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600");
                  list.push("https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=600");
                }
                return list.map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className={`detail-thumb-item ${(activeImage || product.imageUrl) === imgUrl ? 'active' : ''}`}
                    onClick={() => {
                      setActiveImage(imgUrl);
                      if (product.variants?.colorImages) {
                        const matchedColor = Object.keys(product.variants.colorImages).find(
                          color => product.variants.colorImages[color] === imgUrl
                        );
                        if (matchedColor) {
                          setSelectedColor(matchedColor);
                        }
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={getProductImage(imgUrl)} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ));
              })()}
            </div>

            {/* Khung cam kết chân thật */}
            <div className="p-3 rounded bg-light border text-secondary small">
              <div className="font-weight-bold text-dark mb-2"><i className="fa-solid fa-gift text-danger mr-2"></i>Chính sách ưu đãi Hùng Mobile:</div>
              <ul className="pl-3 mb-0">
                <li className="mb-1">Tặng ốp lưng cao cấp & dán cường lực trị giá 200.000đ</li>
                <li className="mb-1">Giảm thêm 100k cho khách hàng cũ</li>
                <li>Bảo hành vàng nguồn & màn hình rơi vỡ trong 12 tháng</li>
              </ul>
            </div>
          </div>

          {/* CỘT PHẢI: Lựa chọn mua hàng */}
          <div className="col-lg-7">
            <span className="badge badge-primary mb-2">Chính hãng</span>
            <h2 className="font-weight-bold text-dark mb-2">{product.name}</h2>
            
            {/* Xếp hạng đánh giá sao */}
            <div className="d-flex align-items-center mb-3">
              <div className="text-warning mr-2" style={{ fontSize: '15px' }}>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>
              </div>
              <span className="text-secondary small font-weight-bold mr-3">{product.rating} / 5</span>
              <span className="text-primary small font-weight-bold border-left pl-3">{reviewsList.length} lượt đánh giá thực tế</span>
            </div>

            {/* Mức Giá hiển thị động */}
            <div className="p-3 bg-light rounded-lg mb-4 d-flex align-items-center">
              <h3 className="text-danger font-weight-bold m-0 mr-3">{formatVND(currentPrice)}</h3>
              {originalPrice > currentPrice && (
                <span className="text-muted text-decoration-line-through old-price m-0 mr-3">{formatVND(originalPrice)}</span>
              )}
              <span className="badge badge-danger">Trả góp 0%</span>
            </div>

            {/* Lọc 1: Lựa chọn Dung lượng (Storage) */}
            {product.variants?.storages && (
              <div className="mb-3">
                <label className="font-weight-bold small text-secondary text-uppercase d-block mb-2">Chọn bộ nhớ trong (ROM)</label>
                <div className="d-flex gap-2 flex-wrap">
                  {product.variants.storages.map((storage) => (
                    <button 
                      key={storage.size}
                      type="button"
                      className={`variant-btn ${selectedStorage?.size === storage.size ? 'active' : ''}`}
                      onClick={() => setSelectedStorage(storage)}
                    >
                      {storage.size}
                      {storage.priceModifier > 0 && ` (+${formatVND(storage.priceModifier)})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lọc 2: Lựa chọn Màu sắc (Color) */}
            {product.variants?.colors && (
              <div className="mb-4">
                <label className="font-weight-bold small text-secondary text-uppercase d-block mb-2">Chọn màu sắc</label>
                <div className="d-flex gap-2 flex-wrap">
                  {product.variants.colors.map((color) => (
                    <button 
                      key={color}
                      type="button"
                      className={`variant-btn ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <span className="color-dot" style={{ 
                        backgroundColor: 
                          color.includes('Tự Nhiên') ? '#a7a49f' : 
                          color.includes('Xanh') ? '#2e4a62' :
                          color.includes('Đen') ? '#212529' :
                          color.includes('Trắng') ? '#f8f9fa' :
                          color.includes('Vàng') ? '#eedc82' :
                          color.includes('Tím') ? '#4b0082' : 
                          color.includes('Kem') ? '#f3e5ab' : '#ccc'
                      }}></span>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hộp khuyến mãi hot */}
            <div className="promo-box mb-4">
              <div className="promo-header"><i className="fa-solid fa-gift mr-2"></i>KHUYẾN MÃI ĐẶC BIỆT</div>
              <ul className="pl-3 mb-0 small text-secondary" style={{ lineHeight: '1.7' }}>
                <li>Tặng voucher mua phụ kiện trị giá 300.000đ (Sạc dự phòng, Tai nghe).</li>
                <li>Tặng gói bảo hành VIP 1 đổi 1 cả nguồn, màn hình trong 12 tháng.</li>
                <li>Thu cũ đổi mới hỗ trợ trợ giá lên tới 1.000.000đ.</li>
                <li>Nhập mã <b>HUNGMB2123</b> giảm thêm 2% tối đa 300.000đ khi thanh toán qua VNPay.</li>
              </ul>
            </div>

            {/* Tình trạng kho hàng */}
            <div className="mb-4">
              <span className="text-secondary small font-weight-bold">
                Tình trạng: {product.stockQuantity > 0 ? (
                  <span className="text-success"><i className="fa-solid fa-circle-check mr-1"></i>Còn hàng (Còn lại {product.stockQuantity} máy trong kho)</span>
                ) : (
                  <span className="text-danger"><i className="fa-solid fa-circle-xmark mr-1"></i>Hết hàng</span>
                )}
              </span>
            </div>

            {/* Số lượng mua & Hàng nút hành động */}
            {product.stockQuantity > 0 && (
              <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                
                {/* Chọn số lượng */}
                <div className="d-flex align-items-center mr-3">
                  <span className="text-secondary small font-weight-bold mr-2 text-nowrap">Số lượng:</span>
                  <div className="input-group input-group-sm" style={{ width: '100px' }}>
                    <div className="input-group-prepend">
                      <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(-1)}>-</button>
                    </div>
                    <input 
                      type="number" 
                      className="form-control text-center bg-white" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(1)}>+</button>
                    </div>
                  </div>
                </div>

                {/* Các nút mua sắm */}
                <div className="d-flex flex-grow-1 gap-2 flex-wrap">
                  <button 
                    type="button" 
                    className="btn btn-danger btn-lg buy-now-btn-pulse flex-grow-1 font-weight-bold" 
                    style={{ borderRadius: '10px', fontSize: '15px' }}
                    onClick={handleBuyNow}
                  >
                    MUA NGAY
                    <span className="d-block small font-weight-normal text-white-50" style={{ fontSize: '10px' }}>Giao nhanh hoặc nhận tại cửa hàng</span>
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-primary font-weight-bold px-3" 
                    style={{ borderRadius: '10px' }}
                    onClick={handleAddCart}
                    title="Thêm vào giỏ hàng"
                  >
                    <i className="fa-solid fa-cart-plus" style={{ fontSize: '18px' }}></i>
                  </button>

                  <button 
                    type="button" 
                    className={`btn ${isCompared ? 'btn-info' : 'btn-outline-secondary'} px-3`}
                    style={{ borderRadius: '10px' }}
                    onClick={() => onAddToCompare(product)}
                    title={isCompared ? "Bỏ so sánh" : "Thêm vào so sánh"}
                  >
                    <i className="fa-solid fa-code-compare" style={{ fontSize: '18px' }}></i>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Tabs Đọc thông tin & Bình luận */}
      <div className="card border-0 shadow-sm p-4 bg-white mb-5" style={{ borderRadius: '16px' }}>
        
        {/* Navigation Tabs */}
        <div className="border-bottom pb-3 mb-4">
          <ul className="nav nav-tabs border-0 font-weight-bold" style={{ fontSize: '14px' }}>
            <li className="nav-item">
              <button 
                className={`nav-link border-0 mr-3 pb-2 ${activeTab === 'DESCRIPTION' ? 'active text-primary border-bottom' : 'text-secondary'}`}
                onClick={() => setActiveTab('DESCRIPTION')}
                style={{ background: 'transparent' }}
              >
                Đặc điểm nổi bật
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link border-0 pb-2 ${activeTab === 'SPECS' ? 'active text-primary border-bottom' : 'text-secondary'}`}
                onClick={() => setActiveTab('SPECS')}
                style={{ background: 'transparent' }}
              >
                Thông số kỹ thuật chi tiết
              </button>
            </li>
          </ul>
        </div>

        {/* Tab 1: Mô tả bài viết đặc điểm nổi bật */}
        {activeTab === 'DESCRIPTION' && (
          <div className="row">
            <div className="col-lg-8">
              <div 
                className="text-secondary text-justify mb-4" 
                style={{ 
                  maxHeight: descriptionExpanded ? 'none' : '450px', 
                  overflow: 'hidden', 
                  position: 'relative',
                  lineHeight: '1.7'
                }}
              >
                <h5 className="font-weight-bold text-dark mb-3">Đánh giá điện thoại {product.name} - Siêu phẩm đáng sở hữu</h5>
                <p>{product.description}</p>
                <p>
                  Bên cạnh đó, việc tối ưu hóa hệ điều hành cùng với chip xử lý thế hệ mới giúp thiết bị 
                  tiết kiệm pin hơn tới 20% so với phiên bản tiền nhiệm. Bạn có thể sử dụng thoải mái suốt cả ngày dài 
                  với các tác vụ hỗn hợp từ lướt web, nghe nhạc, xem phim Netflix đến chiến game liên tục mà không lo cạn năng lượng giữa chừng.
                </p>
                <p>
                  Thiết kế tinh tế kết hợp vật liệu cao cấp tạo cảm giác cực kỳ sang trọng khi cầm trên tay. 
                  Đây không chỉ đơn thuần là một chiếc điện thoại di động, mà còn là một món đồ trang sức công nghệ đẳng cấp khẳng định vị thế của người sở hữu.
                </p>

                {/* Fade effect gradient bottom */}
                {!descriptionExpanded && (
                  <div className="position-absolute w-100" style={{ bottom: 0, height: '120px', background: 'linear-gradient(to top, #fff, rgba(255,255,255,0))' }}></div>
                )}
              </div>

              {/* Nút Xem thêm / Thu gọn */}
              <div className="text-center">
                <button 
                  type="button" 
                  className="btn btn-outline-primary btn-sm px-4 font-weight-bold"
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  style={{ borderRadius: '20px' }}
                >
                  {descriptionExpanded ? "Thu gọn nội dung" : "Đọc thêm đặc điểm nổi bật"}
                </button>
              </div>
            </div>

            {/* Cột phải tóm tắt Specs nhanh */}
            <div className="col-lg-4 mt-4 mt-lg-0 border-left">
              <h5 className="font-weight-bold text-dark mb-3">Cấu hình tóm tắt</h5>
              <table className="table table-sm small text-secondary">
                <tbody>
                  <tr>
                    <td className="font-weight-bold">Màn hình:</td>
                    <td>{product.specs?.screen || "OLED, 120Hz"}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Chipset (CPU):</td>
                    <td>{product.specs?.cpu || "Chip cao cấp"}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Dung lượng RAM:</td>
                    <td>{product.specs?.ram || "8 GB"}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Bộ nhớ trong:</td>
                    <td>{product.specs?.rom || "256 GB"}</td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Dung lượng Pin:</td>
                    <td>{product.specs?.battery || "5000 mAh"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Bảng thông số kỹ thuật chi tiết */}
        {activeTab === 'SPECS' && (
          <div>
            <h5 className="font-weight-bold text-dark mb-3">Thông số kỹ thuật chi tiết - {product.name}</h5>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td>Công nghệ màn hình:</td>
                  <td>{product.specs?.screen}</td>
                </tr>
                <tr>
                  <td>Hệ điều hành:</td>
                  <td>{product.specs?.os}</td>
                </tr>
                <tr>
                  <td>Chip xử lý (CPU):</td>
                  <td>{product.specs?.cpu}</td>
                </tr>
                <tr>
                  <td>Dung lượng RAM:</td>
                  <td>{product.specs?.ram}</td>
                </tr>
                <tr>
                  <td>Bộ nhớ trong (ROM):</td>
                  <td>{product.specs?.rom}</td>
                </tr>
                <tr>
                  <td>Camera sau:</td>
                  <td>{product.specs?.camera}</td>
                </tr>
                <tr>
                  <td>Dung lượng pin & Sạc:</td>
                  <td>{product.specs?.battery}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* KHU VỰC BÌNH LUẬN & ĐÁNH GIÁ CỦA KHÁCH HÀNG */}
      <div className="card border-0 shadow-sm p-4 bg-white mb-5" style={{ borderRadius: '16px' }}>
        <h4 className="font-weight-bold text-dark mb-4">
          <i className="fa-solid fa-comments text-primary mr-2"></i>
          Đánh giá và Bình luận
        </h4>

        <div className="row">
          
          {/* Form viết đánh giá */}
          <div className="col-lg-5 mb-4 mb-lg-0 border-right">
            <h5 className="font-weight-bold text-dark mb-3">Gửi đánh giá của bạn</h5>
            {reviewSubmitted && (
              <div className="alert alert-success py-2">Cảm ơn bạn đã gửi đánh giá! Ý kiến của bạn đã được hiển thị bên dưới.</div>
            )}
            
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Họ tên của bạn</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nhập họ và tên..." 
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Xếp hạng (Số sao)</label>
                <select 
                  className="form-control"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 sao - Tuyệt vời)</option>
                  <option value="4">⭐⭐⭐⭐ (4 sao - Tốt)</option>
                  <option value="3">⭐⭐⭐ (3 sao - Trung bình)</option>
                  <option value="2">⭐⭐ (2 sao - Kém)</option>
                  <option value="1">⭐ (1 sao - Rất tệ)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="small font-weight-bold text-secondary">Nội dung nhận xét</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Chia sẻ trải nghiệm sử dụng sản phẩm..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block font-weight-bold" style={{ borderRadius: '8px' }}>
                Gửi đánh giá ngay
              </button>
            </form>
          </div>

          {/* Danh sách các đánh giá cũ */}
          <div className="col-lg-7 pl-lg-4">
            <h5 className="font-weight-bold text-dark mb-3">Tất cả nhận xét ({reviewsList.length})</h5>
            
            {reviewsList.length > 0 ? (
              <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '10px' }}>
                {reviewsList.map((review) => (
                  <div key={review.id} className="pb-3 mb-3 border-bottom text-justify">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="font-weight-bold m-0 text-dark small">{review.author}</h6>
                      <small className="text-muted">{new Date(review.date).toLocaleDateString('vi-VN')}</small>
                    </div>
                    
                    {/* In sao */}
                    <div className="text-warning mb-2" style={{ fontSize: '11px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className={i < review.rating ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                      ))}
                    </div>
                    
                    <p className="text-secondary small mb-0">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small">Chưa có bình luận nào cho sản phẩm này. Hãy là người đầu tiên nhận xét!</p>
            )}
          </div>

        </div>
      </div>

      {/* SẢN PHẨM LIÊN QUAN (CÙNG HÃNG) */}
      {relatedProducts.length > 0 && (
        <section className="mb-5">
          <div className="section-heading mb-4 border-bottom pb-2">
            <h4 className="font-weight-bold text-dark text-uppercase m-0">
              Sản phẩm tương tự
            </h4>
          </div>
          <div className="row">
            {relatedProducts.map((p) => (
              <div className="col-lg-3 col-sm-6 mb-4" key={p.id}>
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
      )}

    </div>
  );
}

export default ProductDetail;
