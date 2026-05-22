"use client"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import Login from "./AuthPortal";
import { Handbag, Search, LucideIcon, UserRound, Menu, X } from "lucide-react";
import BurgerScreen from "./BurgerScreen";
import { AnimatePresence, motion } from "framer-motion";
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

    const loginValue = useToken((state) => state.user?.login)
    const [isMounted, setIsMounted] = useState(false);

    const deleteSession = useToken((state) => state.deleteSession);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const userButtonTitle = isMounted && loginValue ? loginValue : "войти";

    const handleLogout = () => {
        confirm("Выйти?") && logout({
            setLoading: setIsLogoutLoading,
            deleteSession: deleteSession
        })
    }
    const userFunc = isMounted && loginValue
        ? handleLogout
        : () => setIsLoginVisible(true)

    const controlItems: ControlItems[] = [
        {
            icon: UserRound,
            title: userButtonTitle,
            event: userFunc
        },
        {
            icon: Search,
            title: "поиск",
            event: () => setIsSearchActive(true)
        },
        {
            icon: Handbag,
            title: "корзина",
            event: () => router.push("/cart")
        }
    ]
    return (
        <header className={`px-3 ${/*isBurgerActive ? "fixed top-0" : "absolute"*/""} fixed top-0 scroll-none bg-white w-full h-[150px] z-50 text-lg`}>
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
                                        onClick={() => setIsBurgerActive(!isBurgerActive)}>
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
                <Login isVisible={isLoginVisible} setIsVisible={setIsLoginVisible} />
                <BurgerScreen setIsActive={setIsBurgerActive} items={items} isActive={isBurgerActive} />
            </div>
        </header >
    )
}