"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, ShoppingBag, Plus, Minus, RotateCw } from "lucide-react";
import { getCart, changeQuantityCart, deleteSingleItem, deleteAllItems } from "@/app/lib/cart.service";

export default function CartTestPage() {
    const [cartData, setCartData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Вспомогательные стейты для ручного ввода ID и количества (чтобы легко тестить разные товары)
    const [testVariantId, setTestVariantId] = useState<number>(155);
    const [testQuantity, setTestQuantity] = useState<number>(1);

    const handleAction = async (actionFn: () => Promise<boolean>) => {
        const isSuccess = await actionFn();
        
        if (isSuccess) {
            await getCart({ setData: setCartData, setError, setLoading });
        }
    };

    useEffect(() => {
        getCart({ setData: setCartData, setError, setLoading });
    }, []);

    return (
        <div className="min-h-screen p-6 md:p-12 text-zinc-900 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                <div className="flex flex-row justify-between items-center border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Песочница Модуля Корзины</h1>
                        <p className="text-sm text-zinc-500 mt-1">Интерактивное тестирование методов API в реальном времени</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {loading && <Loader2 className="animate-spin text-zinc-500 w-5 h-5" />}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {error ? "Есть ошибки" : "Система стабильна"}
                        </span>
                    </div>
                </div>

                {/* Вывод лога глобальной ошибки */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
                        <span className="font-bold">Лог ошибки:</span> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* ЛЕВАЯ КОЛОНКА: Панель Управления */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Блок конфигурации параметров */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                ⚙️ Параметры теста
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Variant ID</label>
                                    <input 
                                        type="number" 
                                        value={testVariantId} 
                                        onChange={(e) => setTestVariantId(Number(e.target.value))}
                                        className="w-full h-10 px-3 border rounded-lg text-sm focus:outline-zinc-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Quantity</label>
                                    <input 
                                        type="number" 
                                        value={testQuantity} 
                                        onChange={(e) => setTestQuantity(Number(e.target.value))}
                                        className="w-full h-10 px-3 border rounded-lg text-sm focus:outline-zinc-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Блок запуска методов */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
                            <h2 className="font-semibold text-lg mb-4">🚀 Вызов функций сервиса</h2>
                            
                            {/* 1. Получить корзину (GET) */}
                            <button 
                                disabled={loading}
                                onClick={() => handleAction(() => getCart({ setData: setCartData, setError, setLoading }))}
                                className="w-full flex items-center justify-between h-12 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white rounded-xl font-medium transition-colors text-sm"
                            >
                                <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Получить корзину</span>
                                <span className="text-xs opacity-60 font-mono">getCart()</span>
                            </button>

                            {/* 2. Изменить количество / Добавить товар (POST) */}
                            <button 
                                disabled={loading}
                                onClick={() => handleAction(() => changeQuantityCart({ variantId: testVariantId, quantity: testQuantity, setData: setCartData, setError, setLoading }))}
                                className="w-full flex items-center justify-between h-12 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white rounded-xl font-medium transition-colors text-sm"
                            >
                                <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить / Изменить</span>
                                <span className="text-xs opacity-80 font-mono">changeQuantityCart()</span>
                            </button>

                            {/* 3. Удалить один элемент (DELETE с Variant ID) */}
                            <button 
                                disabled={loading}
                                onClick={() => handleAction(() => deleteSingleItem({ variantId: testVariantId, setError, setLoading }))}
                                className="w-full flex items-center justify-between h-12 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 text-white rounded-xl font-medium transition-colors text-sm"
                            >
                                <span className="flex items-center gap-2"><Minus className="w-4 h-4" /> Удалить по VariantID</span>
                                <span className="text-xs opacity-80 font-mono">deleteSingleItem()</span>
                            </button>

                            {/* 4. Очистить всю корзину (DELETE) */}
                            <button 
                                disabled={loading}
                                onClick={() => handleAction(() => deleteAllItems({ setError, setLoading }))}
                                className="w-full flex items-center justify-between h-12 px-4 bg-red-600 hover:bg-red-700 disabled:bg-zinc-300 text-white rounded-xl font-medium transition-colors text-sm"
                            >
                                <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Полная очистка</span>
                                <span className="text-xs opacity-80 font-mono">deleteAllItems()</span>
                            </button>
                        </div>

                        {/* Краткая шпаргалка-инструкция */}
                        <div className="text-xs text-zinc-500 p-4 bg-zinc-100 rounded-xl space-y-1">
                            <p className="font-semibold text-zinc-700">💡 Советы по ходу тестов:</p>
                            <p>1. Проверь куки: убедись, что твой токен авторизации активен, так как все запросы идут с опцией <code className="bg-white px-1 py-0.5 rounded border">withCredentials</code>.</p>
                            <p>2. При удалении (кнопки 3 и 4) бэкенд возвращает статус 204. Страница сама поймет это и незаметно обновит стейт через повторный GET-запрос.</p>
                        </div>
                    </div>

                    {/* ПРАВАЯ КОЛОНКА: Монитор ответа сервера (Лог JSON) */}
                    <div className="lg:col-span-7 flex flex-col h-[600px]">
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="px-6 py-4 border-b bg-zinc-50 flex flex-row justify-between items-center shrink-0">
                                <span className="text-sm font-semibold tracking-wide text-zinc-600 uppercase">Данные из State (Response JSON)</span>
                                <button 
                                    onClick={() => { setCartData(null); setError(null); }}
                                    className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-500 transition-colors" 
                                    title="Очистить монитор экрана"
                                >
                                    <RotateCw className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto bg-zinc-950 text-emerald-400 font-mono text-xs leading-relaxed custom-scrollbar selection:bg-emerald-800 selection:text-white">
                                {cartData ? (
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(cartData, null, 2)}</pre>
                                ) : (
                                    <div className="text-zinc-500 flex flex-col items-center justify-center h-full gap-2 font-sans text-sm">
                                        <span>[Данные отсутствуют или лог очищен]</span>
                                        <span className="text-[11px] text-zinc-600">Нажми любую кнопку слева для отправки запроса</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}