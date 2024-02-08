import axios from "axios";

const apiService = axios.create({
    baseURL: "http://localhost:8081/api",
});

export interface ResponseAPI {
    success?: boolean;
    code?: number;
    message?: string;
    data?: any;
}

apiService.interceptors.request.use((config) => {
    const userToken = localStorage.getItem("token");
    const token = `Bearer ${userToken}`;
    config.headers.authorization = token ? token : "";
    return config;
});
export default apiService;