"use client"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/store/useAuthStore"
import {useMutation} from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {toast} from "sonner"

export const useLogin=()=>{
    const setAuth = useAuthStore((state)=>state.setAuth)

    const router = useRouter()

    return useMutation({
        mutationFn:authService.login,
        onSuccess:(data)=>{
            setAuth(data.accessToken,data.user)
            toast.success("Succesfully Logged In ")
            router.push("/dashboard")
        },
        onError: (error: any) => {
            toast.error(error.message || "Login failed"); // ❌ Toast here
          },
    })
}



export const useRegister=()=>{
    const setAuth = useAuthStore((state)=>state.setAuth)
    const router = useRouter()

    return useMutation({
    mutationFn:authService.register,
    onSuccess:(data)=>{
        setAuth(data.accessToken,data.user)
        toast.success("Succesfully regsitered..")
        router.push("/dashboard")
    },
    onError: (error: any) => {
        toast.error(error.message || "Registration failed"); // ❌ Toast here
      },
    })
}

export const useLogout = ()=>{
    const clearAuth = useAuthStore((state)=>state.clearAuth)
    const router = useRouter()

    return useMutation(
    {
        mutationFn:authService.logout,
        onSuccess:()=>{
            clearAuth();
            toast.success("Succesfully Logged Out")
            router.push("/auth/login")
        },onError: (error: any) => {
            toast.error(error.message || "Logout failed"); // ❌ Toast here
          },
    }
    )
}