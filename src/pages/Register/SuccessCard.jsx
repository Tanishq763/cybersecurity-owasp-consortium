import React from 'react';
import { CYBERPULSE } from '../../cyberpulse.config';

function generateIcs({ name, email }) {
  const dt = CYBERPULSE.date.replace(/[-:]/g, '').replace('T', 'T').slice(0, 15) + '00Z';
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//OWASP MANIT//CYBERPULSE//EN',
    'BEGIN:VEVENT',
    `DTSTART:${dt}`,
    `SUMMARY:${CYBERPULSE.name} – ${CYBERPULSE.tagline}`,
    `DESCRIPTION:${CYBERPULSE.organiser}`,
    `LOCATION:${CYBERPULSE.venue}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  return URL.createObjectURL(blob);
}

export default function SuccessCard({ regId, name, email, isManit, plan, onClose }) {
  const icsUrl = generateIcs({ name, email });

  return (
    <div className="cp-success">
      <div className="cp-success-icon" aria-hidden="true">✓</div>
      <h3>REGISTRATION CONFIRMED</h3>
      <p style={{ color: '#999', marginBottom: '.5rem' }}>Your registration ID:</p>
      <div className="cp-success-id">{regId}</div>

      <div className="cp-success-summary">
        <p><b>Name:</b> {name}</p>
        <p><b>Email:</b> {email}</p>
        <p><b>Event:</b> {CYBERPULSE.name} — {CYBERPULSE.dateLabel}</p>
        <p><b>Type:</b> {isManit ? 'MANIT Student (Free)' : `External — ${plan === 'combo' ? `Combo (₹${CYBERPULSE.fees.combo})` : `Solo (₹${CYBERPULSE.fees.solo})`}`}</p>
        {!isManit && (
          <p style={{ color: '#4dff91', marginTop: '.5rem' }}>
            ✓ Payment verification will be done within 24 hours. You'll receive a confirmation on your email.
          </p>
        )}
        {isManit && (
          <p style={{ color: '#4dff91', marginTop: '.5rem' }}>✓ No payment required — FREE for MANIT students.</p>
        )}
      </div>

      <div className="cp-success-actions">
        <a href={icsUrl} download={`${regId}.ics`} className="btn">ADD TO CALENDAR</a>
        {CYBERPULSE.links.whatsapp && (
          <a href={CYBERPULSE.links.whatsapp} target="_blank" rel="noreferrer" className="btn red">JOIN WHATSAPP ↗</a>
        )}
        <button className="btn" onClick={onClose}>CLOSE</button>
      </div>
    </div>
  );
}
