export const dynamic = 'force-dynamic';

import { getHeader } from '@/app/lib/getHeader';
import HeaderClient from './HeaderClient';
import { HeaderItem } from '@/types/HeaderItem';

export default async function Header() {
  const header = await getHeader();
  const categoryPath = "/category"
  const headerItems: HeaderItem[] = [
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
      title: "Аксессуары",
      count: header.accessoriesCount,
      link: categoryPath + "/accessories"
    },
    {
      title: "Каталог",
      count: null,
      link: "/catalog"
    },
  ];
  return (
    <HeaderClient items={headerItems} />
  );
}