import axiosClient from "./axiosClient";


const loginApi = {
    getLogin: (userData) => {
        const url = '/public/auth/login';
        return axiosClient.post(url, userData);
    },
    getUser: () => {
        const url = '/users/users/information';
        return axiosClient.get(url);
    },
}

export default loginApi;