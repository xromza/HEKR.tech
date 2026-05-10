'use client'
export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 px-[0.6rem] md:px-0 py-8 text-base font-normal">
            <div className="max-w-[1350px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 md:gap-6 lg:gap-8">

                <ul className="order-first">
                    <li>
                        <span className="block sm:inline wrap">© 2026 HEKR STORE. Все права защищены</span>
                    </li>
                </ul>

                <ul className="uppercase space-y-2">
                    <li><a href="#" className="hover:underline">Мужская коллекция</a></li>
                    <li><a href="#" className="hover:underline">Женская коллекция</a></li>
                    <li><a href="#" className="hover:underline">Бренды</a></li>
                    <li><a href="#" className="hover:underline">Каталог</a></li>
                </ul>

                <ul className="space-y-2 break-all">
                    <li className="uppercase font-semibold md:font-normal">Поддержка</li>
                    <li>
                        <a href="mailto:hekrstore@mail.ru" className="hover:underline text-blue-600 md:text-inherit">
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