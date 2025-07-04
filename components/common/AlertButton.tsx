import React from 'react';
import AlertIcon from '@/repo/ui/Icons/AlertIcon';

export default function AlertButton() {
  return (
    <div className="absolute top-8 right-5 w-12 h-12 flex items-center justify-center bg-custom-green rounded-full">
      <AlertIcon />
    </div>
  );
}
