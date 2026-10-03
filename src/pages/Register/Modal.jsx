import React, { useEffect, useRef } from 'react';

export default function Modal({ title, file = 'register.sh', wide = false, onClose, children }) {
  const ref = useRef();
  const btnRef = useRef();

  useEffect(() => {
    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus trap
    const getFocusable = () =>
      [...(ref.current?.querySelectorAll('button,input,select,textarea,a,[tabindex]:not([tabindex="-1"])') || [])];

    const trap = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const focusable = getFocusable().filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', trap);
    // Focus first focusable inside
    setTimeout(() => { getFocusable()[0]?.focus(); }, 50);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', trap);
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="cp-overlay"
      role="presentation"
      onClick={handleOverlayClick}
      aria-hidden="false"
    >
      <div
        ref={ref}
        className={`cp-modal ${wide ? 'wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Title bar */}
        <div className="cp-modal-bar">
          <i /><i /><i className="red" />
          <span className="cp-modal-title">{file}</span>
          <em className="cp-modal-status">● ACTIVE</em>
          <button
            ref={btnRef}
            className="cp-modal-close"
            aria-label="Close dialog"
            onClick={onClose}
          >✕</button>
        </div>

        {/* Scrollable body */}
        <div className="cp-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
