import { CatalogPageable } from "@/types/CatalogPageable";
import { OrderTypes } from "@/types/OrderTypes";

export async function getCatalog({ path, page = 0, size = 6, verbose = false, sort = "", order = OrderTypes.ASC}: { path: string, page: number, size: number, verbose: boolean, sort: string, order: OrderTypes }): Promise<CatalogPageable> {

    const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
    const order_str = order !== null && order === OrderTypes.ASC ? "asc" : "desc"
    const sort_query = sort !== null && order !== null ? `${sort},${order_str}` : "";
    try {
        const params = `?page=${page}&size=${size}&verbose=${verbose}&sort=${sort_query}`
        const query = `${API_URL}/v1${path}${params}`;
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