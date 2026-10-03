import React from 'react';
import { CYBERPULSE } from '../../cyberpulse.config';
import { CpWin } from './CpWin';

export default function FeesTable() {
  return (
    <CpWin file="pricing.json" status="● ACTIVE">
      <p className="cp-eye"><u>//</u>03 — FEES</p>
      <h2 className="cp-panel-title">Registration Fees</h2>
      <table className="cp-fees-table" aria-label="Registration fee structure">
        <tbody>
          <tr className="cp-free-row">
            <td>MANIT Student</td>
            <td><span className="cp-badge-free">FREE</span></td>
          </tr>
          <tr>
            <td>Outside MANIT — Solo</td>
            <td>₹{CYBERPULSE.fees.solo}</td>
          </tr>
          <tr>
            <td>Outside MANIT — Combo (3 members)</td>
            <td>₹{CYBERPULSE.fees.combo}</td>
          </tr>
        </tbody>
      </table>
      <p className="cp-fees-note">
        External participants pay via UPI. Scan the QR code in the registration form,
        upload your payment screenshot and we'll verify it within 24 hours.
      </p>
    </CpWin>
  );
}
