import axiosClient from './axiosClient';

const voucherApi = {
  getVoucherByLocationType: (location) => {
    const url = '/vouchers/search';
    return axiosClient.get(`${url}?query=location_type=${location}&page=1&size=10`);
  },
  validateVoucher: (voucherIds) => {
    const url = '/vouchers/wish';
    return axiosClient.post(url, voucherIds);
  },
  getVouchersByTripID: (tripId) => {
    const url = '/public/trips';
    return axiosClient.get(`${url}/${tripId}/trip-vouchers`);
  },
};

export default voucherApi;
