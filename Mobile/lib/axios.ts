import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://maintech-backend-r6yk.onrender.com',
})