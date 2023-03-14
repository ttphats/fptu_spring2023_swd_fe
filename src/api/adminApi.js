import axiosClient from "./axiosClient";

const adminApi = {
    getListUser: () => {
        const url = '/users';
        return axiosClient.get(url);
    },
}

export default adminApi;