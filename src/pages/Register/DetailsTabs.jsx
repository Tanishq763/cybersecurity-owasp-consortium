import React, { useEffect, useRef, useState } from 'react';

const TABS = [
  { id: 'cp-overview', label: 'Overview' },
  { id: 'cp-agenda', label: "What You'll Explore" },
  { id: 'cp-fees', label: 'Fees' },
  { id: 'cp-faq', label: 'FAQ' },
  { id: 'cp-register', label: 'Register' },
];

export default function DetailsTabs() {
  const [active, setActive] = useState('cp-overview');
  const ref = useRef();

  useEffect(() => {
    const observers = TABS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -50% 0px' }
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach(io => io?.disconnect());
  }, []);

  return (
    <nav className="cp-tabs" ref={ref} aria-label="Page sections">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          className={`cp-tab ${active === id ? 'active' : ''}`}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
