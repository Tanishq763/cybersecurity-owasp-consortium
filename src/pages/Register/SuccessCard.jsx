import React, { useMemo, useEffect, useRef } from 'react';
import { CYBERPULSE } from '../../cyberpulse.config';

function generateIcsContent() {
  // Convert local IST date to UTC for ICS (IST = UTC+5:30)
  const local = new Date(CYBERPULSE.date);
  const utcStr = local.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  // DTEND = 6 hours after start
  const end = new Date(local.getTime() + 6 * 60 * 60 * 1000);
  const endStr = end.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const uid = `cyberpulse-2026-${Date.now()}@owasp-manit.in`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OWASP MANIT//CYBERPULSE//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${utcStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${CYBERPULSE.name} \u2013 ${CYBERPULSE.tagline}`,
    `DESCRIPTION:${CYBERPULSE.organiser}\\nRegistration: https://owasp-manit.in/register`,
    `LOCATION:${CYBERPULSE.venue}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export default function SuccessCard({ regId, name, email, isManit, plan, onClose }) {
  // Create blob URL once and revoke on unmount — prevents memory leak on every re-render
  const icsUrl = useMemo(() => {
    const blob = new Blob([generateIcsContent()], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  }, []);

  useEffect(() => {
    return () => URL.revokeObjectURL(icsUrl);
  }, [icsUrl]);

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
          <a href={CYBERPULSE.links.whatsapp} target="_blank" rel="noreferrer" className="btn green">JOIN WHATSAPP ↗</a>
        )}
        <button className="btn" onClick={onClose}>CLOSE</button>
      </div>
    </div>
  );
}
