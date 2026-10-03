import React, { useRef } from 'react';
import { config } from '../../../cyberpulse.config';

export default function DetailsStep({ state, setField, next, prev }) {
  const formRef = useRef();

  const handleNext = () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    next();
  }

  const handleChange = (e) => setField(e.target.name, e.target.value);

  return (
    <div className="cp-step" ref={formRef}>
      <h2>2. Your Details</h2>
      <div className="cp-form-grid">
        <label>Full Name <input required name="name" value={state.name||''} onChange={handleChange} /></label>
        <label>Email <input required type="email" name="email" value={state.email||''} onChange={handleChange} /></label>
        <label>Phone <input required type="tel" name="phone" value={state.phone||''} onChange={handleChange} /></label>
        {state.isManit ? (
          <label>Scholar Number <input required pattern={config.registration.scholarPattern} name="scholarNo" value={state.scholarNo||''} onChange={handleChange} /></label>
        ) : (
          <label>College <input required name="college" value={state.college||''} onChange={handleChange} /></label>
        )}
        <label>Year <select required name="year" value={state.year||''} onChange={handleChange}><option value="">Select</option>{config.registration.yearOptions.map(y=><option key={y} value={y}>{y}</option>)}</select></label>
        <label>Branch <select required name="branch" value={state.branch||''} onChange={handleChange}><option value="">Select</option>{config.registration.branchOptions.map(y=><option key={y} value={y}>{y}</option>)}</select></label>
      </div>

      {state.isCombo && (
        <div className="cp-team-details">
          <h3>Team Members</h3>
          {[2,3].map(n => (
            <div key={n} className="cp-member-row">
              <label>Member {n} Name <input required name={`m${n}name`} value={state[`m${n}name`]||''} onChange={handleChange} /></label>
              <label>Member {n} Email <input required type="email" name={`m${n}email`} value={state[`m${n}email`]||''} onChange={handleChange} /></label>
              <label>Member {n} Phone <input required type="tel" name={`m${n}phone`} value={state[`m${n}phone`]||''} onChange={handleChange} /></label>
            </div>
          ))}
        </div>
      )}

      <div className="cp-step-btns">
        <button className="btn ghost" onClick={prev}>← BACK</button>
        <button className="btn" onClick={handleNext}>NEXT →</button>
      </div>
    </div>
  );
}
