import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7103";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

export const uploadFile = (formData) =>
  axios.post(`${API_URL}/api/File/upload`, formData, {
    headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
  });

// PAGE
export const getPages = (params) =>
  axios.get(`${API_URL}/api/Page`, { params, headers: getAuthHeader() });

export const getPage = (id) =>
  axios.get(`${API_URL}/api/Page/${id}`, { headers: getAuthHeader() });

export const getPageByName = (name) =>
  axios.get(`${API_URL}/api/Page/name/${name}`, { headers: getAuthHeader() });

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
