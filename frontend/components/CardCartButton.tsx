'use client';

import { changeQuantityCart, deleteSingleItem } from "@/app/lib/cart.service";
import useMobile from "@/hooks/useMobile";
import { useToken } from "@/store/useToken";
import { CartItemInterface } from "@/types/CartItemInterface";
import { Check, Handbag, Loader, LucideIcon, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartCartButton({ variantId }: { variantId: number }) {
    const loginValue = useToken((state) => state.user?.login);
    const [cartData, setCartData] = useState<CartItemInterface | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [added, setAdded] = useState<boolean>(false);
    const mobile = useMobile(768);
    const iconSize = 
        mobile ? 20 : 25
    ;
    const [success, setSuccess] = useState<boolean>(false);
    const changeQuantity = async (quantity: number) => {
        return changeQuantityCart({
            variantId: variantId,
            quantity: quantity,
            setData: setCartData,
            setError: setError,
            setLoading: setLoading
        });
    }
    const handleAddToCart = async () => {
        setError(null);
        setSuccess(false);
        const isSuccess = await changeQuantity(1);
        setAdded(true);
        setSuccess(isSuccess);
    };
    const [hover, setHover] = useState(false);
    const handleRemoveFromCart = async () => {
        setError(null);
        setSuccess(false);
        await deleteSingleItem({ variantId, setError: setError, setLoading });
        setAdded(false);
    }
    const getIcon = () => {
        if (loading) return <Loader className="animate-spin" size={iconSize} />;
        if (!added) return <Handbag size={iconSize} />;
        if (hover) return <Trash size={iconSize} className="text-red-500" />;
        if (success) return <Check size={iconSize} />;
        return <X size={iconSize} className="text-red-500" />;
    };

    const handleMouseEnter = () => {
        if (window.matchMedia("(hover: hover)").matches) {
            setHover(true);
        }
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (loading) return;
                added ? handleRemoveFromCart() : handleAddToCart();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={loading}
            className={`absolute z-10 bottom-1 md:-bottom-5 right-1 p-3 md:p-2 lg:p-4 rounded-xl md:rounded-2xl bg-white shadow-sm
                       transition-all duration-200 select-none
                       ${loading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer active:scale-95 hover:scale-110'}
                       ${added && !hover ? 'text-black' : 'text-gray-400 hover:text-black'}`}>
            {
                loading ?
                    <Loader className="animate-spin" size={iconSize} /> :
                    getIcon()
            }
        </button>
    );
}