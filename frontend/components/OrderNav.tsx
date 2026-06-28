'use client';
import { useRouter } from 'next/navigation';
import { Home, ShoppingCart, UserCircle2, ArrowDown } from 'lucide-react';

interface OrderNavProps {
  onScrollToForm?: () => void;
}

export default function OrderNav({ onScrollToForm }: OrderNavProps) {
  const router = useRouter();

  const navItems = [
    { title: "Главная", icon: Home, href: "/" },
    { title: "Корзина", icon: ShoppingCart, href: "/cart" },
    { title: "Личный кабинет", icon: UserCircle2, href: "/profile" },
  ];

  return (
    <div className="flex-shrink-0 flex mb-4 items-center md:items-start flex-col px-6 w-full md:w-fit">
      <div className="flex flex-row gap-2 items-center justify-center md:justify-start mb-5 w-full">
        <div className="uppercase font-bold text-[3rem] leading-none text-center md:text-left">
          Оформление<br className="hidden md:inline" /> заказа
        </div>
      </div>

      <button
        onClick={onScrollToForm}
        className="pt-2 hover:text-black text-gray-400 w-full uppercase text-xl text-start cursor-pointer transition-colors border-b-2 mb-2 md:hidden"
      >
        <div className="flex flex-row items-center gap-2">
          <ArrowDown className="w-5 h-5" />
          <span>К форме доставки</span>
        </div>
      </button>

      <div className="flex flex-col gap-2 w-full">
        {navItems.map((item) => (
          <button
            key={item.title}
            onClick={() => router.push(item.href)}
            className="pt-2 hover:text-black text-gray-400 w-full uppercase text-xl text-start cursor-pointer transition-colors border-b-2"
          >
            <div className="flex flex-row items-center gap-2">
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}