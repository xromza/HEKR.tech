import { IndividualDetailsResponse } from "./IndividualDetailsResponse";
import { LegalDetailsResponse } from "./LegalDetailsResponse";

export interface ProfileInterface {
    id: number,
    login: string,
    role: string,
    createdAt: string,
    isApproved: boolean,
    clientType: string,
    email: string,
    phone: string,
    details: LegalDetailsResponse | IndividualDetailsResponse
}