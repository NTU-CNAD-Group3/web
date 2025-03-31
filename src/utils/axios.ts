import axios from 'axios';

export const url = import.meta.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
