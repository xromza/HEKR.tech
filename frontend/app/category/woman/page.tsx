import Catalog from "@/components/Catalog"
import { getCatalog } from "@/app/lib/getCatalog"
import { CatalogPageable } from "@/types/CatalogPageable"
import { Collections } from "@/types/Collections"
import SliderDiscount from "@/components/SliderDiscount"
import Image from "next/image"
import { OrderTypes } from "@/types/OrderTypes"

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
    const path = "/products/category/"
    const collection = Collections.WOMAN

    const total_path = path + collection;
    const res = await getCatalog(
        {
            path: total_path,
            page: 0,
            size: 6,
            verbose: true,
            sort: "",
            order: OrderTypes.ASC
        }
    );
    const arr: CatalogPageable = res;
    return (
        <div className="w-full flex flex-col p-4 md:p-0 -mt-7 md:-mt-7 items-center mx-auto max-w-[1920px]">
            <div className="md:px-15 w-[100vw] md:w-full md:max-w-full overflow-hidden">
                <Image
                    src="/woman_collection_back.png"
                    width={1441}
                    height={720}
                    alt="Логотип компании HEKR, состоящий из белых букв, написанных по часовой стрелке, на черном фоне "
                    className='select-none md:rounded-3xl scale-150 md:scale-100 w-full md:translate-y-10'
                />
            </div>
            <div className="mb-15">
                <SliderDiscount />
            </div>
            <Catalog title="Женская коллекция" path={total_path} initialData={arr} />
        </div>
    )
}