"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Login from "./Login";
import { Handbag, Search, LucideIcon, UserRound } from "lucide-react";

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

export default function HeaderClient({ saleCount, manCount, womenCount, brandCount }: { saleCount: number, manCount: number, womenCount: number, brandCount: number }) {

    const router = useRouter();
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const categoryPath = "/category"
    const headerItems: HeaderItems[] = [
        {
            title: "sale",
            count: saleCount,
            link: categoryPath + "/sale"
        },
        {
            title: "мужская коллекция",
            count: manCount,
            link: categoryPath + "/man"
        },
        {
            title: "Женская коллекция",
            count: womenCount,
            link: categoryPath + "/woman"
        },
        {
            title: "Бренды",
            count: brandCount,
            link: categoryPath + "/brands"
        },
    ];

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
        <header className='p-15 absolute bg-white w-full h-[200px] z-50 text-lg'>
            <div className="flex items-center justify-around h-full">
                <div className='flex flex-row w-full items-center justify-around uppercase'>
                    <div className="flex-shrink-0 p-10">
                        <button
                            onClick={() => router.push("/")}
                            className="cursor-pointer"

                        >
                            <Image src="https://res.cloudinary.com/dcc2qkmq7/image/upload/v1777939108/logo_ryssvy.svg"
                                width={96}
                                height={69}
                                className="object-contain"
                                alt="Логотип компании HEKR, состоящий из белых букв, написанных по часовой стрелке, на черном фоне " />

                        </button>
                    </div>
                    <nav className='flex-1 flex items-center justify-between'>
                        <ul className='flex w-full pr-[10rem] flex-row justify-around'>
                            {headerItems.map((item, idx) =>
                                <li key={idx}>
                                    <div className="flex flex-row gap-3">
                                        <button
                                            className='hover:underline uppercase cursor-pointer'
                                            onClick={() => router.push(item.link)}>{item.title}</button> 
                                            <span className='text-[#ccc] cursor-default'>{item.count}</span>
                                    </div>
                                </li>
                            )}

                        </ul>
                        <ul className='flex flex-row gap-8 items-center flex-shrink-0'>

                            {controlItems.map((item, idx) =>

                                <li key={idx} className='flex flex-row'>
                                    <div className="flex flex-row gap-3">
                                        <item.icon
                                            size={24} />
                                        <button
                                            className='uppercase hover:underline cursor-pointer'
                                            onClick={item.event}>
                                            {item.title}
                                        </button>
                                    </div>
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