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
    const [error, setError] = useState<string | null>(null);
    const [errorMap, setErrorMap] = useState<Map<string, string> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [isLegal, setIsLegal] = useState<boolean>(false);

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [midName, setMidName] = useState<string | null>(null);
    const [birthDate, setBirthDate] = useState<string>("");
    const [passportSeries, setPassportSeries] = useState<string>("");
    const [passportNumber, setPassportNumber] = useState<string>("");

    const [companyName, setCompanyName] = useState<string>("");
    const [inn, setInn] = useState<string>("");
    const [kpp, setKpp] = useState<string>("");
    const [ogrn, setOgrn] = useState<string>("");
    const [legalAddress, setLegalAddress] = useState<string>("");

    const updateToken = useToken((state) => state.updateToken);
    const updateSession = useToken((state) => state.updateSession)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!login || !password || !phone || !email) {
            setError("Заполните основные поля");
            return;
        }

        const type = isLegal ? "LEGAL" : "INDIVIDUAL"
        const details = isLegal
            ? { type, companyName, inn, kpp, ogrn, legalAddress } // LegalDetails
            : { type, firstName, lastName, midName, birthDate, passportSeries, passportNumber }; // IndividualDetails

        const userData: RegisterInterface = {
            login,
            password,
            phone,
            email,
            details
        };

        const isSuccess = await apiRegister({
            login,
            password,
            phone,
            email,
            details,
            setData,
            setErrorMap,
            setError,
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

            <label htmlFor="login" className='uppercase font-semibold text-base'>
                Логин
            </label>
            <input
                id="login"
                name='login'
                type="text"
                onChange={(e) => setLogin(e.target.value)}
                className={`h-[3.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all flex-shrink-0
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                placeholder='ПРИДУМАЙТЕ ЛОГИН' />
            <label htmlFor="phone" className='uppercase font-semibold text-base'>
                Телефон
            </label>
            <input
                id="phone"
                name='phone'
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                className={`h-[3.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all flex-shrink-0
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                placeholder='УКАЖИТЕ ВАШ ТЕЛЕФОН' />
            <label htmlFor="login" className='uppercase font-semibold text-base'>
                EMAIL
            </label>
            <input
                id="email"
                name='email'
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className={`h-[3.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all flex-shrink-0
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                placeholder='УКАЖИТЕ ВАШ EMAIL' />
            <label htmlFor="password" className='uppercase font-semibold text-base'>Пароль</label>
            <div className="w-full relative">
                <input
                    id="password"
                    name='password'
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='ПРИДУМАЙТЕ ПАРОЛЬ'
                    className={`h-[3.5rem] ring ring-gray-300 focus:ring-black 
                                        rounded-lg w-full px-4 text-base focus:border-black flex-shrink-0
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
                                <label htmlFor="firstName" className='uppercase font-semibold text-base flex items-start'>
                                    ФИО<span className="text-red-500 text-xs">*</span>
                                </label>
                                <div className="grid grid-cols-1 shrink-0 md:grid-cols-3 gap-2">
                                    <input
                                        id="details.lastName"
                                        name='lastName'
                                        type="text"
                                        onChange={(e) => setLastName(e.target.value)}
                                        className={`h-[2.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                                        placeholder='ФАМИЛИЯ*' />
                                    <input
                                        id="details.firstName"
                                        name='firstName'
                                        type="text"
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={`h-[2.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all 
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                                        placeholder='ИМЯ*' />
                                    <input
                                        id="details.midName"
                                        name='midName'
                                        type="text"
                                        onChange={(e) => setMidName(e.target.value)}
                                        className={`h-[2.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all 
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                                        placeholder='ОТЧЕСТВО' />
                                </div>
                                <label htmlFor="firstName" className='uppercase font-semibold text-base flex items-start'>
                                    Дата рождения<span className="text-red-500 text-xs">*</span>
                                </label>
                                <input
                                    id="details.birthDate"
                                    name='birthDate'
                                    type="date"
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className={`h-[2.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none appearance-none flex items-center leading-normal transition-all flex-shrink-0
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                                    placeholder='ДАТА РОЖДЕНИЯ' />
                                <label htmlFor="firstName" className='uppercase font-semibold text-base flex items-start'>
                                    Паспортные данные<span className="text-red-500 text-xs">*</span>
                                </label>
                                <div className="grid grid-cols-[100px_1fr] gap-2 shrink-0 w-full">
                                    <input
                                        id="details.passportSeries"
                                        name='passportSeries'
                                        type="text"
                                        onChange={(e) => setPassportSeries(e.target.value)}
                                        className={`h-[2.5rem] ring ring-gray-300 rounded-lg 
                                px-4 text-base focus:ring-black outline-none transition-all 
                                w-full min-w-0
                                ${error ? "ring ring-red-500" : ""}
                                `}
                                        placeholder='СЕРИЯ*'
                                    />
                                    <input
                                        id="details.passportNumber"
                                        name='passportNumber'
                                        type="text"
                                        onChange={(e) => setPassportNumber(e.target.value)}
                                        className={`h-[2.5rem] ring ring-gray-300 rounded-lg 
                                px-4 text-base focus:ring-black outline-none transition-all 
                                w-full min-w-0
                                ${error ? "ring ring-red-500" : ""}
                                `}
                                        placeholder='НОМЕР*'
                                    />
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
                                <label htmlFor="companyName" className='uppercase font-semibold text-base flex items-start'>
                                    Название компании<span className="text-red-500 text-xs">*</span>
                                </label>
                                <input
                                    id="details.companyName"
                                    name='companyName'
                                    type="text"
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className={`h-[2.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                                    placeholder='НАЗВАНИЕ КОМПАНИИ*' />
                                <label htmlFor="kpp" className='uppercase font-semibold text-base flex items-start'>
                                    Юридический адрес<span className="text-red-500 text-xs">*</span>
                                </label>
                                <input
                                    id="details.legalAddress"
                                    name='legalAddress'
                                    type="text"
                                    onChange={(e) => setLegalAddress(e.target.value)}
                                    className={`h-[2.5rem] ring ring-gray-300 rounded-lg 
                                    px-4 text-base focus:ring-black outline-none transition-all flex-shrink-0
                                    ${error ? "ring ring-red-500" : ""}
                                    `}
                                    placeholder='ЮРИДИЧЕСКИЙ АДРЕС' />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 w-full">

                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="details.inn" className='uppercase font-semibold text-sm'>
                                            ИНН<span className="text-red-500 text-xs">*</span>
                                        </label>
                                        <input
                                            id="details.inn"
                                            name='inn'
                                            type="text"
                                            onChange={(e) => setInn(e.target.value)}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all min-w-0
                ${error ? "ring-red-500" : ""}
            `}
                                            placeholder='ИНН*'
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="details.ogrn" className='uppercase font-semibold text-sm'>
                                            ОГРН<span className="text-red-500 text-xs">*</span>
                                        </label>
                                        <input
                                            id="details.ogrn"
                                            name='ogrn'
                                            type="text"
                                            onChange={(e) => setOgrn(e.target.value)}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all min-w-0
                ${error ? "ring-red-500" : ""}
            `}
                                            placeholder='ВВЕДИТЕ ОГРН*'
                                        />
                                    </div>

                                    {/* Блок КПП */}
                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="details.kpp" className='uppercase font-semibold text-sm'>
                                            КПП<span className="text-red-500 text-xs">*</span>
                                        </label>
                                        <input
                                            id="details.kpp"
                                            name='kpp'
                                            type="text"
                                            onChange={(e) => setKpp(e.target.value)}
                                            className={`h-[2.5rem] w-full ring ring-gray-300 rounded-lg px-4 text-base focus:ring-black outline-none transition-all min-w-0
                ${error ? "ring-red-500" : ""}
            `}
                                            placeholder='ВВЕДИТЕ КПП'
                                        />
                                    </div>

                                </div>
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
            </div>
            <div className="flex-shrink-0">
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
            </div>
            <div className="w-full flex justify-center">
                <button
                    type="submit"
                    className='bg-black text-white uppercase py-2 text-lg rounded mt-2 px-5'
                >
                    {loading ? <Loader className="mx-auto animate-spin" /> : "Регистрация"}
                </button>
            </div>
            <div className="flex flex-col items-center">
                <div className="uppercase text-sm">Уже есть учётная запись?</div>
                <div className="uppercase text-sm hover:underline font-semibold" onClick={() => setSelectedScreen("login")}>войти</div>
            </div>
        </form>
    );
}