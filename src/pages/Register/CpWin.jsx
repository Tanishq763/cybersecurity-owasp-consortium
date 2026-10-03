import React, { useEffect, useRef } from 'react';

// Reusable terminal-window panel (matches site's Win component style)
export function CpWin({ file, status = '● RUNNING', children }) {
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { ref.current?.classList.add('visible'); io.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className="cp-win">
      <div className="cp-wbar">
        <i /><i /><i className="on" />
        <span>{file}</span>
        <em>{status}</em>
      </div>
      <div className="cp-wbody">
        {children}
      </div>
    </section>
  );
}
