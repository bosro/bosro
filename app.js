/* ============ SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ============ MOBILE MENU ============ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ============ TERMINAL ============ */
const CONTACT = {
  email: 'misterbosro@gmail.com',
  phone: '+233 593 706 706',
  whatsapp: '233593706706',
  github: 'github.com/bosro',
  linkedin: 'linkedin.com/in/bernard-bosro-5bab6a24a'
};

const TERM_COMMANDS = {
  help: () => [
    'Available commands:',
    '  about          show a short bio',
    '  skills         list technical skills',
    '  experience     show work history',
    '  projects       list projects',
    '  education      show education background',
    '  certifications show certifications',
    '  blog           about the dev notes page',
    '  contact        get contact details',
    '  open <site>    open github / linkedin / email / whatsapp / projects / blog',
    '  clear          clear the terminal',
    '  exit           close the terminal'
  ],
  whoami: () => ['bernard@bosro — Software Engineer / Aspiring Application Security Engineer'],
  about: () => [
    'Bernard Bosro — Software Developer, Accra, Ghana.',
    '3+ years building production web & mobile apps across fintech,',
    'transport, e-commerce, and AI. Core stack: Angular, React, React',
    'Native, Next.js, Node.js, Firebase, MongoDB, PostgreSQL.',
    'Also integrates AI/LLM features (chat interfaces, adaptive learning,',
    'automation) using prompt engineering — and is now folding in',
    'Application Security Engineering study (OWASP Top 10, threat',
    'modelling) targeting Mollie\'s 2026 Security Graduate Program.',
    'Portfolio: bosro.github.io/portfolio'
  ],
  skills: () => [
    'Frameworks: HTML5, CSS3, TypeScript, JavaScript, Angular, React.js,',
    '  React Native, Next.js, Node.js, Express, Python',
    'AI & LLM: OpenAI/Gemini integration, prompt engineering, chat UIs,',
    '  context handling, token optimization, response streaming',
    'Security (Applied): JWT, Firebase Auth, RBAC, HTTPS/TLS,',
    '  Input Validation, OWASP Top 10, Secure API Design',
    'State & Data: Redux Toolkit, TanStack Query, Zustand, Context API,',
    '  Axios, WebSocket, GraphQL (basic)',
    'Backend & Cloud: Firebase Firestore/FCM, MongoDB (Mongoose),',
    '  PostgreSQL (Prisma), Google Cloud Console, Cloudflare R2',
    'Payments/Maps/ML: Payment Gateways, Paystack, Google Maps API,',
    '  Geolocation, Scikit-learn, Pandas, Streamlit',
    'Tools: Git, GitHub, Postman, Figma, Canva, VS Code'
  ],
  experience: () => [
    'Software Engineer — Lazylogic Limited (2023–2025), Accra, Ghana',
    '  Built production web/mobile apps in fintech & digital services.',
    '  Integrated secure REST APIs, JWT auth, RBAC, OAuth, payment flows.',
    '',
    'Software Engineer (Freelance) — Self-Employed (2022–2023, 2025–Present)',
    '  Delivered full-stack apps for fintech, transport, e-commerce clients.'
  ],
  education: () => [
    'Accra Technical University',
    '  BTech, Computer Science — 10/2025 – 09/2026',
    '  HND, Computer Science — 11/2022 – 09/2025',
    'Final Year Project: Disease Prediction Prototype',
    '  Tools: Python, Streamlit, Scikit-learn, Visual Basic, Google Colab'
  ],
  certifications: () => [
    '2026 Aspire Leaders Program — Aspire Institute',
    '  Completed all modules · 40 hours of coursework · Issued July 2026',
    '  Focus: self-confidence, critical thinking, communication, and',
    '  positive social impact within a global community.',
    '',
    'Type "open certificate" to view the certificate PDF.'
  ],
  projects: () => [
    '★ Recent: DoronX, VoltGo, VoltGo Rider, Mariseth Farms, Churchman,',
    '  Donkomi, BigLuxx',
    '',
    'Fintech: DoronX, DoronPay Web, DoronPay App, Susu Management App',
    'Delivery: VoltGo, VoltGo Rider',
    'AgriTech: Mariseth Farms',
    'AI / ML: AI-Powered Learning Platform, Disease Prediction Web App',
    'Mobile: GHartisans App, GHcustomers App',
    'Transport: Trofice Web, Trofice App (PaaS)',
    'Dashboards: Churchman, DoronERP, AWELLAMGH, ODKBREAD',
    'Marketplace: Donkomi, 16th August85 Villa, BigLuxx',
    '',
    '20 projects total. Type "open projects" for the full grid,',
    'filterable by category — or "★ Recent" for current work.'
  ],
  blog: () => [
    'Dev Notes — live tech & software engineering articles, pulled from',
    'the dev.to public API and filtered by webdev / security / career.',
    '',
    'Type "open blog" to read the latest posts.'
  ],
  contact: () => [
    `Email:    ${CONTACT.email}`,
    `Phone:    ${CONTACT.phone}`,
    `WhatsApp: wa.me/${CONTACT.whatsapp}`,
    `GitHub:   ${CONTACT.github}`,
    `LinkedIn: ${CONTACT.linkedin}`,
    '',
    'Type "open whatsapp" to start a chat.'
  ]
};

function initTerminal() {
  const toggle = document.getElementById('terminalToggle');
  const overlay = document.getElementById('terminalOverlay');
  const closeBtn = document.getElementById('termClose');
  const input = document.getElementById('termInput');
  const body = document.getElementById('termBody');
  if (!toggle || !overlay) return;

  let history = [];
  let historyIdx = -1;

  function printLine(text, cls) {
    const div = document.createElement('div');
    div.className = 'term-line ' + (cls || 'out');
    div.textContent = text;
    body.appendChild(div);
  }

  function printCmd(cmd) {
    const div = document.createElement('div');
    div.className = 'term-line cmd';
    div.textContent = cmd;
    body.appendChild(div);
  }

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    printCmd(cmd);
    history.push(cmd);
    historyIdx = history.length;

    const [base, ...rest] = cmd.toLowerCase().split(' ');

    if (base === 'clear') {
      body.innerHTML = '';
      return;
    }
    if (base === 'exit') {
      closeTerminal();
      return;
    }
    if (base === 'open') {
      const target = rest.join(' ');
      if (target.includes('github')) {
        printLine(`Opening ${CONTACT.github} ...`, 'accent');
        window.open('https://' + CONTACT.github, '_blank');
      } else if (target.includes('linkedin')) {
        printLine(`Opening ${CONTACT.linkedin} ...`, 'accent');
        window.open('https://' + CONTACT.linkedin, '_blank');
      } else if (target.includes('email') || target.includes('mail')) {
        printLine(`Opening mail client for ${CONTACT.email} ...`, 'accent');
        window.location.href = 'mailto:' + CONTACT.email;
      } else if (target.includes('project')) {
        printLine('Opening projects page ...', 'accent');
        setTimeout(() => { window.location.href = 'projects.html'; }, 400);
      } else if (target.includes('blog')) {
        printLine('Opening blog ...', 'accent');
        setTimeout(() => { window.location.href = 'blog.html'; }, 400);
      } else if (target.includes('whatsapp') || target.includes('wa.me')) {
        printLine(`Opening WhatsApp chat with +${CONTACT.whatsapp} ...`, 'accent');
        window.open(`https://wa.me/${CONTACT.whatsapp}`, '_blank');
      } else if (target.includes('cert')) {
        printLine('Opening Aspire Leaders Program certificate ...', 'accent');
        window.open('aspire-certificate.pdf', '_blank');
      } else {
        printLine(`Nothing to open for "${target}". Try: open github / linkedin / email / whatsapp / projects / blog / certificate`, 'warn');
      }
      return;
    }
    if (TERM_COMMANDS[base]) {
      TERM_COMMANDS[base]().forEach(line => printLine(line));
      return;
    }
    printLine(`command not found: ${base} — type "help" for a list of commands`, 'warn');
  }

  function openTerminal() {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 200);
    if (!body.dataset.initialized) {
      printLine('Welcome to bernard@bosro — interactive portfolio terminal.', 'accent');
      printLine('Type "help" to see available commands.');
      body.dataset.initialized = 'true';
    }
  }
  function closeTerminal() {
    overlay.classList.remove('open');
  }

  toggle.addEventListener('click', openTerminal);
  closeBtn.addEventListener('click', closeTerminal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeTerminal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTerminal();
    if (e.key === '`' && !overlay.classList.contains('open')) { e.preventDefault(); openTerminal(); }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCommand(input.value);
      input.value = '';
      body.scrollTop = body.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) { historyIdx--; input.value = history[historyIdx] || ''; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < history.length - 1) { historyIdx++; input.value = history[historyIdx] || ''; }
      else { historyIdx = history.length; input.value = ''; }
    }
  });
}

document.addEventListener('DOMContentLoaded', initTerminal);

/* ============ PROJECT FILTERS (projects page) ============ */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.pf-card');
  if (!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        let show;
        if (f === 'all') show = true;
        else if (f === 'recent') show = card.dataset.recent === 'true';
        else show = card.dataset.category === f;
        card.style.display = show ? '' : 'none';
      });
    });
  });
});