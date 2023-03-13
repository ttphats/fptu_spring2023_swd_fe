import axios from 'axios';
import axiosClient from './axiosClient';


const tripApi = {
  createTrip: (formData) => {
    console.log('data: ', formData);
    const url = '/trips';
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAllTrips: (sort) => {
    const url = '/public/trips';
    return axiosClient.get(`${url}?page=1&limit=30&sort=postDate:${sort}`);
  },
  getAllTripsUserJoined: (userId) => {
    const url = '/public/trips';
    return axiosClient.get(`${url}?user:${userId}&page=1&limit=8&sort=postDate:desc`);
  },
  getTripMembers: (id) => {
    const url = '/trips';
    return axiosClient.get(`${url}/${id}/trip-members`);
  },
  getTripById: (id) => {
    const url = '/public/trips';
    return axiosClient.get(`${url}/${id}`);
  },
  joinTripById: (id) => {
    const url = '/trips';
    return axiosClient.post(`${url}/${id}/join`);
  },
};

export default tripApi;
