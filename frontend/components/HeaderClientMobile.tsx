"use client"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import Login from "./Login";
import { Handbag, Search, LucideIcon, UserRound, Menu, X } from "lucide-react";
import { HeaderInterface } from "@/types/HeaderInterface";
import BurgerScreen from "./BurgerScreen";
import { AnimatePresence, motion } from "framer-motion";
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
    const controlItems: ControlItems[] = [
        {
            icon: UserRound,
            title: "войти",
            event: () => setIsLoginVisible(true)
        },
        {
            icon: Search,
            title: "поиск",
            event: () => router.push("/catalog/search")
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
                <div className='flex flex-row w-full items-center justify-between uppercase z-50'>
                    <div className="flex-shrink-0 pr-8 lg:pr-16">
                        <button
                            onClick={() => router.push("/")}
                            className="cursor-pointer"

                        >
                            <Image src="https://res.cloudinary.com/dcc2qkmq7/image/upload/v1777939108/logo_ryssvy.svg"
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
                                            animate={{ opacity: 1, scale: 1}}
                                            exit={{ opacity: 0, scale: 0}}
                                            key="x">
                                            <X
                                                size={22} className="lg:w-6 lg:h-6" />
                                        </motion.div>
                                        : <motion.div
                                            initial={{ opacity: 0, scale: 0}}
                                            animate={{ opacity: 1, scale: 1}}
                                            exit={{ opacity: 0, scale: 0}}
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
                </div>
                <Login isVisible={isLoginVisible} setIsVisible={setIsLoginVisible} />
                <BurgerScreen items={items} isActive={isBurgerActive} />
            </div>
        </header >
    )
}