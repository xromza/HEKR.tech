"use client";
import { useState, useEffect } from "react";
import { deleteAllItems, getCart } from "../lib/cart.service";
import CartGrid from "@/components/CartGrid";
import { Loader, RotateCw, TriangleAlert, X } from "lucide-react";
import { CartInterface } from "@/types/CartInterface";
import { formatPrice, getEnding } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToken } from "@/store/useToken";

export default function CartPage() {
  const [cartData, setCartData] = useState<CartInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const loginValue = useToken((state) => state.user?.login)
  const [isMounted, setIsMounted] = useState(false);
  const handleAction = async (actionFn: () => Promise<boolean>) => {
    const isSuccess = await actionFn();

    if (isSuccess) {
      await getCart({ setData: setCartData, setError, setLoading });
    }
  };
  const router = useRouter();
  useEffect(() => {
    getCart({ setData: setCartData, setError, setLoading });
  }, [loginValue]);

  useEffect(() => {
    setIsMounted(true);
  }, [])
  return (

    <main className="h-full w-full mx-auto flex max-w-[1680px]">
      <div className="flex flex-col md:flex-row w-full px-4">
        <div className="flex-shrink-0 flex mb-4 items-center md:items-start flex-col px-6 w-full md:w-fit">
          <div className="flex flex-row gap-2 items-center justify-center md:justify-start mb-5 w-full">
            <div className="uppercase font-bold text-[3rem] leading-none">Корзина</div>
            <button disabled={loading} className="w-fit md:w-full uppercase disabled:text-gray-400 text-xl enabled:cursor-pointer pb-1" onClick={() => getCart({ setData: setCartData, setError, setLoading })}>
              <RotateCw className={`${loading && "animate-spin"}`} />
            </button>
          </div>
          <button disabled={loading || cartData?.items.length === 0} onClick={() => {
            confirm("Вы уверены, что хотите удалить всё содержимое корзины?") &&
              handleAction(() => deleteAllItems({ setError: setError, setLoading: setLoading }));
          }} className="w-full uppercase disabled:text-gray-400 text-xl enabled:cursor-pointer border-b-2">
            <div className="flex flex-row items-center">
              <X className="inline" /> 
              <span>Очистить</span>
            </div></button>
        </div>
        <div className="flex-1">
          {loading ? <Loader className="animate-spin mx-auto my-auto" /> :
            (error || !loginValue || !isMounted) ? <div className="flex flex-col items-center justify-center w-full px-4 gap-4 text-md md:text-xl h-[60vh]">
              <TriangleAlert className="w-[7rem] h-[7rem] text-red-700" />
              <div className="text-center uppercase">{error ? error : "сначала необходимо авторизоваться в системе"}</div>
            </div>
              :
              cartData &&
                cartData.items.length > 0 ?
                <div className="flex flex-col gap-6">
                  <CartGrid cart={cartData} setCartData={setCartData} setError={setError} setLoading={setLoading} />
                  <div className="flex flex-col gap-3 p-2 w-full lg:w-1/2 xl:w-1/3">
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









