"use client";

import CartGrid from "@/components/CartGrid";
import { useToken } from "@/store/useToken";
import { CartInterface } from "@/types/CartInterface";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCw, X, Loader, TriangleAlert, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatPrice, getEnding } from "../lib/utils";
import { ProfileInterface } from "@/types/ProfileInterface";
import { getProfile } from "../lib/profile.service";
import { IndividualDetailsResponse } from "@/types/IndividualDetailsResponse";
import { LegalDetailsResponse } from "@/types/LegalDetailsResponse";
import { Variants } from "framer-motion";
interface NavFields {
    idx: number,
    title: string
}


export default function AccountPage() {
    const [profileData, setProfileData] = useState<ProfileInterface | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const loginValue = useToken((state) => state.user?.login)
    const [isMounted, setIsMounted] = useState(false);

    const pageVariants: Variants = {
        initial: (direction: number) => ({
            opacity: 0,
            y: direction > 0 ? "100%" : "-100%",
        }),
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 22,
                mass: 0.8,
            }
        },
        exit: (direction: number) => ({
            opacity: 0,
            y: direction > 0 ? "-100%" : "100%",
            transition: {
                duration: 0.25,
            }
        })
    };
    const [[screen, direction], setScreen] = useState([0, 0]);

    const navigateTo = (newScreen: number) => {
        setScreen([newScreen, newScreen > screen ? 1 : -1]);
    };


    const handleAction = async (actionFn: () => Promise<boolean>) => {
        const isSuccess = await actionFn();

        if (isSuccess) {
            await getProfile({ setData: setProfileData, setError, setLoading });
        }
    };
    
    useEffect(() => {
        getProfile({ setData: setProfileData, setError, setLoading });
    }, [loginValue]);

    useEffect(() => {
        setIsMounted(true);
    }, [])
    const router = useRouter();

    const navButtons: NavFields[] = [
        {
            idx: 0,
            title: "Главная"
        },
        {
            idx: 1,
            title: "Профиль"
        },
        {
            idx: 2,
            title: "Мои заказы"
        },
    ]

    return (

        <main className="h-full w-full mx-auto flex max-w-[1680px]">
            <div className="flex flex-col md:flex-row w-full px-4">
                <div className="flex-shrink-0 flex mb-4 items-center md:items-start flex-col px-6 w-full md:w-fit">
                    <div className="flex flex-row gap-2 items-center justify-center md:justify-start mb-5 w-full">
                        <div className="uppercase font-bold text-[3rem] leading-none">личный кабинет</div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        {
                            navButtons.map((btn) => (
                                <button key={btn.idx} onClick={() => navigateTo(btn.idx)}
                                    className={`pt-2 hover:text-black ${btn.idx === screen ? "text-black" : "text-gray-400  "} w-full uppercase disabled:text-gray-400 
                                    text-xl text-start enabled:cursor-pointer transition-colors border-b-2`}>
                                    {btn.title}
                                </button>
                            ))
                        }
                    </div>
                </div>
                <div className="flex-1">
                    {loading ? <Loader className="animate-spin mx-auto my-auto" /> :
                        (error || !loginValue || !isMounted) ? <div className="flex flex-col items-center justify-center w-full px-4 gap-4 text-md md:text-xl h-[60vh]">
                            <TriangleAlert className="w-[7rem] h-[7rem] text-red-700" />
                            <div className="text-center uppercase">{error ? error : "сначала необходимо авторизоваться в системе"}</div>
                        </div>
                            :
                            <div className="relative overflow-hidden w-full h-full">
                                
                                <AnimatePresence mode="popLayout" custom={direction}>
                                    {screen === 0 && (
                                        <motion.div
                                            key={0}
                                            custom={direction}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full h-full"
                                        >
                                            <MainPage />
                                        </motion.div>
                                    )}

                                    {screen === 1 && (
                                        <motion.div
                                            key={1}
                                            custom={direction}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full h-full"
                                        >
                                            {(profileData && <ProfilePage profileData={profileData} />) || <div>Error</div>}
                                        </motion.div>
                                    )}

                                    {screen === 2 && (
                                        <motion.div
                                            key={2}
                                            custom={direction}
                                            variants={pageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="w-full h-full"
                                        >
                                            <OrdersPage />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                    }
                </div>
            </div>
        </main>
    );
}

function ProfilePage({ profileData }: { profileData: ProfileInterface }) {
    interface ProfileField {
        title: string,
        value: string,
        visible: boolean
    }
    const isIndividual = profileData.clientType === "INDIVIDUAL";
    let profileFields: ProfileField[] = [
        {
            title: "Логин",
            value: profileData.login,
            visible: profileData.login !== undefined
        },
        {
            title: "Email",
            value: profileData.email,
            visible: profileData.email !== undefined
        },
        {
            title: "Номер телефона",
            value: profileData.phone,
            visible: profileData.phone !== undefined
        }
    ];

    if (profileData.clientType === "INDIVIDUAL") {
        const indivDetails: IndividualDetailsResponse = profileData.details;

        profileFields = profileFields.concat([
            {
                title: "ФИО",
                value: `${indivDetails.lastName} ${indivDetails.firstName} ${indivDetails.midName || ""}`.trim(),
                visible: indivDetails.lastName !== undefined && indivDetails.firstName !== undefined
            },
            {
                title: "Паспорт",
                value: `${indivDetails.passportSeries} ${indivDetails.passportNumber}`,
                visible: indivDetails.passportSeries !== undefined && indivDetails.passportNumber !== undefined
            },
            {
                title: "Дата рождения",
                value: indivDetails.birthDate,
                visible: indivDetails.birthDate !== undefined
            }
        ]);
    } else if (profileData.clientType === "LEGAL") {
        const legalDetails: LegalDetailsResponse = profileData.details;

        profileFields = profileFields.concat([
            {
                title: "Наименование компании",
                value: legalDetails.companyName,
                visible: legalDetails.companyName !== undefined
            },
            {
                title: "Юридический адрес",
                value: legalDetails.legalAddress,
                visible: legalDetails.legalAddress !== undefined
            },
            {
                title: "ИНН",
                value: legalDetails.inn,
                visible: legalDetails.inn !== undefined
            },
            {
                title: "ОГРН",
                value: legalDetails.ogrn,
                visible: legalDetails.ogrn !== undefined
            },
            {
                title: "КПП",
                value: legalDetails.kpp,
                visible: legalDetails.kpp !== undefined
            }
        ]);
    }

    return (
        <div className="w-full rounded-lg border-2 p-8 py-12">
            <div className="flex flex-row gap-1 items-center text-[2rem] uppercase mb-4">
                <UserRound /> Профиль
            </div>
            <table>
                <tbody>
                    {
                        profileFields.filter((item) => item.visible).map((field, idx) => (
                            <tr key={idx}>
                                <td className="py-[0.5] md:pr-8 font-medium uppercase text-sm md:text-md md:whitespace-nowrap border-r-2 border-gray-300">{field.title}</td>
                                <td className="pl-4 md:pl-8 text-gray-900 break-all">{field.value}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
function MainPage() {
    return (
        <div className="w-full rounded-2xl border-2">
            <div>
                Главная страница
            </div>
        </div>
    )
}
function OrdersPage() {
    return (
        <div className="p-10 w-full h-[40vh] border-2 rounded-xl">
            Страница заказов
        </div>
    )
}
