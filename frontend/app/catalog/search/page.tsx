'use client';

import { getCatalog } from "@/app/lib/getCatalog";
import Catalog from "@/components/Catalog";
import { CatalogPageable } from "@/types/CatalogPageable";
import { OrderTypes } from "@/types/OrderTypes";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export function SearchPageContent() {
    const searchParams = useSearchParams();
    const [catalogData, setCatalogData] = useState<CatalogPageable | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const query = searchParams.get("query");
    const path = '/products/search';

    let res: CatalogPageable;
    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                setLoading(true);
                setError(null);

                const path = '/products/search';

                const res = await getCatalog({
                    path: path,
                    page: 0,
                    size: 6,
                    verbose: false,
                    sort: "",
                    order: OrderTypes.ASC,
                    searchQuery: query
                });

                setCatalogData(res);
            } catch (err: any) {
                console.error("Ошибка при поиске:", err);
                setError(err.message || "Не удалось загрузить результаты");
            } finally {
                setLoading(false);
            }
        };
        fetchCatalog();
    }
        , [query]);

    return (
        <div className="w-full flex flex-col p-4 md:p-0 items-center mx-auto max-w-[1920px]">
            <Catalog
                isParentLoading={loading}
                title={`Результат поиска по запросу "${query}"`}
                path={path}
                searchQuery={query}
                initialData={catalogData || { content: [], last: true, totalPages: 0, totalElements: 0 } as any}
            />
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader className="animate-spin" />
                </div>
            }
        >
            <SearchPageContent/>
        </Suspense>
    )
}