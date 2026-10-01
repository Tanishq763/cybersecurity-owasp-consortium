import paymentQr from '../assets/qr code.jpeg';

const yearOptions = `<option value="" selected disabled>Select year</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option><option value="other">Other</option>`;
const branchOptions = `<option value="" selected disabled>Select branch / course</option><option value="cse">CSE</option><option value="ece">ECE</option><option value="ee">EE</option><option value="me">ME</option><option value="ce">CE</option><option value="other">Other</option>`;
const topics = ['Ethical Hacking Basics', 'Web Security & Common Attacks', 'Bug Bounty Fundamentals', 'Vulnerability Hunting', 'AI in Cybersecurity', 'Real-World Hacking Demos'];
const paymentImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const maxPaymentImageSize = 8 * 1024 * 1024;

function field(label, name, type = 'text', placeholder = '', extra = '') { return `<label class="registration-field"><span>${label}<b>*</b></span><input name="${name}" type="${type}" placeholder="${placeholder}" required ${extra}></label>`; }
function selectField(label, name, options) { return `<label class="registration-field"><span>${label}<b>*</b></span><select name="${name}" required>${options}</select></label>`; }
function formSection(number, title, fields) { return `<section class="form-section"><header><span>${number}</span><h3>${title}</h3></header><div class="registration-fields">${fields}</div></section>`; }
function paymentFields(amount) { return `<section class="form-section payment-section"><header><span>03</span><h3>Payment</h3></header><div class="payment-panel"><img class="payment-qr" src="${paymentQr}" alt="UPI payment QR code"><div class="payment-amount"><span>AMOUNT TO PAY</span><strong>₹${amount}</strong><p>Scan the QR code to complete your payment.</p></div></div><label class="registration-field"><span>Payment screenshot<b>*</b></span><input name="paymentImage" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" required></label><p class="payment-upload-status" role="status"></p><input type="hidden" name="paymentImageUrl" value=""></section>`; }

function manitFields() { return `${formSection('01', 'Personal details', `${field('Full name', 'name', 'text', 'Enter your full name')}${field('MANIT email ID', 'email', 'email', 'Enter your MANIT email ID')}${field('Phone number', 'phone', 'tel', '+91 98765 43210', 'inputmode="tel"')}`)}${formSection('02', 'Academic details', `${selectField('Year', 'year', yearOptions)}${selectField('Branch', 'branch', branchOptions)}${field('Scholar number', 'scholarNo', 'text', 'Enter your scholar number')}`)}`; }
function outsideFields() { return `${formSection('01', 'Personal details', `${field('Full name', 'name', 'text', 'Enter your full name')}${field('Email ID', 'email', 'email', 'Enter your email ID')}${field('Phone number', 'phone', 'tel', '+91 98765 43210', 'inputmode="tel"')}`)}${formSection('02', 'Academic details', `${field('College / university', 'collegeName', 'text', 'Enter your college name')}${selectField('Year', 'year', yearOptions)}${selectField('Branch / course', 'branch', branchOptions)}`)}${paymentFields(249)}`; }
function member(number, leader = false) { const key = `member${number}`; return `<details class="team-member" ${leader ? 'open' : ''}><summary><span class="team-member__number">0${number}</span><span>${leader ? 'Team leader' : `Member 0${number}`}</span><small>${leader ? '✓' : '+'}</small></summary><div class="team-member__body">${field('Full name', `${key}Name`, 'text', 'Enter full name')}${field('Email ID', `${key}Email`, 'email', 'Enter email ID')}${field('Phone number', `${key}Phone`, 'tel', '+91 98765 43210', 'inputmode="tel"')}${leader ? `${field('College / university', `${key}College`, 'text', 'Enter college name')}${selectField('Year', `${key}Year`, yearOptions)}${selectField('Branch / course', `${key}Branch`, branchOptions)}` : ''}</div></details>`; }
function comboFields() { return `${formSection('01', 'Team details', `${field('Combo / team name', 'teamName', 'text', 'Enter your team name')}`)}<section class="form-section form-section--team"><header><span>02</span><h3>Team members</h3></header><p>Expand a participant to add their details.</p>${member(1, true)}${member(2)}${member(3)}</section>${paymentFields(649)}`; }

async function compressPaymentImage(file) {
  if (file.size <= 768 * 1024 || typeof createImageBitmap !== 'function') return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const maxDimension = 2000;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const compressed = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.86));
    if (!compressed || compressed.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, '') || 'payment-screenshot';
    return new File([compressed], `${name}.jpg`, { type: 'image/jpeg', lastModified: file.lastModified });
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}

async function uploadPaymentImage(file) {
  const image = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Could not read the payment screenshot.'));
    reader.readAsDataURL(file);
  });
  const response = await fetch('/api/payment-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, mimeType: file.type }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Could not upload the payment screenshot.');
  return result.url;
}

async function submitRegistration(payload) {
  const response = await fetch('/api/registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.error || 'Could not save the registration.');
}

export function renderRegistrationPage() { return `<section class="cyberpulse-page" data-registration-view="manit"><div class="cyberpulse-grid" aria-hidden="true"></div><div class="cyberpulse-layout">
  <aside class="event-panel"><div class="event-panel__inner"><div class="event-brand"><span class="event-brand__mark">◌</span><span>OWASP MANIT</span></div><p class="event-kicker">SECURE • LEARN • BUILD</p><div class="event-pulse" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><h1>CYBER<span>PULSE</span></h1><p class="event-type">Ethical Hacking &<br>Web Security Workshop</p><div class="event-hook"><p>Ever wondered how websites actually get hacked?</p><strong>Now’s your chance to find out!</strong></div><div class="event-facts"><div><small>DATE</small><b>10 OCTOBER</b></div><div><small>TIME</small><b>10 AM — 4 PM</b></div></div><section class="event-topics"><h2>WHAT YOU’LL EXPLORE</h2>${topics.map((topic, index) => `<div class="event-topic"><span>0${index + 1}</span><p>${topic}</p><b>→</b></div>`).join('')}</section><p class="event-footer">OWASP MANIT / CYBERPULSE 2026</p></div></aside>
  <main class="registration-column"><header class="registration-heading"><p>EVENT REGISTRATION</p><h2>CYBERPULSE</h2><span>Ethical Hacking & Web Security Workshop</span><strong>Choose your participant type to continue.</strong></header><form id="registration-form" novalidate><section class="participant-section"><p class="control-label">I AM FROM</p><div class="participant-options" role="tablist" aria-label="Participant type"><button type="button" class="participant-option is-active" data-registration-type="manit" role="tab" aria-selected="true"><span class="participant-option__dot"></span><b>MANIT</b><small>MANIT Student</small></button><button type="button" class="participant-option" data-registration-type="outside" role="tab" aria-selected="false"><span class="participant-option__dot"></span><b>OUTSIDE MANIT</b><small>External Participant</small></button></div></section><section id="outside-options" class="plan-section" hidden><p class="control-label">PARTICIPATION TYPE</p><div class="plan-options" role="tablist" aria-label="Participation type"><button type="button" class="plan-option is-active" data-registration-plan="solo" role="tab" aria-selected="true"><b>SOLO</b><span>Individual participant</span><strong>₹249</strong></button><button type="button" class="plan-option" data-registration-plan="combo" role="tab" aria-selected="false"><b>COMBO</b><span>Team registration</span><strong>₹649</strong></button></div></section><div id="registration-fields" class="registration-fields-wrap">${manitFields()}</div><p id="registration-status" class="registration-status" role="status"></p><button class="registration-submit" type="submit">Register for CYBERPULSE <span aria-hidden="true">→</span></button></form></main>
</div></section>`; }

export function initRegistrationPage() {
  const form = document.getElementById('registration-form');
  if (!form) return;
  const page = document.querySelector('.cyberpulse-page');
  const fields = document.getElementById('registration-fields');
  const options = document.getElementById('outside-options');
  let type = 'manit';
  let plan = 'solo';

  const renderFields = () => {
    fields.innerHTML = type === 'manit' ? manitFields() : plan === 'combo' ? comboFields() : outsideFields();
    fields.classList.remove('is-changing');
    requestAnimationFrame(() => fields.classList.add('is-changing'));
  };

  document.querySelectorAll('[data-registration-type]').forEach(button => button.addEventListener('click', () => {
    type = button.dataset.registrationType;
    const fromManit = type === 'manit';
    page.dataset.registrationView = type;
    options.hidden = fromManit;
    document.querySelectorAll('[data-registration-type]').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    renderFields();
  }));

  document.querySelectorAll('[data-registration-plan]').forEach(button => button.addEventListener('click', () => {
    plan = button.dataset.registrationPlan;
    document.querySelectorAll('[data-registration-plan]').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    renderFields();
  }));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const paymentInput = form.querySelector('[name="paymentImage"]');
    const imageFile = paymentInput?.files?.[0];
    if (paymentInput) {
      paymentInput.setCustomValidity('');
      if (imageFile && !paymentImageTypes.includes(imageFile.type)) {
        paymentInput.setCustomValidity('Choose a JPEG, PNG, WebP, GIF, or AVIF image.');
      } else if (imageFile && imageFile.size > maxPaymentImageSize) {
        paymentInput.setCustomValidity('Choose an image smaller than 8 MB.');
      }
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = form.querySelector('.registration-submit');
    const imageUrlInput = form.elements.paymentImageUrl;
    submitButton.disabled = true;
    const submission = (async () => {
      if (imageFile && !imageUrlInput.value) {
        imageUrlInput.value = await uploadPaymentImage(await compressPaymentImage(imageFile));
      }

      const fields = Object.fromEntries(new FormData(form).entries());
      delete fields.paymentImage;
      delete fields.paymentImageUrl;
      await submitRegistration({
        participantType: type,
        plan: type === 'outside' ? plan : '',
        fields,
        paymentImageUrl: imageUrlInput?.value || '',
      });
    })();
    window.alert('Registration received. Final confirmation will follow.');
    try {
      await submission;
      form.reset();
      window.alert('Registration successful!');
    } catch (error) {
      window.alert(`Registration failed: ${error.message}`);
    } finally {
      submitButton.disabled = false;
    }
  });
}
