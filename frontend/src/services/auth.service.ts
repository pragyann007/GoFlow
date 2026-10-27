import { api } from "@/lib/axios";
import {AuthResponse,LoginCredentials,RegisterCredentials,User} from "../types/auth"

export const authService ={
    async register(credentials:RegisterCredentials):Promise<AuthResponse>{
        const {data} = await api.post("/authentication/register",credentials)
        return data ;

    },
    async login(credentials:LoginCredentials):Promise<AuthResponse>{
        const { data } = await api.post<AuthResponse>('/authentication/login', credentials);
    return data;

    },

    async logout():Promise<void>{
        await api.post("/authenication/logout")

    }
}