import React, { useEffect, useRef } from 'react';
import { CYBERPULSE } from '../../cyberpulse.config';
import { CpWin } from './CpWin';

export default function Agenda() {
  const itemsRef = useRef([]);

  useEffect(() => {
    let delay = 0;
    const observers = itemsRef.current.map((el) => {
      if (!el) return null;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('lit'), delay);
            delay += 120;
            io.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach(io => io?.disconnect());
  }, []);

  return (
    <CpWin file="schedule.log" status="● RUNNING">
      <p className="cp-eye"><u>//</u>02 — WHAT YOU'LL EXPLORE</p>
      <h2 className="cp-panel-title">Agenda</h2>
      <div className="cp-agenda">
        <div className="cp-agenda-line" aria-hidden="true" />
        {CYBERPULSE.agenda.map((item, i) => (
          <div
            key={i}
            className="cp-agenda-item"
            ref={el => itemsRef.current[i] = el}
          >
            <div className="cp-agenda-dot" aria-hidden="true" />
            <div>
              <p className="cp-agenda-time">{item.time}</p>
              <p className="cp-agenda-title">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </CpWin>
  );
}
