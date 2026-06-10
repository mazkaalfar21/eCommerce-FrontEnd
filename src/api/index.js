import api from './axios';

// Auth
export const authAPI = {
  login:         (data) => api.post('/auth/login', data),
  register:      (data) => api.post('/auth/register', data),
  logout:        ()     => api.post('/auth/logout'),
  getProfile:    ()     => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Brand
export const brandAPI = {
  getAll:   ()       => api.get('/brand'),
  getById:  (id)     => api.get(`/brand/${id}`),
  create:   (data)   => api.post('/brand', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:   (id, data) => api.put(`/brand/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:   (id)     => api.delete(`/brand/${id}`),
};

// Kategori
export const kategoriAPI = {
  getAll:  ()         => api.get('/kategori'),
  getById: (id)       => api.get(`/kategori/${id}`),
  create:  (data)     => api.post('/kategori', data),
  update:  (id, data) => api.put(`/kategori/${id}`, data),
  delete:  (id)       => api.delete(`/kategori/${id}`),
};

// Ukuran
export const ukuranAPI = {
  getAll:  ()         => api.get('/ukuran'),
  getById: (id)       => api.get(`/ukuran/${id}`),
  create:  (data)     => api.post('/ukuran', data),
  update:  (id, data) => api.put(`/ukuran/${id}`, data),
  delete:  (id)       => api.delete(`/ukuran/${id}`),
};

// Produk
export const produkAPI = {
  getAll:      (params) => api.get('/produk', { params }),
  getFeatured: ()       => api.get('/produk/featured'),
  getById:     (id)     => api.get(`/produk/${id}`),
  create:      (data)   => api.post('/produk', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:      (id, data) => api.put(`/produk/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:      (id)     => api.delete(`/produk/${id}`),
};

// Order
export const orderAPI = {
  getAll:       (params) => api.get('/order', { params }),
  getById:      (id)     => api.get(`/order/${id}`),
  checkout:     (data)   => api.post('/order/checkout', data),
  createManual: (data)   => api.post('/order/manual', data),
  updateStatus: (id, status) => api.put(`/order/status/${id}`, { status }),
  delete:       (id)     => api.delete(`/order/${id}`),
};

// Dashboard
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getChart:   () => api.get('/dashboard/chart'),
};

// Export
export const exportAPI = {
  produkExcel: () => api.get('/export/produk/excel', { responseType: 'blob' }),
  produkPDF:   () => api.get('/export/produk/pdf',   { responseType: 'blob' }),
  orderExcel:  () => api.get('/export/order/excel',  { responseType: 'blob' }),
  orderPDF:    () => api.get('/export/order/pdf',    { responseType: 'blob' }),
};

// User (Admin)
export const userAPI = {
  getAll:  (params)    => api.get('/users', { params }),
  getById: (id)        => api.get(`/users/${id}`),
  create:  (data)      => api.post('/users', data),
  update:  (id, data)  => api.put(`/users/${id}`, data),
  delete:  (id)        => api.delete(`/users/${id}`),
};
