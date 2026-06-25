// File: src/services/categoryProductService.js
import axiosClient from '../api/axiosClient';
import { mockCategories } from './mockData';

const categoryProductService = {
  getAllCategoryProducts: () => {
    return axiosClient.get('/categoriesproducts')
      .then(res => {
        const data = res.data ? res.data : res;
        const finalData = Array.isArray(data) ? data : (data?.value || data?.$values || []);
        
        if (finalData.length === 0) {
          console.warn("API CategoriesProducts rỗng, dùng dữ liệu Mock.");
          return mockCategories;
        }
        return finalData;
      })
      .catch(err => {
        console.error("Lỗi kết nối API CategoriesProducts, chuyển sang Mock:", err);
        return mockCategories;
      });
  }
};

export default categoryProductService;