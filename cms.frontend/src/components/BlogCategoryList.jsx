// File: src/components/BlogCategoryList.jsx
import React, { useState, useEffect } from 'react';
import postService from '../services/postService';

const BlogCategoryList = ({ activeId, setActiveId }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        postService.getPostCategories()
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi lấy danh mục bài viết:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-muted p-3"><i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang nạp chủ đề...</div>;

    return (
        <div className="card shadow-sm border-0 mb-3">
            <div className="card-header bg-success text-white py-3">
                <h6 className="mb-0 text-uppercase font-weight-bold">📰 CHỦ ĐỀ BÀI VIẾT</h6>
            </div>
            <div className="list-group list-group-flush">
                {/* Nút xem tất cả bài viết */}
                <button
                    type="button"
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${activeId === null ? 'active bg-success text-white' : ''}`}
                    onClick={() => setActiveId(null)}
                >
                    <span>Tất cả bài viết</span>
                </button>

                {/* Duyệt mảng danh mục bài viết từ API */}
                {categories.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${activeId === item.id ? 'active bg-success text-white' : ''}`}
                        onClick={() => setActiveId(item.id)}
                    >
                        <span>{item.name}</span>
                        <span className="badge badge-pill badge-light border">Đọc</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BlogCategoryList;