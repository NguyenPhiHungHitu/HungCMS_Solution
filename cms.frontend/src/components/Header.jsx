// File: src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { getImageUrl } from '../api/axiosClient';

function Header({ cart = [], compareList = [], user = null, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const suggestionRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load danh sách sản phẩm để phục vụ tìm kiếm nhanh
  useEffect(() => {
    productService.getAll()
      .then(data => setAllProducts(data))
      .catch(err => console.error("Không nạp được sản phẩm cho tìm kiếm:", err));
  }, []);

  // Xử lý đóng đề xuất và dropdown khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Tối đa 5 gợi ý
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Submit form tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Click vào suggestion
  const handleSuggestionClick = (id) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/product/${id}`);
  };

  // Tính số lượng trong giỏ hàng
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="main-header-wrapper sticky-top">
      {/* Top Header */}
      <div className="main-header py-3 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            
            {/* Logo */}
            <div className="col-lg-3 col-md-4 col-6">
              <Link to="/" className="text-decoration-none">
                <h3 className="font-weight-bold m-0 text-primary d-flex align-items-center">
                  <i className="fa-solid fa-mobile-screen-button mr-2"></i>
                  <span>HUNG MOBILE</span>
                </h3>
              </Link>
            </div>

            {/* Ô tìm kiếm thông minh */}
            <div className="col-lg-6 col-md-5 d-none d-md-block" ref={suggestionRef}>
              <form className="input-group search-input-group" onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tìm kiếm iPhone 15, Galaxy S24, Xiaomi..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  style={{ borderRadius: '8px 0 0 8px' }}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary px-4" type="submit" style={{ borderRadius: '0 8px 8px 0' }}>
                    <i className="fas fa-search"></i>
                  </button>
                </div>

                {/* Danh sách đề xuất thông minh */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="search-suggestions">
                    {suggestions.map(p => (
                      <div 
                        key={p.id} 
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(p.id)}
                      >
                        <img 
                          src={getImageUrl(p.imageUrl)} 
                          alt={p.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40?text=Phone";
                          }}
                        />
                        <div>
                          <div className="font-weight-bold text-dark small">{p.name}</div>
                          <div className="text-danger small font-weight-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Tài khoản, So sánh, Giỏ hàng */}
            <div className="col-lg-3 col-md-3 col-6 text-right d-flex align-items-center justify-content-end gap-3">
              
              {/* So sánh sản phẩm */}
              <Link to="/compare" className="btn position-relative p-2 text-dark mr-2" title="So sánh sản phẩm">
                <i className="fa-solid fa-code-compare" style={{ fontSize: '20px' }}></i>
                {compareList.length > 0 && (
                  <span className="badge badge-pill badge-info position-absolute" style={{ top: '0', right: '-2px', fontSize: '10px' }}>
                    {compareList.length}
                  </span>
                )}
              </Link>

              {/* Giỏ hàng */}
              <Link to="/cart" className="btn position-relative p-2 text-dark mr-3" title="Giỏ hàng">
                <i className="fa-solid fa-bag-shopping" style={{ fontSize: '21px' }}></i>
                {cartCount > 0 && (
                  <span className="badge badge-pill badge-danger position-absolute" style={{ top: '0', right: '-2px', fontSize: '10px' }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Đăng nhập / Tài khoản */}
              {user ? (
                <div className={`dropdown d-inline-block ${dropdownOpen ? 'show' : ''}`} ref={dropdownRef}>
                  <button 
                    className="btn btn-outline-primary btn-sm dropdown-toggle font-weight-bold" 
                    type="button" 
                    id="dropdownMenuUser" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ borderRadius: '20px' }}
                  >
                    <i className="fa-regular fa-user mr-1"></i> {user.name}
                  </button>
                  <div className={`dropdown-menu dropdown-menu-right ${dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuUser">
                    <Link className="dropdown-item small font-weight-bold" to="/profile" onClick={() => setDropdownOpen(false)}>Trang cá nhân</Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item small text-danger font-weight-bold" onClick={() => { onLogout(); setDropdownOpen(false); }}>Đăng xuất</button>
                  </div>
                </div>
              ) : (
                <Link to="/profile" className="btn btn-primary btn-sm px-3 font-weight-bold" style={{ borderRadius: '20px' }}>
                  Đăng nhập
                </Link>
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="main-navigation bg-white py-1">
        <div className="container">
          <nav className="navbar navbar-expand-lg p-0">
            <button className="navbar-toggler ml-auto p-1 text-dark" type="button" onClick={() => setMenuOpen(!menuOpen)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav w-100 font-weight-bold text-uppercase" style={{ fontSize: '13.5px' }} onClick={() => setMenuOpen(false)}>
                <li className="nav-item mr-4">
                  <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'text-primary active' : 'text-dark'}`}>Trang Chủ</NavLink>
                </li>
                <li className="nav-item mr-4">
                  <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'text-primary active' : 'text-dark'}`}>Cửa Hàng</NavLink>
                </li>
                <li className="nav-item mr-4">
                  <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'text-primary active' : 'text-dark'}`}>Tin tức công nghệ</NavLink>
                </li>
                <li className="nav-item mr-4">
                  <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'text-primary active' : 'text-dark'}`}>Giới Thiệu</NavLink>
                </li>
                <li className="nav-item mr-4">
                  <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'text-primary active' : 'text-dark'}`}>Liên Hệ</NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;