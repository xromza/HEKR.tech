import { create } from "zustand";

interface UserInfo {
    login: string;
    role: string;
    expire?: string;
}

interface TokenInterface {
    accessToken: string;
    user: UserInfo | null;
    expire: string;
    updateSession: (token: string, user: UserInfo) => void; 
    updateToken: (token: string) => void; 
    deleteSession: () => void;
    clearTimeoutRef: () => void;
}

let logoutTimeout: NodeJS.Timeout | null = null;

const isSessionExpired = (expireStr: string | null): boolean => {
    if (!expireStr) return false;
    const expireTime = Number(expireStr);
    if (isNaN(expireTime)) return false; 
    return Date.now() > expireTime;
};

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return { accessToken: "", user: null, expire: "" };
    }

    const expire = localStorage.getItem("expire") || "";

    if (isSessionExpired(expire)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_login");
        localStorage.removeItem("user_role");
        localStorage.removeItem("expire");
        return { accessToken: "", user: null, expire: "" };
    }

    const token = localStorage.getItem("token") || "";
    const login = localStorage.getItem("user_login") || "";
    const role = localStorage.getItem("user_role") || "";

    return {
        accessToken: token,
        user: login && role ? { login, role } : null,
        expire: expire
    };
};

export const useToken = create<TokenInterface>()((set, get) => {
    
    const startLogoutTimer = (expireTimestamp: string) => {
        if (typeof window === 'undefined') return;
        
        if (logoutTimeout) clearTimeout(logoutTimeout);

        const delay = Number(expireTimestamp) - Date.now();
        
        if (delay <= 0) {
            get().deleteSession();
        } else {
            logoutTimeout = setTimeout(() => {
                console.log("[Zustand]: Время сессии вышло! Автоматический разлогин.");
                get().deleteSession();
            }, delay);
        }
    };

    const initialState = getInitialState();
    if (initialState.expire) {
        startLogoutTimer(initialState.expire);
    }

    return {
        ...initialState,

        updateSession: (token, user) => {
            const SESSION_TTL = 3600000;
            const calculatedExpire = (Date.now() + SESSION_TTL).toString();

            if (typeof window !== "undefined") {
                localStorage.setItem("token", token);
                localStorage.setItem("user_login", user.login);
                localStorage.setItem("user_role", user.role);
                localStorage.setItem("expire", calculatedExpire);
            }

            set({ 
                accessToken: token, 
                user: { login: user.login, role: user.role }, 
                expire: calculatedExpire 
            });

            startLogoutTimer(calculatedExpire);
        },

        updateToken: (token) => {
            if (isSessionExpired(get().expire)) {
                get().deleteSession();
                return;
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("token", token);
            }
            set({ accessToken: token });
        },

        clearTimeoutRef: () => {
            if (logoutTimeout) {
                clearTimeout(logoutTimeout);
                logoutTimeout = null;
            }
        },

        deleteSession: () => {
            if (logoutTimeout) clearTimeout(logoutTimeout);

            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user_login");
                localStorage.removeItem("user_role");
                localStorage.removeItem("expire");
            }
            set({ accessToken: "", user: null, expire: "" });
        },
    };
});