import React from 'react';
import { CYBERPULSE } from '../../cyberpulse.config';

// Only show 5 most important FAQs
const SHORT_FAQS = CYBERPULSE.faqs.slice(0, 5);

export default function Faq() {
  return (
    <section className="cp-faq-section">
      <p className="cp-options-eye"><u>//</u> 02 — FAQ</p>
      <h2 className="cp-options-title" style={{fontSize:'clamp(1.4rem,4vw,2rem)'}}>Quick Answers</h2>
      <div className="cp-faq">
        {SHORT_FAQS.map((item, i) => (
          <details key={i}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      <p className="cp-faq-contact">
        More questions? Email us at <a href={`mailto:${CYBERPULSE.contact.email}`}>{CYBERPULSE.contact.email}</a>
      </p>
    </section>
  );
}
