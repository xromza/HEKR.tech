import { ApiArgs } from "@/types/ApiArgs";
import api from "./api";
import { CartItemInterface } from "@/types/CartItemInterface";
import { ProfileInterface } from "@/types/ProfileInterface";

export async function getProfile({
    setData,
    setError,
    setLoading
}: Pick<ApiArgs, 'setData' | 'setError' | 'setLoading'>): Promise<ProfileInterface | null> {
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
        const serverErrors = err.error || err.response?.data?.error;
        const mainMessage = err.description || err.response?.data?.description || "Произошла ошибка при получении данных профиля";
        if (serverErrors) {
            setError(mainMessage);
        }
        return null;
    }
    finally {
        setLoading(false);
    }
}