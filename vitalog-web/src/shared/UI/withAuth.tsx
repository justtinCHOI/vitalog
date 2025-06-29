'use client';

import { useAuthStore } from '@/shared/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
    const AuthComponent = (props: P) => {
        const { isAuthenticated, _hasHydrated } = useAuthStore();
        const router = useRouter();

        useEffect(() => {
            if (_hasHydrated && !isAuthenticated) {
                router.replace('/login');
            }
        }, [_hasHydrated, isAuthenticated, router]);

        if (!_hasHydrated) {
            return (
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            );
        }

        if (!isAuthenticated) {
            return null; // Avoid rendering component while redirecting
        }

        return <WrappedComponent {...props} />;
    };
    AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return AuthComponent;
} 