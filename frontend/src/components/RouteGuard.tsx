"use client"
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading spinner while checking the refresh token on initial load
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading GoFlow...</div>;
    }

    if (!isAuthenticated) {
        return null; // Don't flash dashboard content before redirecting
    }

    return <>{children}</>;
}