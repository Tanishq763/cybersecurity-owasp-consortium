import React, { useRef } from 'react';
import { config } from '../../cyberpulse.config';

export default function PaymentStep({ state, setField, next, prev }) {
  const formRef = useRef();

  const handleNext = () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    next();
  }

  const handleFile = (e) => {
    if(e.target.files[0]) {
       // In real app, compress here.
       setField('paymentScreenshot', e.target.files[0].name);
    }
  }

  return (
    <div className="cp-step" ref={formRef}>
      <h2>3. Payment</h2>
      <div className="cp-payment-card">
        <img src={config.payment.qrImage} alt="QR" className="cp-qr" />
        <div>
           <p>AMOUNT DUE</p>
           <h3>₹{state.isCombo ? config.fees.combo : config.fees.solo}</h3>
           <p>UPI ID: <b>{config.payment.upiId}</b></p>
           <label>Upload Screenshot <b>*</b> <input type="file" required accept="image/*" onChange={handleFile} /></label>
           <label>UTR / Ref Number (Optional) <input type="text" name="utr" value={state.utr||''} onChange={e=>setField('utr', e.target.value)} /></label>
        </div>
      </div>
      <p className="mt-2 text-mute"><small>Payment verified manually within {config.payment.verificationTime}.</small></p>
      
      <div className="cp-step-btns">
        <button className="btn ghost" onClick={prev}>← BACK</button>
        <button className="btn" onClick={handleNext}>NEXT →</button>
      </div>
    </div>
  );
}
