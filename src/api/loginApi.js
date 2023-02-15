import axios from 'axios';
import axiosClient from './axiosClient';

const loginApi = {
  getLogin: (userData) => {
    const url = '/public/auth/login';
    return axiosClient.post(url, userData);
  },
  getLoginPublic: (idToken) => {
    const url = '/oauth2/public/login';
    return axiosClient.get(`${url}?idToken=${idToken}`);
  },
  getUser: () => {
    const url = '/users/users/information';
    return axiosClient.get(url);
  },
};

export default loginApi;
