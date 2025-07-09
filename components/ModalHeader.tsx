'use client';

import { Button } from '@/components/ui/button';

interface ModalHeaderProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

export function ModalHeader({ onClose, children }: ModalHeaderProps) {
  return (
    <div className="bg-white sticky top-0 z-10 flex justify-center py-5 w-full">
      {/* <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="w-26 h-2 rounded-md bg-custom-green text-white absolute left-0 right-0 mx-auto"
      /> */}
      {children}
    </div>
  );
}
