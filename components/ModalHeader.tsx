'use client';

interface ModalHeaderProps {
  children?: React.ReactNode;
}

export function ModalHeader({ children }: ModalHeaderProps) {
  return <div className="bg-white sticky top-0 z-10">{children}</div>;
}
