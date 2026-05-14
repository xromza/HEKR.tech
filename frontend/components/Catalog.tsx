"use client";
import { ItemCardInterface } from "@/types/ItemCardInterface";
import ItemCard from "./ItemCard";
import { useState } from "react";
import { CatalogPageable } from "@/types/CatalogPageable";
import { getCatalog } from "@/app/lib/getCatalog";
import { useInteractionObserver } from "@/hooks/useInteractionObserver";
import { ArrowDown01, ArrowDown10, ArrowUp10, LoaderCircle } from "lucide-react";
import { OrderTypes } from "@/types/OrderTypes";

export default function Catalog({ initialData, path, title }: { initialData: CatalogPageable, path: string, title: string }) {

    const [items, setItems] = useState<ItemCardInterface[]>(initialData.content);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(!initialData.last);
    const [isLoading, setIsLoading] = useState(false);

    const [sortBy, setSortBy] = useState("id");
    const [order, setOrder] = useState(OrderTypes.ASC);

    const toggleOrder = () => {
        if (sortBy !== "priceRetail") {
            setSortBy("priceRetail");
            setOrder(OrderTypes.ASC);
        } else {
            order === OrderTypes.DESC
                ? setOrder(OrderTypes.ASC)
                : setOrder(OrderTypes.DESC)
        }
    };


    const loadMore = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        const nextPage = page + 1;

        try {
            const data = await getCatalog(
                {
                    path: path,
                    page: nextPage,
                    size: 6,
                    verbose: false,
                    sort: sortBy + "," + order
                })

            setItems((prev) => [...prev, ...data.content]);
            setPage(nextPage);
            setHasMore(!data.last);
        } catch (e) {
            console.error("Ошибка подзагрузки", e);
        } finally {
            setIsLoading(false);
        }
    }

    const observerTarget = useInteractionObserver(loadMore, [page, hasMore, isLoading]);

    return (
        <div className="w-full max-w-[1920px] md:px-16 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="uppercase text-3xl font-semibold mb-6">
                    {title}
                </div>
                <div className="uppercase text-sm text-gray-500">Сортировка</div>
                <div className="flex flex-row gap-6 md:gap-8 items-center text-md md:text-xl h-[70px]">
                    <button
                        onClick={toggleOrder}
                        className='flex flex-row gap-2 uppercase items-center justify-center'
                    >
                        <span className={`${sortBy === "priceRetail" ? "border-b-2 border-black" : "border-b-2 border-transparent"}`}>
                            По цене
                        </span>

                        <div className={`transition-opacity`}>
                            {order === OrderTypes.ASC ? <ArrowUp10 size={20} /> : <ArrowDown10 size={20} />}
                        </div>
                    </button>
                    <button
                        onClick={() => {
                            setSortBy("category");
                            alert("TODO CATEGORY");
                        }}
                        className='uppercase '
                    >
                        <span className={`${sortBy === "category" ? "border-b-2" : ""}`}>Категория</span>

                    </button>
                    <button
                        onClick={() => {
                            setSortBy("color");
                            alert("TODO COLOR");
                        }}
                        className='uppercase '
                    >
                        <span className={`${sortBy === "color" ? "border-b-2" : ""}`}>Цвет</span>

                    </button>
                </div>
            </div>

            <div className="h-full grid grid-cols-2 gap-12 lg:gap-36 lg:grid-cols-3">
                {items.map((item, idx) =>
                    <div key={idx}>
                        <ItemCard card={item} />
                    </div>)}
            </div>
            <div ref={observerTarget} className="p-10 w-full flex justify-center items-center">
                {isLoading && <LoaderCircle className="animate-spin" />}
                {!hasMore && items.length > 0 && <span>Вы просмотрели все товары</span>}
            </div>
        </div>
    )
}