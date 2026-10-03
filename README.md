# Cybersecurity OWASP Consortium — MANIT Bhopal

<div align="center">
  <img src="public/logo.png" alt="OWASP MANIT Logo" height="80" />
  <br/>
  <strong>Official website of the Cybersecurity OWASP Consortium chapter at MANIT Bhopal.</strong>
  <br/><br/>

  ![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)
  ![License](https://img.shields.io/badge/License-MIT-red?style=flat-square)
</div>

---

## ✦ Overview

A hacker-themed single-page application showcasing the consortium's events, team, gallery, sponsors, and the **CYBERPULSE** workshop registration system. Built with a pure black/white/red terminal aesthetic — no bloat, no external CSS frameworks.

Live: **[owaspmanit.in](https://owaspmanit.in)** (HashRouter, so all routes use `#/...`)

---

## 🗂 Pages

| Route | Description |
|-------|-------------|
| `#/` | Home — hero, stats, programs, mission |
| `#/about` | About — journey timeline, collaborators |
| `#/events` | Upcoming & past events |
| `#/gallery` | Photo gallery grid |
| `#/sponsors` | Sponsors by tier |
| `#/team` | Full team with photos & social links |
| `#/contact` | Contact form |
| `#/register` | **CYBERPULSE** workshop registration |

---

## 🛠 Tech Stack

| Layer | Tool |
|-------|------|
| UI Framework | React 19 + JSX |
| Build | Vite 8 |
| Routing | React Router v7 (HashRouter) |
| Styling | Vanilla CSS (design tokens in `styles.css`) |
| Animation | CSS keyframes + IntersectionObserver |
| 3D Background | Canvas 2D (custom particle/network) |
| Fonts | Outfit (headings), JetBrains Mono (labels), Inter (body) |

---

## 📂 Project Structure

```
cybersecurity-owasp-consortium/
├── public/
│   ├── logo.png            # Site logo
│   ├── team/               # Team member photos (copied from src/assets/team/)
│   └── fonts/, icons/
├── src/
│   ├── App.jsx             # All pages + shared components (single-file SPA)
│   ├── data.js             # ← ALL content lives here (team, events, sponsors…)
│   ├── cyberpulse.config.js # ← CYBERPULSE event config (fees, UPI, FAQ…)
│   ├── styles.css          # Global design tokens + shared component styles
│   ├── main.jsx            # React entry point
│   ├── pages/
│   │   └── Register/       # CYBERPULSE registration page
│   │       ├── index.jsx
│   │       ├── Hero.jsx
│   │       ├── RegisterOptions.jsx
│   │       ├── ManitForm.jsx
│   │       ├── OutsideForm.jsx
│   │       ├── PaymentBlock.jsx
│   │       ├── SuccessCard.jsx
│   │       ├── Modal.jsx
│   │       ├── Faq.jsx
│   │       └── register.css
│   ├── components/
│   │   └── Slider.jsx      # Scroll-snap carousel
│   └── assets/
│       └── team/           # Source team photos (use New_images/ for latest)
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚡ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (hot-reload)
npm run dev
# → http://localhost:5173

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## ✏️ How to Update Content

Everything is in **two files** — no hunting through components.

### Site content (`src/data.js`)
```js
// Update team members:
export const team = {
  'Faculty Advisors': [
    { name: 'Dr. Name', role: 'Faculty Advisor', img: 'Name.jpg', linkedin: 'https://...', github: '#' },
  ],
  ...
}

// Update social links:
export const SOCIALS = [
  ['instagram', 'https://instagram.com/owasp.manit'],
  ...
]
```

### CYBERPULSE workshop (`src/cyberpulse.config.js`)
```js
export const CYBERPULSE = {
  venue: 'CSE Seminar Hall, MANIT Bhopal', // fill in
  payment: {
    upiId: 'yourname@upi',                 // fill in
    qrImage: '/qr code.jpeg',
  },
  registration: {
    endpoint: 'https://your-formspree-url', // fill in
  },
  links: {
    whatsapp: 'https://chat.whatsapp.com/...', // fill in
  },
}
```

### Adding team photos
1. Put the photo in `public/team/YourName.jpg`
2. Set `img: 'YourName.jpg'` in `src/data.js`

---

## 🚀 Deployment

### Vercel (recommended)
1. Push to GitHub
2. Import repo into [Vercel](https://vercel.com)
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy — done ✓

### GitHub Pages
```bash
npm run build
# then push dist/ to gh-pages branch
```

> **Note:** This is a HashRouter SPA — all routes use `#/` so no server-side rewrite config is needed.

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © Cybersecurity OWASP Consortium, MANIT Bhopal
