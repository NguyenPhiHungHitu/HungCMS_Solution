// File: src/pages/shop/index.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import ProductCard from '../../components/ProductCard';

function Shop({ onAddToCart, onAddToCompare, compareList = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc nội bộ
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [priceRange, setPriceRange] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRam, setSelectedRam] = useState('ALL');
  const [selectedRom, setSelectedRom] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Phân trang 6 sản phẩm mỗi trang

  // Lắng nghe thay đổi từ URL params (được truyền từ Header search hoặc Home brand quick links)
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const brandParam = searchParams.get('brand');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
  }, [searchParams]);

  // 1. Chỉ tải danh mục thương hiệu lúc mount (chỉ một lần duy nhất)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catData = await categoryProductService.getAllCategoryProducts();
        setCategories(catData);
      } catch (err) {
        console.error("Lỗi nạp danh mục cửa hàng:", err);
      }
    };
    loadCategories();
  }, []);

  // 2. Lắng nghe bộ lọc và gọi API lọc ngầm (từ Database) với Debounce tránh dồn dập
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const params = {};
        if (minPrice.trim() !== '') params.minPrice = minPrice;
        if (maxPrice.trim() !== '') params.maxPrice = maxPrice;
        if (selectedBrand !== 'ALL') params.categoryProductId = selectedBrand;
        if (searchQuery.trim() !== '') params.search = searchQuery;

        // Xử lý radio priceRange nếu có
        if (priceRange === 'UNDER_10M') {
          params.maxPrice = 10000000;
        } else if (priceRange === '10M_20M') {
          params.minPrice = 10000000;
          params.maxPrice = 20000000;
        } else if (priceRange === 'OVER_20M') {
          params.minPrice = 20000000;
        }

        const prodData = await productService.getAll(params);
        setProducts(prodData);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi gọi API lọc sản phẩm ngầm:", err);
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(() => {
      fetchFilteredProducts();
    }, 400); // 400ms debounce

    return () => clearTimeout(delayTimer);
  }, [minPrice, maxPrice, selectedBrand, searchQuery, priceRange]);

  // Xử lý Lọc dữ liệu
  const getFilteredProducts = () => {
    let result = [...products];

    // 1. Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Lọc theo thương hiệu (hãng)
    if (selectedBrand !== 'ALL') {
      result = result.filter(p => String(p.categoryProductId) === String(selectedBrand));
    }

    // 3. Lọc theo khoảng giá (Radio)
    if (priceRange === 'UNDER_10M') {
      result = result.filter(p => p.price < 10000000);
    } else if (priceRange === '10M_20M') {
      result = result.filter(p => p.price >= 10000000 && p.price <= 20000000);
    } else if (priceRange === 'OVER_20M') {
      result = result.filter(p => p.price > 20000000);
    }

    // Tiêu chí 39: Lọc theo khoảng giá nhập tự do (Min - Max)
    if (minPrice.trim() !== '') {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice.trim() !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // 4. Lọc theo RAM
    if (selectedRam !== 'ALL') {
      result = result.filter(p => p.specs?.ram?.includes(selectedRam));
    }

    // 5. Lọc theo ROM (Dung lượng bộ nhớ)
    if (selectedRom !== 'ALL') {
      result = result.filter(p => p.specs?.rom?.includes(selectedRom));
    }

    // 6. Sắp xếp dữ liệu (Sort)
    if (sortBy === 'PRICE_LOW_HIGH') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH_LOW') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'RATING') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  };

  const filteredList = getFilteredProducts();

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('ALL');
    setPriceRange('ALL');
    setMinPrice('');
    setMaxPrice('');
    setSelectedRam('ALL');
    setSelectedRom('ALL');
    setSortBy('DEFAULT');
    setCurrentPage(1);
    setSearchParams({}); // Xóa URL params
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
        <p className="mt-3 text-muted">Đang lọc danh sách siêu phẩm smartphone...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Thanh Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white shadow-sm" style={{ borderRadius: '8px' }}>
          <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Trang Chủ</a></li>
          <li className="breadcrumb-item active" aria-current="page">Cửa Hàng</li>
        </ol>
      </nav>

      <div className="row">
        
        {/* CỘT TRÁI - BỘ LỌC ĐA NĂNG */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px' }}>
            
            {/* Tiêu đề bộ lọc */}
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="font-weight-bold text-dark m-0"><i className="fa-solid fa-filter mr-2 text-primary"></i>Bộ Lọc Sạch</h5>
              <button 
                type="button" 
                className="btn btn-link text-danger p-0 font-weight-bold small text-decoration-none"
                onClick={handleResetFilters}
              >
                Đặt lại
              </button>
            </div>

            {/* Lọc theo Từ khóa */}
            <div className="mb-4">
              <label className="font-weight-bold small text-secondary text-uppercase mb-2">Tìm tên máy</label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Gõ iPhone, S24..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
                {searchQuery && (
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setSearchQuery('')}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Lọc theo Hãng (Brand) */}
            <div className="mb-4">
              <label className="font-weight-bold small text-secondary text-uppercase mb-2">Hãng điện thoại</label>
              <select 
                className="form-control form-control-sm font-weight-bold"
                value={selectedBrand}
                onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">-- Tất cả các hãng --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Lọc theo Mức Giá */}
            <div className="mb-4">
              <label className="font-weight-bold small text-secondary text-uppercase mb-2">Khoảng giá</label>
              <div className="list-group list-group-flush" style={{ fontSize: '13.5px' }}>
                <label className="d-flex align-items-center mb-2 font-weight-normal cursor-pointer">
                  <input 
                    type="radio" 
                    name="priceRange" 
                    className="mr-2"
                    checked={priceRange === 'ALL'}
                    onChange={() => { setPriceRange('ALL'); setCurrentPage(1); }}
                  />
                  <span>Tất cả mức giá</span>
                </label>
                <label className="d-flex align-items-center mb-2 font-weight-normal cursor-pointer">
                  <input 
                    type="radio" 
                    name="priceRange" 
                    className="mr-2"
                    checked={priceRange === 'UNDER_10M'}
                    onChange={() => { setPriceRange('UNDER_10M'); setCurrentPage(1); }}
                  />
                  <span>Dưới 10 triệu</span>
                </label>
                <label className="d-flex align-items-center mb-2 font-weight-normal cursor-pointer">
                  <input 
                    type="radio" 
                    name="priceRange" 
                    className="mr-2"
                    checked={priceRange === '10M_20M'}
                    onChange={() => { setPriceRange('10M_20M'); setCurrentPage(1); }}
                  />
                  <span>Từ 10M - 20 triệu</span>
                </label>
                <label className="d-flex align-items-center mb-2 font-weight-normal cursor-pointer">
                  <input 
                    type="radio" 
                    name="priceRange" 
                    className="mr-2"
                    checked={priceRange === 'OVER_20M'}
                    onChange={() => { setPriceRange('OVER_20M'); setCurrentPage(1); }}
                  />
                  <span>Trên 20 triệu</span>
                </label>
              </div>
            </div>

            {/* Tiêu chí 39: Bộ lọc khoảng giá tự chọn */}
            <div className="mb-4">
              <label className="font-weight-bold small text-secondary text-uppercase mb-2">Giá tự chọn (VNĐ)</label>
              <div className="d-flex gap-2 align-items-center">
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="Min" 
                  value={minPrice} 
                  onChange={(e) => { setMinPrice(e.target.value); setPriceRange('ALL'); setCurrentPage(1); }} 
                />
                <span className="text-muted small">-</span>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="Max" 
                  value={maxPrice} 
                  onChange={(e) => { setMaxPrice(e.target.value); setPriceRange('ALL'); setCurrentPage(1); }} 
                />
              </div>
            </div>

            {/* Lọc theo cấu hình RAM */}
            <div className="mb-4">
              <label className="font-weight-bold small text-secondary text-uppercase mb-2">Dung lượng RAM</label>
              <select 
                className="form-control form-control-sm"
                value={selectedRam}
                onChange={(e) => { setSelectedRam(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">Tất cả RAM</option>
                <option value="6 GB">6 GB</option>
                <option value="8 GB">8 GB</option>
                <option value="12 GB">12 GB</option>
                <option value="16 GB">16 GB</option>
              </select>
            </div>

            {/* Lọc theo cấu hình bộ nhớ trong ROM */}
            <div className="mb-2">
              <label className="font-weight-bold small text-secondary text-uppercase mb-2">Bộ nhớ trong (ROM)</label>
              <select 
                className="form-control form-control-sm"
                value={selectedRom}
                onChange={(e) => { setSelectedRom(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">Tất cả Bộ nhớ</option>
                <option value="128 GB">128 GB</option>
                <option value="256 GB">256 GB</option>
                <option value="512 GB">512 GB</option>
              </select>
            </div>

          </div>
        </div>

        {/* CỘT PHẢI - DANH SÁCH SẢN PHẨM */}
        <div className="col-lg-9">
          
          {/* Thanh Toolbar Sắp xếp và Thống kê */}
          <div className="bg-white p-3 rounded-lg shadow-sm mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span className="text-secondary small font-weight-bold">
                Tìm thấy <span className="text-primary">{filteredList.length}</span> chiếc điện thoại phù hợp
              </span>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small font-weight-bold text-nowrap mr-2">Sắp xếp:</span>
              <select 
                className="form-control form-control-sm font-weight-bold" 
                style={{ width: '180px', borderRadius: '6px' }}
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              >
                <option value="DEFAULT">Mặc định tốt nhất</option>
                <option value="PRICE_LOW_HIGH">Giá bán: Thấp đến Cao</option>
                <option value="PRICE_HIGH_LOW">Giá bán: Cao xuống Thấp</option>
                <option value="RATING">Đánh giá sao cao nhất</option>
              </select>
            </div>
          </div>

          {/* Grid điện thoại */}
          <div className="row">
            {currentItems.length > 0 ? (
              currentItems.map((p) => (
                <div className="col-md-4 col-sm-6 mb-4" key={p.id}>
                  <ProductCard 
                    product={p} 
                    onAddToCart={onAddToCart}
                    onAddToCompare={onAddToCompare}
                    isCompared={compareList.some(item => item.id === p.id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=400&q=80" 
                    alt="No products found" 
                    style={{ maxWidth: '280px', borderRadius: '12px' }}
                  />
                </div>
                <h5 className="font-weight-bold text-dark">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</h5>
                <p className="text-muted small">Hãy thử điều chỉnh khoảng giá hoặc từ khóa tìm kiếm khác.</p>
                <button type="button" className="btn btn-primary btn-sm mt-2 px-4" style={{ borderRadius: '20px' }} onClick={handleResetFilters}>
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Điều hướng Phân Trang */}
          {totalPages > 1 && (
            <nav className="mt-4 mb-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo; Trước</button>
                </li>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Sau &raquo;</button>
                </li>
              </ul>
            </nav>
          )}

        </div>

      </div>
    </div>
  );
}

export default Shop;