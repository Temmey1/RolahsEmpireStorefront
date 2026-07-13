import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({ baseURL: BASE });

export const productsApi = {
  getAll: (params?: Record<string, any>) => api.get('/products', { params }).then(r => r.data),
  getOne: (id: string) => api.get(`/products/${id}`).then(r => r.data),
};

export const locationsApi = {
  getAll: () => api.get('/locations').then(r => r.data),
};

export const ordersApi = {
  create: (data: any) => api.post('/orders', data).then(r => r.data),
  // Public order view — no auth needed, uses token
  getByToken: (token: string) => api.get(`/orders/public/${token}`).then(r => r.data),
  updateByToken: (token: string, data: any) => api.put(`/orders/public/${token}`, data).then(r => r.data),
};

export const settingsApi = {
  getAll: () => api.get('/settings').then(r => r.data),
};
