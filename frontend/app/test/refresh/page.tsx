"use client";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { refreshToken } from "@/app/lib/auth.service";
import { useToken } from "@/store/useToken";

export default function AuthPage() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const updateToken = useToken((state) => state.updateToken);

    useEffect(() => {
        const runFetch = refreshToken({
            setData,
            setError,
            setLoading,
            updateToken
        });
    }, [])

    if (loading) return <div className="p-10 text-xl">Стучимся на бэкенд... <LoaderIcon className="animate-spin" /></div>;
    if (error) return <div className="p-10 text-xl text-red-500">Ошибка: {error}</div>;

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4 text-green-600">Связь с бэком установлена!</h1>
            <pre className="bg-gray-100 p-4 rounded border">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}