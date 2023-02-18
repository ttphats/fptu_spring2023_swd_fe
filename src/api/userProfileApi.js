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
};

export default userProfileApi;
