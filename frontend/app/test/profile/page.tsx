'use client';

import React, { useState } from 'react';
import { getProfile, editProfileDetails } from "@/app/lib/profile.service";
import { ProfileInterface } from "@/types/ProfileInterface";
import { Loader, User, ShieldCheck, Mail, Phone, Building, FileText, Calendar, MapPin, Save, RefreshCw } from 'lucide-react';

export default function ProfileTestPage() {
    // Индикаторы состояния запросов
    const [loading, setLoading] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [profileData, setProfileData] = useState<ProfileInterface | null>(null);

    const [form, setForm] = useState({
        password: '',
        phone: '',
        email: '',
        firstName: '',
        lastName: '',
        midName: '',
        birthDate: '',
        companyName: '',
        inn: '',
        kpp: '',
        ogrn: '',
        legalAddress: ''
    });
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);
    // Определяем тип клиента на основе данных бэкенда
    const isClientLegal =
        profileData?.clientType?.toUpperCase() === 'LEGAL' ||
        (profileData?.details && 'companyName' in profileData.details);

    const handleSetError = (err: string | Record<string, string> | null) => {
        if (err === null) {
            setGlobalError(null);
            setFieldErrors({});
        } else if (typeof err === 'string') {
            setGlobalError(err);
            setFieldErrors({});
        } else {
            setFieldErrors(err);
            setGlobalError("Ошибка валидации данных. Проверьте поля формы.");
        }
    };

    // Функция загрузки профиля и безопасного распределения данных из details
    const handleLoadProfile = async () => {
        handleSetError(null);
        setSuccessMessage(null);

        const data = await getProfile({
            setData: setProfileData,
            setError: (err) => typeof err === 'string' ? setGlobalError(err) : null,
            setLoading: setLoading
        });

        if (data) {
            const details = data.details;
            const isLegal = data.clientType?.toUpperCase() === 'LEGAL' || (details && 'companyName' in details);

            setForm({
                password: '',
                phone: data.phone || '',
                email: data.email || '',
                firstName: (!isLegal && details ? (details as any).firstName : '') || '',
                lastName: (!isLegal && details ? (details as any).lastName : '') || '',
                midName: (!isLegal && details ? (details as any).midName : '') || '',
                birthDate: (!isLegal && details ? (details as any).birthDate : '') || '',
                companyName: (isLegal && details ? (details as any).companyName : '') || '',
                inn: (isLegal && details ? (details as any).inn : '') || '',
                kpp: (isLegal && details ? (details as any).kpp : '') || '',
                ogrn: (isLegal && details ? (details as any).ogrn : '') || '',
                legalAddress: (isLegal && details ? (details as any).legalAddress : '') || ''
            });
            setSuccessMessage(`Профиль успешно загружен!`);
        }
    };

    // Функция сохранения изменений
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        handleSetError(null);
        setSuccessMessage(null);

        // Фильтруем отправляемый payload в зависимости от типа клиента
        const baseFields = {
            password: form.password || undefined,
            phone: form.phone || undefined,
            email: form.email || undefined,
        };

        const dynamicFields = isClientLegal
            ? {
                companyName: form.companyName || undefined,
                inn: form.inn || undefined,
                kpp: form.kpp || undefined,
                ogrn: form.ogrn || undefined,
                legalAddress: form.legalAddress || undefined,
            }
            : {
                firstName: form.firstName || undefined,
                lastName: form.lastName || undefined,
                midName: form.midName || undefined,
                birthDate: form.birthDate || undefined,
            };

        const payload = Object.fromEntries(
            Object.entries({ ...baseFields, ...dynamicFields }).filter(
                ([_, value]) => value !== undefined && value !== ''
            )
        );

        const success = await editProfileDetails({
            ...payload,
            setData: setProfileData,
            setError: handleSetError,
            setLoading: setLoading
        });

        if (success) {
            setSuccessMessage("Профиль успешно обновлен на сервере!");
            setForm(prev => ({ ...prev, password: '' }));
            handleLoadProfile(); // Обновляем данные в форме и JSON-логе
        }
    };

    const renderFieldError = (fieldName: keyof typeof form) => {
        if (fieldErrors[fieldName]) {
            return (
                <span className="text-xs text-red-600 block mt-1 font-medium">
                    ⚠️ {fieldErrors[fieldName]}
                </span>
            );
        }
        return null;
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6 text-gray-800 bg-gray-50/50 min-h-screen">
            <header className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                            <User className="text-blue-600" /> Тестирование модуля профиля
                        </h1>
                        {profileData && (
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${isClientLegal ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                                {isClientLegal ? 'Юридическое лицо' : 'Физическое лицо'}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Проверка работы GET /v1/profile и PATCH /v1/profile (Раздельный маппинг вложенного details)</p>
                </div>
                <button
                    onClick={handleLoadProfile}
                    disabled={loading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm shadow-sm disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Загрузить / Обновить данные
                </button>
            </header>

            {/* Статус-панель уведомлений */}
            <div className="flex flex-col gap-2">
                {loading && (
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm flex items-center gap-2 animate-pulse">
                        <Loader className="w-4 h-4 animate-spin" /> Сетевой запрос в процессе выполнения...
                    </div>
                )}
                {globalError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                        <strong>Ошибка API:</strong> {globalError}
                    </div>
                )}
                {successMessage && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
                        {successMessage}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ЛЕВАЯ СЕКЦИЯ: Плоская форма редактирования */}
                <form onSubmit={handleSaveProfile} className="lg:col-span-7 bg-white p-6 rounded-xl border shadow-sm space-y-6">
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg border-b pb-2 flex items-center gap-2">
                            <Save className="w-5 h-5 text-emerald-500" /> Изменение полей профиля
                        </h2>
                    </div>

                    {/* Общие аккаунт-данные */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Данные аккаунта</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                                <input type="email" className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white ${fieldErrors.email ? 'border-red-400 bg-red-50/20' : ''}`} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                {renderFieldError('email')}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Телефон</label>
                                <input type="text" className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white ${fieldErrors.phone ? 'border-red-400 bg-red-50/20' : ''}`} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                {renderFieldError('phone')}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-red-600 mb-1">Новый пароль (Оставь пустым, если не меняется)</label>
                                <input type="password" placeholder="Пароль будет передан в WRITE_ONLY режиме..." className={`w-full p-2 border border-red-100 rounded-lg bg-red-50/30 focus:bg-white ${fieldErrors.password ? 'border-red-400' : ''}`} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                {renderFieldError('password')}
                            </div>
                        </div>
                    </div>

                    {/* Блок персональных данных (Только для физлиц) */}
                    {profileData && !isClientLegal && (
                        <div className="space-y-4 pt-4 border-t transition-all">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4" /> Персональные данные / Физическое лицо
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Фамилия (lastName)</label>
                                    <input type="text" className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white ${fieldErrors.lastName ? 'border-red-400 bg-red-50/20' : ''}`} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                                    {renderFieldError('lastName')}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Имя (firstName)</label>
                                    <input type="text" className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white ${fieldErrors.firstName ? 'border-red-400 bg-red-50/20' : ''}`} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                                    {renderFieldError('firstName')}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Отчество (midName)</label>
                                    <input type="text" className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white ${fieldErrors.midName ? 'border-red-400 bg-red-50/20' : ''}`} value={form.midName} onChange={e => setForm({ ...form, midName: e.target.value })} />
                                    {renderFieldError('midName')}
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Дата рождения</label>
                                    <input type="text" placeholder="YYYY-MM-DD" className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white ${fieldErrors.birthDate ? 'border-red-400 bg-red-50/20' : ''}`} value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} />
                                    {renderFieldError('birthDate')}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Блок корпоративных данных (Только для юрлиц) */}
                    {profileData && isClientLegal && (
                        <div className="space-y-4 pt-4 border-t transition-all">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1">
                                <Building className="w-4 h-4" /> Корпоративные данные / Юридическое лицо
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Название компании</label>
                                    <input type="text" className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white ${fieldErrors.companyName ? 'border-red-400 bg-red-50/20' : ''}`} value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
                                    {renderFieldError('companyName')}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">ИНН (строго 15 симв.)</label>
                                    <input type="text" maxLength={15} className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white font-mono ${fieldErrors.inn ? 'border-red-400 bg-red-50/20' : ''}`} value={form.inn} onChange={e => setForm({ ...form, inn: e.target.value })} />
                                    {renderFieldError('inn')}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">КПП (строго 9 симв.)</label>
                                    <input type="text" maxLength={9} className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white font-mono ${fieldErrors.kpp ? 'border-red-400 bg-red-50/20' : ''}`} value={form.kpp} onChange={e => setForm({ ...form, kpp: e.target.value })} />
                                    {renderFieldError('kpp')}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">ОГРН (строго 13 симв.)</label>
                                    <input type="text" maxLength={13} className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white font-mono ${fieldErrors.ogrn ? 'border-red-400 bg-red-50/20' : ''}`} value={form.ogrn} onChange={e => setForm({ ...form, ogrn: e.target.value })} />
                                    {renderFieldError('ogrn')}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Юридический адрес</label>
                                    <input type="text" className={`w-full p-2 border rounded-lg bg-gray-50 focus:bg-white ${fieldErrors.legalAddress ? 'border-red-400 bg-red-50/20' : ''}`} value={form.legalAddress} onChange={e => setForm({ ...form, legalAddress: e.target.value })} />
                                    {renderFieldError('legalAddress')}
                                </div>
                            </div>
                        </div>
                    )}

                    {!profileData && (
                        <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed text-sm text-gray-500">
                            Сначала нажмите кнопку <strong className="text-indigo-600">"Загрузить / Обновить данные"</strong>, чтобы инициализировать форму под тип вашего аккаунта.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!isMounted ? false : (loading || !profileData)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> Отправить PATCH запрос (/v1/profile)
                    </button>
                </form>

                {/* ПРАВАЯ СЕКЦИЯ: Raw JSON */}
                <div className="lg:col-span-5">
                    <div className="bg-gray-900 text-gray-100 p-5 rounded-xl border border-gray-800 shadow-inner h-[710px] flex flex-col font-mono text-xs">
                        <div className="text-gray-400 font-sans font-bold uppercase tracking-wider border-b border-gray-800 pb-2 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" /> Ответ от GET /v1/profile
                        </div>
                        <pre className="flex-1 overflow-auto bg-gray-950 p-3 rounded-lg border border-gray-900 text-green-400 custom-scrollbar">
                            {profileData
                                ? JSON.stringify(profileData, null, 2)
                                : '// Информации нет.\n// Пожалуйста, кликните "Загрузить / Обновить данные" в верхнем углу.'
                            }
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}