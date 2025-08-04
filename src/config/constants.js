/**
 * Application Constants
 * Tüm uygulama genelinde kullanılan sabitler
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "https://localhost:7103",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/Auth/login",
      REGISTER: "/api/Auth/register", 
      LOGOUT: "/api/Auth/logout"
    },
    CONTACT: {
      BASE: "/api/Contact",
      BY_ID: (id) => `/api/Contact/${id}`
    },
    DOCUMENT: {
      BASE: "/api/Document",
      BY_ID: (id) => `/api/Document/${id}`,
      BY_NAME: (name) => `/api/Document/name/${name}`,
      BY_SLUG: (slug) => `/api/Document/slug/${slug}`,
      BY_CATEGORY: (category) => `/api/Document/category/${category}`,
      ACTIVE: "/api/Document/active",
      UPLOAD: "/api/Document/upload",
      DOWNLOAD: (id) => `/api/Document/${id}/download`
    },
    FILE: {
      BASE: "/api/File",
      BY_ID: (id) => `/api/File/${id}`,
      UPLOAD: "/api/File/upload"
    },
    PAGE: {
      BASE: "/api/Page",
      BY_ID: (id) => `/api/Page/${id}`,
      BY_NAME: (name) => `/api/Page/name/${name}`,
      BY_SLUG: (slug) => `/api/Page/slug/${slug}`,
      BY_TYPE: (type) => `/api/Page/type/${type}`,
      PRODUCT_ORDER: "/api/Page/product-order"
    },
    PRODUCT: {
      BASE: "/api/Product",
      BY_ID: (id) => `/api/Product/${id}`,
      BY_NAME: (name) => `/api/Product/name/${name}`,
      BY_SLUG: (slug) => `/api/Product/slug/${slug}`
    }
  }
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  TIMEOUT: 30000 // 30 seconds
};

// Pagination Defaults
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_INDEX: 1,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Page Types (API'den gelen enum değerleri)
export const PAGE_TYPES = {
  HOME: 0,
  ABOUT: 1,
  PRODUCT: 2,
  CONTACT: 3,
  SERVICE: 4
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.",
  UNAUTHORIZED: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
  FORBIDDEN: "Bu işlem için yetkiniz bulunmuyor.",
  NOT_FOUND: "Aranan kaynak bulunamadı.",
  SERVER_ERROR: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
  VALIDATION_ERROR: "Girilen bilgilerde hata var. Lütfen kontrol edin.",
  FILE_TOO_LARGE: "Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.",
  INVALID_FILE_TYPE: "Geçersiz dosya türü. Lütfen desteklenen dosya türlerini kullanın."
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: "Kayıt başarıyla tamamlandı.",
  UPDATE_SUCCESS: "Güncelleme başarıyla tamamlandı.",
  DELETE_SUCCESS: "Silme işlemi başarıyla tamamlandı.",
  UPLOAD_SUCCESS: "Dosya başarıyla yüklendi."
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Default UI Values
export const UI_DEFAULTS = {
  LOADING_TEXT: "Yükleniyor...",
  NO_DATA_TEXT: "Veri bulunamadı.",
  RETRY_TEXT: "Tekrar dene"
};
