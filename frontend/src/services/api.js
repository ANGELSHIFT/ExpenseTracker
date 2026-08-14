import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Create one central Axios instance to use across the whole app
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR
// Before every request, automatically attach the access token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
// If we get a 401 (Unauthorized), try to refresh the access token automatically
api.interceptors.response.use(
  // If response is OK, just return it
  (response) => response,

  // If there's an error...
  async (error) => {
    const originalRequest = error.config;

    // Only try to refresh if it's a 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // mark so we don't retry again

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token at all — force logout and go to login page
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try to get a new access token using the refresh token
        const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // Save the new access token
        localStorage.setItem('accessToken', newAccessToken);

        // Update the failed request's header and retry it
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh token also failed — force logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Expense API calls — simple functions the components will use
export const expenseAPI = {
  list: ()          => api.get('/api/expenses/'),
  create: (data)    => api.post('/api/expenses/', data),
  update: (id, data)=> api.put(`/api/expenses/${id}/`, data),
  destroy: (id)     => api.delete(`/api/expenses/${id}/`),
  monthlyTotal: ()  => api.get('/api/expenses/monthly-total/'),
};

export default api;
