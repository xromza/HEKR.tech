"use client";

import { useEffect, useRef } from "react";
import { verifySession } from "@/app/lib/auth.service";
import { useToken } from "@/store/useToken";

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const deleteSession = useToken((state) => state.deleteSession);
    const accessToken = useToken((state) => state.accessToken);
    const user = useToken((state) => state.user);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!accessToken || !user) {
            console.log("[AuthGuard]: Нет активной сессии, проверка не нужна");
            return;
        }

        const checkSession = async () => {
            const currentToken = useToken.getState().accessToken;
            if (!currentToken) return;
            console.log("[AuthGuard]: Проверяем сессию на сервере...");
            const isValid = await verifySession();

            if (!isValid) {
                console.log("[AuthGuard]: Сессия невалидна, разлогин");
                deleteSession();

                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            } else {
                console.log("[AuthGuard]: Сессия валидна");
            }
        };

        checkSession();

        const CHECK_INTERVAL = 20 * 60 * 1000;
        intervalRef.current = setInterval(checkSession, CHECK_INTERVAL);

        console.log(`[AuthGuard]: Запущена периодическая проверка каждые ${CHECK_INTERVAL / 1000} секунд`);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                console.log("[AuthGuard]: Интервал проверки остановлен");
            }
        };
    }, [accessToken, user, deleteSession]);

    return <>{children}</>;
}