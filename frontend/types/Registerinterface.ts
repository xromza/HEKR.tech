import { IndividualDetails } from "./IndividualDetails";
import { LegalDetails } from "./LegalDetails";

export interface RegisterInterface {
    login: string,
    password: string, 
    phone: string,
    email: string,
    details: IndividualDetails | LegalDetails
}