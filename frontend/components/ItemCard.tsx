import { formatPrice } from "@/app/lib/utils";
import { ItemCardInterface } from "@/types/ItemCardInterface";
import { Handbag } from "lucide-react";
import Image from "next/image";
import CardCartButton from "./CardCartButton";
export default function ItemCard({ card }: { card: ItemCardInterface }) {
    console.log(card);
    return (

        <div className="flex flex-col md:gap-5 h-full">
            <div className="bg-[#F6F3EE69] relative rounded-2xl aspect-[1/1] w-full overflow-visible">
                <Image
                    src={card.mainImageUrl}
                    alt={card.title + " Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-2xl object-contain p-2 md:p-0"
                ></Image>
                <CardCartButton variantId={card.mainVariantId}/>
            </div>
            <div className="flex uppercase text-sm md:text-lg flex-col justify-center">
                <div className="font-bold">
                    {card.brand}
                </div>
                <div className="truncate">
                    {card.title}
                </div>
                <div className="flex flex-col pt-1">
                    <div className="md:text-xl">
                        {formatPrice(card.priceRetail)}
                    </div>

                    <div className="flex items-end gap-1 whitespace-nowrap leading-none">
                        <span className="font-semibold text-lg md:text-2xl leading-none">
                            {formatPrice(card.priceWholesale)}
                        </span>
                        <span className="text-[11px] md:text-base leading-none mb-[1px] md:mb-[2px]">
                            ОТ {card.wholesaleThreshold} ШТ.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}