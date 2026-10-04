import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ open, title, onClose, children }) => {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const onKey = (event) => event.key === 'Escape' && onCloseRef.current();
    document.addEventListener('keydown', onKey);
    dialogRef.current?.querySelector('button, [href], input, select, textarea')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="paper w-full max-w-md rounded-sm px-6 py-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="mb-3 text-xl font-bold tracking-[0.1em] uppercase">{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
