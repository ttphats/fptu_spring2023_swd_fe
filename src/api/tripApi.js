import axios from 'axios';
import axiosClient from './axiosClient';

const tripApi = {
  createTrip: (formData) => {
    console.log('data: ', formData);
    const url = '/trips';
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  },
};

export default tripApi;
