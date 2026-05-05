import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Since we are using cookies for JWT, we must set withCredentials
api.defaults.withCredentials = true;

export default api;
