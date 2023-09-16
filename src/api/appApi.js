import axios from 'axios';

const { VITE_API_URL, VITE_API_URL_PROD } = import.meta.env;
const BASE_URL = window.location.hostname == "localhost" ? VITE_API_URL_PROD : VITE_API_URL;

const appApi = axios.create({
    baseURL: BASE_URL
});

// Todo: configurar interceptores
appApi.interceptors.request.use( config => {

    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }

    return config;
})


export default appApi;



