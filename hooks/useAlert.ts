'use client';

import { AlertContext } from '@/lib/Alert';
import { useContext } from 'react';

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within AlertContext');
  }

  return context;
};
