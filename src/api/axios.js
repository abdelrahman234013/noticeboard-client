import axios from 'axios';

const api = axios.create({
  baseURL: 'https://noticeboard-backend-nvij.onrender.com',
  withCredentials: true,
});

export default api;
