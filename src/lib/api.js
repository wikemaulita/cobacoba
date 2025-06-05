// src/lib/api.js
import axios from 'axios';

// It's a good practice to store your API base URL in an environment variable.
// For development, you can define it in your .env file as VITE_API_BASE_URL=http://localhost:3000
// And access it via import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach the authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- USER Endpoints ---
export const loginUser = (email, password) => apiClient.post('/users/login', { email, password });
export const registerRegularUser = (username, email, password) => apiClient.post('/users/register-user', { username, email, password });
export const createAdminUser = (adminData) => apiClient.post('/users/create-admin', adminData);
export const getAllUsers = () => apiClient.get('/users/get-users');
export const getRegularUsers = () => apiClient.get('/users/get-users-regular');
export const getUserDetail = (id) => apiClient.get(`/users/get-detail-user/${id}`);
export const updateUser = (id, userData) => apiClient.put(`/users/edit-user/${id}`, userData);
export const deleteUser = (id) => apiClient.delete(`/users/delete-user/${id}`);

// --- BUDAYA (CULTURE) Endpoints ---
// Note: The backend endpoint is `/budaya/get-budaya`, so `getCultures` will match this.
// For filtering, you can pass params: `getCultures({ type: 'Dance', province: 'Bali' })`
export const getCultures = (params) => apiClient.get('/budaya/get-budaya', { params });
export const getCultureDetail = (id) => apiClient.get(`/budaya/get-detail-budaya/${id}`);
export const createCulture = (cultureData) => apiClient.post('/budaya/create-budaya', cultureData);
export const updateCulture = (id, cultureData) => apiClient.put(`/budaya/edit-budaya/${id}`, cultureData);
export const deleteCulture = (id) => apiClient.delete(`/budaya/delete-budaya/${id}`);

// --- EVENT Endpoints ---
// For filtering, you can pass params: `getEvents({ province: 'Bali', date: '2023-06-15' })`
export const getEvents = (params) => apiClient.get('/event/get-events', { params });
export const getEventDetail = (id) => apiClient.get(`/event/get-event-detail/${id}`);
export const createEvent = (eventData) => apiClient.post('/event/create-event', eventData);
export const updateEvent = (id, eventData) => apiClient.put(`/event/edit-event/${id}`, eventData);
export const deleteEvent = (id) => apiClient.delete(`/event/delete-event/${id}`);

// --- DAERAH (REGION) Endpoints ---
// For filtering, you can pass params: `getRegions({ provinceId: 1 })`
export const getRegions = (params) => apiClient.get('/daerah/get-daerah', { params });
export const getRegionDetail = (id) => apiClient.get(`/daerah/get-detail-daerah/${id}`);
export const createRegion = (regionData) => apiClient.post('/daerah/create-daerah', regionData);
export const updateRegion = (id, regionData) => apiClient.put(`/daerah/edit-daerah/${id}`, regionData);
export const deleteRegion = (id) => apiClient.delete(`/daerah/delete-daerah/${id}`);

// --- PROVINSI (PROVINCE) Endpoints ---
export const getProvinces = () => apiClient.get('/provinsi/get-provinsi');
export const getProvinceDetail = (id) => apiClient.get(`/provinsi/get-detail-provinsi/${id}`);
export const createProvince = (provinceData) => apiClient.post('/provinsi/create-provinsi', provinceData);
export const updateProvince = (id, provinceData) => apiClient.put(`/provinsi/edit-provinsi/${id}`, provinceData);
export const deleteProvince = (id) => apiClient.delete(`/provinsi/delete-provinsi/${id}`);

// --- REQUEST (Admin Account Request) Endpoints ---
export const getAdminRequests = () => apiClient.get('/request/get-request-admin');
export const getAdminRequestDetail = (id) => apiClient.get(`/request/get-detail-request-admin/${id}`);
export const updateAdminRequest = (id, requestData) => apiClient.put(`/request/edit-request-admin/${id}`, requestData);
export const deleteAdminRequest = (id) => apiClient.delete(`/request/delete-request-admin/${id}`);

// --- EVENT RATE Endpoints ---
export const getEventRatings = (eventId) => apiClient.get(`/event-rate/get-event-ratings/${eventId}`);
export const getDetailEventRatings = (ratingId) => apiClient.get(`/event-rate/get-detail-event-ratings/${ratingId}`);
export const getAverageRating = (eventId) => apiClient.get(`/event-rate/get-average-rating/${eventId}`);
// Clarify with backend if this endpoint is different from getEventDetail in Event section
export const getEventDetailWithRatings = (eventId) => apiClient.get(`/event-rate/get-detail-event/${eventId}`);
export const getUserRatingForEvent = (eventId) => apiClient.get(`/event-rate/get-user-rating/${eventId}`);
export const joinEvent = (eventId, userId) => apiClient.post('/event-rate/join-event', { eventId, userId });
export const submitUserRating = (ratingData) => apiClient.put('/event-rate/user-give-rating', ratingData);
export const deleteRatingParticipation = (eventId) => apiClient.delete(`/event-rate/delete-rating-participation/${eventId}`);