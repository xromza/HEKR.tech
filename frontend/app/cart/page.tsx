"use client";
import { useState, useEffect } from "react";
import { deleteAllItems, getCart } from "../lib/cart.service";
import CartGrid from "@/components/CartGrid";
import { Loader, RotateCw, X } from "lucide-react";
import { CartInterface } from "@/types/CartInterface";
import { formatPrice, getEnding } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartData, setCartData] = useState<CartInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAction = async (actionFn: () => Promise<boolean>) => {
    const isSuccess = await actionFn();

    if (isSuccess) {
      await getCart({ setData: setCartData, setError, setLoading });
    }
  };
  const router = useRouter();
  useEffect(() => {
    getCart({ setData: setCartData, setError, setLoading });
  }, []);


  return (
    <main className="h-full w-full mx-auto flex max-w-[1920px]">
      <div className="grid grid-cols-1 w-full px-4 md:grid-cols-4">
        <div className="col-span-1 flex items-center flex-col px-6">
          <div className="flex flex-row gap-2 items-center mb-5">
            <div className="uppercase font-extrabold text-2xl">Корзина</div>
            <button disabled={loading} className="cursor-pointer disabled:cursor-default" onClick={() => getCart({ setData: setCartData, setError, setLoading })}>
              <RotateCw className={`${loading && "animate-spin"}`} />
            </button>
          </div>
          <button disabled={loading || cartData?.items.length === 0} onClick={() => {
            const conf = confirm("Вы уверены, что хотите удалить всё содержимое корзины?");

            conf &&
              handleAction(() => deleteAllItems({ setError: setError, setLoading: setLoading }));
          }} className="flex flex-row gap-1 text-red-500 disabled:text-gray-400 items-center enabled:cursor-pointer enabled:hover:underline transition-colors"><X /> Очистить корзину </button>
        </div>
        <div className="col-span-3">
          {loading ? <Loader className="animate-spin mx-auto my-auto" /> :
            cartData &&
              cartData.items.length > 0 ?
              <div className="flex flex-col gap-6">
                <CartGrid cart={cartData} setCartData={setCartData} setError={setError} setLoading={setLoading} />
                <div className="flex flex-col gap-3 p-2 w-full md:w-1/2 lg:w-1/3">
                  <div className="flex flex-row justify-between border-b-1">
                    <div>Итого</div>
                    <div>{formatPrice(cartData.total_price)}</div>
                  </div>
                  <div className="text-sm">
                    {cartData.items.length} {getEnding(cartData.items.length, ["товар", "товара", "товаров"])}
                  </div>
                  <AnimatePresence mode="popLayout">
                    {(cartData.can_checkout && cartData.items.length !== 0) &&
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}

                        disabled={!cartData.can_checkout || cartData.items.length === 0} className="px-6 py-4 bg-gray-900 text-white uppercase cursor-pointer disabled:cursor-default transition-colors rounded">
                        Перейти к оформлению заказа
                      </motion.button>}
                  </AnimatePresence>
                </div>
              </div>
              :
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="text-[10rem] font-extrabold -mb-6 select-none">∅</div>
                <div className="text-xl uppercase">вы ещё не добавили ничего в корзину</div>
                <button onClick={() => router.push("/category/man")} className="cursor-pointer uppercase px-16 py-4 bg-black text-white rounded-xl text-xl">за покупками</button>
              </div>
          }
        </div>
      </div>
    </main>
  );
}









