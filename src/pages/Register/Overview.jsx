import React from 'react';
import { CYBERPULSE } from '../../cyberpulse.config';
import { CpWin } from './CpWin';

export default function Overview() {
  return (
    <CpWin file="overview.md" status="● RUNNING">
      <p className="cp-eye"><u>//</u>01 — OVERVIEW</p>
      <h2 className="cp-panel-title">About the Workshop</h2>
      <p style={{ color: '#ccc', marginBottom: '1.5rem', lineHeight: 1.7 }}>
        {CYBERPULSE.eligibility}
      </p>

      <h3 style={{ font: '700 .8rem var(--mono)', color: '#999', letterSpacing: '.1em', marginBottom: '.75rem' }}>WHAT YOU'LL LEARN</h3>
      <div className="cp-learn-cards">
        {CYBERPULSE.learnings.map((item, i) => (
          <div key={i} className="cp-learn-card">{item}</div>
        ))}
      </div>

      <h3 style={{ font: '700 .8rem var(--mono)', color: '#999', letterSpacing: '.1em', margin: '1.5rem 0 .75rem' }}>WHAT TO BRING</h3>
      <ul className="cp-reqs">
        {CYBERPULSE.requirements.map((r, i) => <li key={i}>{r}</li>)}
      </ul>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <p style={{ font: '600 .75rem var(--mono)', color: '#777', letterSpacing: '.08em', marginBottom: '.2rem' }}>REPORTING TIME</p>
          <p style={{ color: '#fff', fontWeight: 700 }}>{CYBERPULSE.reportingTime}</p>
        </div>
        <div>
          <p style={{ font: '600 .75rem var(--mono)', color: '#777', letterSpacing: '.08em', marginBottom: '.2rem' }}>VENUE</p>
          <p style={{ color: '#fff', fontWeight: 700 }}>{CYBERPULSE.venue}</p>
        </div>
        <a href={CYBERPULSE.mapsLink} target="_blank" rel="noreferrer" className="btn" style={{ padding: '.5rem 1rem', fontSize: '.75rem' }}>
          OPEN IN MAPS ↗
        </a>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,.08)' }}>
        <p style={{ font: '600 .75rem var(--mono)', color: '#777', marginBottom: '.3rem' }}>CONTACT</p>
        <p style={{ color: '#ccc' }}>{CYBERPULSE.contact.name}</p>
        <p style={{ color: '#999', fontSize: '.88rem' }}>{CYBERPULSE.contact.email}</p>
        {CYBERPULSE.contact.phone !== 'TBA' && <p style={{ color: '#999', fontSize: '.88rem' }}>{CYBERPULSE.contact.phone}</p>}
      </div>
    </CpWin>
  );
}
