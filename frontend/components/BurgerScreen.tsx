"use client";

import useMobile from "@/hooks/useMobile";
import { HeaderItem } from "@/types/HeaderItem";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
export default function BurgerScreen({ isActive, setIsActive, items }: { isActive: boolean, setIsActive: Dispatch<SetStateAction<boolean>>, items: HeaderItem[] }) {
    const isMobile = useMobile(768);
    const pathname = usePathname();

    useEffect(() => {
        setIsActive(false)
    }, [pathname, setIsActive]);


    const router = useRouter();
    return (
        <AnimatePresence>
            {isActive && isMobile &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed mt-[150px] flex flex-col gap-7 inset-0 z-40 bg-white w-full h-full">
                    {items.map((item, idx) =>
                        <button
                            key={idx}
                            className={`${pathname === item.link ? "" : "hover:underline cursor-pointer "} flex text-2xl justify-between px-8 group`}
                            onClick={pathname === item.link ? undefined : () => router.push(item.link)}
                        >
                            <span className={`${pathname === item.link ? "underline font-semibold scale-102" : "group-hover:underline cursor-pointer"} uppercase`}>{item.title}</span>
                            <span className="text-gray-300 font-normal">{item.count}</span>
                        </button>)}
                </motion.div>
            }
        </AnimatePresence>
    )
}