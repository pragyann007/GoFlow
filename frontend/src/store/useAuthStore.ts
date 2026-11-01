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
    initialiseAuth: () => Promise<void>
}

// Shared promise lock for initialization to prevent race conditions on page load
let initPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
    devtools(
        (set) => ({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: true,
            
            setAuth: (accessToken, user) => 
                set({ accessToken, user, isAuthenticated: true, isLoading: false }, false, "auth/setAuth"),
            
            clearAuth: () => 
                set({ accessToken: null, user: null, isAuthenticated: false, isLoading: false }, false, "auth/clearAuth"),
            
            initialiseAuth: async () => {
                // If initialization is already running, return the existing promise
                if (initPromise) {
                    return initPromise;
                }

                initPromise = (async () => {
                    set({ isLoading: true }, false, "auth/initialise_start");
                    try {
                        const res = await axios.post(
                            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/authentication/refresh`,
                            {},
                            { withCredentials: true }
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
                    } finally {
                        // Clear the lock when done
                        initPromise = null;
                    }
                })();

                return initPromise;
            }
        }),
        { name: "AuthStore" }
    )
)