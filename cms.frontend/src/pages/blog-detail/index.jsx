// File: src/pages/blog-detail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../services/postService';
import { getImageUrl } from '../../api/axiosClient';

function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const loadPostDetail = async () => {
      try {
        setLoading(true);
        const item = await postService.getPostById(id);
        setPost(item);

        const all = await postService.getAllPosts();
        setPopularPosts(all.filter(p => String(p.id) !== String(id)).slice(0, 3));
        
        setLoading(false);
      } catch (err) {
        console.error("Lỗi nạp chi tiết bài viết:", err);
        setLoading(false);
      }
    };
    loadPostDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Đang nạp...</span>
        </div>
        <p className="mt-3 text-muted">Đang mở nội dung tin tức...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-5 text-center my-5">
        <h3 className="font-weight-bold text-danger">Không tìm thấy bài viết!</h3>
        <Link to="/blog" className="btn btn-success btn-sm mt-3 px-4">Quay lại Tin Tức</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white shadow-sm" style={{ borderRadius: '8px' }}>
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang Chủ</Link></li>
          <li className="breadcrumb-item"><Link to="/blog" className="text-decoration-none">Tin Tức Công Nghệ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Chi tiết bài viết</li>
        </ol>
      </nav>

      <div className="row">
        
        {/* CỘT TRÁI - CHI TIẾT BÀI ĐỌC */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '16px' }}>
            
            {/* Tiêu đề & Ngày đăng */}
            <span className="badge badge-success mb-2 align-self-start">Bản tin công nghệ</span>
            <h2 className="font-weight-bold text-dark mb-3 text-justify" style={{ lineHeight: '1.4' }}>{post.title}</h2>
            <div className="d-flex align-items-center text-secondary small mb-4 pb-3 border-bottom">
              <span className="mr-3"><i className="fa-regular fa-calendar-days mr-1 text-success"></i>Đăng ngày: {new Date(post.createdDate).toLocaleDateString('vi-VN')}</span>
              <span><i className="fa-regular fa-user mr-1 text-success"></i>Bởi: Ban biên tập Hùng Mobile</span>
            </div>

            {/* Hình ảnh chính bài viết */}
            <div className="mb-4 rounded overflow-hidden shadow-sm" style={{ maxHeight: '380px' }}>
              <img 
                src={getImageUrl(post.imageUrl)} 
                alt={post.title} 
                className="w-100"
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400?text=HungMobile+News";
                }}
              />
            </div>

            {/* Nội dung bài viết (Tiêu chí 44: dangerouslySetInnerHTML) */}
            <div 
              className="post-content text-secondary text-justify" 
              style={{ lineHeight: '1.8', fontSize: '15px' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Nút quay lại */}
            <div className="border-top pt-3 mt-4 text-right">
              <Link to="/blog" className="btn btn-outline-success btn-sm font-weight-bold" style={{ borderRadius: '20px' }}>
                <i className="fa-solid fa-arrow-left mr-2"></i>Quay lại danh sách tin
              </Link>
            </div>

          </div>
        </div>

        {/* CỘT PHẢI - BÀI VIẾT NỔI BẬT KHÁC */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 bg-white mb-4" style={{ borderRadius: '16px' }}>
            <h5 className="font-weight-bold text-dark mb-3 pb-2 border-bottom">Tin tức liên quan</h5>
            
            {popularPosts.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {popularPosts.map(p => (
                  <div key={p.id} className="d-flex align-items-center mb-3">
                    <img 
                      src={getImageUrl(p.imageUrl)} 
                      alt={p.title} 
                      className="rounded mr-2 border"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/60?text=News";
                      }}
                    />
                    <div className="flex-grow-1 min-width-0">
                      <Link to={`/blog/${p.id}`} className="font-weight-bold text-dark small text-justify text-truncate-2 d-block text-decoration-none" style={{ lineHeight: '1.3' }}>
                        {p.title}
                      </Link>
                      <small className="text-muted" style={{ fontSize: '11px' }}>{new Date(p.createdDate).toLocaleDateString('vi-VN')}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small">Không có tin tức liên quan nào khác.</p>
            )}
          </div>

          <div className="card border-0 shadow-sm p-4 text-center text-white" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #1e3c72, #2a5298)' }}>
            <h6 className="font-weight-bold mb-2">HỖ TRỢ TRẢ GÓP 0%</h6>
            <p className="small text-white-50">Lãi suất cực ưu đãi, xét duyệt hồ sơ nhanh chỉ 10 phút. Nhận máy ngay.</p>
            <Link to="/shop" className="btn btn-warning btn-sm font-weight-bold" style={{ borderRadius: '20px' }}>Mua sắm ngay</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BlogDetail;
