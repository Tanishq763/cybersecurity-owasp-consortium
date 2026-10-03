import React, { useState, useEffect } from 'react';
import { CYBERPULSE } from '../../cyberpulse.config';

function pad2(n) { return String(Math.floor(n)).padStart(2, '0'); }

export default function Hero({ onRegister }) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    if (!CYBERPULSE.date) return;
    const target = new Date(CYBERPULSE.date).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setCd(p => ({ ...p, expired: true })); return; }
      setCd({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3),
        expired: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="cp-hero">
      <div className="cp-hero-inner">
        <p className="cp-hero-kicker">CYBERSECURITY OWASP CONSORTIUM × MANIT BHOPAL</p>
        <h1 className="cp-logotype">CYBER<span>PULSE</span></h1>
        <p className="cp-hero-tagline">{CYBERPULSE.tagline}</p>

        <div className="cp-chips">
          <span className="cp-chip">📅 {CYBERPULSE.dateLabel}</span>
          <span className="cp-chip">🕙 {CYBERPULSE.timeLabel}</span>
          <span className="cp-chip cp-chip-free">🎓 FREE for MANIT Students</span>
        </div>

        {!cd.expired && (
          <div className="cp-countdown" aria-label="Countdown">
            {[['DAYS', cd.d], ['HRS', cd.h], ['MIN', cd.m], ['SEC', cd.s]].map(([lbl, val], i) => (
              <React.Fragment key={lbl}>
                {i > 0 && <span className="cp-cd-sep">:</span>}
                <div className="cp-cd-unit">
                  <span className="cp-cd-num">{pad2(val)}</span>
                  <span className="cp-cd-label">{lbl}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        <button className="btn red cp-hero-cta" onClick={onRegister}>
          REGISTER NOW →
        </button>
      </div>
    </header>
  );
}
