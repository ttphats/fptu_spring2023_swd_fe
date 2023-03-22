import axiosClient from './axiosClient';

const vnpayApi = {
  depositMoneyToAccount: (amount, returnUrl) => {
    const url = '/transaction/wallet/vnpay';
    return axiosClient.post(url, { amount, returnUrl });
  },
};

export default vnpayApi;