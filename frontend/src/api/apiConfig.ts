import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Types for API Responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling ApiResponse wrapper
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    if (!response.data.success) {
      // If the API indicates failure, convert it to an error
      return Promise.reject(new Error(response.data.message || 'Operation failed'));
    }
    return response.data.data; // Return just the data part
  },
  (error: AxiosError) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const data = error.response.data as ApiResponse<any>;
      errorMessage = data.message || `Error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }

    // Show error toast
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default api;
