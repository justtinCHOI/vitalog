'use client';

import { useAuthStore } from '@/shared/store/useAuthStore';
import { useEffect } from 'react';

function StoreInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}

export default StoreInitializer; 