"use client";

import useMobile from "@/hooks/useMobile";
import { HeaderItem } from "@/types/HeaderItem";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
export default function BurgerScreen({ isActive, items }: { isActive: boolean, items: HeaderItem[] }) {
    const isMobile = useMobile(768);

    const router = useRouter();
    return (
        <AnimatePresence>
            {isActive && isMobile &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed mt-[150px] flex flex-col gap-7 inset-0 z-50 bg-white w-full h-full">
                    {items.map((item, idx) =>
                        <button
                            key={idx}
                            className="flex text-2xl justify-between px-8 group"
                            onClick={() => router.push(item.link)}
                        >
                            <span className="uppercase group-hover:underline">{item.title}</span>
                            <span className="text-gray-300">{item.count}</span>
                        </button>)}
                </motion.div>
            }
        </AnimatePresence>
    )
}