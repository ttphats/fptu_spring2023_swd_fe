// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request config` for the full list of configs
const axiosClient = axios.create({
  baseURL: 'https://hqtbe.site/api/v1',
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token-info')}`,
  },
  paramsSerializer: {
    serialize: (params) => queryString.stringify(params),
    indexes: false,
  },
});
axiosClient.interceptors.request.use(
  
  async (config) => {
    const token = await localStorage.getItem('token-info');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    return (response && response.data) || response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default axiosClient;
