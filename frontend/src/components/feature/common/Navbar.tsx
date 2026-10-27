"use client"
import { useUser } from '@/hooks/useUser';

const Navbar = () => {
    const { user, isAuthenticated, isLoading } = useUser();

    if (isLoading) return <div>Loading session...</div>;

    if (!isAuthenticated) return <div>Please log in</div>;

    return (
        <nav>
            <span>Welcome back, {user?.email}</span>
        </nav>
    );
};

export default Navbar