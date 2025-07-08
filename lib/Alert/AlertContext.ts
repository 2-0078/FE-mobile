'use client';

import { createContext } from 'react';

export interface AlertContextType {
  basic: (msg: string) => void;
  error: (msg: string) => void;
  success: (msg: string) => void;
  wiggle: (msg: string) => void;
  midBig: (msg: string) => void;
  heartBeat: (msg: string) => void;
  hideAll: () => void;
}

export const AlertContext = createContext<AlertContextType | null>(null);
