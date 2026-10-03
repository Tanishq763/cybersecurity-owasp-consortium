import React from 'react';
export default function ParticipantStep({ state, setField, next }) {
  return (
    <div className="cp-step">
      <h2>1. Participant Type</h2>
      <div className="cp-toggle-group">
         <button className={state.isManit ? 'active' : ''} onClick={() => { setField('isManit', true); setField('isCombo', false); }}>MANIT Student</button>
         <button className={!state.isManit ? 'active' : ''} onClick={() => setField('isManit', false)}>Outside MANIT</button>
      </div>
      {!state.isManit && (
        <div className="cp-toggle-group mt-2">
          <button className={!state.isCombo ? 'active' : ''} onClick={() => setField('isCombo', false)}>SOLO (₹249)</button>
          <button className={state.isCombo ? 'active' : ''} onClick={() => setField('isCombo', true)}>COMBO (₹649)</button>
        </div>
      )}
      {state.isManit && <div className="cp-free-badge">FREE FOR MANIT STUDENTS</div>}
      <button className="btn mt-4 w-100" onClick={next}>NEXT →</button>
    </div>
  );
}
