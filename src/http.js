import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from './router';

let loading;
const startLoading = () => {
    loading = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0,0,0,0,7)'
    })
}

const endLoading = () => {
    loading.close();
}

axios.interceptors.request.use(config => {
    startLoading();

    if(localStorage.token){
        config.headers.Authorization = localStorage.token;
    }

    return config;
}, err => {
    return Promise.reject(err);
});

axios.interceptors.response.use(response => {
    endLoading();
    return response;
}, err => {
    endLoading();
    Message.error(err.response.data.msg);
    const { status} = err.response;
    if(status == 401){
        router.push('/login');
        localStorage.removeItem('token');
    }
    return Promise.reject(err);
})

export default axios;