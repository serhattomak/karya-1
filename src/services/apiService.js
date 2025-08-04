/**
 * API Services
 * Refactored API service layer using new HTTP utilities and constants
 */

import { HttpClient } from '../utils/httpUtils';
import { API_CONFIG } from '../config/constants';

// Create HTTP client instance
const apiClient = new HttpClient();

// Auth Services
export const authService = {
  login: (credentials) => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
};

// Contact Services
export const contactService = {
  getAll: () => apiClient.get(API_CONFIG.ENDPOINTS.CONTACT.BASE),
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.CONTACT.BY_ID(id)),
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.CONTACT.BASE, data),
  update: (data) => apiClient.put(API_CONFIG.ENDPOINTS.CONTACT.BASE, data),
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.CONTACT.BY_ID(id))
};

// Document Services
export const documentService = {
  getAll: (params = {}) => apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.BASE, params),
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.BY_ID(id)),
  getByName: (name) => apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.BY_NAME(name)),
  getBySlug: (slug) => apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.BY_SLUG(slug)),
  getByCategory: (category) => apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.BY_CATEGORY(category)),
  getActive: () => apiClient.get(API_CONFIG.ENDPOINTS.DOCUMENT.ACTIVE),
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENT.BASE, data),
  update: (data) => apiClient.put(API_CONFIG.ENDPOINTS.DOCUMENT.BASE, data),
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.DOCUMENT.BY_ID(id)),
  upload: (formData) => apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENT.UPLOAD, formData),
  download: (id) => apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENT.DOWNLOAD(id))
};

// File Services
export const fileService = {
  getAll: () => apiClient.get(API_CONFIG.ENDPOINTS.FILE.BASE),
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.FILE.BY_ID(id)),
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.FILE.BASE, data),
  update: (data) => apiClient.put(API_CONFIG.ENDPOINTS.FILE.BASE, data),
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.FILE.BY_ID(id)),
  upload: (file) => apiClient.uploadFile(file, API_CONFIG.ENDPOINTS.FILE.UPLOAD)
};

// Page Services
export const pageService = {
  getAll: (params = {}) => apiClient.get(API_CONFIG.ENDPOINTS.PAGE.BASE, params),
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.PAGE.BY_ID(id)),
  getByName: (name) => apiClient.get(API_CONFIG.ENDPOINTS.PAGE.BY_NAME(name)),
  getBySlug: (slug) => apiClient.get(API_CONFIG.ENDPOINTS.PAGE.BY_SLUG(slug)),
  getByType: (type, params = {}) => apiClient.get(API_CONFIG.ENDPOINTS.PAGE.BY_TYPE(type), params),
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.PAGE.BASE, data),
  update: (data) => apiClient.put(API_CONFIG.ENDPOINTS.PAGE.BASE, data),
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.PAGE.BY_ID(id)),
  updateProductOrder: (data) => apiClient.put(API_CONFIG.ENDPOINTS.PAGE.PRODUCT_ORDER, data)
};

// Product Services
export const productService = {
  getAll: (params = {}, withAuth = false) => {
    // Public endpoint for frontend, authenticated for admin
    return apiClient.get(API_CONFIG.ENDPOINTS.PRODUCT.BASE, params);
  },
  getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.PRODUCT.BY_ID(id)),
  getByName: (name) => apiClient.get(API_CONFIG.ENDPOINTS.PRODUCT.BY_NAME(name)),
  getBySlug: (slug) => apiClient.get(API_CONFIG.ENDPOINTS.PRODUCT.BY_SLUG(slug)),
  create: (data) => apiClient.post(API_CONFIG.ENDPOINTS.PRODUCT.BASE, data),
  update: (data) => apiClient.put(API_CONFIG.ENDPOINTS.PRODUCT.BASE, data),
  delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.PRODUCT.BY_ID(id))
};

// Legacy API exports for backward compatibility
// Bu kısım mevcut kodu bozmamak için geçici olarak kalabilir
export const login = authService.login;
export const register = authService.register;
export const logout = authService.logout;

export const getContacts = contactService.getAll;
export const getContact = contactService.getById;
export const createContact = contactService.create;
export const updateContact = contactService.update;
export const deleteContact = contactService.delete;

export const getDocuments = documentService.getAll;
export const getDocument = documentService.getById;
export const getDocumentByName = documentService.getByName;
export const getDocumentBySlug = documentService.getBySlug;
export const getDocumentsByCategory = documentService.getByCategory;
export const getActiveDocuments = documentService.getActive;
export const createDocument = documentService.create;
export const updateDocument = documentService.update;
export const deleteDocument = documentService.delete;
export const uploadDocument = documentService.upload;
export const downloadDocument = documentService.download;

export const getFiles = fileService.getAll;
export const getFile = fileService.getById;
export const createFile = fileService.create;
export const updateFile = fileService.update;
export const deleteFile = fileService.delete;
export const uploadFile = fileService.upload;

export const getPages = pageService.getAll;
export const getPage = pageService.getById;
export const getPageByName = pageService.getByName;
export const getPageBySlug = pageService.getBySlug;
export const getPagesByType = pageService.getByType;
export const createPage = pageService.create;
export const updatePage = pageService.update;
export const deletePage = pageService.delete;
export const updatePageProductOrder = pageService.updateProductOrder;

export const getProducts = productService.getAll;
export const getProductsAuth = (params) => productService.getAll(params, true);
export const getProduct = productService.getById;
export const getProductByName = productService.getByName;
export const getProductBySlug = productService.getBySlug;
export const createProduct = productService.create;
export const updateProduct = productService.update;
export const deleteProduct = productService.delete;

// Health check - backend connection test
export const checkBackendHealth = async () => {
  try {
    await apiClient.get(API_CONFIG.ENDPOINTS.FILE.BASE);
    return {
      isHealthy: true,
      message: "Backend başarıyla erişilebilir"
    };
  } catch (error) {
    return {
      isHealthy: false,
      message: error.message || "Backend bağlantı hatası"
    };
  }
};
