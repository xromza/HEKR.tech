export const dynamic = 'force-dynamic';

import { getHeader } from '@/app/lib/getHeader';
import HeaderClient from './HeaderClient';

export default async function Header() {

  const header = await getHeader();
  return (
    <HeaderClient
      manCount={header.manCount}
      brandCount={header.brandCount}
      womenCount={header.womenCount}
      saleCount={header.saleCount} />
  );
}