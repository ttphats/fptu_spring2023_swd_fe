import axiosClient from "./axiosClient";

const addressApi = {
    getProvince: () => {
        const url = '/address/provinces';
        return axiosClient.get(url);
    },
    getDistrict: (code) => {
        const url = '/address/provinces';
        return axiosClient.get(`${url}/${code}`);
    },
    getWard: (code) => {
        const url = '/address/districts';
        return axiosClient.get(`${url}/${code}`);
    },
    getLocationType: () => {
        const url = '/locations/types';
        return axiosClient.get(url);
    },
}

export default addressApi;