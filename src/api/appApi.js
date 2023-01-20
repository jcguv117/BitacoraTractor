import axios from 'axios';


const { VITE_API_URL } = import.meta.env;


const appApi = axios.create({
    baseURL: VITE_API_URL
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



