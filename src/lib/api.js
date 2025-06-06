// src/lib/api.js
import axios from 'axios';

// Base URL API sudah diubah sesuai dengan backend Anda
const API_BASE_URL = 'https://be-jelajah-budaya.vercel.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token otorisasi secara otomatis
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ambil token dari local storage
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
// Endpoint user tidak disebutkan untuk diubah, jadi tetap seperti semula
export const loginUser = (email, password) => apiClient.post('/users/login', { email, password });
export const registerRegularUser = (username, email, password) => apiClient.post('/users/register-user', { username, email, password });
export const createAdminUser = (adminData) => apiClient.post('/users/create-admin', adminData); // Digunakan di AccountRequests
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
// POST create provinsi = /provinsi/create-provinsi
export const createProvince = (provinceData) => apiClient.post('/provinsi/create-provinsi', provinceData); // Sesuai permintaan
// PUT edit provinsi = /provinsi/4 -> /provinsi/${id}
export const updateProvince = (id, provinceData) => apiClient.put(`/provinsi/${id}`, provinceData); // Diubah
// DELETE delete provinsi = /provinsi/1 -> /provinsi/${id}
export const deleteProvince = (id) => apiClient.delete(`/provinsi/${id}`); // Diubah

// --- REQUEST (Admin Account Request) Endpoints ---
// GET get request admin = /requests/
export const getAdminRequests = () => apiClient.get('/requests/'); // Diubah
// GET get detail request admin = /requests/1
export const getAdminRequestDetail = (id) => apiClient.get(`/requests/${id}`); // Diubah
// PUT edit request admin = /requests/1
export const updateAdminRequest = (id, requestData) => apiClient.put(`/requests/${id}`, requestData); // Diubah
// DELETE delete request admin = /requests/1
export const deleteAdminRequest = (id) => apiClient.delete(`/requests/${id}`); // Diubah

// --- EVENT RATE Endpoints ---
// GET get event ratings = /event-ratings/ -> (Misal: ratings untuk event tertentu) /event-ratings/event/${eventId}
// Penyesuaian: Jika /event-ratings/ mengambil semua rating (tanpa eventId), fungsi ini mungkin perlu penyesuaian atau fungsi baru.
// Untuk saat ini, kita asumsikan ini untuk mendapatkan rating dari event tertentu.
export const getEventRatings = (eventId) => apiClient.get(`/event-ratings/event/${eventId}`); // Diubah (Asumsi, butuh konfirmasi)
// GET get detail event ratings = /event-ratings/1
export const getDetailEventRatings = (ratingId) => apiClient.get(`/event-ratings/${ratingId}`); // Diubah
// GET get average rating = /event-ratings/event/1/average
export const getAverageRating = (eventId) => apiClient.get(`/event-ratings/event/${eventId}/average`); // Diubah
// GET get detail event = /event-rating/event/1 (Path root berbeda: event-rating)
export const getEventDetailWithRatings = (eventId) => apiClient.get(`/event-rating/event/${eventId}`); // Diubah
// GET get user rating = /event-ratings/user/2 -> Perlu eventId juga, atau userId dari token jika untuk user saat ini
// Penyesuaian: Mengubah signature fungsi untuk menerima userId dan eventId
// Jika ini untuk user saat ini, backend idealnya mengambil userId dari token.
// Jika path `/event-ratings/user/${userId}` adalah final dan eventId diperlukan, eventId bisa jadi query param.
export const getUserRatingForEvent = (userId, eventId) => apiClient.get(`/event-ratings/user/${userId}`, { params: { eventId: eventId } }); // Diubah, signature fungsi juga berubah!
// POST join event = /event-ratings/join
export const joinEvent = (eventId, userId) => apiClient.post('/event-ratings/join', { eventId, userId }); // Diubah
// PUT user give rating = /event-ratings/1/rate -> Asumsi 1 adalah eventId, atau ratingId.
// Jika untuk memberi/update rating event oleh user, maka eventId lebih masuk akal di path.
export const submitUserRating = (ratingData) => { // ratingData = { eventId, userId, rating, comment }
  const { eventId, ...bodyData } = ratingData; // Pisahkan eventId untuk path, sisanya untuk body
  return apiClient.put(`/event-ratings/event/${eventId}/rate`, bodyData); // Diubah (Asumsi eventId di path)
}
// DELETE delete rating & participation = /event-ratings/1
// Asumsi 1 adalah eventId dan ini untuk user saat ini (user dari token).
// Jika '1' adalah ratingId spesifik, pathnya /event-ratings/${ratingId}
export const deleteRatingParticipation = (eventId) => apiClient.delete(`/event-ratings/event/${eventId}/my-rating`); // Diubah (Asumsi eventId dan untuk user saat ini)