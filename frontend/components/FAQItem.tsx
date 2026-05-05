"use client";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { useState } from "react";
import MainButton from "./mainButton";


export default function FAQItem({ text, title }: { text: string, title: string }) {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className='flex flex-row justify-between w-full py-5 items-start group cursor-pointer' onClick={() => setIsActive(!isActive)}>
            
            <div className='w-[95%] py-1 flex flex-col border-b border-black border-opacity-90'>
                <h3 className='uppercase text-2xl md:text-3xl font-normal leading-none mb-2 select-none'>
                    {title}
                </h3>
                
                <AnimatePresence initial={false}>
                    {isActive && (
                        <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className='overflow-hidden'
                        >
                            <p className='uppercase text-md md:text-xl pt-4 w-full md:w-2/3'>
                                {text}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="flex-shrink-0 pt-1"> 
                 <MainButton setIsTextVisible={setIsActive} isTextVisible={isActive} />
            </div>
        </div>
    );
}