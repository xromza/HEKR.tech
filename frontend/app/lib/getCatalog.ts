import { CatalogPageable } from "@/types/CatalogPageable";

export async function getCatalog({ page = 0, size = 6, verbose = false, sort = "" }: { page: number, size: number, verbose: boolean, sort: string }): Promise<CatalogPageable> {
    
    const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
    try {
        const params = `?page=${page}&size=${size}&verbose=${verbose}&sort=${sort}`
        const query = `${API_URL}/v1/products${params}`;
        const res = await fetch(query);
        console.log(query)

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