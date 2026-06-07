"use client"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Login from "./AuthPortal";
import { Handbag, Search, LucideIcon, UserRound, Menu, X, LogOut, LogIn } from "lucide-react";
import BurgerScreen from "./BurgerScreen";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import SearchBar from "./SearchBar";
import { logout } from "@/app/lib/auth.service";
import { useToken } from "@/store/useToken";
interface HeaderItems {
    title: string,
    count: number,
    link: string
}
interface ControlItems {
    icon: LucideIcon,
    title: string,
    event: () => void
}
export default function HeaderClientMobile({ items, isLoginVisible, setIsLoginVisible }: { items: HeaderItems[], isLoginVisible: boolean, setIsLoginVisible: Dispatch<SetStateAction<boolean>> }) {

    const router = useRouter();
    const [isBurgerActive, setIsBurgerActive] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const loginValue = useToken((state) => state.user?.login)
    const [isMounted, setIsMounted] = useState(false);
    const [windowTitle, setWindowTitle] = useState<string | null>("войти");
    const [referrer, setReferrer] = useState<string | null>(null);
    const deleteSession = useToken((state) => state.deleteSession);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const { scrollY } = useScroll();
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = lastScrollY.current;

        if (latest > previous && latest > 150 && !isBurgerActive) {
            setIsHidden(true);
            setDropdownVisible(false);
        }
        else if (latest < previous) {
            setIsHidden(false);
        }

        lastScrollY.current = latest;
    })
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const userButtonTitle = isMounted && loginValue ? loginValue : "войти";
    const handleCart = () => {
        if (loginValue)
            router.push("/cart")
        else {
            setWindowTitle("Для просмотра корзины нужно войти")
            setReferrer("/cart");
            setIsLoginVisible(true);
        }
    }
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
        }
    ]
    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" }
            }}
            animate={isHidden ? "hidden" : "visible"}
            transition={{ duration: 0.3, ease: "easeInOut" }} className={`px-3 ${/*isBurgerActive ? "fixed top-0" : "absolute"*/""} fixed top-0 scroll-none bg-white w-full h-[150px] z-50 text-lg`}>
            <div className="container mx-auto h-full px-4 flex items-center">
                <AnimatePresence mode="popLayout">
                    {!isSearchActive
                        ? <motion.div
                            key="header"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className='flex flex-row w-full items-center justify-between uppercase z-50'>
                            <div className="flex-shrink-0 pr-8 lg:pr-16">
                                <button
                                    onClick={() => router.push("/")}
                                    className="cursor-pointer"

                                >
                                    <Image src="/logo.svg"
                                        width={77}
                                        height={55}
                                        className="object-contain"
                                        alt="Логотип компании HEKR, состоящий из белых букв, написанных по часовой стрелке, на черном фоне " />
                                </button>
                            </div>
                            <ul className='flex flex-row gap-4 lg:gap-8 items-center flex-shrink-0 ml-4'>
                                <li className='flex flex-row relative items-center justify-center h-6 w-6'>
                                    <button
                                        className="flex items-center justify-center cursor-pointer h-6 w-6"
                                        onClick={dropdownVisible ? () => setDropdownVisible(false) : userFunc}
                                    >
                                        <AnimatePresence mode="wait">
                                            {dropdownVisible ? (
                                                <motion.div
                                                    key="close"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="w-6 h-6 flex z-50 items-center justify-center shrink-0"
                                                >
                                                    <X size={22} className="lg:w-6 lg:h-6" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="user"
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="w-6 h-6 flex items-center justify-center shrink-0"
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {isMounted && loginValue ? (
                                                            <motion.div
                                                                key="logged"
                                                                initial={{ opacity: 0, y: -5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -5 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="w-6 h-6 flex items-center justify-center shrink-0"
                                                            >
                                                                <UserRound size={22} className="lg:w-6 lg:h-6" />
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="unlogged"
                                                                initial={{ opacity: 0, y: -5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -5 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="w-6 h-6 flex items-center justify-center shrink-0"
                                                            >
                                                                <LogIn size={22} className="lg:w-6 lg:h-6" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>

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
                                                size={22} className="lg:w-6 lg:h-6" />
                                            <span className="hidden xl:inline uppercase text-sm lg:text-base">
                                                {item.title}
                                            </span>
                                        </button>
                                    </li>
                                )}
                                <li className='flex flex-row'>
                                    <button className="flex flex-row gap-3 uppercase hover:underline cursor-pointer"
                                        onClick={() => {
                                            setDropdownVisible(false);
                                            setIsBurgerActive(!isBurgerActive);
                                        }
                                            
                                        }>
                                        <AnimatePresence mode="popLayout">
                                            {isBurgerActive
                                                ? <motion.div
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0 }}
                                                    key="x">
                                                    <X
                                                        size={22} className="lg:w-6 lg:h-6" />
                                                </motion.div>
                                                : <motion.div
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0 }}
                                                    key="menu">
                                                    <Menu
                                                        size={22} className="lg:w-6 lg:h-6" />
                                                </motion.div>
                                            }
                                        </AnimatePresence>
                                        <span className="hidden xl:inline uppercase text-sm lg:text-base">
                                            Меню
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </motion.div>
                        :
                        <motion.div key="search"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }} className="w-full">
                            <SearchBar isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
                        </motion.div>

                    }
                </AnimatePresence>
                <Login isVisible={isLoginVisible} setIsVisible={setIsLoginVisible} referrer={referrer} windowTitle={windowTitle} />
                <BurgerScreen setIsActive={setIsBurgerActive} items={items} isActive={isBurgerActive} />
            </div>
        </motion.header >
    )
}