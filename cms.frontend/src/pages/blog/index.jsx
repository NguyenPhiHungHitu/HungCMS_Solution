// File: src/pages/blog/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import postService from '../../services/postService';
import { getImageUrl } from '../../api/axiosClient';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        setLoading(true);
        const postsData = await postService.getAllPosts();
        const catsData = await postService.getPostCategories();

        setPosts(postsData);
        setCategories(catsData);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi nạp tin tức:", err);
        setLoading(false);
      }
    };
    loadBlogData();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
  };

  const getFilteredPosts = () => {
    let result = [...posts];

    // Lọc theo từ khóa
    if (searchQuery.trim()) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo danh mục bài viết
    if (selectedCategory !== 'ALL') {
      result = result.filter(p => {
        const pCatId = p.categoryId || p.CategoryId || p.idCategory;
        return String(pCatId) === String(selectedCategory);
      });
    }

    return result;
  };

  const filteredPosts = getFilteredPosts();

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Đang nạp...</span>
        </div>
        <p className="mt-3 text-muted">Đang nạp tin tức công nghệ di động...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white shadow-sm" style={{ borderRadius: '8px' }}>
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang Chủ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Tin Tức Công Nghệ</li>
        </ol>
      </nav>

      <div className="row">
        
        {/* CỘT TRÁI - CHỦ ĐỀ VÀ TÌM KIẾM */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm p-4 bg-white mb-4" style={{ borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="font-weight-bold text-dark m-0"><i className="fa-solid fa-list mr-2 text-success"></i>Chủ đề tin</h5>
              <button type="button" className="btn btn-link text-danger p-0 font-weight-bold small text-decoration-none" onClick={handleResetFilters}>
                Đặt lại
              </button>
            </div>

            {/* Tìm kiếm bài viết */}
            <div className="mb-4">
              <label className="font-weight-bold small text-secondary text-uppercase mb-2">Tìm kiếm tin</label>
              <input 
                type="text" 
                className="form-control form-control-sm" 
                placeholder="Nhập từ khóa tìm..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Danh mục */}
            <div className="list-group list-group-flush" style={{ fontSize: '13.5px' }}>
              <button 
                type="button"
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 ${selectedCategory === 'ALL' ? 'active bg-success text-white' : ''}`}
                onClick={() => setSelectedCategory('ALL')}
              >
                <span>Tất cả tin tức</span>
              </button>
              {categories.map((c) => (
                <button 
                  key={c.id}
                  type="button"
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 ${String(selectedCategory) === String(c.id) ? 'active bg-success text-white' : ''}`}
                  onClick={() => setSelectedCategory(c.id)}
                >
                  <span>{c.name}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Banner quảng cáo nhỏ */}
          <div className="card border-0 shadow-sm overflow-hidden text-center text-white" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #155799, #159957)', padding: '30px 20px' }}>
            <h6 className="font-weight-bold mb-2">THU CŨ ĐỔI MỚI</h6>
            <p className="small text-white-50">Lên đời iPhone 15 hỗ trợ trợ giá 1 triệu đồng tại các cửa hàng Hùng Mobile.</p>
            <Link to="/shop" className="btn btn-warning btn-sm font-weight-bold" style={{ borderRadius: '20px' }}>Tham gia ngay</Link>
          </div>
        </div>

        {/* CỘT PHẢI - DANH SÁCH BÀI ĐĂNG */}
        <div className="col-lg-9">
          <div className="row">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div className="col-md-6 col-lg-4 mb-4" key={post.id}>
                  <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden bg-white">
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img 
                        src={getImageUrl(post.imageUrl)} 
                        alt={post.title} 
                        className="w-100 h-100" 
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x160?text=HungMobile+News";
                        }}
                      />
                    </div>
                    <div className="card-body p-3 d-flex flex-column">
                      <span className="badge badge-light border mb-2 text-success align-self-start" style={{ fontSize: '10.5px' }}>
                        <i className="fa-regular fa-calendar-days mr-1"></i>
                        {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                      </span>
                      <h6 className="font-weight-bold text-dark mb-2 text-justify" style={{ lineHeight: '1.4', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {post.title}
                      </h6>
                      <p className="card-text text-secondary small text-justify text-truncate mb-3">
                        Đọc bài phân tích cấu hình, camera, trải nghiệm hiệu năng thực tế...
                      </p>
                      <Link to={`/blog/${post.id}`} className="btn btn-success btn-sm btn-block mt-auto font-weight-bold" style={{ borderRadius: '6px' }}>
                        Đọc bài viết
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h5 className="font-weight-bold text-muted">Không tìm thấy bài viết nào phù hợp!</h5>
                <button type="button" className="btn btn-success btn-sm mt-3 px-4" style={{ borderRadius: '20px' }} onClick={handleResetFilters}>
                  Xem tất cả bài viết
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Blog;