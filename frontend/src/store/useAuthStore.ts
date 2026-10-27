import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { User } from "../types/auth"
import axios from "axios"

interface AuthState {
    accessToken: string | null
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    setAuth: (accessToken: string, user: User) => void
    clearAuth: () => void
    initialiseAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    devtools(
        (set) => ({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: true,
            
            // Passing third argument string names your actions in Redux DevTools
            setAuth: (accessToken, user) => 
                set({ accessToken, user, isAuthenticated: true, isLoading: false }, false, "auth/setAuth"),
            
            clearAuth: () => 
                set({ accessToken: null, user: null, isAuthenticated: false, isLoading: false }, false, "auth/clearAuth"),
            
            initialiseAuth: async () => {
                set({ isLoading: true }, false, "auth/initialise_start");
                try {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/refresh`,
                        {},
                        { withCredentials: true } // Sends the refresh cookie automatically
                    );

                    set({
                        accessToken: res.data.accessToken,
                        user: res.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    }, false, "auth/initialise_success");
                    
                } catch (error) {
                    set({ 
                        accessToken: null, 
                        user: null, 
                        isAuthenticated: false, 
                        isLoading: false 
                    }, false, "auth/initialise_failure");
                }
            }
        }),
        { name: "AuthStore" } // Sets the top-level store tab name in Redux DevTools
    )
)