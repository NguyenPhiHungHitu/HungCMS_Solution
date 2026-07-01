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
        // Thay vì in console.error đỏ màn hình cho các lỗi Client (như 401, 400), ta chỉ cảnh báo nhẹ
        console.warn('Yêu cầu API thất bại:', error.message);
        return Promise.reject(error);
    }
);

export const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7044';

export const getBackendDomain = () => {
    try {
        const url = new URL(axiosClient.defaults.baseURL);
        return `${url.protocol}//${url.host}`;
    } catch (e) {
        return 'https://localhost:7044';
    }
};

export const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/200?text=No+Image';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `${IMAGE_BASE_URL}${url}`;
};

export default axiosClient;