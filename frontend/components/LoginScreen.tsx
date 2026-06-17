"use client";

import { useToken } from "@/store/useToken";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, EyeOff, Loader } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { login as apiLogin } from '@/app/lib/auth.service';
import { useRouter } from "next/navigation";
interface LoginScreenProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    setSelectedScreen: Dispatch<SetStateAction<string>>;
}
export default function LoginScreen({ isVisible, setIsVisible, setSelectedScreen, windowTitle, referrer }: LoginScreenProps & {windowTitle: string | null, referrer: string | null}) {
    const [showPassword, setShowPassword] = useState(false);

    const [password, setPassword] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const updateToken = useToken((state) => state.updateToken);
    const updateSession = useToken((state) => state.updateSession)
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
            console.log("referrer", referrer);
            referrer && router.push(referrer);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex p-10 md:p-22 relative flex-col gap-5'>
            <legend className='text-3xl flex flex-row justify-between font-semibold uppercase mb-8'>
                <div>{windowTitle ? windowTitle : "войти"}</div>
                <X
                    onClick={() => setIsVisible(false)}
                    className="cursor-pointer transition-transform hover:scale-110" 
                />
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
                <button 
                type="button" 
                className='text-xs hover:underline uppercase cursor-pointer'
                onClick={() => setSelectedScreen("register")}
                >Зарегистрируйтесь</button>
            </p>
            <button
                type="submit"
                className='bg-black text-white uppercase py-2 text-lg rounded mt-2 w-[40%] ml-[30%]'
            >
                {loading ? <Loader className="mx-auto animate-spin" /> : "Войти"}
            </button>
        </form>
    )
}