import Catalog from "@/components/Catalog"
import { getCatalog } from "../lib/getCatalog"
import { CatalogPageable } from "@/types/CatalogPageable"

export default async function CatalogPage() {
    const res = await getCatalog(
        {
            page: 0,
            size: 6,
            verbose: true,
            sort: ""
        }
    );
    const arr: CatalogPageable = res;
    return (
        <div className="w-full flex flex-col items-center gap-6 p-4">
            <Catalog initialData={arr}/>
        </div>
    )
}