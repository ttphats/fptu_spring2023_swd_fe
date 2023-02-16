import axiosClient from './axiosClient';

const notifyApi = {
  getNotify: (fcmToken) => {
    const url = '/notification';
    return axiosClient.post(url, {
      fcmToken,
      title: 'Chào mừng bạn trở lại ^^',
      body: 'Rất vui được phục vụ pạn',
      image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgS6ggp18eT7mu_SfntVCBuKy53YbxUdM-g&usqp=CAU',
      data: {
        additionalProp1: 'string',
        additionalProp2: 'string',
        additionalProp3: 'string',
      },
    });
  },
};

export default notifyApi;
