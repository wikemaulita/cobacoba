// src/lib/api.js
import axios from 'axios';

const API_BASE_URL = 'https://be-jelajah-budaya.vercel.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
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
export const getCultures = (params) => apiClient.get('/budaya', { params });
export const getCultureDetail = (id) => apiClient.get(`/budaya/${id}`);
export const createCulture = (cultureData) => apiClient.post('/budaya/create-budaya', cultureData);
export const updateCulture = (id, cultureData) => apiClient.put(`/budaya/${id}`, cultureData);
export const deleteCulture = (id) => apiClient.delete(`/budaya/${id}`);

// --- EVENT Endpoints ---
export const getEvents = (params) => apiClient.get('/events', { params });
export const getEventDetail = (id) => apiClient.get(`/events/${id}`);
export const createEvent = (eventData) => apiClient.post('/events/create-event', eventData);
export const updateEvent = (id, eventData) => apiClient.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => apiClient.delete(`/events/${id}`);

// --- DAERAH (REGION) Endpoints ---
export const getRegions = (params) => apiClient.get('/daerah/', { params });
export const getRegionDetail = (id) => apiClient.get(`/daerah/${id}`);
export const createRegion = (regionData) => apiClient.post('/daerah/create-daerah', regionData);
export const updateRegion = (id, regionData) => apiClient.put(`/daerah/${id}`, regionData);
export const deleteRegion = (id) => apiClient.delete(`/daerah/${id}`);

// --- PROVINSI (PROVINCE) Endpoints ---
export const getProvinces = () => apiClient.get('/provinsi/');
export const getProvinceDetail = (id) => apiClient.get(`/provinsi/${id}`);
export const createProvince = (provinceData) => apiClient.post('/provinsi/create-provinsi', provinceData); 
export const updateProvince = (id, provinceData) => apiClient.put(`/provinsi/${id}`, provinceData); 
export const deleteProvince = (id) => apiClient.delete(`/provinsi/${id}`); 

// --- REQUEST (Admin Account Request) Endpoints ---
export const getAdminRequests = () => apiClient.get('/requests/'); 
export const getAdminRequestDetail = (id) => apiClient.get(`/requests/${id}`); 
export const updateAdminRequest = (id, requestData) => apiClient.put(`/requests/${id}`, requestData); 
export const deleteAdminRequest = (id) => apiClient.delete(`/requests/${id}`); 

// --- EVENT RATE Endpoints ---
export const getEventRatings = (eventId) => apiClient.get(`/event-ratings/event/${eventId}`); 
export const getDetailEventRatings = (ratingId) => apiClient.get(`/event-ratings/${ratingId}`); 
export const getAverageRating = (eventId) => apiClient.get(`/event-ratings/event/${eventId}/average`); 
export const getEventDetailWithRatings = (eventId) => apiClient.get(`/event-rating/event/${eventId}`); 
export const getUserRatingForEvent = (userId, eventId) => apiClient.get(`/event-ratings/user/${userId}`, { params: { eventId: eventId } });
export const joinEvent = (eventId, userId) => apiClient.post('/event-ratings/join', { eventId, userId }); 
export const submitUserRating = (ratingData) => { 
  const { eventId, ...bodyData } = ratingData; 
  return apiClient.put(`/event-ratings/event/${eventId}/rate`, bodyData); 
}
export const deleteRatingParticipation = (eventId) => apiClient.delete(`/event-ratings/event/${eventId}/my-rating`);