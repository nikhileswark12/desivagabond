import axios from 'axios';
import { useStore } from './store';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authApi = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Trips
export const tripsApi = {
  list: (params?: any) => api.get('/trips', { params }),
  get: (id: string) => api.get(`/trips/${id}`),
  create: (data: any) => api.post('/trips', data),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  share: (id: string, isPublic: boolean) => api.patch(`/trips/${id}/share`, { isPublic }),
  addStop: (id: string, data: any) => api.post(`/trips/${id}/stops`, data),
  updateStop: (id: string, stopId: string, data: any) => api.put(`/trips/${id}/stops/${stopId}`, data),
  deleteStop: (id: string, stopId: string) => api.delete(`/trips/${id}/stops/${stopId}`),
  reorderStops: (id: string, stopIds: string[]) => api.patch(`/trips/${id}/stops/reorder`, { stopIds }),
  getBudget: (id: string) => api.get(`/trips/${id}/budget`),
  addBudgetItem: (id: string, data: any) => api.post(`/trips/${id}/budget`, data),
  deleteBudgetItem: (id: string, itemId: string) => api.delete(`/trips/${id}/budget/${itemId}`),
  getPacking: (id: string) => api.get(`/trips/${id}/packing`),
  addPackingItem: (id: string, data: any) => api.post(`/trips/${id}/packing`, data),
  updatePackingItem: (id: string, itemId: string, data: any) => api.put(`/trips/${id}/packing/${itemId}`, data),
  deletePackingItem: (id: string, itemId: string) => api.delete(`/trips/${id}/packing/${itemId}`),
  getNotes: (id: string) => api.get(`/trips/${id}/notes`),
  addNote: (id: string, data: any) => api.post(`/trips/${id}/notes`, data),
  updateNote: (id: string, noteId: string, data: any) => api.put(`/trips/${id}/notes/${noteId}`, data),
  deleteNote: (id: string, noteId: string) => api.delete(`/trips/${id}/notes/${noteId}`),
};

// Cities & Activities
export const citiesApi = {
  list: (params?: any) => api.get('/cities', { params }),
  types: () => api.get('/cities/types'),
  regions: () => api.get('/cities/regions'),
};

export const activitiesApi = {
  list: (params?: any) => api.get('/activities', { params }),
  categories: () => api.get('/activities/categories'),
};

// Admin
export const adminApi = {
  stats: () => api.get('/admin/stats'),
  auditLogs: (params?: any) => api.get('/admin/audit-logs', { params }),
};

// Shared
export const sharedApi = {
  get: (token: string) => api.get(`/shared/${token}`),
};
