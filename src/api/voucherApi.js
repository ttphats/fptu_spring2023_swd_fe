import axiosClient from './axiosClient';

const voucherApi = {
  getAllVouchers: () => {
    const url = '/vouchers';
    return axiosClient.get(`${url}?page=1&size=100`);
  },
  getVoucherByLocationType: (location) => {
    const url = '/vouchers';
    return axiosClient.get(`${url}?query=location_type=${location}&page=1&size=10`);
  },
  getVoucherByProvince: (province) => {
    const url = '/vouchers';
    return axiosClient.get(`${url}?query=location_address=${province}&page=1&size=10`);
  },
  validateVoucher: (voucherIds) => {
    const url = '/vouchers/wish';
    return axiosClient.post(url, voucherIds);
  },
  getVouchersByTripID: (tripId) => {
    const url = '/public/trips';
    return axiosClient.get(`${url}/${tripId}/trip-vouchers`);
  },
  addVouchersToTrip: (tripId,voucherIds) => {
    const url = '/trips/vouchers';
    return axiosClient.post(url, {
      tripId,
      voucherIds,
    });
  },
};

export default voucherApi;
