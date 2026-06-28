import { BucketInterface } from "@/types/BucketInterface";
import { cookies } from 'next/headers';


export async function getBucket(): Promise<BucketInterface> {
  const cookieStore = await cookies();
  //правильно ли организовал получение куки юзера?
  const tokenUser = cookieStore.get('tokenUser');
  const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';
  try {
    const response = await fetch(`${API_URL}/v1/cart`, {
      method:'GET',
      headers:{
        'Authorization': `Bearer ${tokenUser}`,
        'Content-type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Bucket fetch failed with status: ${response.status}`);
      throw new Error('Failed to fetch bucket');
    }
    return await response.json();
  }
  catch (error) {
    console.error("Fetch error during build/runtime:", error);
    const zero: BucketInterface = {items: [], totalSum: 0, sales: false, isReadyForOrder: false};
    return zero;
  }
}