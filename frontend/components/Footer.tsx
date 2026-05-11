'use client'

import { HeaderItem } from "@/types/HeaderItem";
import { useRouter } from "next/navigation";

interface FooterItem {
    title: string,
    link: string
}

export default function Footer() {
    const categoryPath = "/category"
    const footerItems: FooterItem[] = [
        {
            title: "sale",
            link: categoryPath + "/sale"
        },
        {
            title: "мужская коллекция",
            link: categoryPath + "/man"
        },
        {
            title: "Женская коллекция",
            link: categoryPath + "/woman"
        },
        {
            title: "Бренды",
            link: categoryPath + "/brands"
        },
    ];
    const router = useRouter();
    return (
        <footer className="w-full sticky border-t border-gray-200 px-[0.6rem] md:px-0 py-8 text-base font-normal">
            <div className="max-w-[1350px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 md:gap-6 lg:gap-8">

                <ul className="order-first">
                    <li>
                        <span className="block sm:inline wrap">© 2026 HEKR STORE. Все права защищены</span>
                    </li>
                </ul>

                <ul className="space-y-2">
                    {footerItems.map((item, idx) =>
                        <li key={idx}>
                            <button
                                onClick={() => router.push(item.link)}
                                className="hover:underline uppercase cursor-pointer">{item.title}
                            </button>
                        </li>)
                    }
                </ul>

                <ul className="space-y-2 break-all">
                    <li className="uppercase font-semibold md:font-normal">Поддержка</li>
                    <li>
                        <a href="mailto:hekrstore@mail.ru" className="hover:underline md:text-inherit">
                            hekrstore@mail.ru
                        </a>
                    </li>
                    <li>
                        <a href="tel:+79183533252" className="whitespace-nowrap">
                            +7 (918) 353 32 52
                        </a>
                    </li>
                </ul>

                <ul className="uppercase space-y-2 flex gap-2 flex-row md:flex-col">
                    <li><a href="#" className="text-[0.6rem] md:text-base md:text-black text-gray-500 hover:underline">Политика конфиденциальности</a></li>
                    <li><a href="#" className="text-[0.6rem] md:text-base md:text-black text-gray-500 hover:underline">Условия пользования</a></li>
                </ul>
            </div>
        </footer>
    );
};