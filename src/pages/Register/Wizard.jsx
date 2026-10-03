import React from 'react';
import { useRegistration } from './useRegistration';
import ParticipantStep from './steps/ParticipantStep';
import DetailsStep from './steps/DetailsStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import SuccessCard from './SuccessCard';

export default function Wizard() {
  const { state, setField, nextStep, prevStep, submit, isSubmitting } = useRegistration();

  if (state.status === 'success') {
    return <SuccessCard regId={state.regId} />;
  }

  return (
    <div className="cp-wizard win">
      <div className="win-head"><span className="mono dim">register.exe</span><span className="mono">STEP 0{state.step}</span></div>
      <div className="win-body">
        
        <div className="cp-stepper">
          <div className="cp-stepper-track">
             <div className="cp-stepper-fill" style={{ width: `${(state.step / (state.isManit ? 3 : 4)) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={e => e.preventDefault()} noValidate className="cp-step-content">
          {state.step === 1 && <ParticipantStep state={state} setField={setField} next={nextStep} />}
          {state.step === 2 && <DetailsStep state={state} setField={setField} next={nextStep} prev={prevStep} />}
          {state.step === 3 && !state.isManit && <PaymentStep state={state} setField={setField} next={nextStep} prev={prevStep} />}
          {(state.step === (state.isManit ? 3 : 4)) && <ReviewStep state={state} submit={submit} prev={prevStep} isSubmitting={isSubmitting} />}
        </form>

      </div>
    </div>
  );
}
