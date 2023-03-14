import axiosClient from './axiosClient';

const voucherApi = {
  getVoucherByLocationType: (location) => {
    const url = '/vouchers/search';
    return axiosClient.get(`${url}?location_type=${location}&page=1&size=10`);
  },
};

export default voucherApi;
