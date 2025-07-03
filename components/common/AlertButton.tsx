import React from 'react';
import AlertIcon from '@/repo/ui/Icons/AlertIcon';

export default function AlertButton({
  isActive = false,
}: {
  isActive?: boolean;
}) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center bg-custom-green rounded-full">
      <AlertIcon />
      {isActive && (
        <span className="absolute top-0 right-[3px] w-3 h-3 bg-custom-red rounded-full border-2 border-background" />
      )}
    </div>
  );
}
