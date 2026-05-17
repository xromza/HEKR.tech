'use client'
import Form from 'next/form'
import { useState, useEffect, SetStateAction, Dispatch, FormEventHandler } from 'react';
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { login as apiLogin } from '@/app/lib/auth.service';
import { useToken } from '@/store/useToken';

interface LoginProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function Login({ isVisible, setIsVisible }: LoginProps) {
    const [mounted, setMounted] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const [password, setPassword] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const updateToken = useToken((state) => state.updateToken);
    const updateSession = useToken((state) => state.updateSession)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!login || !password) {
            setError("Заполните все поля");
            return;
        }

        const isSuccess = await apiLogin({
            loginValue: login,
            passwordValue: password,
            setData,
            setError,
            setLoading,
            updateSession,
            updateToken
        });
        if (isSuccess) {
            setIsVisible(false);
        }
    };

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
                            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                                <legend className='text-3xl font-semibold uppercase mb-8'>
                                    Войти
                                </legend>
                                <label htmlFor="login" className='uppercase font-bold text-base'>
                                    Логин
                                </label>
                                <input
                                    id="login"
                                    name='login'
                                    onChange={(e) => setLogin(e.target.value)}
                                    className={`h-[3.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                                    placeholder='ВАШ ЛОГИН' />
                                <div className='flex flex-row justify-between items-center'>
                                    <label htmlFor="password" className='uppercase font-bold text-base'>Пароль</label>
                                    <p className='text-xs text-gray-500 transition-colors uppercase hover:underline hover:text-black cursor-pointer'>Забыли пароль?</p>
                                </div>
                                <div className="w-full relative ">
                                    <input
                                        id="password"
                                        name='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='ВАШ ПАРОЛЬ'
                                        className={`h-[3.5rem] ring ring-gray-300 focus:ring-black 
                                        rounded-lg w-full px-4 text-base focus:border-black 
                                        outline-none transition-all ${error ? "ring ring-red-500" : ""}
                                    `} />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c8c8c8] hover:text-black transition-colors"
                                    >
                                        {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                                    </button>
                                </div>
                                <AnimatePresence mode="popLayout">
                                    {error && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                                            className="ring ring-red-200 w-full bg-red-50 rounded-lg overflow-hidden"
                                        >
                                            <div className="px-3 py-2 text-center text-sm text-red-600">
                                                {error}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <p className='text-xs text-center font-normal uppercase select-none'>
                                    <span className='text-gray-500'>Впервые у нас? </span>
                                    <button className='text-xs hover:underline uppercase cursor-pointer'>Зарегистрируйтесь</button>
                                </p>
                                <button
                                    type="submit"
                                    className='bg-black text-white uppercase py-2 text-lg rounded mt-2 w-[40%] ml-[30%]'


                                >
                                    {loading ? <Loader className="mx-auto animate-spin" /> : "Войти"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>}
        </AnimatePresence>,
        document.body
    )
}