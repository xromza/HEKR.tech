"use client";

import { useToken } from "@/store/useToken";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, TriangleAlert, UserRound, Calendar, CreditCard, Package, Clock, Check, X, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, Dispatch, SetStateAction } from "react";
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
import { createCategory, createNewWarehouse, updateStock, updateOrderStatus, createProduct, updateCategoryDiscount, updateUserApproval, getAdminProductsList, getWarehouses, getCategories, getUsers, getAdminOrders, getStockOnWarehouse, createProductVariant } from "../lib/admin.service";
import { ProductInterface } from "@/types/ProductInterface";
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
    if (!isMounted) return (
        <div>
            <Loader />
        </div>
    )
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
                                            <AdminPage />
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
                                                className="w-full h-full object-contain"
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

export function ManagerPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const [ordersPage, setOrdersPage] = useState<any>({ content: [], totalPages: 0, number: 0 });
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeAction, setActiveAction] = useState<string | null>(null);

    const [warehousesList, setWarehousesList] = useState<any[]>([]);
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [productsList, setProductsList] = useState<ProductInterface[]>([]);


    // Стейты форм
    const [categoryName, setCategoryName] = useState("");
    const [warehouseAddress, setWarehouseAddress] = useState("");

    // Стейты для остатков
    const [stockWarehouseId, setStockWarehouseId] = useState("");
    const [stockList, setStockList] = useState<any[]>([]);
    const [stockProductId, setStockProductId] = useState("");
    const [stockVariantId, setStockVariantId] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");

    const [orderId, setOrderId] = useState("");
    const [orderStatus, setOrderStatus] = useState("PROCESSING");
    const [orderComment, setOrderComment] = useState("");

    const [prodTitle, setProdTitle] = useState("");
    const [prodBrand, setProdBrand] = useState("");
    const [prodCatId, setProdCatId] = useState("");
    const [prodPriceW, setProdPriceW] = useState("");
    const [prodPriceR, setProdPriceR] = useState("");
    const [prodThreshold, setProdThreshold] = useState("");
    const [prodDesc, setProdDesc] = useState("");

    const [discCatId, setDiscCatId] = useState("");
    const [discValue, setDiscValue] = useState("");

    const [varProductId, setVarProductId] = useState("");
    const [varSize, setVarSize] = useState("");
    const [varColor, setVarColor] = useState("");
    const [varSku, setVarSku] = useState("");
    const [varAutoSku, setVarAutoSku] = useState(true);
    const [varWeight, setVarWeight] = useState("");

    const triggerSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 4000);
    };

    useEffect(() => {
        if (stockWarehouseId) {
            getStockOnWarehouse({
                warehouseId: Number(stockWarehouseId),
                setData: setStockList,
                setError,
                setLoading
            });
        }
    }, [stockWarehouseId]);

    useEffect(() => {
        if (activeAction === "STOCK" || activeAction === "VARIANT") {
            getWarehouses({ setData: setWarehousesList, setError, setLoading });
            getAdminProductsList({ setData: setProductsList, setError, setLoading });
        }
        if (activeAction === "PRODUCT" || activeAction === "DISCOUNT") {
            getCategories({ setData: setCategoriesList, setError, setLoading });
        }
        if (activeAction === "ORDER_MANAGEMENT") {
            getAdminOrders({
                page: currentPage,
                size: 10,
                setData: setOrdersPage,
                setError,
                setLoading
            });
        }
    }, [activeAction, currentPage]);

    const selectedProductVariants = productsList.find(p => p.id === Number(stockProductId))?.variants || [];

    // ===== АВТОГЕНЕРАЦИЯ SKU ДЛЯ ВАРИАНТА =====
    useEffect(() => {
        if (!varAutoSku) return;

        const product = productsList.find(p => p.id === Number(varProductId));
        if (!product || !varColor || !varSize) {
            setVarSku("");
            return;
        }

        // Аббревиатура бренда: SAINTS KELLY -> SK
        const brandAbbr = product.brand
            .split(" ")
            .map(w => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 3);

        // Аббревиатура типа товара: КУРТКА ДУТАЯ -> JKT (упрощённо берём первые 3 буквы транслита)
        const titleAbbr = transliterate(product.title)
            .split(/[\s-]+/)[0]
            .slice(0, 3)
            .toUpperCase();

        // Цвет: Черный -> BLK
        const colorAbbr = transliterate(varColor)
            .slice(0, 3)
            .toUpperCase();

        // Размер как есть
        const sizeClean = varSize.replace(/\s+/g, "").toUpperCase();

        setVarSku(`${brandAbbr}-${titleAbbr}-${colorAbbr}-${sizeClean}`);
    }, [varProductId, varColor, varSize, varAutoSku, productsList]);

    const handleUpdateStock = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateStock({
            warehouseId: Number(stockWarehouseId),
            variantId: Number(stockVariantId),
            quantity: Number(stockQuantity),
            setData: () => triggerSuccess("Остатки успешно обновлены!"),
            setError,
            setLoading
        });
        setStockQuantity("");
        setStockVariantId("");
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        await createCategory({ categoryDto: { name: categoryName }, setData: () => triggerSuccess(`Категория "${categoryName}" создана!`), setError, setLoading });
        setCategoryName("");
    };

    const handleCreateWarehouse = async (e: React.FormEvent) => {
        e.preventDefault();
        await createNewWarehouse({ address: warehouseAddress, setData: () => triggerSuccess("Новый склад добавлен!"), setError, setLoading });
        setWarehouseAddress("");
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;
        setOrderComment("");
        await updateOrderStatus({
            orderId: Number(orderId),
            status: orderStatus,
            comment: orderComment,
            setData: () => {
                triggerSuccess(`Заказ #${orderId} переведен в статус ${orderStatus}`);
                getAdminOrders({
                    page: currentPage,
                    setData: setOrdersPage,
                    setError,
                    setLoading
                });
            },
            setError,
            setLoading
        });
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const dto = {
            title: prodTitle,
            description: prodDesc,
            brand: prodBrand,
            categoryId: Number(prodCatId),
            priceWholesale: Number(prodPriceW),
            priceRetail: Number(prodPriceR),
            wholesaleThreshold: Number(prodThreshold)
        };
        await createProduct({ productDto: dto, setData: () => triggerSuccess("Продукт успешно создан!"), setError, setLoading });
    };

    const handleUpdateDiscount = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateCategoryDiscount({ categoryId: Number(discCatId), discount: Number(discValue), setData: () => triggerSuccess("Скидка обновлена!"), setError, setLoading });
    };

    const handleCreateVariant = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!varProductId) {
            setError("Выберите продукт");
            return;
        }
        if (!varSize.trim() || !varColor.trim() || !varSku.trim()) {
            setError("Заполните все поля варианта");
            return;
        }

        const product = productsList.find(p => p.id === Number(varProductId));

        const exists = product?.variants.some(
            v => v.color === varColor.trim() && v.size === varSize.trim()
        );
        if (exists) {
            setError(`Вариант "${varColor} / ${varSize}" уже существует для этого продукта`);
            return;
        }

        const skuExists = productsList.some(p =>
            p.variants.some(v => v.sku === varSku.trim())
        );
        if (skuExists) {
            setError(`SKU "${varSku}" уже используется`);
            return;
        }

        const dto = {
            size: varSize.trim(),
            color: varColor.trim(),
            sku: varSku.trim(),
            weight: varWeight ? Number(varWeight) : 0
        };

        await createProductVariant({
            productId: Number(varProductId),
            dto,
            setData: () => {
                triggerSuccess(`Вариант "${varColor} / ${varSize}" успешно создан!`);
                getAdminProductsList({ setData: setProductsList, setError, setLoading });
            },
            setError,
            setLoading
        });

        setVarSize("");
        setVarColor("");
        setVarSku("");
        setVarWeight("");
        setVarAutoSku(true);
    };

    return (
        <div className="w-full md:h-[75vh] md:overflow-y-auto pr-2 space-y-6 animate-fadeIn text-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b-2 border-gray-200">
                <div className="flex flex-row gap-2 items-center text-[2rem] uppercase font-bold"><Package /> Менеджмент магазина</div>
                {loading && <div className="flex items-center gap-2 uppercase text-xs font-bold bg-black text-white px-3 py-1"><Loader className="animate-spin w-4 h-4" /> Обработка...</div>}
            </div>

            {error && <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase flex justify-between items-center"><span>Ошибка: {error}</span><button onClick={() => setError(null)}><X className="w-4 h-4" /></button></div>}
            <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2">
                <AnimatePresence mode="wait">
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="border-2 border-green-600 bg-white p-4 text-xs font-bold uppercase flex items-center gap-3 shadow-2xl rounded-lg"
                        >
                            <div className="bg-green-100 p-1 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span>{successMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {activeAction && (
                <div className="border-2 border-black p-6 bg-gray-50 rounded-lg space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                        <span className="text-sm font-black uppercase">Окно действия: {activeAction}</span>
                        <button onClick={() => { setActiveAction(null); setError(null); }} className="border-2 border-black hover:bg-black hover:text-white px-2 py-1 text-[10px] uppercase font-bold">Закрыть</button>
                    </div>
                    <AnimatePresence mode="wait">

                        {/* ===== НОВОЕ: СОЗДАНИЕ ВАРИАНТА ===== */}
                        {activeAction === "VARIANT" && (
                            <motion.div
                                key="variant-management-window"
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                style={{ display: "block" }}
                                className="overflow-hidden"
                            >
                                <div className="border-2 border-black p-6 rounded-lg bg-white mt-4">
                                    <h4 className="font-black uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">
                                        Добавить новый вариант продукта
                                    </h4>

                                    <form onSubmit={handleCreateVariant} className="space-y-4">
                                        {/* Выбор продукта */}
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Продукт</label>
                                            <select
                                                value={varProductId}
                                                onChange={(e) => {
                                                    setVarProductId(e.target.value);
                                                    setVarSize("");
                                                    setVarColor("");
                                                    setVarSku("");
                                                }}
                                                className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none bg-white font-bold"
                                                required
                                            >
                                                <option value="" disabled>Выберите продукт...</option>
                                                {productsList.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.brand} — {p.title} ({p.variants.length} вар.)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Превью существующих вариантов */}
                                        {varProductId && (
                                            <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                                <div className="text-[10px] uppercase font-black text-gray-500 mb-2">
                                                    Существующие варианты ({productsList.find(p => p.id === Number(varProductId))?.variants.length || 0})
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {productsList.find(p => p.id === Number(varProductId))?.variants.map(v => (
                                                        <div key={v.id} className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-1 rounded uppercase">
                                                            {v.color} / {v.size} <span className="text-gray-400">[{v.sku}]</span>
                                                        </div>
                                                    ))}
                                                    {productsList.find(p => p.id === Number(varProductId))?.variants.length === 0 && (
                                                        <div className="text-[10px] text-gray-400 italic">Пока нет вариантов</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Поля варианта */}
                                        {/* Поля варианта */}
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Цвет</label>
                                                <input
                                                    type="text"
                                                    value={varColor}
                                                    onChange={(e) => setVarColor(e.target.value)}
                                                    placeholder="Черный"
                                                    className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Размер</label>
                                                <input
                                                    type="text"
                                                    value={varSize}
                                                    onChange={(e) => setVarSize(e.target.value)}
                                                    placeholder="L / 42 / 32"
                                                    className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Вес (кг)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={varWeight}
                                                    onChange={(e) => setVarWeight(e.target.value)}
                                                    placeholder="0.5"
                                                    className="w-full border-2 border-black p-2 text-sm rounded focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1 flex items-center gap-2">
                                                    SKU (артикул)
                                                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-400 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={varAutoSku}
                                                            onChange={(e) => setVarAutoSku(e.target.checked)}
                                                            className="accent-black"
                                                        />
                                                        Авто
                                                    </label>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={varSku}
                                                    onChange={(e) => {
                                                        setVarSku(e.target.value.toUpperCase());
                                                        setVarAutoSku(false);
                                                    }}
                                                    placeholder="SK-JKT-BLK-L"
                                                    className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none font-mono"
                                                    required
                                                    readOnly={varAutoSku}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={!varProductId || loading}
                                                className="bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center gap-2"><Loader className="animate-spin w-4 h-4" /> Создание...</span>
                                                ) : (
                                                    "Создать вариант"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeAction === "PRODUCT" && (
                            <motion.div
                                key="product-management-window"
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                style={{ display: "block" }}
                                className="overflow-hidden"
                            >
                                <div className="border-2 border-black p-6 rounded-lg bg-white mt-4">
                                    <h4 className="font-black uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">Создать новый продукт</h4>
                                    <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Бренд</label>
                                            <input type="text" value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Название</label>
                                            <input type="text" value={prodTitle} onChange={(e) => setProdTitle(e.target.value)} className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Категория</label>
                                            <select value={prodCatId} onChange={(e) => setProdCatId(e.target.value)} className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none bg-white font-bold" required>
                                                <option value="" disabled>Выберите категорию...</option>
                                                {categoriesList.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Порог ОПТА (шт)</label>
                                            <input type="number" value={prodThreshold} onChange={(e) => setProdThreshold(e.target.value)} className="w-full border-2 border-black p-2 text-sm rounded focus:outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Розничная цена (₽)</label>
                                            <input type="number" value={prodPriceR} onChange={(e) => setProdPriceR(e.target.value)} className="w-full border-2 border-black p-2 text-sm rounded focus:outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Оптовая цена (₽)</label>
                                            <input type="number" value={prodPriceW} onChange={(e) => setProdPriceW(e.target.value)} className="w-full border-2 border-black p-2 text-sm rounded focus:outline-none" required />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Описание</label>
                                            <textarea value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className="w-full border-2 border-black p-2 text-sm rounded focus:outline-none" rows={3} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <button type="submit" className="w-full sm:w-auto bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors">Сохранить продукт</button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeAction === "DISCOUNT" && (
                            <motion.div
                                key="discount-management-window"
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                style={{ display: "block" }}
                                className="overflow-hidden"
                            >
                                <div className="border-2 border-black p-6 rounded-lg bg-white mt-4">
                                    <h4 className="font-black uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">Управление скидками</h4>
                                    <form onSubmit={handleUpdateDiscount} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Выберите категорию</label>
                                            <select value={discCatId} onChange={(e) => setDiscCatId(e.target.value)} className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none bg-white font-bold" required>
                                                <option value="" disabled>Выберите категорию...</option>
                                                {categoriesList.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Скидка (0.00 - 1.00)</label>
                                            <input type="number" step="0.01" value={discValue} onChange={(e) => setDiscValue(e.target.value)} placeholder="0.15" className="w-full border-2 border-black p-2 text-sm rounded focus:outline-none" required />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <button type="submit" className="w-full sm:w-auto bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors">Применить скидку</button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeAction === "CATEGORY" && (
                            <motion.div
                                key="category-management-window"
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                style={{ display: "block" }}
                                className="overflow-hidden"
                            >
                                <div className="border-2 border-black p-6 rounded-lg bg-white mt-4">
                                    <h4 className="font-black uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">Создать новую категорию</h4>
                                    <form onSubmit={handleCreateCategory} className="space-y-4">
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Название новой категории</label>
                                            <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none" required />
                                        </div>
                                        <button type="submit" className="w-full sm:w-auto bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors">Создать категорию</button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeAction === "WAREHOUSE" && (
                            <motion.div
                                key="warehouse-management-window"
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                style={{ display: "block" }}
                                className="overflow-hidden"
                            >
                                <div className="border-2 border-black p-6 rounded-lg bg-white mt-4">
                                    <h4 className="font-black uppercase text-sm mb-4 border-b-2 border-gray-100 pb-2">Добавить новый склад</h4>
                                    <form onSubmit={handleCreateWarehouse} className="space-y-4">
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Адрес нового склада</label>
                                            <input type="text" value={warehouseAddress} onChange={(e) => setWarehouseAddress(e.target.value)} className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none" required />
                                        </div>
                                        <button type="submit" className="w-full sm:w-auto bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors">Добавить склад</button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeAction === "STOCK" && (
                            <motion.div
                                key="stock-management-window"
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                style={{ display: "block" }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
                                    <div className="border-2 border-black p-4 rounded-lg bg-white h-[500px] flex flex-col">
                                        <h4 className="font-black uppercase text-xs mb-3 border-b-2 pb-2">Текущие остатки на складе</h4>
                                        <div className="flex-1 overflow-y-auto space-y-2">
                                            {stockList.length > 0 ? (
                                                stockList.map((item: any) => (
                                                    <div key={item.variantId} className="flex justify-between items-center p-2 border border-gray-100 rounded text-xs font-bold uppercase">
                                                        <span>{item.title} <span className="text-gray-400">[{item.sku}]</span></span>
                                                        <span className="bg-gray-100 px-2 py-1 rounded">{item.quantity} шт.</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-400 text-xs italic p-2">Выберите склад для просмотра остатков</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-2 border-black p-4 rounded-lg bg-gray-50">
                                        <h4 className="font-black uppercase text-xs mb-3 border-b-2 pb-2">Изменение остатков</h4>
                                        <form onSubmit={handleUpdateStock} className="space-y-4">
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Склад</label>
                                                <select value={stockWarehouseId} onChange={(e) => setStockWarehouseId(e.target.value)} className="w-full border-2 border-black p-2 text-sm rounded bg-white font-bold" required>
                                                    <option value="" disabled>Выберите склад...</option>
                                                    {warehousesList.map(w => <option key={w.id} value={w.id}>{w.address}</option>)}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <select value={stockProductId} onChange={(e) => setStockProductId(e.target.value)} className="border-2 border-black p-2 text-sm rounded bg-white font-bold" required>
                                                    <option value="">Товар...</option>
                                                    {productsList.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                                </select>
                                                <select value={stockVariantId} onChange={(e) => setStockVariantId(e.target.value)} className="border-2 border-black p-2 text-sm rounded bg-white font-bold" required disabled={!stockProductId}>
                                                    <option value="">Вариант...</option>
                                                    {selectedProductVariants.map(v => <option key={v.id} value={v.id}>{v.sku} ({v.color})</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Количество (изменение)</label>
                                                <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} placeholder="0" className="w-full border-2 border-black p-2 text-sm rounded" required />
                                            </div>
                                            <button type="submit" onClick={() => { getStockOnWarehouse({ warehouseId: Number(stockWarehouseId), setData: setStockList, setError, setLoading }); }} className="w-full bg-black text-white py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors">Сохранить изменения</button>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeAction === "ORDER_MANAGEMENT" && (
                            <motion.div
                                key="order-management-window"
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                style={{ display: "block" }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2 min-h-[500px]">
                                    <div className="xl:col-span-1 border-2 border-black p-4 rounded-lg bg-white flex flex-col h-[500px]">
                                        <h4 className="font-black uppercase text-xs mb-3 border-b-2 pb-2">Список заказов</h4>
                                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                            {ordersPage.content.map((order: any) => (
                                                <button key={order.id} onClick={() => { setSelectedOrder(order); setOrderId(String(order.id)); setOrderStatus(order.status); }} className={`w-full flex items-center justify-between p-3 border-2 rounded transition-all duration-200 ${selectedOrder?.id === order.id ? "bg-black text-white border-black" : "bg-white border-gray-200 hover:border-black"}`}>
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="text-[11px] font-black uppercase">Заказ №{order.id}</span>
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${selectedOrder?.id === order.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>{order.status}</span>
                                                    </div>
                                                    <div className="text-right"><span className="text-[11px] font-black">{formatPrice(order.totalPrice)}</span></div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="border-t-2 border-black mt-4 pt-2 flex justify-between items-center bg-gray-100 px-2">
                                            <button disabled={ordersPage.first || loading} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} className="text-[10px] font-black uppercase border-2 border-black px-2 py-1 hover:bg-black hover:text-white disabled:opacity-30">Назад</button>
                                            <span className="text-[10px] font-bold uppercase">Стр. {ordersPage.number + 1} из {ordersPage.totalPages}</span>
                                            <button disabled={ordersPage.last || loading} onClick={() => setCurrentPage(prev => prev + 1)} className="text-[10px] font-black uppercase border-2 border-black px-2 py-1 hover:bg-black hover:text-white disabled:opacity-30">Вперед</button>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-2 space-y-6">
                                        {selectedOrder ? (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                                                <div className="border-2 border-black p-6 bg-white rounded-lg">
                                                    <h4 className="font-black uppercase text-sm mb-4">Детали заказа №{selectedOrder.id}</h4>
                                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                                        <p>Клиент: <span className="font-bold">{selectedOrder.userId}</span></p>
                                                        <p>Адрес: <span className="font-bold">{selectedOrder.address}</span></p>
                                                        <p>Оплата: <span className="font-bold">{selectedOrder.paymentMethod}</span></p>
                                                        <p>Дата: <span className="font-bold">{new Date(selectedOrder.date).toLocaleString()}</span></p>
                                                    </div>
                                                </div>
                                                <div className="border-2 border-black p-6 bg-gray-50 rounded-lg">
                                                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Изменить статус</label>
                                                            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-full border-2 border-black p-2 text-sm uppercase rounded bg-white font-bold">
                                                                <option value="PROCESSING">В обработке</option>
                                                                <option value="ASSEMBLING">Собирается</option>
                                                                <option value="ASSEMBLED">Собран</option>
                                                                <option value="SHIPPING">Передан в доставку</option>
                                                                <option value="SHIPPED">Доставляется</option>
                                                                <option value="COMPLETED">Выполнен</option>
                                                                <option value="CANCELED">Отменен</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Комментарий к изменению</label>
                                                            <input type="text" value={orderComment} onChange={(e) => setOrderComment(e.target.value)} placeholder="Причина или пояснение..." className="w-full border-2 border-black p-2 text-sm rounded focus:outline-none" />
                                                        </div>
                                                        <button type="submit" className="w-full bg-black text-white py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors">Сохранить статус</button>
                                                    </form>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 p-10 text-gray-400 font-bold uppercase text-xs">Выберите заказ для управления</div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full rounded-lg border-2 p-6 bg-white space-y-4">
                    <div className="text-lg font-bold uppercase border-b-2 border-gray-100 pb-2">Управление товарами</div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setActiveAction("PRODUCT")} className={`w-full text-start border-2 px-4 py-3 text-xs font-bold uppercase transition-colors rounded-md ${activeAction === "PRODUCT" ? "border-black bg-black text-white" : "border-gray-200 hover:border-black"}`}>+ Добавить новый продукт</button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setActiveAction("VARIANT")} className={`w-full text-start border-2 px-4 py-3 text-xs font-bold uppercase transition-colors rounded-md ${activeAction === "VARIANT" ? "border-black bg-black text-white" : "border-gray-200 hover:border-black"}`}>+ Добавить новый вариант продукта</button>
                    </div>
                </div>

                <div className="w-full rounded-lg border-2 p-6 bg-white space-y-4">
                    <div className="text-lg font-bold uppercase border-b-2 border-gray-100 pb-2">Категории и Скидки</div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setActiveAction("CATEGORY")} className={`w-full text-start border-2 px-4 py-3 text-xs font-bold uppercase transition-colors rounded-md ${activeAction === "CATEGORY" ? "border-black bg-black text-white" : "border-gray-200 hover:border-black"}`}>+ Создать категорию</button>
                        <button onClick={() => setActiveAction("DISCOUNT")} className={`w-full text-start border-2 px-4 py-3 text-xs font-bold uppercase transition-colors rounded-md ${activeAction === "DISCOUNT" ? "border-black bg-black text-white" : "border-gray-200 hover:border-black"}`}>Изменить скидку категории</button>
                    </div>
                </div>
            </div>

            <div className="border-2 rounded-lg p-6 bg-white space-y-4">
                <div className="text-lg font-bold uppercase border-b-2 border-gray-100 pb-2">Операционная деятельность</div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-start text-sm">
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-3 pr-4 font-medium uppercase text-xs text-gray-400 border-r-2 border-gray-300 whitespace-nowrap w-[200px]">Остатки на складах</td>
                                <td className="pl-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <span className="text-xs uppercase text-gray-600">Изменение количества</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setActiveAction("WAREHOUSE")} className="border-2 border-gray-200 px-3 py-1 text-[10px] font-black uppercase hover:border-black transition-colors">+ Добавить склад</button>
                                        <button onClick={() => setActiveAction("STOCK")} className="border-2 border-black px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-colors">Обновить остатки</button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-3 pr-4 font-medium uppercase text-xs text-gray-400 border-r-2 border-gray-300 whitespace-nowrap w-[200px]">Обработка заказов</td>
                                <td className="pl-4 py-2 flex items-center justify-between gap-4">
                                    <span className="text-xs uppercase text-gray-600">Просмотр и смена статусов</span>
                                    <button onClick={() => setActiveAction("ORDER_MANAGEMENT")} className="border-2 border-black px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-colors">Открыть менеджер заказов</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Вспомогательная функция транслитерации для автогенерации SKU
function transliterate(text: string): string {
    const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    return text.toLowerCase().split('').map(c => map[c] !== undefined ? map[c] : c).join('');
}

export function AdminPage() {
    const [usersList, setUsersList] = useState<any[]>([]); // Для списка пользователей  
    const [userPage, setUserPage] = useState<any>({ content: [], totalPages: 0, number: 0 });
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [usersPage, setUsersPage] = useState<number>(0);
    // Стейты формы верификации пользователя
    const [verifyUserId, setVerifyUserId] = useState("");
    const [verifyStatus, setVerifyStatus] = useState("true"); // true/false (аппрув/бан)
    useEffect(() => {
        if (activeAction === "USER_APPROVAL") {
            getUsers({ approved: false, setData: setUserPage, setError, setLoading, page: usersPage });
        }
    }, [activeAction, usersPage]);
    const triggerSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setActiveAction(null);
        setTimeout(() => setSuccessMessage(null), 4000);
    };
    const handleSelectUser = (user: any) => {
        setSelectedUser(user);
        setVerifyUserId(String(user.id));
    };
    const handleVerifyUser = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUserApproval({
            userId: Number(verifyUserId),
            approved: verifyStatus === "true",
            setData: () => triggerSuccess(`Статус аккаунта ID ${verifyUserId} успешно обновлен!`),
            setError,
            setLoading
        });
        setVerifyUserId("");
    };

    return (
        <div className="w-full md:h-[75vh] md:overflow-y-auto pr-2 space-y-6 animate-fadeIn text-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b-2 border-gray-200">
                <div className="flex flex-row gap-2 items-center text-[2rem] uppercase font-bold"><ShieldAlert /> Панель администратора</div>
            </div>

            {error && <div className="border-2 border-red-600 bg-red-50 p-4 text-xs font-bold uppercase flex justify-between items-center"><span>Ошибка: {error}</span><button onClick={() => setError(null)}><X className="w-4 h-4" /></button></div>}
            <div className="fixed bottom-0 right-6 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="border-2 border-green-600 bg-white p-4 text-xs font-bold uppercase flex items-center gap-3 shadow-2xl rounded-lg"
                        >
                            <div className="bg-green-100 p-1 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span>{successMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
                {activeAction === "USER_APPROVAL" && (
                    <motion.div
                        key="user-approval-window"
                        // Добавляем начальную высоту, равную ожидаемой минимальной
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }} // Более мягкий easing
                        style={{ display: "block" }} // Принудительно задаем блочный элемент
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                            <div className="border-2 border-black p-4 rounded-lg bg-white min-h-[450px] flex flex-col">
                                {loading && userPage.content.length === 0 ? (
                                    <div className="space-y-2 animate-pulse">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-16 bg-gray-100 rounded"></div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <h4 className="font-black uppercase text-xs mb-3 border-b-2 pb-2">
                                            Список пользователей (Страница {userPage.number + 1} из {userPage.totalPages})
                                        </h4>

                                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                                            {userPage?.content && userPage.content.length > 0 ? (
                                                userPage.content.map((user: any) => (
                                                    <button
                                                        key={user.id}
                                                        onClick={() => handleSelectUser(user)}
                                                        className={`w-full flex items-center justify-between p-3 border-2 rounded transition-all duration-200 
                                    ${selectedUser?.id === user.id
                                                                ? "bg-black text-white border-black"
                                                                : "bg-white border-gray-200 hover:border-black"}`}
                                                    >
                                                        <div className="flex flex-col items-start gap-0.5">
                                                            <span className="text-[10px] font-bold opacity-60">ID: {user.id}</span>
                                                            <span className="text-xs font-black uppercase tracking-wide">{user.login}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${selectedUser?.id === user.id
                                                                ? "bg-white/20 text-white"
                                                                : "bg-gray-100 text-gray-500"
                                                                }`}>
                                                                {user.role || 'USER'}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="text-xs text-gray-400 p-2 italic">Пользователи не найдены</div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mt-6 border-t-2 border-gray-100 pt-4">
                                            <button
                                                disabled={userPage.first || loading}
                                                onClick={() => setUsersPage(prev => Math.max(prev - 1, 0))}
                                                className="text-[10px] font-black uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-300"
                                            >
                                                Назад
                                            </button>

                                            <span className="text-xs font-bold uppercase">
                                                Страница {userPage.number + 1} из {userPage.totalPages || 1}
                                            </span>

                                            <button
                                                disabled={userPage.last || loading}
                                                onClick={() => setUsersPage(prev => prev + 1)}
                                                className="text-[10px] font-black uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-300"
                                            >
                                                Вперед
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            <form onSubmit={handleVerifyUser} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Выбранный пользователь</label>
                                    <div className="w-full border-2 border-black p-2 text-sm font-bold bg-white">
                                        {selectedUser ? `${selectedUser.login} (ID: ${selectedUser.id})` : "Выберите пользователя слева"}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Новый статус</label>
                                    <select value={verifyStatus} onChange={(e) => setVerifyStatus(e.target.value)} className="w-full border-2 border-black p-2 text-sm uppercase rounded focus:outline-none bg-white font-bold">
                                        <option value="true">Активировать (Approve)</option>
                                        <option value="false">Заблокировать / Отказать</option>
                                    </select>
                                </div>

                                <button type="submit" disabled={!selectedUser} className="w-full bg-red-600 text-white py-3 text-xs font-bold uppercase hover:bg-red-800 transition-colors disabled:bg-gray-400">
                                    Применить статус
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )
                }
            </AnimatePresence>

            <div className="border-2 rounded-lg p-6 bg-white space-y-4 border-red-200">
                <div className="text-lg font-bold uppercase border-b-2 border-gray-100 pb-2 text-red-600 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" /> Управление доступом (B2B)
                </div>
                <p className="text-xs uppercase text-gray-400">Здесь вы можете верифицировать юридических лиц, активировать/блокировать аккаунты клиентов.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => setActiveAction("USER_APPROVAL")} className={`text-start border-2 px-4 py-3 text-xs font-bold uppercase transition-colors rounded-md ${activeAction === "USER_APPROVAL" ? "border-red-600 bg-red-600 text-white" : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"}`}>
                        Изменить статус верификации аккаунта
                    </button>
                </div>
            </div>

        </div >

    );
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
            <AccountPageContent />
        </Suspense>
    )
}