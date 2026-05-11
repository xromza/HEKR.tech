"use client"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import Image from "next/image";
import Login from "./Login";
import { Handbag, Search, LucideIcon, UserRound, X } from "lucide-react";
import { HeaderItem } from "@/types/HeaderItem";
import { motion, AnimatePresence } from "framer-motion"

interface ControlItems {
    icon: LucideIcon,
    title: string,
    event: () => void
}

export default function HeaderClientBig({ items, isLoginVisible, setIsLoginVisible }: { items: HeaderItem[], isLoginVisible: boolean, setIsLoginVisible: Dispatch<SetStateAction<boolean>> }) {

    const router = useRouter();
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchText, setSearchText] = useState("");
    const searchField = useRef<HTMLInputElement>(null)
    const controlItems: ControlItems[] = [
        {
            icon: UserRound,
            title: "войти",
            event: () => setIsLoginVisible(true)
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
        },
    ]

    const handleClear = () => {
        searchField.current?.focus();
        if (searchField.current)
            searchField.current.value = "";

    }
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!searchText.trim()) return;
        setIsSearchActive(false);
    };
    return (
        <header className='px-6 absolute bg-white w-full h-[200px] z-50 text-lg'>
            <div className="container mx-auto h-full px-4 flex items-center">
                <div className='flex flex-row w-full h-full items-center justify-start uppercase'>
                    <div className="flex-shrink-0 pr-8 lg:pr-16">
                        <button
                            onClick={() => router.push("/")}
                            className="cursor-pointer"

                        >
                            <Image src="https://res.cloudinary.com/dcc2qkmq7/image/upload/v1777939108/logo_ryssvy.svg"
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
                                                    className='hover:underline uppercase cursor-pointer text-sm lg:text-base'
                                                    onClick={() => router.push(item.link)}>{item.title}</button>
                                                <span className='text-[#ccc] cursor-default hidden lg:inline'>{item.count}</span>
                                            </div>
                                        </li>
                                    )}

                                </ul>
                                <ul className='flex flex-row gap-4 lg:gap-8 items-center flex-shrink-0 ml-4'>

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
                                exit={{ opacity: 0, y: -50 }} className="p-15 w-full h-full gap-4 flex items-center flex-row">
                                <div className="flex-1 flex-col">
                                    <form onSubmit={handleSubmit} className="flex flex-row gap-4 border-b-2 pe-2 py-1">
                                        <input ref={searchField} onChange={(e) => setSearchText(e.target.value)}
                                            className="w-full h-full focus:outline-none" type="text" placeholder="ИСКАТЬ"></input>
                                        <button
                                            type="button"
                                            onClick={handleClear} className="cursor-pointer text-gray-400 duration-200 ease-in-out transition active:scale-[0.95] hover:scale-[1.1]">
                                            <X size={18} />
                                        </button>
                                        <button
                                            type="submit"
                                            className="cursor-pointer text-gray-400 
                                        transition hover:scale-[1.1] duration-200 
                                        ease-in-out active:scale-[0.95]"
                                            onClick={() => {
                                                const query = encodeURIComponent(searchText)
                                                router.push(`/catalog/search?query=${query}`);
                                            }}
                                        >
                                            <Search size={18} />
                                        </button>
                                    </form>
                                    <div className="flex flex-row gap-6"></div>
                                </div>
                                <div className="uppercase cursor-pointer hover:underline text-gray-400" onClick={() => setIsSearchActive(false)}>
                                    ОТМЕНИТЬ
                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
                <Login isVisible={isLoginVisible} setIsVisible={setIsLoginVisible} />
            </div>
        </header>
    );
}