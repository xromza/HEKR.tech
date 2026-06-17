import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, Dispatch, SetStateAction } from "react";

export default function SearchBar({isSearchActive, setIsSearchActive}: {isSearchActive: boolean, setIsSearchActive: Dispatch<SetStateAction<boolean>>}) {
    const [searchText, setSearchText] = useState("");
    const router = useRouter();
    const searchField = useRef<HTMLInputElement>(null)
    const handleClear = () => {
        searchField.current?.focus();
        if (searchField.current)
            searchField.current.value = "";

    }
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!searchText.trim()) return;
        setIsSearchActive(false);
    };
    return (
        <div className="w-full h-full gap-4 flex items-center flex-row">
            <div className="flex-1 flex-col">
                <form onSubmit={handleSubmit} className="flex flex-row gap-4 border-b-2 pe-2 py-1">
                    <input ref={searchField} onChange={(e) => setSearchText(e.target.value)}
                        className="w-full h-full focus:outline-none" type="text" placeholder="ИСКАТЬ"></input>
                    <button
                        type="button"
                        onClick={handleClear} className="cursor-pointer text-gray-400 duration-200 ease-in-out transition active:scale-[0.95] hover:scale-[1.1]">
                        <X size={18} />
                    </button>
                    <button
                        type="submit"
                        className="cursor-pointer text-gray-400 
                                        transition hover:scale-[1.1] duration-200 
                                        ease-in-out active:scale-[0.95]"
                        onClick={() => {
                            const query = encodeURIComponent(searchText)
                            router.push(`/catalog/search?query=${query}`);
                        }}
                    >
                        <Search size={18} />
                    </button>
                </form>
                <div className="flex flex-row gap-6"></div>
            </div>
            <div className="uppercase cursor-pointer hover:underline text-gray-400" onClick={() => setIsSearchActive(false)}>
                ОТМЕНИТЬ
            </div>
        </div>)
}