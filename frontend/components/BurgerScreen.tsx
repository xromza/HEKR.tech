import useMobile from "@/hooks/useMobile";
import { HeaderItem } from "@/types/HeaderItem";
import { motion, AnimatePresence } from "framer-motion";
export default function BurgerScreen({ isActive, items }: { isActive: boolean, items: HeaderItem[] }) {
    const isMobile = useMobile(768)
    return (
        <AnimatePresence>
            {isActive && isMobile && 
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500 w-full h-full">
                    приветик
                </motion.div>
            }
        </AnimatePresence>
    )
}