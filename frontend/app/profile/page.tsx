"use client";

import { useToken } from "@/store/useToken";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, TriangleAlert, UserRound, Calendar, CreditCard, Package, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { formatPrice, getEnding } from "../lib/utils";
import { ProfileInterface } from "@/types/ProfileInterface";
import { getProfile } from "../lib/profile.service";
import { IndividualDetailsResponse } from "@/types/IndividualDetailsResponse";
import { LegalDetailsResponse } from "@/types/LegalDetailsResponse";
import { Variants } from "framer-motion";
import { getOrders } from "../lib/order.service";
import { OrderInterface } from "@/types/OrderInterface";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UserTypes } from "@/types/UserTypes";
interface NavFields {
    idx: number,
    title: string
}

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
            return { text: status, className: 'bg-gray-50 text-gray-700  border-gray-200' };
    }
};

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
};

export function AccountPageContent() {
    const searchParams = useSearchParams();

    const [profileData, setProfileData] = useState<ProfileInterface | null>(null);
    const [orders, setOrders] = useState<OrderInterface[] | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const loginValue = useToken((state) => state.user?.login)
    const role = useToken((state) => state.user?.role)
    const roleId = role && role in UserTypes
        ? UserTypes[role as keyof typeof UserTypes]
        : 0;
    const [isMounted, setIsMounted] = useState(false);

    const pageVariants: Variants = {
        initial: (direction: number) => ({
            opacity: 0,
            y: direction > 0 ? "100%" : "-100%",
        }),
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 22,
                mass: 0.8,
            }
        },
        exit: (direction: number) => ({
            opacity: 0,
            y: direction > 0 ? "-100%" : "100%",
            transition: {
                duration: 0.25,
            }
        })
    };
    const allowed_screens = {
        0: [0, 1, 2], // client
        1: [0, 1, 2, 3], // manager
        2: [0, 1, 2, 3, 4] // admin 
    };
    const requestedScreen = Number(searchParams.get("s")) || 0;
    const screensForRole = allowed_screens[roleId as keyof typeof allowed_screens] || [0];
    const initSelectedScreen = screensForRole.includes(requestedScreen) ? requestedScreen : 0;
    const [[screen, direction], setScreen] = useState([initSelectedScreen, 0]);

    const navigateTo = (newScreen: number) => {
        setScreen([newScreen, newScreen > screen ? 1 : -1]);
    };


    const handleAction = async (actionFn: () => Promise<boolean>) => {
        const isSuccess = await actionFn();

        if (isSuccess) {
            await getProfile({ setData: setProfileData, setError, setLoading });
        }
    };

    useEffect(() => {
        getProfile({ setData: setProfileData, setError, setLoading });
        getOrders(
            {
                setData: setOrders,
                setError: setError,
                setLoading: setLoading
            }
        )
    }, [loginValue]);

    useEffect(() => {
        setIsMounted(true);
    }, [])
    const router = useRouter();

    const navButtons: NavFields[] = [
        {
            idx: 0,
            title: "Главная"
        },
        {
            idx: 1,
            title: "Профиль"
        },
        {
            idx: 2,
            title: "Мои заказы"
        },
        {
            idx: 3,
            title: "Менеджмент"
        },
        {
            idx: 4,
            title: "Администрирование"
        },
    ]

    return (

        <main className="h-full w-full mx-auto flex max-w-[1680px]">
            <div className="flex flex-col md:flex-row w-full px-4">
                <div className="flex-shrink-0 flex mb-4 items-center md:items-start flex-col px-6 w-full md:w-fit">
                    <div className="flex flex-row gap-2 items-center justify-center md:justify-start mb-5 w-full">
                        <div className="uppercase font-bold text-[3rem] leading-none">личный кабинет</div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        {
                            navButtons.filter((screen) => screensForRole.includes(screen.idx)).map((btn) => (
                                <button key={btn.idx} onClick={() => navigateTo(btn.idx)}
                                    className={`pt-2 hover:text-black ${btn.idx === screen ? "text-black" : "text-gray-400  "} w-full uppercase disabled:text-gray-400 
                                    text-xl text-start enabled:cursor-pointer transition-colors border-b-2`}>
                                    {btn.title}
                                </button>
                            ))
                        }
                    </div>
                </div>
                <div className="flex-1">
                    {loading ? <Loader className="animate-spin mx-auto my-auto" /> :
                        (error || !loginValue || !isMounted) ? <div className="flex flex-col items-center justify-center w-full px-4 gap-4 text-md md:text-xl h-[60vh]">
                            <TriangleAlert className="w-[7rem] h-[7rem] text-black" />
                            <div className="text-center uppercase">{error ? error : "сначала необходимо авторизоваться в системе"}</div>
                        </div>
                            :
                            <div className="relative overflow-hidden w-full h-full min-h-[75vh]">

                                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                                    {screen === 0 && (
                                        <motion.div
                                            key={0}
                                            custom={direction}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full h-full"
                                        >
                                            <MainPage orders={orders} router={router} profileData={profileData} />
                                        </motion.div>
                                    )}

                                    {screen === 1 && (
                                        <motion.div
                                            key={1}
                                            custom={direction}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full h-full"
                                        >
                                            {(profileData && <ProfilePage profileData={profileData} />) || <div>Error</div>}
                                        </motion.div>
                                    )}

                                    {screen === 2 && (
                                        <motion.div
                                            key={2}
                                            custom={direction}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full h-full"
                                        >
                                            <OrdersPage orders={orders} router={router} />
                                        </motion.div>
                                    )}
                                    {screen === 3 && (
                                        <motion.div
                                            key={3}
                                            custom={direction}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full h-full"
                                        >
                                            <ManagerPage />
                                        </motion.div>
                                    )}
                                    {screen === 4 && (
                                        <motion.div
                                            key={4}
                                            custom={direction}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full h-full"
                                        >
                                            <AdminPage  />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                    }
                </div>
            </div>
        </main>
    );
}

function ProfilePage({ profileData }: { profileData: ProfileInterface }) {
    interface ProfileField {
        title: string,
        value: string,
        visible: boolean
    }
    const isIndividual = profileData.clientType === "INDIVIDUAL";
    let profileFields: ProfileField[] = [
        {
            title: "Логин",
            value: profileData.login,
            visible: profileData.login !== undefined
        },
        {
            title: "Email",
            value: profileData.email,
            visible: profileData.email !== undefined
        },
        {
            title: "Номер телефона",
            value: profileData.phone,
            visible: profileData.phone !== undefined
        }
    ];

    if (profileData.clientType === "INDIVIDUAL") {
        const indivDetails: IndividualDetailsResponse = profileData.details;

        profileFields = profileFields.concat([
            {
                title: "ФИО",
                value: `${indivDetails.lastName} ${indivDetails.firstName} ${indivDetails.midName || ""}`.trim(),
                visible: indivDetails.lastName !== undefined && indivDetails.firstName !== undefined
            },
            {
                title: "Паспорт",
                value: `${indivDetails.passportSeries} ${indivDetails.passportNumber}`,
                visible: indivDetails.passportSeries !== undefined && indivDetails.passportNumber !== undefined
            },
            {
                title: "Дата рождения",
                value: indivDetails.birthDate,
                visible: indivDetails.birthDate !== undefined
            }
        ]);
    } else if (profileData.clientType === "LEGAL") {
        const legalDetails: LegalDetailsResponse = profileData.details;

        profileFields = profileFields.concat([
            {
                title: "Наименование компании",
                value: legalDetails.companyName,
                visible: legalDetails.companyName !== undefined
            },
            {
                title: "Юридический адрес",
                value: legalDetails.legalAddress,
                visible: legalDetails.legalAddress !== undefined
            },
            {
                title: "ИНН",
                value: legalDetails.inn,
                visible: legalDetails.inn !== undefined
            },
            {
                title: "ОГРН",
                value: legalDetails.ogrn,
                visible: legalDetails.ogrn !== undefined
            },
            {
                title: "КПП",
                value: legalDetails.kpp,
                visible: legalDetails.kpp !== undefined
            }
        ]);
    }

    return (
        <div className="w-full rounded-lg border-2 p-8 py-12">
            <div className="flex flex-row gap-1 items-center text-[2rem] uppercase mb-4">
                <UserRound /> Профиль
            </div>
            <table>
                <tbody>
                    {
                        profileFields.filter((item) => item.visible).map((field, idx) => (
                            <tr key={idx}>
                                <td className="py-[0.5] md:pr-8 font-medium uppercase text-sm md:text-md md:whitespace-nowrap border-r-2 border-gray-300">{field.title}</td>
                                <td className="pl-4 md:pl-8 text-gray-900 break-all">{field.value}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
function MainPage({
    profileData,
    orders,
    router
}: {
    profileData: ProfileInterface | null;
    orders: OrderInterface[] | null;
    router: AppRouterInstance;
}) {
    const lastOrder = orders && orders.length > 0 ? orders[orders.length - 1] : null;
    const lastOrderItemsCount = lastOrder?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const totalSpent = orders?.reduce((acc, order) => {
        return order.status !== 'CANCELED' ? acc + order.totalPrice : acc;
    }, 0) || 0;

    const getUserName = () => {
        if (profileData?.clientType === "INDIVIDUAL" && profileData.details?.firstName) {
            return profileData.details.firstName;
        }
        if (profileData?.clientType === "LEGAL" && profileData.details?.companyName) {
            return profileData.details.companyName;
        }
        return profileData?.login || "Пользователь";
    };

    return (
        <div className="w-full md:h-[75vh] md:overflow-y-auto pr-2 space-y-6 animate-fadeIn">
            <div className="flex flex-col gap-1 pb-4 border-b-2 border-gray-200">
                <div className="text-[2rem] font-bold uppercase leading-none">
                    Привет, {getUserName()}!
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border-2 rounded-lg p-6 flex flex-col gap-1 bg-white">
                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Всего заказов</span>
                    <span className="text-3xl font-bold">{orders?.length || 0}</span>
                </div>
                <div className="border-2 rounded-lg p-6 flex flex-col gap-1 bg-white">
                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Общая сумма выкупа</span>
                    <span className="text-3xl font-bold">{formatPrice(totalSpent)}</span>
                </div>
                <div className="border-2 rounded-lg p-6 flex flex-col gap-1 bg-white sm:col-span-2 lg:col-span-1">
                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Тип аккаунта</span>
                    <span className="text-3xl font-bold uppercase pt-1">
                        {profileData?.clientType === "LEGAL" ? "Юридическое лицо" : "Частный клиент"}
                    </span>
                </div>
            </div>

            <div className="border-2 rounded-lg p-6 md:p-8 bg-white space-y-4">
                <div className="flex justify-between items-center pb-2 border-b-2 border-gray-100">
                    <div className="text-lg font-bold uppercase flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" /> Последний заказ
                    </div>
                </div>

                {lastOrder ? (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-base uppercase">Заказ #{lastOrder.id}</span>
                                <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border-2 ${getStatusConfig(lastOrder.status).className}`}>
                                    {getStatusConfig(lastOrder.status).text}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 uppercase">
                                От {formatDate(lastOrder.date)} — {lastOrderItemsCount} {getEnding(lastOrderItemsCount, ["товар", "товара", "товаров"])}
                            </p>
                        </div>
                        <div className="sm:text-right">
                            <span className="text-base font-bold">{formatPrice(lastOrder.totalPrice)}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs uppercase text-gray-400 py-2">Вы еще не совершали покупок.</p>
                )}
            </div>

            {/* Системные уведомления / Инфо-блок */}
            <div className="border-2 rounded-lg p-6 bg-gray-50 border-dashed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h4 className="text-sm font-bold uppercase">Нужна помощь с заказом или возвратом?</h4>
                    <p className="text-xs text-gray-500 uppercase">Наша служба поддержки работает круглосуточно.</p>
                </div>
                <button
                    onClick={() => router.push('/support')}
                    className="border-2 border-black hover:bg-black hover:text-white px-4 py-2 text-xs font-bold uppercase transition-colors rounded-md flex-shrink-0"
                >
                    Связаться с нами
                </button>
            </div>
        </div>
    );
}
function OrdersPage({ orders, router }: { orders: OrderInterface[] | null, router: AppRouterInstance }) {
    const totalQuantity = (order: OrderInterface) =>
        order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <div className="w-full md:h-[75vh] md:overflow-y-scroll pr-2 space-y-6">
            <div className="flex flex-row gap-2 items-center text-[2rem] uppercase mb-4">
                <Package /> Мои заказы
            </div>

            {orders === undefined || orders === null || orders.length === 0 ? (
                <div className="w-full rounded-lg border-2 p-12 text-center uppercase text-black font-medium tracking-wide">
                    Заказов пока нет
                </div>
            ) : (
                orders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);

                    return (
                        <button
                            onClick={() => router.push(`/order/${order.id}`)}
                            key={order.id}
                            className="w-full cursor-pointer rounded-lg border-2 p-6 md:p-8 flex flex-col gap-6 hover:border-black transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-gray-200 gap-4">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-bold text-xl md:text-2xl uppercase">
                                            Заказ #{order.id}
                                        </span>
                                        <span className={`text-xs px-3 py-1 font-bold uppercase border-2 tracking-wider ${statusConfig.className}`}>
                                            {statusConfig.text}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-medium uppercase">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(order.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CreditCard className="w-3.5 h-3.5" />
                                            {order.paymentMethod === 'CARD' ? 'Картой онлайн' : order.paymentMethod}
                                        </span>
                                    </div>
                                </div>

                                <div className="sm:text-right w-full sm:w-auto">
                                    <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Сумма заказа</span>
                                    <span className="text-xl md:text-2xl whitespace-nowrap">
                                        {formatPrice(order.totalPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full text-sm">
                                <table className="w-full sm:w-auto text-start">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 pr-4 md:pr-8 font-medium uppercase text-xs text-gray-400 border-r-2 border-gray-300 whitespace-nowrap">
                                                Адрес доставки
                                            </td>
                                            <td className="pl-4 md:pl-8 text-gray-900 font-semibold uppercase break-all">
                                                {order.address}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 pr-4 md:pr-8 font-medium uppercase text-xs text-gray-400 border-r-2 border-gray-300 whitespace-nowrap">
                                                Всего товаров
                                            </td>
                                            <td className="pl-4 md:pl-8 text-gray-900 font-semibold uppercase">
                                                {totalQuantity(order)} {getEnding(totalQuantity(order), ["позиция", "позиции", "позиций"])}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                {order.items && order.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="relative w-16 h-16 rounded border-2 border-gray-200 bg-white p-1 flex-shrink-0 overflow-hidden group/thumb"
                                        title={`${item.brand} - ${item.title}`}
                                    >
                                        {item.mainImageUrl ? (
                                            <img
                                                src={item.mainImageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">
                                                No img
                                            </div>
                                        )}
                                        <span className="absolute bottom-0 right-0 bg-black text-white text-[9px] font-black px-1 uppercase tracking-tight">
                                            {item.size}
                                        </span>
                                        {item.quantity > 1 && (
                                            <span className="absolute top-0 left-0 bg-black text-white text-[9px] font-black px-1">
                                                x{item.quantity}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </button>
                    );
                })
            )}
        </div>
    );
}

function ManagerPage() {
    return (
        <div>
            Страница Менеджмент
        </div>
    )
}

function AdminPage() {
    return (
        <div>
            Страница Администрирование
        </div>
    )
}

export default function AccountPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader className="animate-spin" />
                </div>
            }
        >
            <AccountPageContent/>
        </Suspense>
    )
}