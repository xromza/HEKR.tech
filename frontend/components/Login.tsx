'use client'
import Form from 'next/form'
import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import useMobile from '@/hooks/useMobile';

interface LoginProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function Login({ isVisible, setIsVisible }: LoginProps) {
    const [mounted, setMounted] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const isMobile = useMobile();
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence mode="wait">
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
                        className='w-full max-w-2xl flex items-center select-none'
                    >
                        <div
                            className='bg-white rounded-[2rem] p-10 md:p-22 w-full shadow-2xl relative'
                            onClick={(e) => e.stopPropagation()}>
                            <Form action="/example" className='flex flex-col gap-5'>
                                <legend className='text-3xl font-semibold uppercase mb-8'>
                                    Войти
                                </legend>
                                <label htmlFor="tel" className='uppercase font-bold text-base'>
                                    Телефон
                                </label>
                                <input
                                    id="tel"
                                    name='tel'
                                    className='h-[3.5rem] border border-gray-200 rounded-lg px-4 text-base focus:border-black outline-none transition-all'
                                    placeholder='+7 (___) ___-__-__' />
                                <div className='flex flex-row justify-between items-center'>
                                    <label htmlFor="password" className='uppercase font-bold text-base'>Пароль</label>
                                    <p className='text-xs text-gray-500 transition-colors uppercase hover:underline hover:text-black cursor-pointer'>Забыли пароль?</p>
                                </div>
                                <div className="w-full relative ">
                                    <input
                                        id="password"
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='ВАШ ПАРОЛЬ'
                                        className='h-[3.5rem] border border-gray-200 rounded-lg w-full px-4 text-base focus:border-black outline-none transition-all' />
                                        
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c8c8c8] hover:text-black transition-colors"
                                    >
                                        {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                                    </button>
                                </div>
                                <p className='text-xs text-center font-normal uppercase select-none'>
                                    <span className='text-gray-500'>Впервые у нас? </span>
                                    <button className='text-xs hover:underline uppercase cursor-pointer'>Зарегистрируйтесь</button>
                                </p>
                                <button type="submit" className='bg-black text-white uppercase py-2 text-lg rounded mt-2 w-[40%] ml-[30%]'>
                                    Войти
                                </button>
                            </Form>
                        </div>
                    </motion.div>
                </motion.div>}
        </AnimatePresence>,
        document.body
    )
}