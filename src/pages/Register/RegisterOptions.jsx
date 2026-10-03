import React, { useState } from 'react';
import Modal from './Modal';
import ManitForm from './ManitForm';
import OutsideForm from './OutsideForm';
import { CYBERPULSE } from '../../cyberpulse.config';

export default function RegisterOptions() {
  const [open, setOpen] = useState(null); // null | 'manit' | 'outside'
  const close = () => setOpen(null);

  return (
    <>
      <section id="cp-register" className="cp-options-section">
        <p className="cp-options-eye"><u>//</u> 01 — REGISTER</p>
        <h2 className="cp-options-title">Secure Your Spot.</h2>
        <p className="cp-options-sub">Choose your participant type to get started.</p>

        <div className="cp-option-cards">
          {/* MANIT */}
          <div className="cp-option-card">
            <div className="cp-card-top">
              <span className="cp-badge-free">FREE</span>
              <h3>MANIT Student</h3>
              <p>MANIT Bhopal students attend for <b style={{color:'#fff'}}>absolutely free</b>. No payment, no hassle.</p>
            </div>
            <div className="cp-card-bottom">
              <div className="cp-card-price">₹0 <small>for MANIT students</small></div>
              <button className="btn red cp-card-btn" onClick={() => setOpen('manit')}>
                REGISTER FOR FREE →
              </button>
            </div>
          </div>

          {/* Outside */}
          <div className="cp-option-card cp-card-paid">
            <div className="cp-card-top">
              <span className="cp-badge-paid">PAID</span>
              <h3>Outside MANIT</h3>
              <p>Register as an individual or bring a team of 3 for a discounted combo rate.</p>
              <div className="cp-price-row">
                <div className="cp-price-pill">Solo<span>₹{CYBERPULSE.fees.solo}</span></div>
                <div className="cp-price-divider">/</div>
                <div className="cp-price-pill">Combo (3)<span>₹{CYBERPULSE.fees.combo}</span></div>
              </div>
            </div>
            <div className="cp-card-bottom">
              <button className="btn cp-card-btn" onClick={() => setOpen('outside')}>
                REGISTER AS PARTICIPANT →
              </button>
            </div>
          </div>
        </div>

        {/* Quick info strip */}
        <div className="cp-info-strip">
          <span>📅 {CYBERPULSE.dateLabel}</span>
          <span>🕙 {CYBERPULSE.timeLabel}</span>
          <span>📍 {CYBERPULSE.venue}</span>
          <span>🎓 Beginners welcome</span>
        </div>
      </section>

      {open === 'manit' && (
        <Modal title="MANIT Student Registration" file="manit_register.sh" onClose={close}>
          <div className="cp-modal-heading">
            <h2>MANIT Student</h2>
            <span className="cp-badge-free" style={{fontSize:'.9rem',padding:'.3rem 1rem'}}>FREE</span>
          </div>
          <ManitForm onClose={close} />
        </Modal>
      )}

      {open === 'outside' && (
        <Modal title="Outside MANIT Registration" file="outside_register.sh" wide onClose={close}>
          <div className="cp-modal-heading">
            <h2>Outside MANIT</h2>
          </div>
          <OutsideForm onClose={close} />
        </Modal>
      )}
    </>
  );
}
