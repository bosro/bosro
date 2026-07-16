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
  github: 'github.com/bosro',
  linkedin: 'linkedin.com/in/bernard-bosro-5bab6a24a'
};

const TERM_COMMANDS = {
  help: () => [
    'Available commands:',
    '  about        show a short bio',
    '  skills       list technical skills',
    '  experience   show work history',
    '  projects     list projects',
    '  education    show education background',
    '  blog         about the dev notes page',
    '  contact      get contact details',
    '  open <site>  open github / linkedin / email / projects / blog',
    '  clear        clear the terminal',
    '  exit         close the terminal'
  ],
  whoami: () => ['bernard@bosro — Software Engineer / Aspiring Application Security Engineer'],
  about: () => [
    'Bernard Bosro — Software Engineer, Accra, Ghana.',
    '3+ years building production fintech, transport, and AI apps.',
    'Currently transitioning into Application Security Engineering,',
    'combining a software development foundation with self-directed',
    'study in threat modelling and the OWASP Top 10.',
    'Targeting Mollie\'s 2026 Security Graduate Program.'
  ],
  skills: () => [
    'Security (Applied): JWT, OAuth Fundamentals, RBAC, HTTPS/TLS,',
    '  Input Validation, Secure API Design, OWASP Top 10, AuthN/AuthZ',
    'Languages: Python, JavaScript, TypeScript, SQL',
    'Frontend & Mobile: React, React Native, Angular, Next.js',
    'Backend: Node.js, Express',
    'Databases: MongoDB, PostgreSQL, Firebase, MySQL',
    'Tools: Git, Postman, Redux Toolkit, TanStack Query, Figma, Docker'
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
    '  BTech, Computer Science — Expected 2026',
    '  HND, Computer Science — 2025',
    'Coursework: Data Structures & Algorithms, Software Engineering,',
    '  Database Systems, Computer Networks, OS, Machine Learning,',
    '  Information Security.'
  ],
  projects: () => [
    '01. DoronPay — fintech payment platform (Python, JWT, Payment APIs)',
    '02. Disease Prediction System — ML app w/ RBAC (Python, Scikit-learn)',
    '03. GHArtisans — mobile commerce (React Native, Firebase Auth)',
    '04. AI Learning Platform — LLM tutoring (Secure API Design)',
    '05. Trofice — transport & booking (Geolocation, Transaction Security)',
    '',
    'Type "open projects" to view the full projects page.'
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
    `GitHub:   ${CONTACT.github}`,
    `LinkedIn: ${CONTACT.linkedin}`
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
      } else {
        printLine(`Nothing to open for "${target}". Try: open github / linkedin / email / projects / blog`, 'warn');
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
        const show = f === 'all' || card.dataset.category === f;
        card.style.display = show ? '' : 'none';
      });
    });
  });
});