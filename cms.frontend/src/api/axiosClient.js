// File: src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7044/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Bóc tách dữ liệu JSON tự động khi API trả về thành công
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Lỗi kết nối API:', error);
        return Promise.reject(error);
    }
);

export const getBackendDomain = () => {
    try {
        const url = new URL(axiosClient.defaults.baseURL);
        return `${url.protocol}//${url.host}`;
    } catch (e) {
        return 'https://localhost:7044';
    }
};

export const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/200?text=No+Image';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `${getBackendDomain()}${url}`;
};

export default axiosClient;