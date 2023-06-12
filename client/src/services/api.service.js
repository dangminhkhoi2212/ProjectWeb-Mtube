import axios from 'axios';
import pinia from '../store/defineStore';
import { useAccountStore } from '../store/account';

const commonConfig = {
    headers: {
        // 'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${accountStore.account.token}`,
    },
};
export default (baseURL) => {
    return axios.create({
        baseURL,
        ...commonConfig,
    });
};
