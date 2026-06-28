import { ProductInterface } from "@/types/ProductInterface";

export async function getProduct(id: string): Promise<ProductInterface | null> {
  const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
  try {
    const query = `${API_URL}/v1/products/${id}`;
    console.log(query)
    const res = await fetch(query, {
      // next: { revalidate: 600 }
    });

    if (!res.ok) {
      console.error(`Product fetch failed with status: ${res.status}`);
      throw new Error('Failed to fetch product');
    }
    return await res.json();
  }
  catch (error) {
    console.error("Fetch error for product:", error);
    return null;
  }
}