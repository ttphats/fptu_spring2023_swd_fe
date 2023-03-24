import axiosClient from './axiosClient';

const userProfileApi = {
  updateImageUrl: (formData) => {
    const url = '/users/profile/image';
    return axiosClient.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
  },
  updateUserProfile: (data) => {
    const url = '/users/profile';
    return axiosClient.put(url, JSON.stringify(data))
  },
  getAllTransactionsHistory: () => {
    const url = '/users/trasactions';
    return axiosClient.get(`${url}?page=1&limit=20`)
  }
};

export default userProfileApi;
