// File: src/components/PostList.jsx
import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import { getImageUrl } from '../api/axiosClient';

const PostList = ({ activeCategoryId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        postService.getAllPosts()
            .then(res => {
                // 🌟 BƯỚC 1: Lột lớp vỏ của thư viện Axios (lấy res.data)
                const rawData = res.data ? res.data : res;

                // 🌟 BƯỚC 2: Lột lớp vỏ $values của ASP.NET Core (nếu có)
                const finalData = Array.isArray(rawData) ? rawData : (rawData?.$values || []);

                // In ra F12 để kiểm chứng
                console.log("📦 Dữ liệu bài viết đã bóc tách:", finalData);

                setPosts(finalData);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    if (loading) return <div className="text-center py-4 text-muted">Đang tải tin tức công nghệ...</div>;

    const filteredPosts = activeCategoryId
        ? posts.filter(p => {
            const postCatId = p.categoryId || p.CategoryId || p.idCategory;
            return String(postCatId) === String(activeCategoryId);
        })
        : posts;

    return (
        <div className="row">
            {filteredPosts.length > 0 ? (
                filteredPosts.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg p-3 blog-card-hover" style={{ transition: '0.3s' }}>
                            {item.imageUrl && (
                                <div className="mb-3 rounded overflow-hidden" style={{ height: '180px' }}>
                                    <img
                                        src={getImageUrl(item.imageUrl)}
                                        alt={item.title}
                                        className="w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}
                            <div className="card-body p-0 mt-2">
                                <small className="text-success font-weight-bold mb-2 d-block">
                                    <i className="fa-regular fa-calendar mr-1"></i>
                                    {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                                </small>
                                <h6 className="font-weight-bold text-dark mb-2" style={{ lineHeight: '1.4' }}>
                                    {item.title}
                                </h6>
                                <p className="card-text text-secondary small text-truncate">
                                    Bấm vào để xem nội dung chi tiết...
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-12 text-center py-5">
                    <p className="text-muted font-weight-bold">Chưa có bài viết nào thuộc chủ đề này.</p>
                </div>
            )}
        </div>
    );
};

export default PostList;