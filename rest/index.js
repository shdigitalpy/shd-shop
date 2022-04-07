import axios from 'axios';

const config = {
    baseURL: 'https://shdigital-api.herokuapp.com/',
};

const instance = axios.create(config);

let token;
if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    // console.log("token", token)

    if (token) {
        instance.defaults.headers.common['Authorization'] = `Token a630ee9120fee557b6e8709fa5813c3c0c1d0915`;
    }
}

export default instance;
