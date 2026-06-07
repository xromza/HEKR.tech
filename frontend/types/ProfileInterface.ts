import { IndividualDetailsResponse } from "./IndividualDetailsResponse";
import { LegalDetailsResponse } from "./LegalDetailsResponse";
export type ProfileInterface = {
    id: number;
    login: string;
    role: string;
    createdAt: string;
    isApproved: boolean;
    email: string;
    phone: string;
} & (
    | { clientType: "INDIVIDUAL"; details: IndividualDetailsResponse }
    | { clientType: "LEGAL"; details: LegalDetailsResponse }
);