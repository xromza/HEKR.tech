"use client";
import { ItemCardInterface } from "@/types/ItemCardInterface";
import ItemCard from "./ItemCard";

export default function Catalog({ cards }: { cards: ItemCardInterface[] }) {
    return (
        <div className="h-full grid grid-cols-2 gap-4 md:gap-12 w-full max-w-[1440px] md:grid-cols-3">
            {cards.map((item, idx) =>
                <div key={idx}>
                    <ItemCard card={item} />
                </div>)}
        </div>
    )
}