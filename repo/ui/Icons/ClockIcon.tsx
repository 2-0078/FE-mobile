import React from 'react';
import { cn } from '@/lib/utils';
export default function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M10 17.5C13.866 17.5 17 14.366 17 10.5C17 6.63401 13.866 3.5 10 3.5C6.13401 3.5 3 6.63401 3 10.5C3 14.366 6.13401 17.5 10 17.5Z"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M3.96572 1.63623C3.28732 1.81792 2.66872 2.17502 2.17212 2.67163C1.67551 3.16823 1.31841 3.78683 1.13672 4.46523M16.0357 1.63623C16.7141 1.81792 17.3327 2.17502 17.8293 2.67163C18.3259 3.16823 18.683 3.78683 18.8647 4.46523M10.0007 6.50023V10.2502C10.0007 10.3882 10.1127 10.5002 10.2507 10.5002H13.0007"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
