// ============================================================
// DATA.JS — Single source of truth for all site content.
// Update this file to change anything on the site.
// ============================================================

export const EMAIL = 'owasp@manit.ac.in'
export const FORM_ENDPOINT = ''        // Formspree / Web3Forms POST URL
export const REG_URL = '/register'    // Registration page route

export const SOCIALS = [
  ['instagram', 'https://www.instagram.com/owasp.manit/'],
  ['linkedin',  'https://www.linkedin.com/company/owasp-manit-bhopal/'],
  ['github',    'https://github.com/OWASP-MANIT'],
  ['youtube',   '#'],
]

// ── Upcoming Events ───────────────────────────────────────────
export const events = [
  { title: 'CYBERPULSE', date: '2026-10-10', tag: 'Workshop', place: 'MANIT Bhopal', desc: 'Ethical Hacking & Web Security Workshop. Dive into real-world hacking demos, bug bounty basics, AI in cybersecurity, and more.' },
  { title: 'NetShield Workshop', date: '2026-10-15', tag: 'Workshop', place: 'MANIT Bhopal', desc: 'Practical exposure to ethical hacking, networking, and system defense.' },
  { title: 'Capture The Flag (Internal)', date: '2026-11-08', tag: 'CTF', place: 'MANIT Bhopal', desc: 'Test your skills across web exploitation, crypto, forensics, and reverse engineering.' },
  { title: 'Linux for Security Professionals', date: '2026-11-19', tag: 'Tech Talk', place: 'MANIT Bhopal', desc: 'Hands-on session on Linux fundamentals, bash scripting, and command-line security tools.' },
  { title: 'Secure Coding with OWASP', date: '2026-12-06', tag: 'Hackathon', place: 'MANIT Bhopal', desc: 'Best practices and hands-on coding focused on building secure applications.' },
]

// ── Past Events ───────────────────────────────────────────────
export const past = [
  { title: 'CyberHunter 2.0',  date: '2026-02-28', tag: 'Competition' },
  { title: 'Noobathon',        date: '2025-10-18', tag: 'Hackathon'   },
  { title: 'Cyber Hunter 1.0', date: '2025-09-15', tag: 'Initiative'  },
  { title: 'OWASP CTF',        date: '2025-05-25', tag: 'CTF'         },
]

// ── Stats ─────────────────────────────────────────────────────
export const stats = [
  ['200+', 'Active members'],
  ['15+',  'Events hosted'],
  ['5+',   'CTF competitions'],
  ['3+',   'Open-source projects'],
  ['5+',   'Years of impact'],
]

// ── Programs ──────────────────────────────────────────────────
export const programs = [
  ['shield', 'Penetration Testing',  'Ethical hacking workshops covering web, network, and mobile application security testing.'],
  ['trophy', 'CTF Competitions',     'Capture The Flag events and training across web exploitation, crypto, forensics and reverse engineering.'],
  ['search', 'Security Research',    'Open-source vulnerability research, CVE documentation, and responsible disclosure practice.'],
  ['code',   'Tool Development',     'Building security automation tools, scripts and utilities that solve real-world problems.'],
]

// ── Timeline ──────────────────────────────────────────────────
export const journey = [
  ['2019', 'Founded',      'Cybersecurity OWASP Consortium chapter founded at MANIT Bhopal.'],
  ['2020', 'First CTF',    'First internal CTF competition with 80+ participants.'],
  ['2021', 'Partnership',  'Partnered with GDG Bhopal for security awareness events.'],
  ['2022', 'Open Source',  'Launched open-source security toolkit project.'],
  ['2023', 'Cloud Sec',    'AWS Users Group collaboration: cloud security track.'],
  ['2024', 'Growth',       '200+ members, 15+ events, national CTF winners.'],
]

// ── Collaborators ─────────────────────────────────────────────
export const collabs = [
  ['OB', 'OWASP Bhopal'],
  ['GD', 'GDG Bhopal'],
  ['AW', 'AWS Users Group Bhopal'],
  ['ML', 'ML Bhopal'],
  ['IS', 'ISEA'],
]

// ── Team Data (real members) ──────────────────────────────────
// img paths are relative to /public/team/
export const team = {
  'Faculty Advisors': [
    { name: 'Dr. Deepak Singh Tomar', role: 'Research Dean, Prof. CSE', img: '', linkedin: '#', github: '#' },
    { name: 'Dr. Namita Tiwari',      role: 'Prof. CSE',                img: '', linkedin: '#', github: '#' },
    { name: 'Dr. Mitul K Ahirwal',    role: 'Prof. CSE',                img: '', linkedin: '#', github: '#' },
    { name: 'Dr. Pankaj Kumar',       role: 'Prof. CSE',                img: '', linkedin: '#', github: '#' },
  ],
  'Final Year Leads': [
    { name: 'Pulkit Gangil',          role: 'President',      img: 'Pulkit-Gangil.jpg',     linkedin: '#', github: '#' },
    { name: 'Pradeep Singh Yadav',    role: 'Vice President', img: '',                      linkedin: '#', github: '#' },
    { name: 'Abizer Mhowwala',        role: 'Treasurer',      img: 'Abizer-Mhowwala.jpg',   linkedin: '#', github: '#' },
  ],
  'Core Team': [
    { name: 'Ashish Mishra',          role: 'Coordinator',    img: 'Ashish-Mishra.jpg',     linkedin: '#', github: '#' },
    { name: 'Tanishq Agrawal',        role: 'Co-Coordinator', img: 'Tanishq-Agrawal.jpg',   linkedin: 'https://www.linkedin.com/in/tanishq-agrawal1', github: '#' },
    { name: 'Aaditya Barnwal',        role: 'Finance Head',   img: 'Aaditya-Barnwal.jpg',   linkedin: '#', github: '#' },
    { name: 'Vishal Sharma',          role: 'Core Member',    img: 'Vishal-Sharma.jpg',     linkedin: '#', github: '#' },
    { name: 'Raghav Verma',           role: 'Core Member',    img: 'Raghav-Verma.jpg',      linkedin: '#', github: '#' },
    { name: 'Kavya Chanap',           role: 'Core Member',    img: 'Kavya-Chanap.jpg',      linkedin: '#', github: '#' },
    { name: 'Khushboo Gaud',          role: 'Core Member',    img: 'Khushboo-Gaud.jpg',     linkedin: '#', github: '#' },
    { name: 'Riddhi Jaiswal',         role: 'Core Member',    img: 'Riddhi-Jaiswal.jpg',    linkedin: '#', github: '#' },
    { name: 'Sanjana Kabir',          role: 'Core Member',    img: 'Sanjana-Kabir.jpg',     linkedin: '#', github: '#' },
    { name: 'Shivansh Kumar Sahu',    role: 'Core Member',    img: 'Shivansh-Kumar-Sahu.jpg',linkedin: '#', github: '#' },
    { name: 'Ashu Debnath',           role: 'Core Member',    img: 'Ashu-Debnath.jpg',      linkedin: '#', github: '#' },
    { name: 'Mudit Kalya',            role: 'Core Member',    img: 'Mudir-Kalya.jpg',       linkedin: '#', github: '#' },
    { name: 'Pranjali Tiwari',        role: 'Core Member',    img: 'pranjali-tiwari.jpg.jpg',linkedin: '#', github: '#' },
    { name: 'Prabhat Singh Raj',      role: 'Core Member',    img: 'Prabhat-Singh-Raj.jpg', linkedin: '#', github: '#' },
  ],
}

export const members = [
  { name: 'Member Name', role: 'Member', dept: 'Tech',     photo: '', linkedin: '#', github: '#' },
  { name: 'Member Name', role: 'Member', dept: 'Design',   photo: '', linkedin: '#', github: '#' },
  { name: 'Member Name', role: 'Member', dept: 'Events',   photo: '', linkedin: '#', github: '#' },
  { name: 'Member Name', role: 'Member', dept: 'Outreach', photo: '', linkedin: '#', github: '#' },
]

// ── Sponsors ──────────────────────────────────────────────────
export const sponsors = {
  Gold:      ['Sponsor Name'],
  Silver:    ['Sponsor Name', 'Sponsor Name'],
  Community: ['Partner Name', 'Partner Name', 'Partner Name'],
}

// ── Gallery ───────────────────────────────────────────────────
const g = (ev, date, s = '') => ({ ev, date, s })
export const gallery = [
  g('CyberHunter 2.0',  'FEB 2026', 'w'), g('CyberHunter 2.0',  'FEB 2026', 't'),
  g('OWASP CTF',        'MAY 2025'),       g('OWASP CTF',        'MAY 2025', 'w'),
  g('Noobathon',        'OCT 2025', 't'),  g('Noobathon',        'OCT 2025'),
  g('Cyber Hunter 1.0', 'SEP 2025', 'w'), g('Cyber Hunter 1.0', 'SEP 2025'),
  g('CyberHunter 2.0',  'FEB 2026'),       g('OWASP CTF',        'MAY 2025', 't'),
  g('Noobathon',        'OCT 2025'),        g('Cyber Hunter 1.0', 'SEP 2025'),
]
