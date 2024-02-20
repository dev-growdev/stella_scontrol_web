import axios from 'axios';

const apiService = axios.create({
	baseURL: process.env.REACT_APP_API_URL
});

export interface ResponseAPI {
	success?: boolean;
	code?: number;
	message?: string;
	data?: any;
}

apiService.interceptors.request.use(config => {
	const userToken = localStorage.getItem('token');
	const token = `Bearer ${userToken}`;
	config.headers.authorization = token ? token : '';
	return config;
});
export default apiService;
