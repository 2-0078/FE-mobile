'use client';

interface ModalHeaderProps {
  children?: React.ReactNode;
}

export function ModalHeader({ children }: ModalHeaderProps) {
  return (
    <div className="bg-white sticky top-0 z-10">
      <div className="flex justify-center pt-2">
        <div className="w-26 h-2 rounded-md bg-custom-green text-white" />
      </div>
      {children}
    </div>
  );
}
