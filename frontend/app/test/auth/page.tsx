"use client";

import { useState, FormEvent, useEffect } from "react";
import { Loader2, Lock, User, Phone, Mail, LogOut, RefreshCw, Key, ShieldCheck, FileText, Briefcase } from "lucide-react";
import { login, register, logout, refreshToken } from "@/app/lib/auth.service"; // Скорректируй путь к своему сервису
import { useToken } from "@/store/useToken";

export default function AuthTestPage() {
    // Подключаем Zustand-стор
    const tokenState = useToken();

    // Системные стейты страницы
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [responseData, setResponseData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [errorMap, setErrorMap] = useState<Map<string, string> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Стенд данных для формы Входа (Login)
    const [loginValue, setLoginValue] = useState("testuser");
    const [passwordValue, setPasswordValue] = useState("password123");

    // Стенд общих данных для формы Регистрации (Register)
    const [regLogin, setRegLogin] = useState("newuser");
    const [regPassword, setRegPassword] = useState("SecurePass123!");
    const [regPhone, setRegPhone] = useState("+79991112233");
    const [regEmail, setRegEmail] = useState("test@example.com");

    // Переключатель типа деталей: физлицо (individual) или юрлицо (legal)
    const [detailsType, setDetailsType] = useState<"individual" | "legal">("individual");

    // Поля для IndividualDetails
    const [indFirstName, setIndFirstName] = useState("Иван");
    const [indLastName, setIndLastName] = useState("Иванов");
    const [indMidName, setIndMidName] = useState("Иванович");
    const [indBirthDate, setIndBirthDate] = useState("1995-05-15");
    const [indPassportSeries, setIndPassportSeries] = useState("4515");
    const [indPassportNumber, setIndPassportNumber] = useState("123456");

    // Поля для LegalDetails
    const [legCompanyName, setLegCompanyName] = useState("ООО Ромашка");
    const [legInn, setLegInn] = useState("7701234567");
    const [legKpp, setLegKpp] = useState("770101001");
    const [legOgrn, setLegOgrn] = useState("1027700123456");
    const [legLegalAddress, setLegLegalAddress] = useState("г. Москва, ул. Ленина, д. 1");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    // Сброс логов перед отправкой нового запроса
    const resetLogs = () => {
        setResponseData(null);
        setError(null);
        setErrorMap(null);
    };

    // Отправка формы логина
    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        resetLogs();

        await login({
            loginValue,
            passwordValue,
            setData: setResponseData,
            setError,
            setLoading,
            updateSession: tokenState.updateSession,
            updateToken: tokenState.updateToken
        });
    };

    // Отправка формы регистрации с динамической сборкой структуры details
    const handleRegisterSubmit = async (e: FormEvent) => {
        e.preventDefault();
        resetLogs();

        // Формируем объект details в зависимости от выбранного типа
        const details = detailsType === "individual"
            ? {
                type: "individual",
                firstName: indFirstName,
                lastName: indLastName,
                midName: indMidName || null,
                birthDate: indBirthDate,
                passportSeries: indPassportSeries,
                passportNumber: indPassportNumber
            }
            : {
                type: "legal",
                companyName: legCompanyName,
                inn: legInn,
                kpp: legKpp,
                ogrn: legOgrn,
                legalAddress: legLegalAddress
            };

        await register({
            login: regLogin,
            password: regPassword,
            phone: regPhone,
            email: regEmail,
            details: details, // Передаем строго собранный объект
            setData: setResponseData,
            setError,
            setErrorMap,
            setLoading,
            updateSession: tokenState.updateSession,
            updateToken: tokenState.updateToken
        });
    };

    const handleRefresh = async () => {
        resetLogs();
        await refreshToken({
            setData: setResponseData,
            setError,
            setLoading,
            updateToken: tokenState.updateToken
        });
    };

    const handleLogout = async () => {
        resetLogs();
        await logout({
            setLoading,
            deleteSession: tokenState.deleteSession
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 md:p-12 text-zinc-900 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Верхняя панель */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Песочница Модуля Аутентификации</h1>
                        <p className="text-sm text-zinc-500 mt-1">Тестирование методов с поддержкой полиморфных деталей профиля (Individual / Legal)</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {loading && <Loader2 className="animate-spin text-zinc-500 w-5 h-5" />}
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-xs font-medium hover:bg-zinc-50 disabled:opacity-50"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Ручной Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-medium disabled:opacity-50"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Выйти (Logout)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ЛЕВАЯ КОЛОНКА: Управление и Формы */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Выбор метода: Логин или Регистрация */}
                        <div className="flex bg-zinc-200/60 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => { setActiveTab("login"); resetLogs(); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "login" ? "bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
                            >
                                Авторизация (Login)
                            </button>
                            <button
                                type="button"
                                onClick={() => { setActiveTab("register"); resetLogs(); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "register" ? "bg-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
                            >
                                Регистрация (Register)
                            </button>
                        </div>

                        {/* Форма Авторизации */}
                        {activeTab === "login" && (
                            <form onSubmit={handleLoginSubmit} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                                <h2 className="font-semibold text-lg flex items-center gap-2 mb-2"><Key className="w-5 h-5 text-zinc-600" /> Форма Входа</h2>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Логин</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                            <input type="text" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} className="w-full h-10 pl-9 pr-3 border rounded-lg text-sm focus:outline-zinc-900" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Пароль</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                            <input type="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} className="w-full h-10 pl-9 pr-3 border rounded-lg text-sm focus:outline-zinc-900" required />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white rounded-xl font-medium transition-colors text-sm mt-2">
                                    Выполнить login()
                                </button>
                            </form>
                        )}

                        {/* Форма Регистрации */}
                        {activeTab === "register" && (
                            <form onSubmit={handleRegisterSubmit} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-5">
                                <h2 className="font-semibold text-lg flex items-center gap-2 border-b pb-2"><ShieldCheck className="w-5 h-5 text-zinc-600" /> Основные данные аккаунта</h2>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Логин</label>
                                            <input type="text" value={regLogin} onChange={(e) => setRegLogin(e.target.value)} className="w-full h-10 px-3 border rounded-lg text-sm focus:outline-zinc-900" required />
                                            {(errorMap as any)?.login && <p className="text-red-500 text-[11px] mt-1">{(errorMap as any).login}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Пароль</label>
                                            <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full h-10 px-3 border rounded-lg text-sm focus:outline-zinc-900" required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Телефон</label>
                                            <input type="text" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full h-10 px-3 border rounded-lg text-sm focus:outline-zinc-900" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Email</label>
                                            <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full h-10 px-3 border rounded-lg text-sm focus:outline-zinc-900" required />
                                        </div>
                                    </div>
                                </div>

                                {/* Селектор типа деталей (Union Type) */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Тип профиля (details.type)</label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-lg border">
                                        <button
                                            type="button"
                                            onClick={() => setDetailsType("individual")}
                                            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${detailsType === "individual" ? "bg-white text-zinc-900 shadow-xs border" : "text-zinc-500"}`}
                                        >
                                            <FileText className="w-3.5 h-3.5" /> Физлицо (Individual)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDetailsType("legal")}
                                            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${detailsType === "legal" ? "bg-white text-zinc-900 shadow-xs border" : "text-zinc-500"}`}
                                        >
                                            <Briefcase className="w-3.5 h-3.5" /> Юрлицо (Legal)
                                        </button>
                                    </div>
                                </div>

                                {/* Поля деталей для ФИЗЛИЦА */}
                                {detailsType === "individual" && (
                                    <div className="bg-zinc-50/50 p-4 rounded-xl border border-dashed border-zinc-200 space-y-3">
                                        <p className="text-xs font-bold text-zinc-500 uppercase">// Структура IndividualDetails</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">Фамилия</label>
                                                <input type="text" value={indLastName} onChange={(e) => setIndLastName(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">Имя</label>
                                                <input type="text" value={indFirstName} onChange={(e) => setIndFirstName(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">Отчество</label>
                                                <input type="text" value={indMidName} onChange={(e) => setIndMidName(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" placeholder="null" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">Дата рождения</label>
                                            <input type="date" value={indBirthDate} onChange={(e) => setIndBirthDate(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">Серия паспорта</label>
                                                <input type="text" value={indPassportSeries} onChange={(e) => setIndPassportSeries(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">Номер паспорта</label>
                                                <input type="text" value={indPassportNumber} onChange={(e) => setIndPassportNumber(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Поля деталей для ЮРЛИЦА */}
                                {detailsType === "legal" && (
                                    <div className="bg-zinc-50/50 p-4 rounded-xl border border-dashed border-zinc-200 space-y-3">
                                        <p className="text-xs font-bold text-zinc-500 uppercase">// Структура LegalDetails</p>
                                        <div>
                                            <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">Название компании</label>
                                            <input type="text" value={legCompanyName} onChange={(e) => setLegCompanyName(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">ИНН</label>
                                                <input type="text" value={legInn} onChange={(e) => setLegInn(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">КПП</label>
                                                <input type="text" value={legKpp} onChange={(e) => setLegKpp(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">ОГРН</label>
                                                <input type="text" value={legOgrn} onChange={(e) => setLegOgrn(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-medium text-zinc-400 uppercase mb-0.5">Юридический адрес</label>
                                            <input type="text" value={legLegalAddress} onChange={(e) => setLegLegalAddress(e.target.value)} className="w-full h-9 px-2 border rounded-md text-xs" required />
                                        </div>
                                    </div>
                                )}

                                <button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white rounded-xl font-medium transition-colors text-sm">
                                    Выполнить register()
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ПРАВАЯ КОЛОНКА: Мониторинг Zustand и Ответов API */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Состояние Zustand Стора */}
                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Состояние Zustand Store (`useToken`)</span>
                                <span className={`w-2 h-2 rounded-full ${!mounted ? "bg-zinc-300" : tokenState.accessToken ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-zinc-50 p-2.5 rounded-lg border">
                                    <p className="text-zinc-400 font-medium mb-0.5">Статус сессии:</p>
                                    <p className="font-bold font-mono text-zinc-800">{!mounted ? "⏳ Загрузка..." : tokenState.accessToken ? "🟢 Активна" : "🔴 Вылогинен"}</p>
                                </div>
                                <div className="bg-zinc-50 p-2.5 rounded-lg border">
                                    <p className="text-zinc-400 font-medium mb-0.5">Логин (User):</p>
                                    <p className="font-bold text-zinc-800 truncate" title={mounted ? (tokenState as any).user?.login : ""}>
                                        {!mounted ? "..." : (tokenState as any).user?.login || "null"}
                                    </p>
                                </div>
                                <div className="bg-zinc-50 p-2.5 rounded-lg border">
                                    <p className="text-zinc-400 font-medium mb-0.5">Роль (Role):</p>
                                    <p className="font-bold text-zinc-800">
                                        {!mounted ? "..." : (tokenState as any).user?.role || "null"}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-zinc-900 text-zinc-300 p-3 rounded-lg text-[11px] font-mono break-all max-h-24 overflow-y-auto">
                                <span className="text-amber-400 font-bold">accessToken:</span> {!mounted ? "loading..." : tokenState.accessToken || "null"}
                            </div>
                        </div>

                        {/* Логи терминала сервера */}
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col flex-1 min-h-[380px] overflow-hidden">
                            <div className="px-5 py-3 border-b bg-zinc-50 flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Монитор сетевых ответов API</span>
                                {error && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-200">Ошибка запроса</span>}
                            </div>

                            <div className="p-5 flex-1 bg-zinc-950 font-mono text-xs overflow-y-auto max-h-[440px]">
                                {error && (
                                    <div className="text-red-400 border border-red-900 bg-red-950/40 p-3 rounded-lg mb-4 whitespace-pre-wrap">
                                        <span className="text-red-500 font-bold">⚠️ Intercepted Error:</span>{"\n"}{error}
                                    </div>
                                )}

                                {responseData ? (
                                    <div className="text-emerald-400">
                                        <span className="text-zinc-500 font-bold">// Response Body JSON:</span>
                                        <pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(responseData, null, 2)}</pre>
                                    </div>
                                ) : !error ? (
                                    <div className="text-zinc-600 text-center flex flex-col items-center justify-center h-full py-16 font-sans">
                                        <span>[Ожидание выполнения запроса]</span>
                                        <span className="text-[11px] text-zinc-700 mt-1">Заполни поля слева и нажми кнопку метода для проверки передачи данных</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}