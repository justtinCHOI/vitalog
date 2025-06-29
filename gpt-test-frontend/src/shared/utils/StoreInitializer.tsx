'use client';

import { useRef } from 'react';
import { useAuthStore } from '@/shared/store/useAuthStore';

function StoreInitializer() {
    const initialized = useRef(false);
    if (!initialized.current) {
        useAuthStore.getState().setHasHydrated(useAuthStore.persist.hasHydrated());
        initialized.current = true;
    }
    return null;
}

export default StoreInitializer; 