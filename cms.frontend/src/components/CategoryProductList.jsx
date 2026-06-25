import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ activeId, setActiveId }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryProductService.getAllCategoryProducts()
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    if (loading) return <div className="text-muted p-3">Đang nạp hãng...</div>;

    return (
        <div className="card shadow-sm border-0 mb-3">
            <div className="card-header bg-primary text-white py-3">
                <h6 className="mb-0 text-uppercase font-weight-bold">📁 HÃNG ĐIỆN THOẠI</h6>
            </div>
            <div className="list-group list-group-flush">
                {/* Nút mặc định để xem tất cả sản phẩm */}
                <button
                    type="button"
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${activeId === null ? 'active bg-primary text-white' : ''}`}
                    onClick={() => setActiveId(null)}
                >
                    <span>Tất cả sản phẩm</span>
                </button>
                {/* Vòng lặp kết nối API danh mục thật */}
                {categories.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${activeId === item.id ? 'active bg-primary text-white' : ''}`}
                        onClick={() => setActiveId(item.id)}
                    >
                        <span>{item.name}</span>
                        <span className="badge badge-pill badge-light border">Xem</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
export default CategoryProductList;