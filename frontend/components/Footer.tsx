'use client'
export default function Footer() {
    return(
        <footer className="flex border-t border-gray-200 pt-8 flex-row justify-between m-[5%] mt-[15%] text-base font-normal">
            <ul>
                <li><span className="uppercase">© 2026 HEKR STORE.</span> Все права защищены</li>
            </ul>
            <ul className="uppercase space-y-2">
                <li><a>Sale</a></li>
                <li><a>Мужская коллекция</a></li>
                <li><a>Женская коллекция</a></li>
                <li><a>Бренды</a></li>
            </ul>
            <ul className="space-y-2">
                <li><a href="mailto:hekrstore@mail.ru" title="Напишите на нашу электронную почту">hekrstore@mail.ru</a></li>
                <li className="uppercase">Поддержка</li>
                <li><a href="tel:+7 (918) 353 32 52" title="Позвоните нам">+7 (918) 353 32 52</a></li>
            </ul>
            <ul className="uppercase space-y-2">
                <li>Политика конфиденциальности</li>
                <li>Условия пользования</li>
            </ul>
        </footer>
    );
};