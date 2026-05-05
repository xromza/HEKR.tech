import { getHeader } from '@/app/lib/getHeader';
import HeaderClient from './HeaderClient';

export default async function Header() {

  const header = await getHeader();
  console.log(header.manCount)
  return (
    <HeaderClient
      manCount={header.manCount}
      brandCount={header.brandCount}
      womenCount={header.womenCount}
      saleCount={header.saleCount} />
  );
}