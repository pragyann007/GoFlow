"Query Provider"
"use client"

import { useAuthStore } from "@/store/useAuthStore"
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import { stat } from "fs"
import { useState,ReactNode, useEffect } from "react"

export function Providers ({children}:{children:ReactNode}){

    const initializeAuth = useAuthStore((state)=>state.initialiseAuth)

    useEffect(()=>{
        initializeAuth()
    },[initializeAuth])

    const [queryClient] = useState(()=>new QueryClient({
        defaultOptions:{
            queries:{
                staleTime:10000*60*5,
                refetchOnWindowFocus:false

            }
        }
    }))

    return (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    )

}