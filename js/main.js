/* ============================================================
   Jaliane (Jaja) — Portfolio
   ============================================================ */

/* ---------- Configuration ---------- */
const CONFIG = {
  // EmailJS credentials — replace with your own from https://www.emailjs.com/
  emailjsPublicKey: "LsF-qAUdZsPJqjEZb",
  emailjsServiceId: "service_okunfpd",
  emailjsTemplateId: "template_ny0s6yk",
  // Request timeout in milliseconds
  requestTimeout: 15000,
};

/* ---------- EmailJS initialisation ---------- */
(function initEmailJS() {
  if (typeof emailjs === "undefined") return;
  try {
    emailjs.init(CONFIG.emailjsPublicKey);
  } catch (e) {
    console.warn("EmailJS init failed:", e);
  }
})();

/* ---------- Project data (single source of truth) ---------- */
const PROJECTS = [
  {
    id: "portfolio",
    name: "Portfolio Website",
    category: "web",
    status: "live",
    tagline: "Personal developer portfolio",
    description:
      "A fast, accessible, single-page portfolio that presents my projects, skills, and contact details — with dark/light mode, scroll animations, and a working contact form.",
    problem:
      "I needed a professional home on the web to present my work to recruiters, collaborators, and scholarship programs — something that loads fast, works on any device, and is easy to maintain.",
    solution:
      "A single-page site built with semantic HTML, modern CSS, and vanilla JavaScript — no heavy frameworks — backed by a small Express API that delivers contact messages straight to my inbox.",
    features: [
      "Fully responsive on mobile, tablet, and desktop",
      "Dark & light theme with saved preference",
      "Contact form with validation and email delivery",
      "SEO metadata, semantic HTML, and keyboard accessible",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Express", "Nodemailer"],
    links: {
      live: "https://my-website-ruwl.vercel.app/",
      github: "https://github.com/jaja-12/my-website",
    },
    accent: "#5b8def",
  },
  {
    id: "ecommerce",
    name: "E-Commerce App",
    category: "fullstack",
    status: "development",
    tagline: "Full-stack online store",
    description:
      "A full-stack shopping application with user authentication, a product catalog, and a checkout flow — currently in development.",
    problem:
      "Shopping apps are one of the best ways to practice full-stack development: authentication, product data, and payments touch every layer of a web application.",
    solution:
      "A storefront with React on the front end and Node.js + MongoDB on the back end, designed around a clean REST API.",
    features: [
      "User authentication and accounts",
      "Product catalog with search",
      "Shopping cart and checkout",
      "Order management",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB"],
    links: {},
    accent: "#34d399",
  },
  {
    id: "dashboard",
    name: "React Dashboard",
    category: "web",
    status: "development",
    tagline: "Product management dashboard",
    description:
      "A product management dashboard built with React, featuring data visualization and full CRUD operations — currently in development.",
    problem:
      "Dashboards are the perfect project for learning how to work with data: fetching it, displaying it meaningfully, and letting users act on it.",
    solution:
      "A React single-page dashboard with charts, tables, and forms for managing product data.",
    features: [
      "Interactive charts and data visualization",
      "Full CRUD operations",
      "Filtering and search",
      "Responsive data tables",
    ],
    stack: ["React", "JavaScript", "Charts"],
    links: {},
    accent: "#a78bfa",
  },
  {
    id: "chat",
    name: "Chat App",
    category: "fullstack",
    status: "development",
    tagline: "Real-time messaging",
    description:
      "A real-time chat application using Socket.io and Node.js, with private and group chat features — currently in development.",
    problem:
      "Real-time communication is one of the most engaging problems in web development: connections, rooms, and instant message delivery all have to work together.",
    solution:
      "A chat app built on WebSockets with a Node.js back end, designed for private conversations and group rooms.",
    features: [
      "Real-time messaging",
      "Private and group chats",
      "Online presence indicators",
      "Message history",
    ],
    stack: ["Socket.io", "Node.js", "JavaScript"],
    links: {},
    accent: "#fbbf24",
  },
];

/* ---------- Social links ---------- */
const SOCIALS = {
  github: "https://github.com/jaja-12",
  // Add your LinkedIn URL here when available:
  linkedin: "",
  email: "nzamukundajaliane102@gmail.com",
};

/* ============================================================
   Theme
   ============================================================ */
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function currentTheme() {
  return root.classList.contains("light") ? "light" : "dark";
}

function setTheme(theme) {
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  themeToggle.setAttribute(
    "aria-label",
    theme === "light" ? "Switch to dark mode" : "Switch to light mode"
  );
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* storage unavailable — ignore */
  }
}

themeToggle.addEventListener("click", () => {
  setTheme(currentTheme() === "light" ? "dark" : "light");
});

/* ============================================================
   Header: scroll state + scroll progress
   ============================================================ */
const header = document.getElementById("site-header");
const progressBar = document.getElementById("scroll-progress");

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${ratio})`;
}

let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        onScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true }
);
onScroll();

/* ============================================================
   Active navigation link
   ============================================================ */
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ============================================================
   Mobile menu
   ============================================================ */
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuBackdrop = document.getElementById("menu-backdrop");
let lastFocusedElement = null;

function openMenu() {
  lastFocusedElement = document.activeElement;
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuToggle.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
  document.body.style.overflow = "hidden";
  const firstLink = mobileMenu.querySelector(".mobile-menu__link");
  if (firstLink) firstLink.focus();
}

function closeMenu() {
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.contains("is-open") ? closeMenu() : openMenu();
});

menuBackdrop.addEventListener("click", closeMenu);

mobileMenu.querySelectorAll("[data-nav-link]").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* ============================================================
   Reveal on scroll
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => {
  const delay = el.getAttribute("data-delay");
  if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
  revealObserver.observe(el);
});

/* ============================================================
   Projects: render, filter, detail modal
   ============================================================ */
const projectsGrid = document.getElementById("projects-grid");
const projectsEmpty = document.getElementById("projects-empty");
const modal = document.getElementById("project-modal");
const modalBody = document.getElementById("modal-body");
let lastModalTrigger = null;

function projectThumb(project) {
  const initial = project.name.charAt(0);
  return `
    <svg class="project-card__thumb" viewBox="0 0 400 225" role="img" aria-label="${project.name} preview" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="225" fill="#101827" />
      <rect width="400" height="30" fill="#182234" />
      <circle cx="20" cy="15" r="4.5" fill="#f87171" opacity="0.85" />
      <circle cx="36" cy="15" r="4.5" fill="#fbbf24" opacity="0.85" />
      <circle cx="52" cy="15" r="4.5" fill="#34d399" opacity="0.85" />
      <text x="200" y="148" text-anchor="middle" font-family="Sora, Arial, sans-serif" font-size="88" font-weight="700" fill="${project.accent}" opacity="0.9">${initial}</text>
      <rect x="140" y="168" width="120" height="8" rx="4" fill="${project.accent}" opacity="0.45" />
      <rect x="160" y="186" width="80" height="6" rx="3" fill="#334155" opacity="0.7" />
    </svg>`;
}

function projectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute(
    "aria-label",
    `View details for ${project.name} — ${project.status === "live" ? "live" : "in development"}`
  );

  const statusLabel = project.status === "live" ? "Live" : "In Dev";
  const links = [];

  if (project.links.github) {
    links.push(
      `<a class="project-card__link" href="${project.links.github}" target="_blank" rel="noopener noreferrer" data-modal-link>
         <svg class="icon"><use href="#i-github" /></svg>GitHub
       </a>`
    );
  }
  if (project.links.live) {
    links.push(
      `<a class="project-card__link" href="${project.links.live}" target="_blank" rel="noopener noreferrer" data-modal-link>
         <svg class="icon"><use href="#i-external" /></svg>Live Demo
       </a>`
    );
  }
  if (!links.length) {
    links.push(
      `<span class="project-card__link project-card__link--disabled">
         <svg class="icon"><use href="#i-github" /></svg>Coming Soon
       </span>`
    );
  }

  card.innerHTML = `
    ${projectThumb(project)}
    <div class="project-card__body">
      <div class="project-card__top">
        <h3 class="project-card__name">${project.name}</h3>
        <span class="project-card__status project-card__status--${project.status === "live" ? "live" : "dev"}">${statusLabel}</span>
      </div>
      <p class="project-card__desc">${project.description}</p>
      <div class="project-card__stack">
        ${project.stack.map((tech) => `<span class="project-card__tag">${tech}</span>`).join("")}
      </div>
      <div class="project-card__links">${links.join("")}</div>
    </div>
  `;

  const open = () => openProjectModal(project, card);
  card.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-link]")) return; // let links work
    open();
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  return card;
}

function renderProjects(filter = "all") {
  const visible = PROJECTS.filter(
    (p) => filter === "all" || p.category === filter
  );
  projectsGrid.innerHTML = "";
  visible.forEach((project) => projectsGrid.appendChild(projectCard(project)));
  projectsEmpty.hidden = visible.length > 0;
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    renderProjects(btn.getAttribute("data-filter"));
  });
});

renderProjects();

/* ---------- Project detail modal ---------- */
function openProjectModal(project, trigger) {
  lastModalTrigger = trigger;
  const featuresTitle =
    project.status === "live" ? "Key features" : "Planned features";

  const actions = [];
  if (project.links.github) {
    actions.push(
      `<a class="btn btn--ghost" href="${project.links.github}" target="_blank" rel="noopener noreferrer">
         <svg class="icon"><use href="#i-github" /></svg>GitHub
       </a>`
    );
  }
  if (project.links.live) {
    actions.push(
      `<a class="btn btn--primary" href="${project.links.live}" target="_blank" rel="noopener noreferrer">
         <svg class="icon"><use href="#i-external" /></svg>Live Demo
       </a>`
    );
  }
  if (!actions.length) {
    actions.push(
      `<span class="btn btn--ghost" style="opacity:0.6;cursor:default">
         <svg class="icon"><use href="#i-github" /></svg>Links Coming Soon
       </span>`
    );
  }

  modalBody.innerHTML = `
    ${projectThumb(project).replace('class="project-card__thumb"', 'class="modal__thumb"')}
    <h2 class="modal__title" id="modal-title">${project.name}</h2>
    <p class="modal__tagline">${project.tagline}</p>
    <div class="modal__section">
      <h3>Overview</h3>
      <p>${project.description}</p>
    </div>
    <div class="modal__section">
      <h3>The problem</h3>
      <p>${project.problem}</p>
    </div>
    <div class="modal__section">
      <h3>The solution</h3>
      <p>${project.solution}</p>
    </div>
    <div class="modal__section">
      <h3>${featuresTitle}</h3>
      <ul class="modal__features">
        ${project.features.map((f) => `<li><svg class="icon"><use href="#i-check" /></svg>${f}</li>`).join("")}
      </ul>
    </div>
    <div class="modal__section">
      <h3>Tech stack</h3>
      <div class="modal__stack">
        ${project.stack.map((tech) => `<span class="project-card__tag">${tech}</span>`).join("")}
      </div>
    </div>
    <div class="modal__actions">${actions.join("")}</div>
  `;

  modal.showModal();
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal__close").focus();
}

function closeProjectModal() {
  modal.close();
  document.body.style.overflow = "";
  if (lastModalTrigger) lastModalTrigger.focus();
}

modal.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-modal]")) closeProjectModal();
});

/* ============================================================
   Global keyboard: Esc closes menu / modal
   ============================================================ */
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (modal.open) {
    closeProjectModal();
  } else if (mobileMenu.classList.contains("is-open")) {
    closeMenu();
  }
});

/* ============================================================
   Contact form
   ============================================================ */
const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("contact-submit");
const formStatus = document.getElementById("form-status");
const statusTimeout = { id: null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showStatus(message, type) {
  clearTimeout(statusTimeout.id);
  formStatus.className = `form-status form-status--${type}`;
  formStatus.innerHTML = `<svg class="icon"><use href="#i-${type === "success" ? "check" : "alert"}" /></svg><span></span>`;
  formStatus.querySelector("span").textContent = message;
  formStatus.hidden = false;
}

function hideStatus() {
  formStatus.hidden = true;
}

function setFieldError(field, message) {
  const input = form.elements[field];
  const errorEl = document.getElementById(`contact-${field}-error`);
  const wrapper = input.closest(".form-field");
  if (message) {
    wrapper.classList.add("has-error");
    errorEl.textContent = message;
    errorEl.hidden = false;
    input.setAttribute("aria-invalid", "true");
  } else {
    wrapper.classList.remove("has-error");
    errorEl.textContent = "";
    errorEl.hidden = true;
    input.removeAttribute("aria-invalid");
  }
}

function validateField(field) {
  const input = form.elements[field];
  const value = input.value.trim();

  if (field === "name") {
    if (!value) return "Please enter your name.";
    if (value.length < 2) return "Name must be at least 2 characters.";
    if (value.length > 80) return "Name must be 80 characters or fewer.";
  }
  if (field === "email") {
    if (!value) return "Please enter your email address.";
    if (!EMAIL_RE.test(value)) return "Please enter a valid email address.";
  }
  if (field === "message") {
    if (!value) return "Please enter a message.";
    if (value.length < 10) return "Message must be at least 10 characters.";
    if (value.length > 2000) return "Message must be 2,000 characters or fewer.";
  }
  return "";
}

["name", "email", "message"].forEach((field) => {
  const input = form.elements[field];
  input.addEventListener("blur", () => {
    if (input.value.trim()) setFieldError(field, validateField(field));
  });
  input.addEventListener("input", () => {
    if (input.closest(".form-field").classList.contains("has-error")) {
      setFieldError(field, validateField(field));
    }
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideStatus();

  // Validate all fields
  const fields = ["name", "email", "message"];
  const errors = fields.map((field) => {
    const message = validateField(field);
    setFieldError(field, message);
    return message;
  });
  if (errors.some(Boolean)) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const payload = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    message: form.elements.message.value.trim(),
    website: form.elements.website.value.trim(), // honeypot
  };

  // Loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<svg class="icon" style="animation:spin 0.9s linear infinite"><use href="#i-spinner" /></svg><span>Sending...</span>`;

  if (typeof emailjs === "undefined") {
    showStatus("Email service failed to load. Please refresh the page and try again.", "error");
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<svg class="icon"><use href="#i-send" /></svg><span>Send Message</span>`;
    return;
  }

  const templateParams = {
    from_name: payload.name,
    from_email: payload.email,
    message: payload.message,
    to_email: "nzamukundajaliane102@gmail.com",
  };

  try {
    await emailjs.send(CONFIG.emailjsServiceId, CONFIG.emailjsTemplateId, templateParams);
    showStatus("Message sent successfully! I'll get back to you soon.", "success");
    form.reset();
  } catch (error) {
    const offline = !navigator.onLine;
    showStatus(
      offline
        ? "You appear to be offline. Check your connection and try again."
        : "Couldn't send your message. Please try again in a moment.",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<svg class="icon"><use href="#i-send" /></svg><span>Send Message</span>`;
    statusTimeout.id = setTimeout(hideStatus, 8000);
  }
});

/* ============================================================
   Footer year
   ============================================================ */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================================
   Image fallbacks
   ============================================================ */
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.display = "none";
    const fallback = document.createElement("div");
    fallback.style.cssText =
      "width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--surface-2);color:var(--text-muted);font-family:var(--font-display);font-size:2rem;font-weight:700;";
    fallback.textContent = "J";
    img.parentNode.style.position = "relative";
    img.parentNode.appendChild(fallback);
  });
});
