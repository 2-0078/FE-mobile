"use client";

import { useState, useEffect, type ReactNode } from "react";

interface ModalContainerProps {
  children: ReactNode | ((handleClose: () => void) => ReactNode);
  isOpen: boolean;
  onClose?: () => void;
  withAnimation?: boolean;
}

export function ModalContainer({
  children,
  isOpen,
  withAnimation = true,
  onClose,
}: ModalContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // 뒤쪽 페이지 스크롤 비활성화
      document.body.style.overflow = "hidden";

      // 컴포넌트가 마운트된 후 애니메이션 시작
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    }

    return () => {
      if (!isOpen) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      document.body.style.overflow = "unset";
      setIsVisible(false);
      setIsClosing(false);
      onClose?.();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        withAnimation
          ? isClosing
            ? "translate-y-full"
            : isVisible
            ? "translate-y-0"
            : "translate-y-full"
          : ""
      }`}
    >
      <div className="h-full overflow-y-auto">
        <div className="min-h-full bg-white">
          {typeof children === "function" ? children(handleClose) : children}
        </div>
      </div>
    </div>
  );
}
