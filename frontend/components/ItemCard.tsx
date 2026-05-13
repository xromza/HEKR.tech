import { formatPrice } from "@/app/lib/utils";
import { ItemCardInterface } from "@/types/ItemCardInterface";
import { Handbag } from "lucide-react";
import Image from "next/image";
export default function ItemCard({ card }: { card: ItemCardInterface }) {
    return (
        <div className="flex flex-col md:gap-5 h-full">
            <div className="bg-[#F6F3EE69] relative rounded-2xl aspect-[1/1] w-full overflow-visible">
                <Image
                    src={card.imageUrl}
                    alt={card.title + " Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-2xl object-cover p-3 md:p-10"
                ></Image>
                <button className="absolute z-10 -bottom-5 right-1 p-4 rounded-2xl bg-white 
                               text-gray-400 hover:text-black hover:scale-110 
                               active:scale-95 transition-all duration-200">
                    <Handbag size={30} />
                </button>
            </div>
            <div className="flex uppercase text-xl flex-col justify-center">
                <div className="font-bold">
                    {card.brand}
                </div>
                <div className="truncate">
                    {card.title}
                </div>
                <div>
                    <span>{formatPrice(card.priceRetail)}</span> <span className="text-gray-400">/ {formatPrice(card.priceWholesale)} ОПТОВАЯ</span>
                </div>
            </div>
        </div>
    )
}