'use client'
import Form from 'next/form'
import {useState, useEffect} from 'react';
import { createPortal } from 'react-dom'

export default function Login({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!isVisible || !mounted) return null

    // Закрытие по клику вне формы
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return createPortal(
        <div 
            className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'
            onClick={handleBackdropClick}
        >
            <div className='bg-white rounded-3xl p-6 w-full shadow-xl relative ml-[33%] mr-[33%] '>
                <Form action="/example" className='flex flex-col gap-5 m-[10%]'>
                    <legend className='text-2xl font-bold uppercase mb-8'>Войти</legend>
                    <label htmlFor="tel" className='uppercase font-bold text-base'>Телефон</label>
                    <input id="tel" name='tel' className='h-[2.5rem] border rounded p-2 uppercase text-xs' placeholder='Укажите ваш телефон' />
                    <div className='flex flex-row justify-between items-center'><label htmlFor="password" className='uppercase font-bold text-base'>Пароль</label><p className='text-xs text-[#c8c8c8] hover:text-black'>Забыли пароль?</p></div>
                    <input id="password" name='password' type="password" className='h-[2.5rem] border rounded p-2 uppercase text-xs' placeholder='Укажите ваш пароль' />
                    <p className='text-xs text-center font-normal uppercase'><span className='text-[#c8c8c8]'>Впервые у нас? </span><button  className='text-xs hover:text-[] uppercase'>Зарегистрируйтесь</button></p> 
                    <button type="submit" className='bg-black text-white uppercase py-2 rounded mt-2 w-[40%] ml-[30%]'>
                        Войти
                    </button>
                </Form>
            </div>
        </div>,
        document.body
    )
}