'use client';

import React, { useState } from 'react';
import { getOrders, getOrder, cartCheckout, singleCheckout } from "@/app/lib/order.service";
import { OrderInterface } from "@/types/OrderInterface";
import { VerboseOrderInterface } from "@/types/VerboseOrderInterface";
import { Loader, Package, CreditCard, ShoppingBag, List, Calendar, MapPin, DollarSign, Clock, User } from 'lucide-react';

export default function OrdersExtendedTestPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Типизируем стейты твоими интерфейсами
    // Предполагаем, что getOrders возвращает массив OrderInterface[] или объект, подстраиваем под массив
    const [orders, setOrders] = useState<OrderInterface[] | null>(null);
    const [activeOrder, setActiveOrder] = useState<VerboseOrderInterface | null>(null);
    const [checkoutResult, setCheckoutResult] = useState<VerboseOrderInterface | null>(null);

    // Форма отправки
    const [shippingForm, setShippingForm] = useState<{
        warehouseId: number;
        address: string;
        payment: string;
        comment: string | null; // Явно разрешаем null
        variantId: number;
        quantity: number;
    }>({
        warehouseId: 1,
        address: 'г. Москва, ул. Ленина, д. 10, кв. 14',
        payment: 'CARD',
        comment: 'Доставить после 18:00',
        variantId: 1,
        quantity: 1
    });

    // Хелпер для красивого цвета статуса
    const getStatusBadgeClass = (status: string) => {
        const base = "px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ";
        switch (status?.toLowerCase()) {
            case 'created': case 'new': case 'pending': return base + "bg-blue-100 text-blue-800";
            case 'processing': return base + "bg-amber-100 text-amber-800";
            case 'shipped': case 'delivered': return base + "bg-green-100 text-green-800";
            case 'cancelled': return base + "bg-red-100 text-red-800";
            default: return base + "bg-gray-100 text-gray-800";
        }
    };

    // Вызовы сервисов
    const fetchOrders = async () => {
        setError(null);
        // Передаем стейтсеттер. Если у тебя getOrders принимает стейт, 
        // убедись, что тип данных в setData внутри сервиса совпадает с тем, что шлет бэкенд.
        await getOrders({ setData: setOrders, setError, setLoading });
    };

    const fetchSingleOrder = async (id: number) => {
        setError(null);
        setActiveOrder(null);
        await getOrder({ id, setData: setActiveOrder, setError, setLoading });
    };

    const handleCartCheckout = async () => {
        setError(null);
        await cartCheckout({ ...shippingForm, setData: setCheckoutResult, setError, setLoading });
    };

    const handleSingleCheckout = async () => {
        setError(null);
        await singleCheckout({ ...shippingForm, setData: setCheckoutResult, setError, setLoading });
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-gray-50/50 min-h-screen text-gray-800">
            <header className="border-b pb-4 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                        <Package className="text-blue-600" /> Тестирование Жизненного Цикла Заказов
                    </h1>
                    <p className="text-sm text-gray-500">Компоненты используют интерфейсы OrderInterface и VerboseOrderInterface</p>
                </div>
                <div>
                    {loading ? (
                        <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                            <Loader className="w-4 h-4 animate-spin" /> API заблокирован...
                        </span>
                    ) : (
                        <span className="text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium">Система готова</span>
                    )}
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
                    <strong>Ошибка обработки:</strong> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ЛЕВАЯ ЧАСТЬ: Инициация и чекаут */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Кнопка получения списка */}
                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <List className="w-5 h-5 text-indigo-500" /> Шаг 1: Загрузка списка
                        </h3>
                        <button
                            onClick={fetchOrders}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm shadow-sm"
                        >
                            Выполнить GET /v1/orders
                        </button>
                    </div>

                    {/* Форма симуляции оформления */}
                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <CreditCard className="w-5 h-5 text-emerald-500" /> Шаг 2: Симуляция Checkout (POST)
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Склад ID</label>
                                <input type="number" className="w-full p-2 border rounded-lg bg-gray-50" value={shippingForm.warehouseId} onChange={e => setShippingForm({ ...shippingForm, warehouseId: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Метод оплаты</label>
                                <input type="text" className="w-full p-2 border rounded-lg bg-gray-50" value={shippingForm.payment} onChange={e => setShippingForm({ ...shippingForm, payment: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Адрес доставки</label>
                                <input type="text" className="w-full p-2 border rounded-lg bg-gray-50" value={shippingForm.address} onChange={e => setShippingForm({ ...shippingForm, address: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Комментарий (CommentInterface)</label>
                                <input type="text" className="w-full p-2 border rounded-lg bg-gray-50" value={shippingForm.comment || ''} onChange={e => setShippingForm({ ...shippingForm, comment: e.target.value || null })} />
                            </div>

                            <div className="col-span-2 p-3 bg-amber-50 rounded-lg border border-amber-100 grid grid-cols-2 gap-2 text-xs mt-1">
                                <span className="col-span-2 font-bold text-amber-900">Для singleCheckout (Покупка в 1 клик):</span>
                                <div>
                                    <label className="block mb-1 text-gray-600">Variant ID</label>
                                    <input type="number" className="w-full p-1.5 border bg-white rounded" value={shippingForm.variantId} onChange={e => setShippingForm({ ...shippingForm, variantId: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block mb-1 text-gray-600">Количество</label>
                                    <input type="number" className="w-full p-1.5 border bg-white rounded" value={shippingForm.quantity} onChange={e => setShippingForm({ ...shippingForm, quantity: Number(e.target.value) })} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button onClick={handleCartCheckout} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm">
                                <ShoppingBag className="w-4 h-4" /> Вся корзина
                            </button>
                            <button onClick={handleSingleCheckout} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm">
                                <Package className="w-4 h-4" /> Одиночный
                            </button>
                        </div>
                    </div>

                    {/* Результат создания заказа (если есть) */}
                    {checkoutResult && (
                        <div className="p-4 bg-emerald-950 text-emerald-100 rounded-xl font-mono text-xs space-y-2">
                            <div className="text-emerald-400 font-bold border-b border-emerald-800 pb-1">ЗАКАЗ УСПЕШНО СОЗДАН (ID: {checkoutResult.id})</div>
                            <div>Итоговая сумма: {checkoutResult.totalPrice} ₽</div>
                            <div>Статус: {checkoutResult.status}</div>
                        </div>
                    )}
                </div>

                {/* ПРАВАЯ ЧАСТЬ: Отображение списков и подробностей */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Таблица/Список всех заказов */}
                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <List className="w-5 h-5 text-gray-600" /> Список заказов ({Array.isArray(orders) ? orders.length : 0})
                        </h3>

                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                            {Array.isArray(orders) ? (
                                orders.map((ord) => (
                                    <div
                                        key={ord.id}
                                        onClick={() => fetchSingleOrder(ord.id)}
                                        className={`p-3 border rounded-xl cursor-pointer transition flex flex-wrap justify-between items-center gap-2 ${activeOrder?.id === ord.id ? 'border-indigo-500 bg-indigo-50/40' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="space-y-1">
                                            <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                                Заказ #{ord.id}
                                                <span className={getStatusBadgeClass(ord.status)}>{ord.status}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-3">
                                                <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {new Date(ord.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> Склад: {ord.warehouseId}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-extrabold text-sm text-indigo-600">{ord.totalPrice} ₽</div>
                                            <div className="text-[10px] text-gray-400">Позиций: {ord.items?.length || 0}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-xs text-gray-400 font-mono">// Нажмите кнопку слева, чтобы загрузить список...</div>
                            )}
                        </div>
                    </div>

                    {/* Деталка конкретного заказа (VerboseOrderInterface) */}
                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <Clock className="w-5 h-5 text-indigo-600" /> Подробная информация (VerboseOrderInterface)
                        </h3>

                        {activeOrder ? (
                            <div className="space-y-4">
                                {/* Шапка деталки */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg text-xs">
                                    <div>
                                        <span className="block text-gray-400">ID пользователя</span>
                                        <span className="font-semibold flex items-center gap-1"><User className="w-3 h-3 text-gray-400" /> {activeOrder.userId}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400">Тип оплаты</span>
                                        <span className="font-semibold flex items-center gap-1"><DollarSign className="w-3 h-3 text-gray-400" /> {activeOrder.paymentMethod}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-gray-400">Адрес доставки</span>
                                        <span className="font-semibold truncate block"><MapPin className="w-3 h-3 inline text-gray-400" /> {activeOrder.address}</span>
                                    </div>
                                </div>

                                {/* Список товаров внутри (OrderItemInterface) */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Состав заказа ({activeOrder.items?.length || 0})</h4>
                                    <div className="space-y-2">
                                        {activeOrder.items?.map((item, idx) => (
                                            <div key={idx} className="flex gap-3 p-2 border rounded-lg items-center text-xs bg-white">
                                                {item.mainImageUrl && (
                                                    <img src={item.mainImageUrl} alt={item.title} className="w-10 h-10 object-cover rounded bg-gray-100 flex-shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-gray-900 truncate">{item.title}</div>
                                                    <div className="text-gray-500 text-[11px] flex gap-2">
                                                        <span>Бренд: <strong>{item.brand}</strong></span>
                                                        <span>Размер: <strong>{item.size}</strong></span>
                                                        <span>Цвет: <strong>{item.color}</strong></span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</div>
                                                </div>
                                                <div className="text-right flex-shrink-0 font-mono">
                                                    <div>{item.appliedPrice} ₽ × {item.quantity}</div>
                                                    <div className="font-bold text-gray-900">= {item.subtotal} ₽</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* История статусов (StatusHistoryInterface) */}
                                <div className="space-y-2 pt-2 border-t">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">История изменений статуса</h4>
                                    <div className="relative border-l pl-4 ml-2 space-y-4">
                                        {activeOrder.statusHistory && activeOrder.statusHistory.length > 0 ? (
                                            activeOrder.statusHistory.map((hist, hIdx) => (
                                                <div key={hIdx} className="relative text-xs">
                                                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={getStatusBadgeClass(hist.status)}>{hist.status}</span>
                                                        <span className="text-gray-400 text-[11px]">{new Date(hist.changedAt).toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-gray-600 mt-0.5">Изменил: <strong>{hist.changedByName || 'Система'}</strong></div>
                                                    {hist.comment && (
                                                        <p className="text-gray-500 italic bg-gray-50 p-1.5 rounded mt-1 border-l-2 border-gray-300">{hist.comment}</p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-400 italic text-[11px]">// История изменений пуста или отсутствует в ответе бэка</div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="text-center py-12 text-xs text-gray-400 font-mono bg-gray-50/50 rounded-xl border border-dashed">
                                // Выберите заказ из списка выше, чтобы протестировать Verbose структуру
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}