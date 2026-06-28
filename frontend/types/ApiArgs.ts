import { Dispatch, SetStateAction } from "react";
import { UserMinimal } from "./UserMinimal";

export interface ApiArgs {
    setData: Dispatch<SetStateAction<any>>;
    setErrorMap: Dispatch<SetStateAction<Map<string, string> | null>> | null;
    setError: Dispatch<SetStateAction<string | null>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    updateSession: (token: string, user: UserMinimal) => void | null;
    updateToken: (token: string) => void | null;
}