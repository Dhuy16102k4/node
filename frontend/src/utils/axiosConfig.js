import axios from 'axios';

let unauthorizedCallback = null;


export const setUnauthorizedCallback = (callback) => {
  unauthorizedCallback = callback;
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',  
  timeout: 10000, 
});

axiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('authToken');
    console.log("Request Token:", token);  
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;  
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);  
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {

    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Token may have expired or is invalid.');
      

      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      

      if (unauthorizedCallback) {
        unauthorizedCallback(); 
      }

      alert('Your session has expired. Please log in again.');
    }

    console.error('API response error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
