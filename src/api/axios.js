import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // This is crucial for sending cookies
});

instance.interceptors.request.use((config) => {
  return config;
});

export default instance;

