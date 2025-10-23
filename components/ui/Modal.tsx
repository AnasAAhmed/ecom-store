// components/Modal.tsx
"use client";
import React, { useEffect } from "react";
import FocusLock from "react-focus-lock";
import { useFocusWithin } from "@react-aria/interactions";
import { useModalStore } from "@/lib/hooks/useModal";

type ModalProps = {
  modalKey: string;
  children: React.ReactNode;
  overlay?: boolean;
};

const Modal = ({ modalKey, children, overlay = false }: ModalProps) => {
  const { isOpen, close } = useModalStore();
  const open = isOpen(modalKey);

  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => {
      if (open) {
        const modalElement = document.getElementById("modal");
        modalElement?.focus();
      }
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(modalKey);
    };

    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close, modalKey]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${overlay && "bg-gray-800"
        } bg-opacity-50 z-50`}
      onClick={() => close(modalKey)}
    >
      <FocusLock className="w-full">
        <div
          className="w-full"
          id="modal"
          tabIndex={-1}
          {...focusWithinProps}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </FocusLock>
    </div>
  );
};

export default Modal;
