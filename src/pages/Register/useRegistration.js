import { useState } from 'react';
export function useRegistration() {
  const [state, setState] = useState({ step: 1, isManit: true, isCombo: false, status: 'idle' });
  const setField = (k, v) => setState(s => ({...s, [k]: v}));
  const nextStep = () => setState(s => ({...s, step: s.step + 1}));
  const prevStep = () => setState(s => ({...s, step: s.step - 1}));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!state.consent) return alert('Please agree to the terms.');
    setIsSubmitting(true);
    setTimeout(() => {
       setIsSubmitting(false);
       setField('status', 'success');
       setField('regId', 'CP-2026-' + Math.floor(Math.random()*100000));
    }, 1500);
  };
  return { state, setField, nextStep, prevStep, submit, isSubmitting };
}
