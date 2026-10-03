import React, { useState } from 'react';
import Hero from './Hero';
import RegisterOptions from './RegisterOptions';
import Faq from './Faq';
import './register.css';

export default function Register() {
  const scrollToReg = () =>
    document.getElementById('cp-register')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="cp-page">
      <Hero onRegister={scrollToReg} />
      <RegisterOptions />
      <Faq />
    </main>
  );
}
