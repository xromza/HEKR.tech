import { CatalogPageable } from "@/types/CatalogPageable";

export async function getCatalog(): Promise<CatalogPageable> {
const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
  try {
    const res = await fetch(`${API_URL}/v1/products`, {
      next: { revalidate: 600 }
    });

    if (!res.ok) {
      console.error(`Header fetch failed with status: ${res.status}`);
      throw new Error('Failed to fetch header');
    }
    return await res.json();
  }
  catch (error) {
    console.error("Fetch error during build/runtime:", error);
    return Promise.reject();
  }

}