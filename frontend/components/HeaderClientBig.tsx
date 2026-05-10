"use client"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import Login from "./Login";
import { Handbag, Search, LucideIcon, UserRound } from "lucide-react";
import { HeaderInterface } from "@/types/HeaderInterface";

interface ControlItems {
    icon: LucideIcon,
    title: string,
    event: () => void
}
export interface HeaderItems {
    title: string,
    count: number,
    link: string
}
export default function HeaderClientBig({ items, isLoginVisible, setIsLoginVisible }: { items: HeaderItems[], isLoginVisible: boolean, setIsLoginVisible: Dispatch<SetStateAction<boolean>> }) {

    const router = useRouter();
    const categoryPath = "/category"
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
        },
    ]
    return (
        <header className='px-6 absolute bg-white w-full h-[200px] z-50 text-lg'>
            <div className="container mx-auto h-full px-4 flex items-center">
                <div className='flex flex-row w-full items-center justify-start uppercase'>
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
                    <nav className='flex-1 flex items-center justify-between'>
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
                                                size={24} className="lg:w-6 lg:h-6"/>
                                            <span className="hidden xl:inline uppercase text-sm lg:text-base">
                                                {item.title}
                                            </span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
                <Login isVisible={isLoginVisible} setIsVisible={setIsLoginVisible} />
            </div>
        </header>
    );
}