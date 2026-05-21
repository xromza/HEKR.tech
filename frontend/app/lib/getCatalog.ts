import { CatalogPageable } from "@/types/CatalogPageable";
import { OrderTypes } from "@/types/OrderTypes";

export async function getCatalog(
    { path,
        page = 0,
        size = 6,
        verbose = false,
        sort = "",
        order = OrderTypes.ASC,
        searchQuery = null }:
        {
            path: string,
            page: number,
            size: number,
            verbose: boolean,
            sort: string,
            order: OrderTypes,
            searchQuery: string | null
        }): Promise<CatalogPageable> {

    const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
    const searchParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        verbose: verbose.toString()
    })
    if (sort && order) {
        searchParams.append("sort", `${sort},${order}`);
    }

    if (searchQuery) {
        searchParams.append("query", searchQuery);
    }

    const sort_query = sort !== null && order !== null ? `${sort},${order}` : "";
    try {
        const query = `${API_URL}/v1${path}?${searchParams.toString()}`;
        console.log(query)
        const res = await fetch(query);

        if (!res.ok) {
            console.error(`Products fetch failed with status: ${res.status}`);
            throw new Error('Failed to fetch products');
        }
        return await res.json();
    }
    catch (error) {
        console.error("Fetch error during build/runtime:", error);
        return Promise.reject();
    }

}