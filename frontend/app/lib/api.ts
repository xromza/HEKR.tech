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
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
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
            if (isErrorResponse(errorData) && errorData.error === "ExpiredJwt") {
                if (isRefreshing)
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject })
                    }).then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    }).catch((err) => Promise.reject(err));
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
                    processQueue(null, newAccessToken);
                    isRefreshing = false;

                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;
                    console.error("[Axios Interceptor]: Рефреш-кука тоже устарела или невалидна. Тотальный разлогин.");

                    useToken.getState().deleteSession();

                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }

                    return Promise.reject(refreshError);
                }
            }
        }

        if (error.response?.status === 400) {
            const errorData = error.response.data as any;
            if (isMapErrorResponse(errorData) && errorData.error === "ValidationMapError") {
                return Promise.reject(errorData);
            }
        }

        return Promise.reject(error);
    }

)
export default api;