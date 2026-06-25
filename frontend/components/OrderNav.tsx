'use client';
import { useRouter } from 'next/navigation';
import useMobile from '@/hooks/useMobile';
import { Home, ShoppingCart, UserCircle2, ArrowDown } from 'lucide-react';

interface OrderNavProps {
  onScrollToForm?: () => void;
}

export default function OrderNav({ onScrollToForm }: OrderNavProps) {
  const router = useRouter();
  const isMobile = useMobile(1024);

  // Мобильная версия
  if (isMobile) {
    return (
      <aside className="w-screen bg-white border-b border-gray-200 p-4 flex flex-row items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight">Оформление заказа</h1>
        <nav className="flex flex-row space-x-4 items-center">
          {/* Кнопка для скролла к форме */}
          <button
            onClick={onScrollToForm}
            className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-xs uppercase tracking-wider hover:bg-gray-800 transition"
          >
            <ArrowDown className="w-4 h-4" />
            <span className="hidden sm:inline">К форме</span>
          </button>
        </nav>
      </aside>
    );
  }

  // Десктопная версия
  return (
    <aside className="w-[30%] min-w-[280px] bg-white border-r border-gray-200 p-6 flex flex-col  sticky top-0 lg:h-[70vh]">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight">
        Оформление<br />заказа
      </h1>
      <nav className="space-y-4 text-sm">
        <div className="flex items-center gap-2 text-gray-900 hover:text-black cursor-pointer border-b-2" onClick={() => router.push("/")}>
          <Home className="w-4 h-4" />
          <span className="text-xl uppercase">Главная</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 hover:text-black cursor-pointer border-b-2" onClick={() => router.push("/cart")}>
          <ShoppingCart className="w-4 h-4" />
          <span className="text-xl uppercase">Корзина</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 hover:text-black cursor-pointer border-b-2" onClick={() => router.push("/profile")}>
          <UserCircle2 className="w-4 h-4" />
          <span className="text-xl uppercase">Личный кабинет</span>
        </div>
      </nav>
    </aside>
  );
}