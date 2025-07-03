import React from 'react';
import { cn } from '@/lib/utils';

export default function SearchIcon({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.6001 14.8C7.6001 18.76 10.8401 22 14.8001 22C18.7601 22 22.0001 18.76 22.0001 14.8C22.0001 10.84 18.7601 7.60001 14.8001 7.60001C10.8401 7.60001 7.6001 10.84 7.6001 14.8ZM8.80013 14.8C8.80013 11.44 11.4401 8.80001 14.8002 8.80001C18.1602 8.80001 20.8002 11.44 20.8002 14.8C20.8002 18.16 18.1602 20.8 14.8002 20.8C11.4401 20.8 8.80013 18.16 8.80013 14.8Z"
        className="fill-black"
      />
      <path
        d="M19.0188 19.8562L19.8673 19.0077L25.3827 24.5231L24.5342 25.3716L19.0188 19.8562Z"
        className="fill-black"
      />
    </svg>
  );
}
