import CatalogExample from "@/components/ui/catalogexample"
import { FlaskConical } from "lucide-react"

export default function CatalogPage() {
    return (
        <div className="w-full flex flex-col items-center gap-6 p-4">
            <div className="flex flex-row gap-3 text-lg items-center"> <FlaskConical className="hover:scale-[1.1] transition" size={32} /><div className="font-semibold">Пример каталога</div></div>
            <CatalogExample/>
            
        </div>
    )
}