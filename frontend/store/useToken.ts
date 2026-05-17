import { create } from "zustand"

interface UserInfo {
    login: string,
    role: string
}

interface TokenInterface {
    accessToken: string;
    user: UserInfo | null;
    
    // Обновленный метод для логина: принимает токен и данные юзера
    updateSession: (token: string, user: UserInfo) => void; 
    
    // Метод для интерцептора (обновляет только токен при рефреше, юзер остается)
    updateToken: (token: string) => void; 
    
    // Полный сброс сессии (очищает всё)
    deleteSession: () => void;
}

const getStorageItem = (key: string) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key) || "";
    }
    return "";
}

const getInitialState = () => {
    const token = getStorageItem("token");
    const login = getStorageItem("user_login");
    const role = getStorageItem("user_role");

    return {
        accessToken: token,
        user: login && role ? { login, role } : null,
    };
};
export const useToken = create<TokenInterface>()((set) => ({
    ...getInitialState(),

    updateSession: (token, user) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
            localStorage.setItem("user_login", user.login);
            localStorage.setItem("user_role", user.role);
        }
        set({ accessToken: token, user });
    },

    updateToken: (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
        }
        set({ accessToken: token });
    },
    deleteSession: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user_login");
            localStorage.removeItem("user_role");
        }
        set({ accessToken: "", user: null });
    },
}));