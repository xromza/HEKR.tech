"use client"
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Login from "./AuthPortal";
import { Handbag, Search, LucideIcon, UserRound, X, LogOut, User, LogIn } from "lucide-react";
import { HeaderItem } from "@/types/HeaderItem";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import SearchBar from "./SearchBar";
import { useToken } from "@/store/useToken";
import { logout } from "@/app/lib/auth.service";

interface ControlItems {
    icon: LucideIcon,
    title: string,
    event: () => void
}

export default function HeaderClientBig({ items, isLoginVisible, setIsLoginVisible }: { items: HeaderItem[], isLoginVisible: boolean, setIsLoginVisible: Dispatch<SetStateAction<boolean>> }) {

    const router = useRouter();
    const pathname = usePathname();
    const [isSearchActive, setIsSearchActive] = useState(false);
    const loginValue = useToken((state) => state.user?.login)
    const [isMounted, setIsMounted] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const deleteSession = useToken((state) => state.deleteSession);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const [windowTitle, setWindowTitle] = useState<string | null>("войти");
    const [referrer, setReferrer] = useState<string | null>(null);
    useEffect(() => {
        setIsMounted(true);
    }, []);


    const { scrollY } = useScroll();
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = lastScrollY.current;

        if (latest > previous && latest > 150) {
            setIsHidden(true);
            setDropdownVisible(false);
        }
        else if (latest < previous) {
            setIsHidden(false);
        }

        lastScrollY.current = latest;
    })

    const userButtonTitle = isMounted && loginValue ? loginValue : "войти";

    const handleLogout = () => {
        logout({
            setLoading: setIsLogoutLoading,
            deleteSession: deleteSession
        })
        setDropdownVisible(false);
    }
    const handleLogin = () => {
        setWindowTitle("войти")
        setReferrer(null);
        setIsLoginVisible(true);
    }

    const userFunc = isMounted && loginValue
        ? () => setDropdownVisible(true)
        : () => handleLogin();

    const handleCart = () => {
        if (loginValue)
            router.push("/cart")
        else {
            setWindowTitle("Для просмотра корзины нужно войти")
            setReferrer("/cart");
            setIsLoginVisible(true);
        }
    }
    const controlItems: ControlItems[] = [
        {
            icon: Search,
            title: "поиск",
            event: () => setIsSearchActive(true)
        },
        {
            icon: Handbag,
            title: "корзина",
            event: handleCart
        },
    ];
    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" }
            }}
            animate={isHidden ? "hidden" : "visible"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className='fixed bg-white w-full h-[200px] z-50 text-lg left-0 top-0'
        >
            <div className="container mx-auto h-full flex items-center">
                <div className='flex flex-row w-full h-full items-center justify-start uppercase'>
                    <div className="flex-shrink-0 pr-8 lg:pr-16">
                        <button
                            onClick={() => router.push("/")}
                            className="cursor-pointer"

                        >
                            <Image src="/logo.svg"
                                width={100}
                                height={100}
                                className="object-contain"
                                alt="Логотип компании HEKR, состоящий из белых букв, написанных по часовой стрелке, на черном фоне " />
                        </button>
                    </div>
                    <AnimatePresence mode="popLayout">
                        {!isSearchActive ?
                            <motion.nav key="nav"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                className='flex-1 flex items-center justify-between'>
                                <ul className='flex flex-row items-center gap-6 lg:gap-10'>
                                    {items.map((item, idx) =>
                                        <li key={idx} className="whitespace-nowrap">
                                            <div className="flex flex-row gap-1 lg:gap-2">
                                                <button
                                                    className={`${pathname === item.link ? "underline font-semibold scale-102 cursor-default" : "hover:underline cursor-pointer "} transition duration-300 uppercase text-sm lg:text-base`}
                                                    onClick={pathname === item.link ? undefined : () => router.push(item.link)}>{item.title}</button>
                                                <span className='text-[#ccc] cursor-default hidden lg:inline'>{item.count}</span>
                                            </div>
                                        </li>
                                    )}

                                </ul>
                                <ul className='flex flex-row gap-4 lg:gap-8 items-center flex-shrink-0 ml-4'>
                                    <li className='flex flex-row relative items-center'>
                                        <div className="relative hover:underline cursor-pointer">

                                            <div className="flex flex-row gap-3 uppercase items-center opacity-0 pointer-events-none select-none text-sm lg:text-base">
                                                <UserRound size={24} className="lg:w-6 lg:h-6" />
                                                <span className="hidden xl:inline">
                                                    {userButtonTitle.length > "закрыть".length ? userButtonTitle : "закрыть"}
                                                </span>
                                            </div>

                                            <div className="absolute inset-0 flex items-center">
                                                <button
                                                    className="flex flex-row gap-3 uppercase items-center cursor-pointer w-full h-full"
                                                    onClick={dropdownVisible ? () => setDropdownVisible(false) : userFunc}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {dropdownVisible ? (
                                                            <motion.div
                                                                key="close"
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -5 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="flex flex-row gap-3 items-center w-full"
                                                            >
                                                                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                                                    <X size={24} className="lg:w-6 lg:h-6" />
                                                                </div>
                                                                <span className="hidden xl:inline uppercase text-sm lg:text-base whitespace-nowrap">
                                                                    Закрыть
                                                                </span>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="user"
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -5 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="flex flex-row gap-3 items-center w-full"
                                                            >
                                                                <AnimatePresence mode="wait">
                                                                    {isMounted && loginValue ? (
                                                                        <motion.div
                                                                            key="logged"
                                                                            initial={{ opacity: 0, y: -5 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -5 }}
                                                                            transition={{ duration: 0.15 }}
                                                                            className="flex flex-row gap-3 items-center"
                                                                        >
                                                                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                                                                <UserRound size={24} className="lg:w-6 lg:h-6" />
                                                                            </div>
                                                                            <span className="hidden xl:inline uppercase text-sm lg:text-base whitespace-nowrap">
                                                                                {userButtonTitle}
                                                                            </span>
                                                                        </motion.div>
                                                                    ) : (
                                                                        <motion.div
                                                                            key="unlogged"
                                                                            initial={{ opacity: 0, y: -5 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            exit={{ opacity: 0, y: -5 }}
                                                                            transition={{ duration: 0.15 }}
                                                                            className="flex flex-row gap-3 items-center"
                                                                        >
                                                                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                                                                <LogIn size={24} className="lg:w-6 lg:h-6" />
                                                                            </div>
                                                                            <span className="hidden xl:inline uppercase text-sm lg:text-base whitespace-nowrap">
                                                                                войти
                                                                            </span>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {dropdownVisible && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute shadow-lg z-50 p-4 flex flex-col border-2 gap-2 rounded bg-white top-8 right-0"
                                                >
                                                    <button onClick={() => router.push("/profile")} className="uppercase cursor-pointer flex flex-row gap-1 items-center border-b-2">
                                                        <UserRound size={15} /> Профиль
                                                    </button>
                                                    <button onClick={handleLogout} className="flex flex-row cursor-pointer gap-1 select-none uppercase items-center border-b-2 mb-2">
                                                        <LogOut size={15} /> Выйти
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                    {controlItems.map((item, idx) =>

                                        <li key={idx} className='flex flex-row'>
                                            <button className="flex flex-row gap-3 uppercase hover:underline cursor-pointer"
                                                onClick={item.event}>
                                                <item.icon
                                                    size={24} className="lg:w-6 lg:h-6" />
                                                <span className="hidden xl:inline uppercase text-sm lg:text-base">
                                                    {item.title}
                                                </span>
                                            </button>

                                        </li>
                                    )}
                                </ul>
                            </motion.nav>
                            :
                            <motion.div key="search"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }} className="w-full p-15">
                                <SearchBar isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
                <Login isVisible={isLoginVisible} setIsVisible={setIsLoginVisible} referrer={referrer} windowTitle={windowTitle} />
            </div>
        </motion.header>
    );
}