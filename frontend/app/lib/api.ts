import { useToken } from '@/store/useToken';
import { AuthAction } from '@/types/AuthAction';
import { ErrorResponse } from '@/types/ErrorResponse';
import { MapErrorResponse } from '@/types/MapErrorResponse';
import axios, { AxiosError } from 'axios';

function isErrorResponse(data: any): data is ErrorResponse {
    return data && typeof data === "object" && "description" in data;
}

function isMapErrorResponse(data: any): data is MapErrorResponse {
    return data && typeof data === "object" && "errors" in data;
}

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

let isRefreshing = false;

api.interceptors.request.use(
    (config) => {
        const token = useToken.getState().accessToken;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {

        const originalRequest = error.config;
        if (
            error.response?.status === 401
            && originalRequest
            && !(originalRequest as any)._retry
        ) {
            const errorData = error.response.data as any;
            if (isErrorResponse(errorData)) {
                if (errorData.error === "ExpiredJwt") {
                    if (isRefreshing) return Promise.reject(error);
                    isRefreshing = true;
                    (originalRequest as any)._retry = true;
                    try {
                        console.log("[Axios Interceptor]: Токен устарел. Пытаюсь обновить...");
                        const res = await api.post<AuthAction>("/v1/auth/refresh", {}, {
                            withCredentials: true
                        })


                        const newAccessToken = res.data.accessToken;

                        console.log("[Axios Interceptor]: Токен успешно обновлен!");


                        useToken.getState().updateToken(newAccessToken);

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        }

                        isRefreshing = false;

                        return api(originalRequest);
                    } catch (refreshError) {
                        isRefreshing = false;
                        console.error("[Axios Interceptor]: Рефреш-кука тоже устарела или невалидна. Тотальный разлогин.");

                        useToken.getState().deleteSession();

                        if (typeof window !== "undefined") {
                            window.location.href = "/login";
                        }

                        return Promise.reject(refreshError);
                    }
                }
                else
                    return Promise.reject(error)

            }
        }
        return Promise.reject(error);
    }

)
export default api;