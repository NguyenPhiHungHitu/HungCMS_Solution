// File: src/services/customerService.js
import axiosClient from '../api/axiosClient';

const customerService = {
  register: (fullName, email, phone, password) => {
    return axiosClient.post('/Customers/register', {
      fullName: fullName,
      email: email,
      phone: phone,
      password: password
    })
    .then(res => {
      return res.data ? res.data : res;
    });
    // Không dùng catch nuốt lỗi ở đây nữa để lỗi bắn thẳng về giao diện React
  },

  login: (email, password) => {
    return axiosClient.post('/Customers/login', {
      email: email,
      password: password
    })
    .then(res => {
      const data = res.data ? res.data : res;
      return {
        id: data.id,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        mssv: "2123110475" // Đồng bộ MSSV mặc định cho Nguyễn Phi Hùng
      };
    });
  },

  update: (id, fullName, phone, address) => {
    return axiosClient.post(`/Customers/update/${id}`, {
      fullName: fullName,
      phone: phone,
      address: address
    })
    .then(res => {
      const data = res.data ? res.data : res;
      return {
        name: data.fullName,
        phone: data.phone,
        address: data.address
      };
    });
  },

  getOrders: (id) => {
    return axiosClient.get(`/Customers/${id}/orders`)
      .then(res => {
        const data = res.data ? res.data : res;
        const finalData = Array.isArray(data) ? data : (data?.value || data?.$values || []);
        return finalData;
      });
  },

  forgotPassword: (email) => {
    return axiosClient.post('/Customers/forgot-password', { email })
      .then(res => {
        return res.data ? res.data : res;
      });
  },

  changePassword: (id, oldPassword, newPassword) => {
    return axiosClient.post(`/Customers/change-password/${id}`, {
      oldPassword,
      newPassword
    })
    .then(res => {
      return res.data ? res.data : res;
    });
  }
};

export default customerService;
