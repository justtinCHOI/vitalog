'use client';

import { useAuthStore } from '@/shared/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
    const AuthComponent = (props: P) => {
        const { isAuthenticated } = useAuthStore();
        const router = useRouter();

        useEffect(() => {
            if (!isAuthenticated) {
                router.replace('/login');
            }
        }, [isAuthenticated, router]);

        if (!isAuthenticated) {
            return null; // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };
    return AuthComponent;
} 