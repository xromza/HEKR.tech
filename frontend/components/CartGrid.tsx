"use client";

import { deleteSingleItem, getCart } from "@/app/lib/cart.service";
import { formatPrice } from "@/app/lib/utils";
import { CartInterface } from "@/types/CartInterface";
import { X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function CartGrid(
    { cart, setCartData, setError, setLoading }:
        {
            cart: CartInterface,
            setCartData: Dispatch<SetStateAction<CartInterface | null>>,
            setError: Dispatch<SetStateAction<string | null>>,
            setLoading: Dispatch<SetStateAction<boolean>>
        }) {
    const handleAction = async (actionFn: () => Promise<boolean>) => {
        const isSuccess = await actionFn();

        if (isSuccess) {
            await getCart({ setData: setCartData, setError, setLoading });
        }
    };
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-24">
            {cart.items.map((item, idx) => (
                <div key={idx} className="w-full md:max-w-[450px] mx-auto md:mx-0 py-8 px-6 flex flex-row border-2 border-gray-600 rounded-2xl h-full">
                    <div className="w-[170px] h-[200px] relative shrink-0 flex items-center justify-center bg-transparent">
                        <Image
                            alt={`Изображение товара ${item.brand} ${item.title}`}
                            src={item.imageUrl}
                            fill
                            sizes="120px"
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col flex-grow-3 justify-between">
                        <div>
                            <div className="uppercase font-bold flex flex-row justify-between">
                                <span className="border-b-2">{item.brand}</span>
                                <button onClick={() => handleAction(() => deleteSingleItem({ variantId: item.variantId, setError: setError, setLoading: setLoading }))} className="cursor-pointer"><X size={15} /></button>
                            </div>
                            <div>{item.title}</div>
                        </div>
                        <div className="uppercase text-s text-gray-800">{item.color} {item.size}</div>
                        <div>
                            <div className="text-gray-500 text-xs">{item.quantity} x {formatPrice(item.appliedPrice)} </div>
                            <div className="text-lg">{formatPrice(item.subtotal)}</div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
}