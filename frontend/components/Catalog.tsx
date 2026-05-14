"use client";
import { ItemCardInterface } from "@/types/ItemCardInterface";
import ItemCard from "./ItemCard";
import { useState } from "react";
import { CatalogPageable } from "@/types/CatalogPageable";
import { getCatalog } from "@/app/lib/getCatalog";
import { useInteractionObserver } from "@/hooks/useInteractionObserver";

export default function Catalog({ initialData }: { initialData: CatalogPageable }) {

    const [items, setItems] = useState<ItemCardInterface[]>(initialData.content);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(!initialData.last);
    const [isLoading, setIsLoading] = useState(false);

    const loadMore = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        const nextPage = page + 1;

        try {
            const data = await getCatalog(
                {
                    page: nextPage,
                    size: 6,
                    verbose: false,
                    sort: ""
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
        <div className="w-full max-w-[1920px] px-16">
            <div className="h-full grid grid-cols-2 gap-4 md:gap-36 md:grid-cols-3">
                {items.map((item, idx) =>
                    <div key={idx}>
                        <ItemCard card={item} />
                    </div>)}
            </div>
            <div ref={observerTarget} className="h-10 w-full flex justify-center items-center">
                {isLoading && <span>Загрузка...</span>}
                {!hasMore && items.length > 0 && <span>Вы просмотрели все товары</span>}
            </div>
        </div>
    )
}