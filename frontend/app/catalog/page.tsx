import Catalog from "@/components/Catalog"
import ItemCard from "@/components/ItemCard"
import CatalogExample from "@/components/ui/catalogexample"
import { ItemCardInterface } from "@/types/ItemCardInterface"
import { FlaskConical } from "lucide-react"

export default function CatalogPage() {

    const item: ItemCardInterface = {
        id: 1,
        title: "курта дутая",
        brand: "saints kelly",
        priceRetail: 19600,
        priceWholesale: 12500,
        imageUrl: "/jacket.png",
        categoryId: 1,
        categoryName: "Мужская одежда",
        isActive: true,
    }
    const arr: ItemCardInterface[] = Array(20).fill(item);
    return (
        <div className="w-full flex flex-col items-center gap-6 p-4">
            <Catalog cards={arr}/>
        </div>
    )
}