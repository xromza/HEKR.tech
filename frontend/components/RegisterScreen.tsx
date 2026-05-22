'use client';
import { useToken } from "@/store/useToken";
import { Eye, EyeOff, Loader, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { register as apiRegister } from '@/app/lib/auth.service';
import { RegisterInterface } from "@/types/Registerinterface";
import { AnimatePresence, motion } from "framer-motion";

interface RegisterScreenProps {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
    setSelectedScreen: Dispatch<SetStateAction<string>>;
}

function AnimatedRadioIcon({ checked }: { checked: boolean }) {
    return (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <circle cx="21" cy="21" r="20" stroke="black" strokeOpacity="0.89" strokeWidth="2" />
            <motion.circle
                cx="21"
                cy="21"
                r="13"
                fill="black"
                fillOpacity="0.89"
                initial={false}
                animate={{ scale: checked ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ originX: "50%", originY: "50%" }}
            />
        </svg>
    );
}

export default function RegisterScreen({ isVisible, setIsVisible, setSelectedScreen }: RegisterScreenProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isLegal, setIsLegal] = useState<boolean>(false);

    // Объединенный плоский стейт формы
    const [form, setForm] = useState({
        login: '',
        password: '',
        phone: '',
        email: '',
        firstName: '',
        lastName: '',
        midName: '',
        birthDate: '',
        passportSeries: '',
        passportNumber: '',
        companyName: '',
        inn: '',
        kpp: '',
        ogrn: '',
        legalAddress: ''
    });

    const updateToken = useToken((state) => state.updateToken);
    const updateSession = useToken((state) => state.updateSession);

    const handleSetError = (err: any) => {
        console.error("IN REGISTER ERR: ", err);
        if (err === null) {
            setGlobalError(null);
            setFieldErrors({});
        } else if (typeof err === 'string') {
            setGlobalError(err);
            setFieldErrors({});
        } else if (err?.error === "ValidationMapError" && err?.errors) {
            setFieldErrors(err.errors);
            setGlobalError("Ошибка валидации. Проверьте правильность заполнения полей.");
        } else {
            setFieldErrors({});
            setGlobalError(err?.description || err?.message || "Произошла ошибка при регистрации");
        }
    };

    const renderFieldError = (fieldName: string) => {
        if (fieldErrors[fieldName]) {
            return (
                <span className="text-xs uppercase text-red-600 block mt-1 font-medium">
                    {fieldErrors[fieldName]}
                </span>
            );
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSetError(null);

        if (!form.login || !form.password || !form.phone || !form.email) {
            setGlobalError("Заполните основные поля");
            return;
        }

        const type = isLegal ? "LEGAL" : "INDIVIDUAL";
        
        const details = isLegal
            ? { 
                type, 
                companyName: form.companyName, 
                inn: form.inn, 
                kpp: form.kpp, 
                ogrn: form.ogrn, 
                legalAddress: form.legalAddress 
              }
            : { 
                type, 
                firstName: form.firstName, 
                lastName: form.lastName, 
                midName: form.midName, 
                birthDate: form.birthDate, 
                passportSeries: form.passportSeries, 
                passportNumber: form.passportNumber 
              };

        const isSuccess = await apiRegister({
            login: form.login,
            password: form.password,
            phone: form.phone,
            email: form.email,
            details,
            setData,
            setError: handleSetError,
            setLoading,
            updateSession,
            updateToken
        });

        if (isSuccess) {
            setIsVisible(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative w-full px-10 pb-10 pt-0 md:px-22 md:pb-22 md:pt-0">
            <legend className='text-3xl font-semibold flex flex-row justify-between uppercase mb-4 sticky top-0 bg-white z-10 
                -mx-10 px-10 pt-10 pb-4
                md:-mx-22 md:px-22 md:pt-22 md:pb-6
                rounded-t-[2rem]'
            >
                <div>Регистрация</div>
                <X
                    onClick={() => setIsVisible(false)}
                    className="cursor-pointer transition-transform hover:scale-110"
                />
            </legend>

            <div>
                <label htmlFor="login" className='uppercase font-semibold text-base block mb-1'>Логин</label>
                <input
                    id="login"
                    name='login'
                    type="text"
                    value={form.login}
                    onChange={(e) => setForm({ ...form, login: e.target.value })}
                    className={`h-[3.5rem] ring ring-gray-300 rounded-lg w-full
                                px-4 text-base focus:ring-black outline-none transition-all flex-shrink-0
                                ${fieldErrors.login ? "ring-2 ring-red-500" : ""}
                                `}
                    placeholder='ПРИДУМАЙТЕ ЛОГИН' />
                {renderFieldError('login')}
            </div>

            <div>
                <label htmlFor="phone" className='uppercase font-semibold text-base block mb-1'>Телефон</label>
                <input
                    id="phone"
                    name='phone'
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`h-[3.5rem] ring ring-gray-300 rounded-lg w-full
                                px-4 text-base focus:ring-black outline-none transition-all flex-shrink-0
                                ${fieldErrors.phone ? "ring-2 ring-red-500" : ""}
                                `}
                    placeholder='УКАЖИТЕ ВАШ ТЕЛЕФОН' />
                {renderFieldError('phone')}
            </div>

            <div>
                <label htmlFor="email" className='uppercase font-semibold text-base block mb-1'>EMAIL</label>
                <input
                    id="email"
                    name='email'
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`h-[3.5rem] ring ring-gray-300 rounded-lg w-full
                                px-4 text-base focus:ring-black outline-none transition-all flex-shrink-0
                                ${fieldErrors.email ? "ring-2 ring-red-500" : ""}
                                `}
                    placeholder='УКАЖИТЕ ВАШ EMAIL' />
                {renderFieldError('email')}
            </div>

            <div>
                <label htmlFor="password" className='uppercase font-semibold text-base block mb-1'>Пароль</label>
                <div className="w-full relative">
                    <input
                        id="password"
                        name='password'
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='ПРИДУМАЙТЕ ПАРОЛЬ'
                        className={`h-[3.5rem] ring ring-gray-300 focus:ring-black 
                                    rounded-lg w-full px-4 text-base focus:border-black flex-shrink-0
                                    outline-none transition-all ${fieldErrors.password ? "ring-2 ring-red-500" : ""}
                                `} />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c8c8c8] hover:text-black transition-colors"
                    >
                        {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                    </button>
                </div>
                {renderFieldError('password')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="cursor-pointer select-none">
                    <input
                        type="radio"
                        name="accountType"
                        checked={!isLegal}
                        onChange={() => setIsLegal(false)}
                        className="peer hidden"
                    />
                    <div className="w-full flex flex-row gap-2 items-center text-gray-500 peer-checked:text-black transition-colors duration-200">
                        <AnimatedRadioIcon checked={!isLegal} />
                        <span className="text-sm font-semibold uppercase text-center">Физическое лицо</span>
                    </div>
                </label>

                <label className="cursor-pointer select-none">
                    <input
                        type="radio"
                        name="accountType"
                        checked={isLegal}
                        onChange={() => setIsLegal(true)}
                        className="peer hidden"
                    />
                    <div className="w-full flex flex-row gap-2 items-center text-gray-500 peer-checked:text-black transition-colors duration-200">
                        <AnimatedRadioIcon checked={isLegal} />
                        <span className="text-sm font-semibold uppercase text-center">Юридическое лицо</span>
                    </div>
                </label>
            </div>

            <div>
                <AnimatePresence mode="popLayout" initial={false}>
                    <div className="relative">
                        {!isLegal && (
                            <motion.div
                                key="individual"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2"
                            >
                                <label className='uppercase font-semibold text-base flex items-start'>
                                    ФИО<span className="text-red-500 text-xs">*</span>
                                </label>
                                <div className="grid grid-cols-1 shrink-0 md:grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            id="details.lastName"
                                            name='lastName'
                                            type="text"
                                            value={form.lastName}
                                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all ${fieldErrors['details.lastName'] ? "ring-2 ring-red-500" : ""}`}
                                            placeholder='ФАМИЛИЯ*' />
                                        {renderFieldError('details.lastName')}
                                    </div>
                                    <div>
                                        <input
                                            id="details.firstName"
                                            name='firstName'
                                            type="text"
                                            value={form.firstName}
                                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all ${fieldErrors['details.firstName'] ? "ring-2 ring-red-500" : ""}`}
                                            placeholder='ИМЯ*' />
                                        {renderFieldError('details.firstName')}
                                    </div>
                                    <div>
                                        <input
                                            id="details.midName"
                                            name='midName'
                                            type="text"
                                            value={form.midName}
                                            onChange={(e) => setForm({ ...form, midName: e.target.value })}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all ${fieldErrors['details.midName'] ? "ring-2 ring-red-500" : ""}`}
                                            placeholder='ОТЧЕСТВО' />
                                        {renderFieldError('details.midName')}
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <label htmlFor="details.birthDate" className='uppercase font-semibold text-base flex items-start mb-1'>
                                        Дата рождения<span className="text-red-500 text-xs">*</span>
                                    </label>
                                    <input
                                        id="details.birthDate"
                                        name='birthDate'
                                        type="date"
                                        value={form.birthDate}
                                        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                                        className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none appearance-none flex items-center leading-normal transition-all flex-shrink-0 ${fieldErrors['details.birthDate'] ? "ring-2 ring-red-500" : ""}`}
                                    />
                                    {renderFieldError('details.birthDate')}
                                </div>

                                <div className="mt-2">
                                    <label className='uppercase font-semibold text-base flex items-start mb-1'>
                                        Паспортные данные<span className="text-red-500 text-xs">*</span>
                                    </label>
                                    <div className="grid grid-cols-[100px_1fr] gap-2 shrink-0 w-full">
                                        <div>
                                            <input
                                                id="details.passportSeries"
                                                name='passportSeries'
                                                type="text"
                                                value={form.passportSeries}
                                                onChange={(e) => setForm({ ...form, passportSeries: e.target.value })}
                                                className={`h-[2.5rem] ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all w-full min-w-0 ${fieldErrors['details.passportSeries'] ? "ring-2 ring-red-500" : ""}`}
                                                placeholder='СЕРИЯ*'
                                            />
                                            {renderFieldError('details.passportSeries')}
                                        </div>
                                        <div>
                                            <input
                                                id="details.passportNumber"
                                                name='passportNumber'
                                                type="text"
                                                value={form.passportNumber}
                                                onChange={(e) => setForm({ ...form, passportNumber: e.target.value })}
                                                className={`h-[2.5rem] ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all w-full min-w-0 ${fieldErrors['details.passportNumber'] ? "ring-2 ring-red-500" : ""}`}
                                                placeholder='НОМЕР*'
                                            />
                                            {renderFieldError('details.passportNumber')}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {isLegal && (
                            <motion.div
                                key="legal"
                                layout="position"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2"
                            >
                                <div>
                                    <label htmlFor="details.companyName" className='uppercase font-semibold text-base flex items-start mb-1'>
                                        Название компании<span className="text-red-500 text-xs">*</span>
                                    </label>
                                    <input
                                        id="details.companyName"
                                        name='companyName'
                                        type="text"
                                        value={form.companyName}
                                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                        className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all ${fieldErrors['details.companyName'] ? "ring-2 ring-red-500" : ""}`}
                                        placeholder='НАЗВАНИЕ КОМПАНИИ*' />
                                    {renderFieldError('details.companyName')}
                                </div>

                                <div>
                                    <label htmlFor="details.legalAddress" className='uppercase font-semibold text-base flex items-start mb-1'>
                                        Юридический адрес<span className="text-red-500 text-xs">*</span>
                                    </label>
                                    <input
                                        id="details.legalAddress"
                                        name='legalAddress'
                                        type="text"
                                        value={form.legalAddress}
                                        onChange={(e) => setForm({ ...form, legalAddress: e.target.value })}
                                        className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all flex-shrink-0 ${fieldErrors['details.legalAddress'] ? "ring-2 ring-red-500" : ""}`}
                                        placeholder='ЮРИДИЧЕСКИЙ АДРЕС' />
                                    {renderFieldError('details.legalAddress')}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 w-full mt-2">
                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="details.inn" className='uppercase font-semibold text-sm'>
                                            ИНН<span className="text-red-500 text-xs">*</span>
                                        </label>
                                        <input
                                            id="details.inn"
                                            name='inn'
                                            type="text"
                                            value={form.inn}
                                            onChange={(e) => setForm({ ...form, inn: e.target.value })}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all min-w-0 ${fieldErrors['details.inn'] ? "ring-2 ring-red-500" : ""}`}
                                            placeholder='ИНН*'
                                        />
                                        {renderFieldError('details.inn')}
                                    </div>

                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="details.ogrn" className='uppercase font-semibold text-sm'>
                                            ОГРН<span className="text-red-500 text-xs">*</span>
                                        </label>
                                        <input
                                            id="details.ogrn"
                                            name='ogrn'
                                            type="text"
                                            value={form.ogrn}
                                            onChange={(e) => setForm({ ...form, ogrn: e.target.value })}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all min-w-0 ${fieldErrors['details.ogrn'] ? "ring-2 ring-red-500" : ""}`}
                                            placeholder='ВВЕДИТЕ ОГРН*'
                                        />
                                        {renderFieldError('details.ogrn')}
                                    </div>

                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="details.kpp" className='uppercase font-semibold text-sm'>
                                            КПП<span className="text-red-500 text-xs">*</span>
                                        </label>
                                        <input
                                            id="details.kpp"
                                            name='kpp'
                                            type="text"
                                            value={form.kpp}
                                            onChange={(e) => setForm({ ...form, kpp: e.target.value })}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all min-w-0 ${fieldErrors['details.kpp'] ? "ring-2 ring-red-500" : ""}`}
                                            placeholder='ВВЕДИТЕ КПП'
                                        />
                                        {renderFieldError('details.kpp')}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
            </div>

            <div className="flex-shrink-0">
                <AnimatePresence mode="popLayout">
                    {globalError && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                            className="ring ring-red-200 w-full bg-red-50 rounded-lg overflow-hidden"
                        >
                            <div className="px-3 py-2 text-center text-sm text-red-600">
                                {globalError}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="w-full flex justify-center">
                <button
                    type="submit"
                    disabled={loading}
                    className='bg-black text-white uppercase py-2 text-lg rounded mt-2 px-5 min-w-[150px] flex justify-center items-center disabled:opacity-50'
                >
                    {loading ? <Loader className="animate-spin" /> : "Регистрация"}
                </button>
            </div>

            <div className="flex flex-col items-center">
                <div className="uppercase text-sm">Уже есть учётная запись?</div>
                <div className="uppercase text-sm hover:underline font-semibold cursor-pointer" onClick={() => setSelectedScreen("login")}>войти</div>
            </div>
        </form>
    );
}