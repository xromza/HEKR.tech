'use client';

import React, { useState } from 'react';
// Импортируем методы заказов и метод получения корзины
import { getOrders, getOrder, checkout } from "@/app/lib/order.service";
import { getCart } from "@/app/lib/cart.service";
import { OrderInterface } from "@/types/OrderInterface";
import { VerboseOrderInterface } from "@/types/VerboseOrderInterface";
import { CartInterface } from "@/types/CartInterface";
import { Loader, Package, CreditCard, ShoppingBag, List, Calendar, MapPin, DollarSign, Clock, User } from 'lucide-react';
import { mapToOrderSubmit } from '@/app/lib/utils';

export default function OrdersExtendedTestPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [orders, setOrders] = useState<OrderInterface[] | null>(null);
    const [activeOrder, setActiveOrder] = useState<VerboseOrderInterface | null>(null);
    const [checkoutResult, setCheckoutResult] = useState<VerboseOrderInterface | null>(null);

    // Локальный стейт для хранения загруженной корзины (чтобы видеть, что отправляем)
    const [cart, setCart] = useState<CartInterface | null>(null);

    // Состояние формы
    const [shippingForm, setShippingForm] = useState({
        warehouseId: 1,
        address: 'г. Краснодар, ул. Красная, д. 100',
        payment: 'CARD',
        comment: 'Доставить после 18:00',
        variantId: 1,
        quantity: 1
    });

    // Хелпер для статусов
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

    // GET /v1/orders
    const handleFetchOrders = async () => {
        setError(null);
        await getOrders({ setData: setOrders, setError, setLoading });
    };

    // GET /v1/orders/{id}
    const handleFetchSingleOrder = async (id: number) => {
        setError(null);
        setActiveOrder(null);
        await getOrder({ id, setData: setActiveOrder, setError, setLoading });
    };

    // Универсальный обработчик checkout
    const handleCheckout = async (isSingleItem: boolean) => {
        setError(null);
        setCheckoutResult(null);
        let itemsToSubmit = [];

        if (isSingleItem) {
            // Сценарий 1: Покупка в 1 клик (берём данные напрямую из формы)
            itemsToSubmit = [{ variantId: shippingForm.variantId, quantity: shippingForm.quantity }];
        } else {
            // Сценарий 2: Оформление всей корзины
            setLoading(true);

            let fetchedCart: any = null; // Используем any для обхода ловушки сужения типов в замыкании

            const success = await getCart({
                setData: (data: CartInterface) => {
                    fetchedCart = data;
                    setCart(data);
                },
                setError,
                setLoading: () => { }
            });

            if (!success || !fetchedCart) {
                setError("Не удалось загрузить корзину.");
                setLoading(false);
                return;
            }

            // Явно кастим к CartInterface
            const actualCart = fetchedCart as CartInterface;
            const cartItems = actualCart.items;

            if (!cartItems || cartItems.length === 0) {
                setError("Не удалось оформить заказ: корзина пуста.");
                setLoading(false);
                return;
            }

            // Трансформируем элементы
            itemsToSubmit = mapToOrderSubmit({cartItems: actualCart.items});
        }

        // Отправляем сформированный массив на эндпоинт /v1/orders
        await checkout({
            items: itemsToSubmit,
            warehouseId: shippingForm.warehouseId,
            address: shippingForm.address,
            payment: shippingForm.payment,
            comment: shippingForm.comment,
            setData: setCheckoutResult,
            setError,
            setLoading
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-gray-50/50 min-h-screen text-gray-800">
            <header className="border-b pb-4 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                        <Package className="text-blue-600" /> Слой тестирования HEKR STORE Orders API
                    </h1>
                    <p className="text-sm text-gray-500">Автоматический запрос корзины перед вызовом checkout()</p>
                </div>
                <div>
                    {loading ? (
                        <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                            <Loader className="w-4 h-4 animate-spin" /> API в процессе...
                        </span>
                    ) : (
                        <span className="text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium">Система готова</span>
                    )}
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-mono">
                    <strong>Ошибка обработки:</strong> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ЛЕВАЯ КОЛОНКА */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Загрузка списка заказов */}
                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <List className="w-5 h-5 text-indigo-500" /> Шаг 1: Загрузка списка
                        </h3>
                        <button
                            onClick={handleFetchOrders}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm shadow-sm"
                        >
                            Выполнить GET /v1/orders
                        </button>
                    </div>

                    {/* Форма чекаута */}
                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <CreditCard className="w-5 h-5 text-emerald-500" /> Шаг 2: Симуляция checkout()
                        </h3>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="col-span-2 bg-amber-50/60 p-3 rounded-lg border border-amber-100 space-y-2">
                                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Одиночный товар (Тест покупки в 1 клик)</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Variant ID</label>
                                        <input type="number" className="w-full p-2 border bg-white rounded-md" value={shippingForm.variantId} onChange={e => setShippingForm({ ...shippingForm, variantId: Number(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Количество</label>
                                        <input type="number" className="w-full p-2 border bg-white rounded-md" value={shippingForm.quantity} onChange={e => setShippingForm({ ...shippingForm, quantity: Number(e.target.value) })} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Склад ID</label>
                                <input type="number" className="w-full p-2 border rounded-md bg-gray-50" value={shippingForm.warehouseId} onChange={e => setShippingForm({ ...shippingForm, warehouseId: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Метод оплаты</label>
                                <input type="text" className="w-full p-2 border rounded-md bg-gray-50" value={shippingForm.payment} onChange={e => setShippingForm({ ...shippingForm, payment: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs text-gray-600 mb-1">Адрес доставки</label>
                                <input type="text" className="w-full p-2 border rounded-md bg-gray-50" value={shippingForm.address} onChange={e => setShippingForm({ ...shippingForm, address: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs text-gray-600 mb-1">Комментарий</label>
                                <input type="text" className="w-full p-2 border rounded-md bg-gray-50" value={shippingForm.comment} onChange={e => setShippingForm({ ...shippingForm, comment: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => handleCheckout(false)}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm transition"
                            >
                                <ShoppingBag className="w-4 h-4" /> Вся корзина (Динамически)
                            </button>
                            <button
                                onClick={() => handleCheckout(true)}
                                disabled={loading}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm transition"
                            >
                                <Package className="w-4 h-4" /> В 1 клик (Single)
                            </button>
                        </div>
                    </div>

                    {/* Локальный лог подгруженной корзины (полезно при отладке) */}
                    {cart && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                            <span className="font-bold text-blue-900 block">Лог предзагрузки корзины:</span>
                            <div>Позиций обнаружено: {cart.items?.length || 0}</div>
                            <div>Общая сумма: {cart.totalPrice} ₽</div>
                        </div>
                    )}

                    {/* Результат создания заказа */}
                    {checkoutResult && (
                        <div className="p-4 bg-gray-900 text-gray-100 rounded-xl font-mono text-xs space-y-2 shadow-inner border-l-4 border-emerald-500">
                            <div className="text-emerald-400 font-bold border-b border-gray-800 pb-1 flex justify-between">
                                <span>ЗАКАЗ ГЕНЕРИРОВАН ЧЕРЕЗ /all</span>
                                <span>ID: {checkoutResult.id}</span>
                            </div>
                            <div>Итого: <span className="text-amber-400 font-bold">{checkoutResult.totalPrice} ₽</span></div>
                            <div>Статус: {checkoutResult.status}</div>
                        </div>
                    )}
                </div>

                {/* ПРАВАЯ КОЛОНКА */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Список всех заказов */}
                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <List className="w-5 h-5 text-gray-600" /> Заказы в системе ({orders ? orders.length : 0})
                        </h3>

                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                            {orders && orders.length > 0 ? (
                                orders.map((ord) => (
                                    <div
                                        key={ord.id}
                                        onClick={() => handleFetchSingleOrder(ord.id)}
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
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-xs text-gray-400 font-mono">// Нажмите кнопку слева...</div>
                            )}
                        </div>
                    </div>

                    {/* Детализация структуры VerboseOrderInterface */}
                    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                            <Clock className="w-5 h-5 text-indigo-600" /> Детальная спецификация (Verbose)
                        </h3>

                        {activeOrder ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg text-xs border">
                                    <div>
                                        <span className="block text-gray-400">User ID</span>
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

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Товары ({activeOrder.items?.length || 0})</h4>
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
                                                </div>
                                                <div className="text-right flex-shrink-0 font-mono">
                                                    <div>{item.appliedPrice} ₽ × {item.quantity}</div>
                                                    <div className="font-bold text-gray-900">= {item.subtotal} ₽</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">История изменений</h4>
                                    <div className="relative border-l pl-4 ml-2 space-y-4">
                                        {activeOrder.statusHistory && activeOrder.statusHistory.length > 0 ? (
                                            activeOrder.statusHistory.map((hist, hIdx) => (
                                                <div key={hIdx} className="relative text-xs">
                                                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={getStatusBadgeClass(hist.status)}>{hist.status}</span>
                                                        <span className="text-gray-400 text-[11px]">{new Date(hist.changedAt).toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-gray-600 mt-0.5">Кто изменил: <strong>{hist.changedByName || 'Система'}</strong></div>
                                                    {hist.comment && (
                                                        <p className="text-gray-500 italic bg-gray-50 p-1.5 rounded mt-1 border-l-2 border-gray-300">{hist.comment}</p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-400 italic text-[11px]">// Лог пуст</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-xs text-gray-400 font-mono bg-gray-50/50 rounded-xl border border-dashed">
                                // Выберите заказ из списка выше
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}