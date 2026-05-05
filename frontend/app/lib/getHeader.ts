import { HeaderInterface } from "@/types/HeaderInterface";
export async function getHeader(): Promise<HeaderInterface> {
    const isDev = process.env.NODE_ENV === 'development';

  const API_URL = isDev 
    ? 'http://localhost:8080/api' 
    : process.env.BACKEND_URL;
    const res = await fetch(`${API_URL}/v1/header`, { 
    next: { revalidate: 600 }
  });
  
  if (!res.ok) throw new Error('Failed to fetch header');
  
  return res.json();
}