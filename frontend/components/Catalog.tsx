"use client";
import { ItemCardInterface } from "@/types/ItemCardInterface";
import ItemCard from "./ItemCard";
import { useEffect, useState } from "react";
import { CatalogPageable } from "@/types/CatalogPageable";
import { getCatalog } from "@/app/lib/getCatalog";
import { useInteractionObserver } from "@/hooks/useInteractionObserver";
import { Loader, MoveDown, MoveUp } from "lucide-react";
import { OrderTypes } from "@/types/OrderTypes";
import { useRouter } from "next/navigation";

export default function Catalog(
    {
        initialData,
        path,
        title,
        isParentLoading = false,
        searchQuery = null
    }:
        {
            initialData: CatalogPageable,
            path: string,
            title: string,
            isParentLoading: boolean,
            searchQuery: string | null
        }) {

    const [items, setItems] = useState<ItemCardInterface[]>(initialData.content);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(!initialData.last);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const [sortBy, setSortBy] = useState("id");
    const [sortPriceType, setSortPriceType] = useState("Retail");
    const [order, setOrder] = useState(OrderTypes.ASC);

    useEffect(() => {
        setItems(initialData.content);
        setPage(0);
        setHasMore(!initialData.last);
        setSortBy("id");
        setOrder(OrderTypes.ASC);
        setSortPriceType("Retail");
    }, [initialData])

    const toggleOrder = (newSort: string) => {
        let newOrder = order;

        if (sortBy === newSort) {
            newOrder = order === OrderTypes.DESC ? OrderTypes.ASC : OrderTypes.DESC;
        } else {
            newOrder = OrderTypes.ASC;
        }

        setSortBy(newSort);
        setOrder(newOrder);

        updateSort(newSort, newOrder);
    };
    const togglePriceSortType = () => {
        const newPriceType = sortPriceType === "Retail" ? "Wholesale" : "Retail";
        const newSortFieldName = "price" + newPriceType;

        setSortPriceType(newPriceType);

        if (sortBy.startsWith("price")) {
            setSortBy(newSortFieldName);
            updateSort(newSortFieldName, order);
        } else {
            toggleOrder(newSortFieldName);
        }
    };
    const updateSort = async (currentSort: string, currentOrder: OrderTypes) => {
        setIsLoading(true);
        setPage(0);

        try {
            const data = await getCatalog({
                path: path,
                page: 0,
                size: 6,
                verbose: false,
                sort: currentSort,
                order: currentOrder,
                searchQuery: searchQuery
            });

            setItems(data.content);
            setHasMore(!data.last);
        } catch (e) {
            console.error("Ошибка сортировки", e);
        } finally {
            setIsLoading(false);
        }
    }

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
                    sort: sortBy,
                    order: order,
                    searchQuery: searchQuery
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
            <div className="flex flex-col gap-0">
                <div className="uppercase text-4xl font-semibold">
                    {title}
                </div>
                <div className="flex flex-row gap-6 md:gap-8 items-center text-md md:text-xl h-[70px]">
                    <button
                        onClick={() => {
                            setSortBy("id");
                        }}
                        className='uppercase '
                    >
                        <span className={`${sortBy === "id" ? "border-b-2" : ""}`}>По умолчанию</span>

                    </button>
                    <button
                        onClick={() => toggleOrder("price" + sortPriceType)}
                        className='flex flex-row gap-2 uppercase items-center justify-center'
                    >
                        <div className="flex flex-row gap-2 items-baseline">
                            <div
                                className={`transition-all ${sortBy.startsWith("price")
                                    ? "border-b-2 border-black"
                                    : "border-b-2 border-transparent"
                                    }`}
                            >
                                По цене
                            </div>

                            <div className="self-center">·</div>

                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePriceSortType();
                                }}
                                className="px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {sortPriceType === "Retail" ? "розница" : "опт"}
                            </div>
                        </div>

                        <div className={`transition-opacity ${sortBy.startsWith("price") ? "opacity-100" : "opacity-0"}`}>
                            {order === OrderTypes.ASC ? <MoveUp size={16} /> : <MoveDown size={16} />}
                        </div>
                    </button>
                </div>
            </div>
            {isParentLoading ?
                <div className="w-full flex justify-center text-2xl uppercase">
                    <div className="flex flex-row gap-2 items-center">
                        <Loader size={30} className="animate-spin mx-auto" />
                        <div>Загружаем товары</div>
                    </div>
                </div> :

                items.length > 0 ?
                    <div>
                        <div className="h-full grid grid-cols-2 gap-12 lg:gap-36 lg:grid-cols-3">
                            {items.map((item, idx) =>
                                <div
                                    key={idx}
                                    onClick={() => router.push(`/catalog/${item.id}`)}
                                    className="cursor-pointer"
                                >
                                    <ItemCard card={item} />
                                </div>)}
                        </div>
                        <div ref={observerTarget} className="p-10 w-full flex justify-center items-center">
                            {isLoading && <Loader className="animate-spin" />}
                            {!hasMore && items.length > 0 && <span>Вы просмотрели все товары</span>}
                        </div>
                    </div>
                    :
                    <div className="w-full text-2xl flex justify-center">
                        <div className="flex flex-row gap-2 uppercase">
                            <div>Нет товаров</div>
                        </div>
                    </div>
            }
        </div>
    )
}