import axiosClient from "./axiosClient";

const adminApi = {
    getListUser: () => {
        const url = '/users';
        return axiosClient.get(url);
    },
    getListVoucher: () => {
        const url = '/vouchers';
        return axiosClient.get(`${url}?page=1&size=200`);
    },
    getDestinations: () => {
        const url = '/trips/countDestination';
        return axiosClient.get(url);
    },
}

export default adminApi;