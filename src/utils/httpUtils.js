/**
 * HTTP Utilities
 * API çağrıları için yardımcı fonksiyonlar
 */

import axios from 'axios';
import { API_CONFIG, ERROR_MESSAGES, UPLOAD_CONFIG } from '../config/constants';

// Auth Header Helper
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Response Data Extractor
export const extractResponseData = (response) => {
  // Standart response parsing logic
  return response?.data?.data || response?.data || response;
};

// Error Handler
export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response?.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    window.location.href = "/login";
    return { message: ERROR_MESSAGES.UNAUTHORIZED };
  }

  if (error.response?.status === 403) {
    return { message: ERROR_MESSAGES.FORBIDDEN };
  }

  if (error.response?.status === 404) {
    return { message: ERROR_MESSAGES.NOT_FOUND };
  }

  if (error.response?.status >= 500) {
    return { message: ERROR_MESSAGES.SERVER_ERROR };
  }

  if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
    return { message: ERROR_MESSAGES.NETWORK_ERROR };
  }

  // API'den gelen hata mesajı varsa onu kullan
  const apiErrorMessage = error.response?.data?.message || error.response?.data?.error;
  if (apiErrorMessage) {
    return { message: apiErrorMessage };
  }

  return { message: ERROR_MESSAGES.SERVER_ERROR };
};

// File Upload Helper
export const uploadFile = async (file, endpoint = 'upload') => {
  if (!file) {
    throw new Error("Dosya seçilmedi");
  }

  // File size validation
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  // File type validation
  const isImage = UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type);
  const isDocument = UPLOAD_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(file.type);
  
  if (!isImage && !isDocument) {
    throw new Error(ERROR_MESSAGES.INVALID_FILE_TYPE);
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILE.UPLOAD}`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
        timeout: UPLOAD_CONFIG.TIMEOUT,
      }
    );

    return extractResponseData(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

// Image URL Builder
export const buildImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Eğer tam URL ise direkt dön
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Base URL ile birleştir
  return `${API_CONFIG.BASE_URL}/${imagePath}`;
};

// Pagination Helper
export const buildPaginationParams = (pageIndex, pageSize, sortColumn, sortDirection) => {
  const params = {};
  
  if (pageIndex !== undefined && pageIndex !== null) {
    params.PageIndex = Math.max(0, parseInt(pageIndex) || 0);
  }
  
  if (pageSize !== undefined && pageSize !== null) {
    params.PageSize = Math.max(1, parseInt(pageSize) || 10);
  }
  
  if (sortColumn) {
    params.SortColumn = sortColumn;
  }
  
  if (sortDirection) {
    params.SortDirection = sortDirection;
  }
  
  return params;
};

// Request Interceptor Setup
export const setupAxiosInterceptors = () => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Add auth header to all requests if token exists
      const authHeader = getAuthHeader();
      if (authHeader.Authorization) {
        config.headers = { ...config.headers, ...authHeader };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const apiError = handleApiError(error);
      return Promise.reject(apiError);
    }
  );
};

// HTTP Client Class
export class HttpClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });

    this.client.interceptors.request.use(
      (config) => {
        const authHeader = getAuthHeader();
        if (authHeader.Authorization) {
          config.headers = { ...config.headers, ...authHeader };
        }
        return config;
      }
    );

    this.client.interceptors.response.use(
      (response) => extractResponseData(response),
      (error) => Promise.reject(handleApiError(error))
    );
  }

  async get(url, params = {}) {
    return this.client.get(url, { params });
  }

  async post(url, data = {}) {
    return this.client.post(url, data);
  }

  async put(url, data = {}) {
    return this.client.put(url, data);
  }

  async delete(url) {
    return this.client.delete(url);
  }

  async uploadFile(file, url = API_CONFIG.ENDPOINTS.FILE.UPLOAD) {
    const formData = new FormData();
    formData.append("file", file);

    return this.client.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: UPLOAD_CONFIG.TIMEOUT,
    });
  }
}
