'use client';

import { getOrder } from "@/app/lib/order.service";
import { useToken } from "@/store/useToken";
import { VerboseOrderInterface } from "@/types/VerboseOrderInterface";
import { Loader, TriangleAlert, ArrowLeft, Calendar, CreditCard, Package, MapPin } from "lucide-react";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, getEnding } from "@/app/lib/utils";

const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'NEW':
            return { text: 'Новый', className: 'bg-blue-50 text-blue-700 border-blue-200' };
        case 'PROCESSING':
            return { text: 'В обработке', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
        case 'ASSEMBLING':
            return { text: 'Собирается', className: 'bg-amber-50 text-amber-700 border-amber-200' };
        case 'ASSEMBLED':
            return { text: 'Собран', className: 'bg-orange-50 text-orange-700 border-orange-200' };
        case 'SHIPPING':
            return { text: 'Передан в доставку', className: 'bg-purple-50 text-purple-700 border-purple-200' };
        case 'SHIPPED':
            return { text: 'Доставляется', className: 'bg-sky-50 text-sky-700 border-sky-200' };
        case 'COMPLETED':
            return { text: 'Выполнен', className: 'bg-green-50 text-green-700 border-green-200' };
        case 'CANCELED':
            return { text: 'Отменен', className: 'bg-red-50 text-red-700 border-red-200' };
        default:
            return { text: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
};

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
};

export default function OrderPage({
    params,
}: { params: Promise<{ id: string }>; }) {
    const { id } = use(params);
    const router = useRouter();
    const handleBack = () => {
        router.push('/profile?s=2');
    };
    const [orderData, setOrderData] = useState<VerboseOrderInterface | null>(null);
    const [error, setError] = useState<string | null>(null);
    const loginValue = useToken((state) => state.user?.login);
    const [loading, setLoading] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        setOrderData(null);
        setError(null);
        setLoading(true);
        if (id) {
            getOrder({
                id: Number(id),
                setData: setOrderData,
                setError: setError,
                setLoading: setLoading
            });
        }
    }, [id, loginValue]);
    const totalQuantity = orderData?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <main className="h-full w-full mx-auto flex max-w-[1680px] p-4">
            {loading ? (
                <div className="w-full h-[60vh] flex items-center justify-center">
                    <Loader className="animate-spin w-8 h-8" />
                </div>
            ) : (error || !loginValue || !isMounted) ? (
                <div className="flex flex-col items-center justify-center w-full px-4 gap-4 text-md md:text-xl h-[60vh]">
                    <TriangleAlert className="w-[7rem] h-[7rem] text-black" />
                    <div className="text-center uppercase">{error ? error : "сначала необходимо авторизоваться в системе"}</div>
                </div>
            ) : orderData && (
                <div className="w-full space-y-8 animate-fadeIn">

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleBack}
                            className="flex cursor-pointer items-center gap-2 text-xs uppercase font-bold text-gray-400 hover:text-black transition-colors self-start"
                        >
                            <ArrowLeft className="w-4 h-4" /> Назад к заказам
                        </button>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-gray-200 pb-6">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-4">
                                    <h1 className="text-[2.5rem] font-bold uppercase leading-none">Заказ #{orderData.id}</h1>
                                    <span className={`text-xs px-3 py-1 font-bold uppercase border-2 tracking-wider ${getStatusConfig(orderData.status).className}`}>
                                        {getStatusConfig(orderData.status).text}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 uppercase font-medium">
                                    Создан {formatDate(orderData.date)}
                                </p>
                            </div>
                            <div className="sm:text-right">
                                <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Итоговая стоимость</span>
                                <span className="text-3xl font-black whitespace-nowrap">{formatPrice(orderData.totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        <div className="lg:col-span-2 space-y-8">

                            <div className="w-full rounded-lg border-2 p-6 md:p-8 bg-white">
                                <div className="text-lg font-bold uppercase flex items-center gap-2 mb-6 border-b-2 border-gray-100 pb-2">
                                    <Package className="w-5 h-5 text-gray-500" /> Информация о доставке
                                </div>
                                <table className="w-full text-start flex">
                                    <tbody>
                                        <tr>
                                            <td className="py-[0.5] md:pr-8 font-medium uppercase text-sm md:text-md md:whitespace-nowrap border-r-2 border-gray-300">
                                                Адрес доставки
                                            </td>
                                            <td className="pl-4 md:pl-8 text-gray-900 uppercase break-all">
                                                {orderData.address}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-[0.5] md:pr-8 font-medium uppercase text-sm md:text-md md:whitespace-nowrap border-r-2 border-gray-300">
                                                Способ оплаты
                                            </td>
                                            <td className="pl-4 md:pl-8 text-gray-900 break-all uppercase">
                                                {orderData.paymentMethod === 'CARD' ? 'Картой онлайн' : orderData.paymentMethod}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-[0.5] md:pr-8 font-medium uppercase text-sm md:text-md md:whitespace-nowrap border-r-2 border-gray-300">
                                                Количество
                                            </td>
                                            <td className="pl-4 md:pl-8 text-gray-900 break-all uppercase">
                                                {totalQuantity} {getEnding(totalQuantity, ["позиция", "позиции", "позиций"])}
                                            </td>
                                        </tr>
                                        <tr>
                                            {
                                                orderData.comment !== null && orderData.comment.length > 0 &&
                                                <td className="py-[0.5] md:pr-8 font-medium uppercase text-sm md:text-md md:whitespace-nowrap border-r-2 border-gray-300">
                                                    Комментарий
                                                </td>
                                            }
                                            {
                                                orderData.comment !== null && orderData.comment.length > 0 &&
                                                <td className="pl-4 md:pl-8 text-gray-900 break-all uppercase">
                                                    "{orderData.comment}"
                                                </td>
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold uppercase tracking-wide px-1">Состав заказа</h3>
                                <div className="space-y-3">
                                    {orderData.items?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="w-full rounded-lg border-2 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white hover:border-black transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-20 h-20 rounded border-2 border-gray-200 bg-white p-1 flex-shrink-0 overflow-hidden">
                                                    {item.mainImageUrl ? (
                                                        <img src={item.mainImageUrl} alt={item.title} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">No img</div>
                                                    )}
                                                    <span className="absolute bottom-0 right-0 bg-black text-white text-[9px] font-black px-1 uppercase tracking-tight">
                                                        {item.size}
                                                    </span>
                                                </div>

                                                <div className="space-y-0.5">
                                                    <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.brand}</span>
                                                    <h4 className="font-bold text-base uppercase text-gray-900 leading-tight">{item.title}</h4>
                                                    <p className="text-xs uppercase text-gray-400">
                                                        Артикул: <span className="text-gray-600">{item.sku}</span> {item.color && `| Цвет: ${item.color}`}
                                                    </p>
                                                    <p className="text-xs uppercase font-medium text-gray-500 pt-1 sm:hidden">
                                                        {item.quantity} шт. × {formatPrice(item.appliedPrice)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="hidden sm:block text-right">
                                                <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">
                                                    {item.quantity} шт. × {formatPrice(item.appliedPrice)}
                                                </span>
                                                <span className="text-lg font-bold">{formatPrice(item.subtotal)}</span>
                                            </div>

                                            <div className="sm:hidden w-full pt-2 border-t border-gray-100 flex justify-between items-center">
                                                <span className="text-xs uppercase text-gray-400 font-bold">Всего</span>
                                                <span className="text-lg font-bold">{formatPrice(item.subtotal)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full rounded-lg border-2 p-6 md:p-8 bg-gray-50 space-y-4">
                            <div className="text-lg font-bold uppercase border-b-2 border-gray-200 pb-2">
                                История cтатусов
                            </div>

                            {orderData.statusHistory && orderData.statusHistory.length > 0 ? (
                                <div className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
                                    {orderData.statusHistory.sort((a,b) => Date.parse(a.changedAt) - Date.parse(b.changedAt)).map((history, hIdx) => (
                                        <div key={hIdx} className="relative space-y-1">
                                            <div className="absolute -left-[21px] top-1.5 w-[12px] h-[12px] rounded-full border-2 border-black bg-white" />

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border-2 ${getStatusConfig(history.status).className}`}>
                                                    {getStatusConfig(history.status).text}
                                                </span>
                                            </div>
                                            <p className="text-[11px] uppercase text-gray-400 font-medium">
                                                {formatDate(history.changedAt)}
                                            </p>
                                            {history.comment && (
                                                <p className="text-xs uppercase bg-white border border-gray-200 p-2 text-gray-600 rounded">
                                                    {history.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs uppercase text-gray-400 py-2">История статусов пуста.</p>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </main>
    );
}