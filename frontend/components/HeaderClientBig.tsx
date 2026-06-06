"use client"
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Login from "./AuthPortal";
import { Handbag, Search, LucideIcon, UserRound, X, LogOut, User } from "lucide-react";
import { HeaderItem } from "@/types/HeaderItem";
import { motion, AnimatePresence } from "framer-motion"
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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const userButtonTitle = isMounted && loginValue ? loginValue : "войти";

    const handleLogout = () => {
        logout({
            setLoading: setIsLogoutLoading,
            deleteSession: deleteSession
        })
        setDropdownVisible(false);
    }


    const userFunc = isMounted && loginValue
        ? () => setDropdownVisible(true)
        : () => setIsLoginVisible(true)
    const controlItems: ControlItems[] = [
        {
            icon: Search,
            title: "поиск",
            event: () => setIsSearchActive(true)
        },
        {
            icon: Handbag,
            title: "корзина",
            event: () => router.push("/cart")
        },
    ];
    return (
        <header className='fixed bg-white w-full h-[200px] z-50 text-lg'>
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
                                    <li className='flex flex-row relative'>
                                        <AnimatePresence mode="popLayout">
                                            {dropdownVisible ?
                                                <motion.button
                                                    key="initial"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: 10
                                                    }}

                                                    className="flex flex-row gap-3 uppercase z-[25] hover:underline cursor-pointer"
                                                    onClick={() => setDropdownVisible(false)}
                                                >
                                                    <X
                                                        size={24} className="lg:w-6 lg:h-6" />
                                                    <span className="hidden xl:inline uppercase text-sm lg:text-base">
                                                        Закрыть
                                                    </span>
                                                </motion.button> :
                                                <motion.button
                                                    key="dropdown visible"
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10
                                                    }}
                                                    className="flex flex-row gap-3 uppercase hover:underline cursor-pointer"
                                                    onClick={userFunc}>
                                                    <UserRound
                                                        size={24} className="lg:w-6 lg:h-6" />
                                                    <span className="hidden xl:inline uppercase text-sm lg:text-base">
                                                        {userButtonTitle}
                                                    </span>
                                                </motion.button>

                                            }
                                        </AnimatePresence>
                                        <AnimatePresence mode="popLayout">
                                            {dropdownVisible &&
                                                <motion.div

                                                    initial={{
                                                        opacity: 0,
                                                        y: -10
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10
                                                    }}
                                                    className="absolute shadow-lg z-50 p-4 flex flex-col border-2 gap-2 rounded bg-white top-7"
                                                >
                                                    <button onClick={() => router.push("/profile")} className="uppercase cursor-pointer flex flex-row gap-1 items-center border-b-2">
                                                        <UserRound size={15} /> Профиль
                                                    </button>
                                                    <button onClick={handleLogout} className="flex flex-row cursor-pointer gap-1 select-none uppercase items-center border-b-2 mb-2">
                                                        <LogOut size={15} /> Выйти
                                                    </button>
                                                </motion.div>}
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
                <Login isVisible={isLoginVisible} setIsVisible={setIsLoginVisible} />
            </div>
        </header>
    );
}