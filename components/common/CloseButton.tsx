'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { XIcon } from 'lucide-react';

export default function CloseButton() {
  const router = useRouter();
  return (
    <button
      className="bg-custom-green rounded-full w-12 h-12"
      onClick={() => router.push('/')}
    >
      <XIcon className="mx-auto" size={24} color="black" />
    </button>
  );
}
