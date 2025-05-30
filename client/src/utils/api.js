import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
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

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server. Please check your internet connection.' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject({ message: 'Request setup failed. Please try again.' });
    }
  }
);

// Helper methods for common API calls
export const apiService = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/users/me'),
  
  // Courses
  getCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  searchCourses: (query) => api.get(`/courses/search?${query}`),
  uploadVideo: (formData) => api.post('/courses/upload-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadResource: (formData) => api.post('/courses/upload-resource', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Enrollments
  getEnrollments: () => api.get('/enrollments/mine'),
  enrollInCourse: (courseId) => api.post(`/enrollments/${courseId}`),
  updateProgress: (enrollmentId, progress) => api.put(`/enrollments/${enrollmentId}/progress`, { progress }),
  
  // Reviews
  getReviews: (courseId) => api.get(`/reviews/${courseId}`),
  getMyReviews: () => api.get('/reviews/mine'),
  createReview: (courseId, reviewData) => api.post('/reviews', { courseId, ...reviewData }),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  
  // Payments
  createOrder: (courseId) => api.post('/payment/create-order', { courseId }),
  verifyPayment: (paymentData) => api.post('/payment/verify', paymentData),
  
  // Admin
  getUsers: () => api.get('/admin/users'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAnalytics: () => api.get('/admin/analytics'),
  exportAnalytics: () => api.get('/analytics/export', { responseType: 'blob' }),
  
  // Instructor
  getInstructorDashboard: () => api.get('/instructor/dashboard'),
  getInstructorCourses: () => api.get('/instructor/courses'),
  getCourseAnalytics: (courseId) => api.get(`/instructor/courses/${courseId}/analytics`),
  
  // Progress
  getProgress: (courseId) => api.get(`/progress/${courseId}`),
  updateProgress: (data) => api.post('/progress/update', data)
};

export default api; 
