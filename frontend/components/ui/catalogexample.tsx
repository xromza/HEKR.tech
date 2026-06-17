"use client"; // клиентский компонент

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Variants } from 'framer-motion';

export default function CatalogExample() {
    const router = useRouter();
    let data: number[] = Array.from({length: 27}).map((_, i) => _ = i);
    const path = usePathname();
    const containerVariants = {
        hidden: { scale:0.0, opacity: 0 },
        visible: {
            scale:1.0, 
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };
    const itemVariants: Variants = {
        hidden: { scale: 0, opacity: 0, y: 30 },
        visible: { 
            scale: 1, 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden" 
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 flex-wrap gap-6 max-w-[1350px] w-full p-4">
            {data.map((num) => (
                <motion.div
                    key={num}
                    variants={itemVariants}
                    className="rounded-2xl hover:shadow-xl
                     ring-1 ring-black 
                    bg-gray-50 flex flex-col items-center jusitfy-center
                    shadow-lg p-4 cursor-pointer" onClick={() => router.push(path + "/" + num)}
                >
                    <div className="font-semibold text-lg">Блок {num}</div>
                    <div className="italic text-gray-400">Описание блока {num}</div>
                </motion.div>
            ))}
        </motion.div>
    )
}