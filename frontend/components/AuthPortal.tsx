'use client'
import Form from 'next/form'
import { useState, useEffect, SetStateAction, Dispatch, FormEventHandler, JSX } from 'react';
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion';
import { useToken } from '@/store/useToken';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { X } from 'lucide-react';

interface LoginProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function Login({ isVisible, setIsVisible }: LoginProps) {
    const [mounted, setMounted] = useState(false)
    const [selectedScreen, setSelectedScreen] = useState("login")

    const updateToken = useToken((state) => state.updateToken);
    const updateSession = useToken((state) => state.updateSession)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (!isVisible) {
            setSelectedScreen("login");
        }
    }, [isVisible]);

    if (!mounted) return null

    return createPortal(
        <AnimatePresence mode="wait" initial={false}>
            {isVisible &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsVisible(false)}
                    className='fixed inset-0 bg-black/30 z-[100] flex justify-center items-center p-4'
                >
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        layout
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            y: { duration: 0.3 }
                        }}
                        className='w-full max-w-2xl flex items-center select-none'
                    >

                        <motion.div
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 220,
                                damping: 28
                            }}
                            className='bg-white rounded-[2rem] overflow-hidden w-full shadow-2xl relative flex flex-col max-h-[90vh]'
                            onClick={(e) => e.stopPropagation()}>
                            <div className="overflow-y-auto w-full h-full pr-2">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <div className="relative">
                                        {selectedScreen === "login" && (
                                            <motion.div
                                                key="login"
                                                layout="position"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <LoginScreen
                                                    isVisible={isVisible}
                                                    setIsVisible={setIsVisible}
                                                    setSelectedScreen={setSelectedScreen}
                                                />
                                            </motion.div>
                                        )}

                                        {selectedScreen === "register" && (
                                            <motion.div
                                                key="register"
                                                layout="position"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <RegisterScreen
                                                    isVisible={isVisible}
                                                    setIsVisible={setIsVisible}
                                                    setSelectedScreen={setSelectedScreen}
                                                />
                                            </motion.div>
                                        )}
                                    </div>

                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>}
        </AnimatePresence>,
        document.body
    )
}