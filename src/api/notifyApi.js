import axiosClient from './axiosClient';

const notifyApi = {
  getNotify: (fcmToken) => {
    const url = '/notification';
    return axiosClient.post(url, {
      fcmToken,
      title: 'Chào mừng bạn trở lại ^^',
      body: 'Rất vui được phục vụ pạn',
      picture:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgS6ggp18eT7mu_SfntVCBuKy53YbxUdM-g&usqp=CAU',
    });
  },
};

export default notifyApi;
