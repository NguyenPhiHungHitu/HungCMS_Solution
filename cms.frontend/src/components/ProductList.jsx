import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import { getImageUrl } from '../api/axiosClient';

const ProductList = ({ activeCategoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productService.getAll()
            .then(data => { if (Array.isArray(data)) setProducts(data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    if (loading) return <div className="text-center py-4 text-primary">Đang tải sản phẩm...</div>;

    // THUẬT TOÁN: Lọc sản phẩm theo mã hãng điện thoại [camelCase id]
    const filteredProducts = activeCategoryId
        ? products.filter(p => p.categoryProductId === activeCategoryId)
        : products;

    return (
        <div className="row">
            {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden">
                            <div className="phone-img-wrapper">
                                <img src={getImageUrl(item.imageUrl)} alt={item.name} />
                            </div>
                            <div className="card-body p-4">
                                <h5 className="card-title font-weight-bold text-dark mb-2">{item.name}</h5>
                                <h6 className="text-danger font-weight-bold mb-3">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </h6>
                                <p className="card-text small text-muted mb-0">Kho còn: {item.stockQuantity} chiếc</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-12 text-center py-4"><p className="text-muted">Không tìm thấy sản phẩm nào thuộc hãng này.</p></div>
            )}
        </div>
    );
};
export default ProductList;