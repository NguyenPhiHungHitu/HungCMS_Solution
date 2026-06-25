// File: src/services/postService.js
import axiosClient from '../api/axiosClient';
import { mockPosts, mockPostCategories } from './mockData';

const postService = {
  getAllPosts: () => {
    return axiosClient.get('/Posts') // Vì baseURL đã có /api nên chỉ cần /Posts
      .then(res => {
        const data = res.data ? res.data : res;
        const finalData = Array.isArray(data) ? data : (data?.value || data?.$values || []);
        
        if (finalData.length === 0) {
          console.warn("API Posts rỗng, dùng bài viết Mock.");
          return mockPosts;
        }
        return finalData;
      })
      .catch(err => {
        console.error("Lỗi kết nối API Posts, dùng mock:", err);
        return mockPosts;
      });
  },

  getPostCategories: () => {
    return axiosClient.get('/Categories')
      .then(res => {
        const data = res.data ? res.data : res;
        const finalData = Array.isArray(data) ? data : (data?.value || data?.$values || []);
        
        if (finalData.length === 0) {
          console.warn("API Categories (Posts) rỗng, dùng danh mục bài viết Mock.");
          return mockPostCategories;
        }
        return finalData;
      })
      .catch(err => {
        console.error("Lỗi kết nối API Categories, dùng mock:", err);
        return mockPostCategories;
      });
  },

  getPostById: (id) => {
    return axiosClient.get(`/Posts/${id}`)
      .then(res => {
        const data = res.data ? res.data : res;
        return data;
      })
      .catch(err => {
        console.warn("Lỗi lấy chi tiết bài viết từ API, dùng mock:", err);
        return mockPosts.find(p => String(p.id) === String(id)) || mockPosts[0];
      });
  }
};

export default postService;