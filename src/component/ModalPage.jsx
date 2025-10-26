import React, { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * ModalPortal
 * - isOpen: boolean (parent decides)
 * - onClose: function
 * - children: modal card content
 * - zIndex optional
 */
export default function ModalPortal({ isOpen, onClose, children, zIndex = 1000 }) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const node = (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md mx-4">{children}</div>
    </div>
  );

  return createPortal(node, document.body);
}