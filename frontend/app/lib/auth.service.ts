import { AuthAction } from "@/types/AuthAction";
import { Dispatch, SetStateAction, useState } from "react";
import api from "./api";
import { UserMinimal } from "@/types/UserMinimal";

interface LoginArgs {
    loginValue: string;
    passwordValue: string;
    setData: Dispatch<SetStateAction<any>>;
    setError: Dispatch<SetStateAction<string | null>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    updateSession: (token: string, user: UserMinimal) => void;
    updateToken: (token: string) => void;
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

interface ProfileData {
    login: string,
    role: string
}

export async function login({
    loginValue,
    passwordValue,
    setData,
    setError,
    setLoading,
    updateSession,
    updateToken
}: LoginArgs) {
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

        const profileRes = await api.get<ProfileData>("/v1/profile", {
            withCredentials: true
        })
        updateSession(loginRes.data.accessToken, {
            login: profileRes.data.login,
            role: profileRes.data.role
        });
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