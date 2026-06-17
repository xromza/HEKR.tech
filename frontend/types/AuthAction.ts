export interface AuthAction {
    accessToken: string,
    type: string,
    description: string,
    role: "MANAGER" | "CLIENT" | "ADMIN"
}