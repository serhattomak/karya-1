import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7103";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Backend bağlantı kontrolü ve sistem durumu
export const checkBackendHealth = async () => {
  try {
    console.log("Backend bağlantı kontrolü başlatılıyor...");
    
    // Basit bir GET isteği ile backend'in erişilebilir olup olmadığını kontrol et
    const healthResponse = await axios.get(`${API_URL}/api/File`, { 
      headers: getAuthHeader(),
      timeout: 10000 // 10 saniye timeout
    });
    
    console.log("✅ Backend erişilebilir, durum:", healthResponse.status);
    
    return {
      isHealthy: true,
      status: healthResponse.status,
      message: "Backend başarıyla erişilebilir"
    };
  } catch (error) {
    console.error("❌ Backend bağlantı hatası:", error);
    
    let diagnostics = {
      isHealthy: false,
      error: error.message,
      suggestions: []
    };
    
    // Hata türüne göre tanı ve öneriler
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      diagnostics.message = "Backend sunucusuna bağlanılamıyor";
      diagnostics.suggestions = [
        "Backend sunucusunun çalıştığından emin olun",
        "URL'in doğru olduğunu kontrol edin: " + API_URL,
        "Firewall ayarlarını kontrol edin"
      ];
    } else if (error.message.includes('ERR_HTTP2_PROTOCOL_ERROR')) {
      diagnostics.message = "HTTP/2 protokol hatası";
      diagnostics.suggestions = [
        "Backend'de HTTP/2 ayarlarını kontrol edin",
        "CORS ayarlarını kontrol edin",
        "IIS Express veya Kestrel konfigürasyonunu gözden geçirin"
      ];
    } else if (error.code === 'ENOTFOUND') {
      diagnostics.message = "DNS çözümleme hatası";
      diagnostics.suggestions = [
        "Sunucu adresinin doğru olduğunu kontrol edin",
        "İnternet bağlantınızı kontrol edin"
      ];
    } else if (error.response?.status === 401) {
      diagnostics.message = "Yetkilendirme hatası";
      diagnostics.suggestions = [
        "Giriş yapmaya çalışın",
        "Token'ın geçerli olduğunu kontrol edin"
      ];
    } else if (error.response?.status === 404) {
      diagnostics.message = "API endpoint'i bulunamadı";
      diagnostics.suggestions = [
        "Backend API endpoint'lerinin doğru olduğunu kontrol edin",
        "Backend versiyonunun güncel olduğunu kontrol edin"
      ];
    } else {
      diagnostics.message = "Bilinmeyen bağlantı hatası";
      diagnostics.suggestions = [
        "Backend loglarını kontrol edin",
        "Tarayıcı geliştirici konsolunu kontrol edin"
      ];
    }
    
    return diagnostics;
  }
};

// AUTH
export const login = (data) =>
  axios.post(`${API_URL}/api/Auth/login`, data);

export const register = (data) =>
  axios.post(`${API_URL}/api/Auth/register`, data);

export const logout = () =>
  axios.post(`${API_URL}/api/Auth/logout`, {}, { headers: getAuthHeader() });

// CONTACT
export const getContacts = () =>
  axios.get(`${API_URL}/api/Contact`, { headers: getAuthHeader() });

export const getContact = (id) =>
  axios.get(`${API_URL}/api/Contact/${id}`, { headers: getAuthHeader() });

export const createContact = (data) =>
  axios.post(`${API_URL}/api/Contact`, data, { headers: getAuthHeader() });

export const updateContact = (data) =>
  axios.put(`${API_URL}/api/Contact`, data, { headers: getAuthHeader() });

export const deleteContact = (id) =>
  axios.delete(`${API_URL}/api/Contact/${id}`, { headers: getAuthHeader() });

// FILE
export const getFiles = () =>
  axios.get(`${API_URL}/api/File`, { headers: getAuthHeader() });

export const getFile = (id) =>
  axios.get(`${API_URL}/api/File/${id}`, { headers: getAuthHeader() });

export const createFile = (data) =>
  axios.post(`${API_URL}/api/File`, data, { headers: getAuthHeader() });

export const updateFile = (data) =>
  axios.put(`${API_URL}/api/File`, data, { headers: getAuthHeader() });

export const deleteFile = (id) =>
  axios.delete(`${API_URL}/api/File/${id}`, { headers: getAuthHeader() });

export const uploadFile = (formData, options = {}) => {
  console.log("📤 Upload File API başlıyor...");
  
  // FormData'dan dosya bilgilerini al
  let fileInfo = {};
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      fileInfo = {
        name: value.name,
        type: value.type,
        size: value.size,
        isPDF: value.type === 'application/pdf'
      };
      console.log("📁 Dosya bilgileri:", fileInfo);
    }
  }
  
  console.log("🌐 Upload URL:", `${API_URL}/api/File/upload`);
  
  const config = {
    headers: { 
      ...getAuthHeader()
      // Content-Type'ı kaldırdık, axios otomatik olarak boundary ekleyecek
    },
    timeout: options.timeout || (fileInfo.isPDF ? 600000 : 300000), // PDF için 10 dakika, diğerleri için 5 dakika
    maxContentLength: fileInfo.isPDF ? 50 * 1024 * 1024 : 100 * 1024 * 1024, // PDF için 50MB, diğerleri için 100MB
    maxBodyLength: fileInfo.isPDF ? 50 * 1024 * 1024 : 100 * 1024 * 1024,
    onUploadProgress: options.onUploadProgress,
    // HTTP/2 devre dışı bırak, HTTP/1.1 kullan
    httpAgent: false,
    httpsAgent: false,
    // Retry mekanizması
    validateStatus: (status) => status < 500, // 500+ hatalar için retry
    ...options
  };

  // PDF için özel ayarlar
  if (fileInfo.isPDF) {
    console.log("📄 PDF için özel konfigürasyon uygulanıyor...");
    config.headers['Accept'] = 'application/json';
    // PDF için chunk size ayarı
    config.maxRedirects = 0; // Redirect'leri engelle
  }
  
  console.log("⚙️ Request config:", {
    url: `${API_URL}/api/File/upload`,
    timeout: config.timeout,
    maxContentLength: config.maxContentLength,
    maxBodyLength: config.maxBodyLength,
    headers: config.headers
  });
  
  return axios.post(`${API_URL}/api/File/upload`, formData, config)
    .then(response => {
      console.log("✅ Upload başarılı:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        fileType: fileInfo.type
      });
      return response;
    })
    .catch(error => {
      console.error("❌ Dosya yükleme hatası:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
        fileInfo
      });
      
      // PDF için özel hata analizi
      if (fileInfo.isPDF) {
        console.error("📄 PDF yükleme hatası detayları:", {
          pdfSize: fileInfo.size,
          pdfName: fileInfo.name,
          errorType: error.constructor.name,
          isTimeoutError: error.code === 'ECONNABORTED',
          isNetworkError: error.message.includes('Network Error'),
          isHTTP2Error: error.message.includes('ERR_HTTP2_PROTOCOL_ERROR'),
          statusCode: error.response?.status
        });
      }
      
      // Network hataları için özel mesaj
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Ağ bağlantısı hatası. Backend sunucusunun çalıştığından emin olun.');
      }
      
      // HTTP/2 protokol hataları için özel mesaj
      if (error.message.includes('ERR_HTTP2_PROTOCOL_ERROR')) {
        throw new Error('HTTP/2 protokol hatası. Backend CORS ayarlarını kontrol edin.');
      }
      
      // Timeout hataları için özel mesaj
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Dosya yükleme zaman aşımına uğradı. Backend timeout ayarlarını kontrol edin.');
      }

      // CORS hataları
      if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
        throw new Error('CORS hatası. Backend CORS ayarlarını kontrol edin.');
      }

      // HTTP status hataları
      if (error.response?.status === 413) {
        throw new Error('Dosya çok büyük. Backend maksimum dosya boyutu limitini kontrol edin.');
      }
      
      if (error.response?.status === 415) {
        throw new Error('Desteklenmeyen dosya formatı. Backend dosya türü ayarlarını kontrol edin.');
      }

      if (error.response?.status === 400) {
        throw new Error('Geçersiz dosya. Dosyanın bozuk olmadığından emin olun.');
      }

      if (error.response?.status === 401) {
        throw new Error('Yetkilendirme hatası. Giriş yapmayı deneyin.');
      }

      if (error.response?.status === 403) {
        throw new Error('Dosya yükleme izni yok. Admin ile iletişime geçin.');
      }

      if (error.response?.status === 404) {
        throw new Error('Upload endpoint\'i bulunamadı. Backend API ayarlarını kontrol edin.');
      }

      if (error.response?.status >= 500) {
        throw new Error('Sunucu hatası. Backend loglarını kontrol edin.');
      }

      // Sunucu hatası mesajları
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      // Genel hata mesajı
      throw new Error(`Dosya yükleme hatası: ${error.message || 'Bilinmeyen hata'}`);
    });
};

// DOCUMENT
export const getDocuments = (params = {}) => {
  console.log("API getDocuments - Raw params:", params);
  
  const cleanParams = {};
  
  if (params.PageIndex !== undefined && params.PageIndex !== null) {
    cleanParams.PageIndex = Math.max(0, parseInt(params.PageIndex) || 0);
  }
  
  if (params.PageSize !== undefined && params.PageSize !== null) {
    cleanParams.PageSize = Math.max(1, parseInt(params.PageSize) || 10);
  }
  
  console.log("API getDocuments - Clean params:", cleanParams);
  
  return axios.get(`${API_URL}/api/Document`, { 
    params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined, 
    headers: getAuthHeader() 
  });
};

export const getDocument = (id) =>
  axios.get(`${API_URL}/api/Document/${id}`, { headers: getAuthHeader() });

export const uploadMultipleFiles = (formData, options = {}) => {
  console.log("📤 Çoklu dosya yükleme başlıyor...");
  return axios.post(`${API_URL}/api/File/upload-multiple`, formData, {
    headers: {
      ...getAuthHeader()
    },
    ...options
  });
};

export const uploadDocument = (formData) => {
  console.log("Upload Document API - FormData:", formData);
  console.log("Upload Document API - URL:", `${API_URL}/api/Document/upload`);
  return axios.post(`${API_URL}/api/Document/upload`, formData, {
    headers: {
      ...getAuthHeader()
    },
  });
};
  axios.get(`${API_URL}/api/Document/active`, { headers: getAuthHeader() });

export const createDocument = (data) => {
  console.log("=== CREATE DOCUMENT API ===");
  console.log("Raw data:", data);
  console.log("JSON.stringify(data):", JSON.stringify(data));
  console.log("========================");
  
  return axios.post(
    `${API_URL}/api/Document`,
    JSON.stringify(data),
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
};

export const updateDocument = (data) => {
  console.log("=== UPDATE DOCUMENT API ===");
  console.log("Raw data:", data);
  console.log("JSON.stringify(data):", JSON.stringify(data));
  console.log("========================");
  
  return axios.put(
    `${API_URL}/api/Document`,
    JSON.stringify(data),
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
};

export const deleteDocument = (id) =>
  axios.delete(`${API_URL}/api/Document/${id}`, { headers: getAuthHeader() });

export const downloadDocument = (id) =>
  axios.post(`${API_URL}/api/Document/${id}/download`, {}, { 
    headers: getAuthHeader(),
    responseType: 'blob'
  });

// PAGE
export const getPages = (params) =>
  axios.get(`${API_URL}/api/Page`, { params, headers: getAuthHeader() });

export const getPage = (id) =>
  axios.get(`${API_URL}/api/Page/${id}`, { headers: getAuthHeader() });

export const getPageByName = (name) =>
  axios.get(`${API_URL}/api/Page/name/${name}`, { headers: getAuthHeader() });

export const getPageBySlug = (slug) =>
  axios.get(`${API_URL}/api/Page/slug/${slug}`, { headers: getAuthHeader() });

export const getPagesByType = (type, params) =>
  axios.get(`${API_URL}/api/Page/type/${type}`, { params, headers: getAuthHeader() });

export const createPage = (data) =>
  axios.post(`${API_URL}/api/Page`, data, { headers: getAuthHeader() });

export const updatePage = (data) =>
  axios.put(
    `${API_URL}/api/Page`,
    JSON.stringify(data),
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );

export const updatePageProductOrder = (data) =>
  axios.put(
    `${API_URL}/api/Page/product-order`,
    JSON.stringify(data),
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );

export const deletePage = (id) =>
  axios.delete(`${API_URL}/api/Page/${id}`, { headers: getAuthHeader() });

// PRODUCT
export const getProducts = (params) =>
  axios.get(`${API_URL}/api/Product`, { params });

export const getProductsAuth = (params) =>
  axios.get(`${API_URL}/api/Product`, { params, headers: getAuthHeader() });

export const getProduct = (id) =>
  axios.get(`${API_URL}/api/Product/${id}`);

export const getProductByName = (name) =>
  axios.get(`${API_URL}/api/Product/name/${name}`);

export const getProductBySlug = (slug) =>
  axios.get(`${API_URL}/api/Product/slug/${slug}`);

export const createProduct = (data) =>
  axios.post(`${API_URL}/api/Product`, data, { headers: getAuthHeader() });

export const updateProduct = (data) =>
  axios.put(
    `${API_URL}/api/Product`,
    JSON.stringify(data),
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );

export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/api/Product/${id}`, { headers: getAuthHeader() });
