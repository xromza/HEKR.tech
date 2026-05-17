"use client";

import { useState, FormEvent } from "react";
import { LoaderIcon } from "lucide-react";
import { login as apiLogin } from "@/app/lib/auth.service"; // Импортируем твою функцию
import { useToken } from "@/store/useToken"; // Твой Zustand стор

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const updateSession = useToken((state) => state.updateSession);
    const updateToken = useToken((state) => state.updateToken)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!username || !password) {
            setError("Заполните все поля");
            return;
        }

        await apiLogin({
            loginValue: username,
            passwordValue: password,
            setData,
            setError,
            setLoading,
            updateSession,
            updateToken
        });
    };

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Авторизация</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Логин</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите логин"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите пароль"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>Входим... <LoaderIcon className="animate-spin size-5" /></>
                    ) : (
                        "Войти"
                    )}
                </button>
            </form>

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded border border-red-200 mb-4 text-sm">
                    Ошибка: {error}
                </div>
            )}

            {data && (
                <div className="mt-6 p-4 bg-green-50 rounded border">
                    <h2 className="text-xl font-bold mb-2 text-green-600">Вход выполнен успешно!</h2>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded border text-xs overflow-x-auto">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}