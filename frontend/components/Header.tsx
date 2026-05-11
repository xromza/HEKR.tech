export const dynamic = 'force-dynamic';

import { getHeader } from '@/app/lib/getHeader';
import HeaderClient from './HeaderClient';
import { HeaderItem } from '@/types/HeaderItem';

export default async function Header() {
  const header = await getHeader();
   const categoryPath = "/category"
  const headerItems: HeaderItem[] = [
    {
      title: "sale",
      count: header.saleCount,
      link: categoryPath + "/sale"
    },
    {
      title: "мужская коллекция",
      count: header.manCount,
      link: categoryPath + "/man"
    },
    {
      title: "Женская коллекция",
      count: header.womenCount,
      link: categoryPath + "/woman"
    },
    {
      title: "Бренды",
      count: header.brandCount,
      link: categoryPath + "/brands"
    },
  ];
  return (
    <HeaderClient items={headerItems} />
  );
}