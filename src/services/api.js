import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const REQUEST_TIMEOUT_MS = 30000;

const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('joblytic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Normalize axios errors for UI */
export const getApiErrorMessage = (err, fallback = 'Request failed') => {
  if (!err) return fallback;
  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    return `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s. Check that the backend is running on port 5000.`;
  }
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 401) return 'Session expired. Please log in again.';
  if (!err.response) {
    return 'Cannot reach the server. Start the backend with: cd server && npm run dev';
  }
  return err.message || fallback;
};

export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);
export const getProfile = () => api.get('/api/user/profile');
export const updateProfile = (data) => api.put('/api/user/profile', data);

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  });
};

export const getRecommendedJobs = (page = 1) =>
  api.get('/api/jobs/recommended', { params: { page }, timeout: REQUEST_TIMEOUT_MS });

export const searchJobs = (params) =>
  api.get('/api/jobs/search', { params, timeout: REQUEST_TIMEOUT_MS });

export const saveJob = (id, jobData) => api.post(`/api/jobs/save/${id}`, jobData);
export const unsaveJob = (id) => api.delete(`/api/jobs/save/${id}`);
export const applyToJob = (id, jobData) => api.post(`/api/jobs/apply/${id}`, jobData);
export const updateApplicationStatus = (id, status) =>
  api.patch(`/api/jobs/apply/${id}/status`, { status });

export const interviewPrepRequest = (body) =>
  api.post('/api/interview-prep', body, { timeout: 60000 });

export default api;
