import React from 'react';
export default function ReviewStep({ state, submit, prev, isSubmitting }) {
  return (
    <div className="cp-step">
      <h2>{state.isManit ? '3' : '4'}. Review & Submit</h2>
      <div className="cp-summary">
         <p><b>Name:</b> {state.name}</p>
         <p><b>Email:</b> {state.email}</p>
         <p><b>Type:</b> {state.isManit ? 'MANIT' : (state.isCombo ? 'External Combo' : 'External Solo')}</p>
      </div>
      <label className="cp-consent">
        <input type="checkbox" required onChange={e=>state.consent = e.target.checked} />
        <span>I agree to be contacted about this event.</span>
      </label>
      <div className="cp-step-btns">
        <button className="btn ghost" onClick={prev} disabled={isSubmitting}>← BACK</button>
        <button className="btn" onClick={()=>submit()} disabled={isSubmitting}>{isSubmitting ? 'PROCESSING...' : 'SUBMIT REGISTRATION'}</button>
      </div>
    </div>
  );
}
