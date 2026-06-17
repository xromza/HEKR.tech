import { AuthAction } from "@/types/AuthAction";
import { Dispatch, SetStateAction, useState } from "react";
import api from "./api";
import { UserMinimal } from "@/types/UserMinimal";
import { RegisterInterface } from "@/types/Registerinterface";
import { useToken } from "@/store/useToken";
import { CartInterface } from "@/types/CartInterface";
import { CartItemRequest } from "@/types/CartItemRequest";
import { ApiArgs } from "@/types/ApiArgs";
import { getProfile } from "./profile.service";

interface LoginArgs {
    loginValue: string;
    passwordValue: string;
}

export async function refreshToken({
    setData,
    setError,
    setLoading,
    updateToken
}
    : {
        setData: Dispatch<SetStateAction<any>>,
        setError: Dispatch<SetStateAction<string | null>>,
        setLoading: Dispatch<SetStateAction<boolean>>,
        updateToken: (token: string) => void
    }) {
    try {
        setLoading(true);

        const res = await api.post<AuthAction>("/v1/auth/refresh");
        setData(res.data)
        console.debug("REFRESH SUCCESSFUL: ", res.data);
        updateToken(res.data.accessToken)

    }
    catch (err: any) {
        setError(err.response?.data?.message || err.message);
        console.debug("REFRESH ERROR: ", err.response)
    } finally {
        setLoading(false)
    }
}

export async function login({
    loginValue,
    passwordValue,
    setData,
    setError,
    setLoading,
    updateSession,
    updateToken,
}: LoginArgs
    & Omit<ApiArgs, 'setError' | 'setErrorMap'>
    & { setError: (error: any) => void; }) {
    try {
        setLoading(true);
        setError(null);

        const loginRes = await api.post<AuthAction>("/v1/auth/login", {
            login: loginValue,
            password: passwordValue
        });

        setData(loginRes.data);
        console.log("LOGIN SUCCESSFUL: ", loginRes.data);

        updateToken(loginRes.data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.accessToken}`;
        const profile = await getProfile({
            setData: () => { },
            setError: setError,
            setLoading: () => { }
        });
        if (profile) {
            updateSession(loginRes.data.accessToken, {
                login: profile.login,
                role: profile.role
            });
        }
        return true;
    } catch (err: any) {
        const msg =
            err.response?.data?.description ||
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message;
        setError(msg);
        console.error("LOGIN ERROR: ", msg);
        return false;
    } finally {
        setLoading(false);
    }
}

export async function logout(
    {
        setLoading,
        deleteSession
    }
        : {
            setLoading: Dispatch<SetStateAction<boolean>>,
            deleteSession: () => void
        }) {
    try {

        setLoading(true);
        const logoutRes = await api.post<LogoutStatus>("/v1/auth/logout");
        console.log("LOGOUT SUCCESSFUL: ", logoutRes.data);
    } catch (err: any) {
        const msg =
            err.response?.data?.description ||
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message;
        console.error("LOGOUT ERROR: ", msg);
        return false;
    } finally {
        setLoading(false);
        deleteSession();
    }
}

export async function register({
    login,
    password,
    phone,
    email,
    details,
    setData,
    setError,
    setLoading,
    updateSession,
    updateToken
}: RegisterInterface
    & Omit<ApiArgs, 'setError' | 'setErrorMap'>
    & { setError: (error: any) => void; }) {
    try {
        setLoading(true);
        setError(null);
        const registerRes = await api.post<AuthAction>("/v1/auth/register", {
            login: login,
            password: password,
            phone: phone,
            email: email,
            details: details
        });
        console.log("REGISTER SUCCESSFUL: ", registerRes.data)

        setData(registerRes.data);
        updateToken(registerRes.data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${registerRes.data.accessToken}`;
        const profile = await getProfile({
            setData: () => { },
            setError: setError,
            setLoading: () => { }
        });
        if (profile) {
            updateSession(registerRes.data.accessToken, {
                login: profile.login,
                role: profile.role
            });
        }
        return true;
    } catch (err: any) {
        const responseData = err;
        if (responseData?.error === "ValidationMapError" && responseData?.errors !== null) {
            setError(responseData);
        } else {
            const mainMessage = responseData?.description || "Произошла ошибка при регистрации профиля";

            setError(mainMessage);
        }
        return false;

        return false;
    } finally {
        setLoading(false)
    }

}

export function getAccessToken() {
    return useToken((state) => state.accessToken);
}