import { ApiArgs } from "@/types/ApiArgs";
import api from "./api";
import { CartItemInterface } from "@/types/CartItemInterface";
import { ProfileInterface } from "@/types/ProfileInterface";
import { ProfileEditInterface } from "@/types/ProfileEditInterface";

export async function getProfile({
    setData,
    setError,
    setLoading
}: {
    setData: (data: any) => void;
    setError: (error: string | Record<string, string> | null) => void; 
    setLoading: (loading: boolean) => void;
}): Promise<ProfileInterface | null> {
    try {
        setLoading(true);
        setData(null);
        setError(null);

        const res = await api.get<ProfileInterface>("/v1/profile",
            {
                withCredentials: true
            }
        )
        console.log("GET PROFILE SUCCESSFUL: ", res.data);
        setData(res.data);
        return res.data;

    }
    catch (err: any) {
        const responseData = err;

        if (responseData?.error === "ValidationMapError" && responseData?.errors) {
            setError(responseData.errors);
        } else {
            const mainMessage = responseData?.description || "Произошла ошибка при получении профиля";

            setError(mainMessage);
        }
        return null;
    }
    finally {
        setLoading(false);
    }
}

export async function editProfileDetails({
    password,
    phone,
    email,
    firstName,
    lastName,
    midName,
    birthDate,
    companyName,
    inn,
    kpp,
    ogrn,
    legalAddress,
    setData,
    setError,
    setLoading
}: ProfileEditInterface & {
    setData: (data: any) => void;
    setError: (error: string | Record<string, string> | null) => void; // Изменили тип здесь
    setLoading: (loading: boolean) => void;
}) {
    try {
        setLoading(true);
        setError(null);
        const res = await api.patch<ProfileInterface>(`/v1/profile`, {
            password: password,
            phone: phone,
            email: email,
            firstName: firstName,
            lastName: lastName,
            midName: midName,
            birthDate: birthDate,
            companyName: companyName,
            inn: inn,
            kpp: kpp,
            ogrn: ogrn,
            legalAddress: legalAddress,
        }, {
            withCredentials: true
        });
        console.log("PROFILE EDIT SUCCESSFUL: ", res.data)
        setData(res.data);
        return true;
    } catch (err: any) {
        const responseData = err;

        if (responseData?.error === "ValidationMapError" && responseData?.errors) {
            setError(responseData.errors);
        } else {
            const mainMessage = responseData?.description || "Произошла ошибка при редактировании профиля";

            setError(mainMessage);
        }
        return false;
    } finally {
        setLoading(false);
    }
}