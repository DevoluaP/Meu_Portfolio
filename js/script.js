const el = (id) => document.getElementById(id);
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

const DOM = {
  body: document.body,
  header: el("site-header"),
  navLinks: el("nav-links"),
  menuButton: el("btn-menu"),
  themeButton: el("btn-theme"),
  progress: el("scroll-progress"),
  cursorGlow: qs(".cursor-glow"),
  langDropdown: el("lang-dropdown"),
  langButton: el("lang-dropdown-btn"),
  langList: el("lang-dropdown-list"),
  langFlag: el("lang-current-flag"),
  langLabel: el("lang-current-label"),
  skills: el("skills-section"),
  projects: el("projects-container"),
  projectFilter: el("projects-filter"),
  experience: el("experience-list"),
  education: el("education-list"),
  modal: el("modal"),
  modalImg: el("modal-img"),
  modalTitle: el("modal-title"),
  modalDesc: el("modal-desc"),
  modalTech: el("modal-technologies"),
  modalGithub: el("modal-github"),
  modalSite: el("modal-site"),
  modalClose: el("modal-close"),
  modalImageTrigger: el("modal-image-trigger"),
  imageLightbox: el("image-lightbox"),
  imageLightboxImg: el("image-lightbox-img"),
  imageLightboxClose: el("image-lightbox-close"),
  alert: el("alert-modal"),
  alertMessage: el("alert-message"),
  alertClose: el("alert-close"),
};

const state = {
  theme: localStorage.getItem("theme") || "dark",
  lang: localStorage.getItem("lang") || "pt",
  skills: {},
  projects: [],
  experience: [],
  education: [],
  projectFilter: "all",
};

const CONFIG = {
  desktop: 980,
  languages: {
    pt: { label: "Português", country: "br" },
    en: { label: "English", country: "us" },
    es: { label: "Español", country: "es" },
    fr: { label: "Français", country: "fr" },
    de: { label: "Deutsch", country: "de" },
    ja: { label: "日本語", country: "jp" },
    it: { label: "Italiano", country: "it" },
  },
  icon: {
    sun: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.5A8.8 8.8 0 0 1 8.5 3.6 8.8 8.8 0 1 0 20.4 15.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
  },
};

const translations = {};
async function loadLanguage(lang) {
  if (translations[lang]) return translations[lang];

  const response = await fetch(`js/lang/${lang}.json`);
  if (!response.ok) throw new Error(`Falha ao carregar idioma: ${lang}`);

  translations[lang] = await response.json();
  return translations[lang];
}

const Translation = {
  get(key) {
    return (
      key
        .split(".")
        .reduce((value, part) => value?.[part], translations[state.lang]) || key
    );
  },
  apply() {
    qsa("[data-translate]").forEach((node) => {
      node.textContent = this.get(node.dataset.translate);
    });
    qsa("[data-translate-title]").forEach((node) => {
      node.title = this.get(node.dataset.translateTitle);
    });
    qsa("[data-translate-alt]").forEach((node) => {
      node.alt = this.get(node.dataset.translateAlt);
    });

    document.documentElement.lang = state.lang;
    document.title = `Paulo Henrique | ${this.get("home.role")}`;
    const cv = state.lang === "pt" ? "imagens/cv.pdf" : "imagens/cv_EN.pdf";
    [el("hero-cv"), el("about-cv")].forEach((node) => node && (node.href = cv));
    Language.updateCurrent();
    Theme.update();
  },
};

const Language = {
  init() {
    DOM.langList.innerHTML = Object.entries(CONFIG.languages)
      .map(
        ([code, item]) => `
          <li role="option" data-lang="${code}" aria-selected="${code === state.lang}">
            <img src="https://flagcdn.com/24x18/${item.country}.png" alt="" />
            <span>${item.label}</span>
          </li>
        `,
      )
      .join("");

    DOM.langList.addEventListener("click", async (event) => {
      const item = event.target.closest("li[data-lang]");
      if (!item) return;
      await this.set(item.dataset.lang);
      this.close();
    });

    DOM.langButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggle();
    });

    document.addEventListener("click", (event) => {
      if (!DOM.langDropdown.contains(event.target)) this.close();
    });
  },
  async set(lang) {
    if (!CONFIG.languages[lang] || lang === state.lang) return;
    state.lang = lang;

    localStorage.setItem("lang", lang);
    await loadLanguage(lang);
    Translation.apply();
    Skills.render();
    Projects.render();
    Experience.render();
    Education.render();
  },
  updateCurrent() {
    const current = CONFIG.languages[state.lang];
    DOM.langFlag.src = `https://flagcdn.com/24x18/${current.country}.png`;
    DOM.langLabel.textContent = current.label;
    qsa("#lang-dropdown-list li").forEach((li) =>
      li.setAttribute("aria-selected", li.dataset.lang === state.lang),
    );
  },
  toggle() {
    DOM.langList.classList.toggle("open");
  },
  close() {
    DOM.langList.classList.remove("open");
  },
};

const Theme = {
  init() {
    DOM.body.classList.toggle("light-theme", state.theme === "light");
    this.update();
  },
  toggle() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", state.theme);
    DOM.body.classList.toggle("light-theme", state.theme === "light");
    this.update();
  },
  update() {
    DOM.themeButton.innerHTML =
      state.theme === "dark" ? CONFIG.icon.sun : CONFIG.icon.moon;
    DOM.themeButton.title = Translation.get(
      state.theme === "dark" ? "theme.toggleLight" : "theme.toggleDark",
    );
  },
};

const Menu = {
  toggle() {
    const open = DOM.navLinks.classList.toggle("open");
    DOM.menuButton.setAttribute("aria-expanded", String(open));
  },
  close() {
    DOM.navLinks.classList.remove("open");
    DOM.menuButton.setAttribute("aria-expanded", "false");
  },
};

const Skills = {
  async load() {
    try {
      state.skills = await fetch("js/habilidades.json").then((r) => r.json());
      this.render();
    } catch (error) {
      console.error(error);
    }
  },
  render() {
    DOM.skills.innerHTML = Object.entries(state.skills)
      .map(
        ([category, items]) => `
          <article class="skill-group glass-card spotlight-card">
            <h3>${translations[state.lang]?.skills?.[category] || category}</h3>
            <div class="skill-items">
              ${items
                .map(
                  (skill) => `
                  <div class="skill-item">
                    <img src="${skill.imagem}" alt="" loading="lazy" />
                    <span>${skill.nome}</span>
                  </div>`,
                )
                .join("")}
            </div>
          </article>
        `,
      )
      .join("");
    bindSpotlights();
  },
};

const Experience = {
  async load() {
    try {
      state.experience = await fetch("js/experiencia.json").then((r) =>
        r.json(),
      );
      this.render();
    } catch (error) {
      console.error(error);
    }
  },
  render() {
    const localizedItems = translations[state.lang]?.experience?.items || [];
    DOM.experience.innerHTML = state.experience
      .map((item, index) => {
        const localized = localizedItems[index] || {};
        const tags = localized.tags || item.tags;
        const period = item.periodo.replace(
          "PRESENTE",
          translations[state.lang]?.experience?.present || "PRESENTE",
        );
        return `
          <article class="timeline-item">
            <div class="timeline-period">${period}</div>
            <div class="timeline-main">
              <img class="timeline-logo" src="${item.imagem}" alt="" loading="lazy" />
              <div>
                <h3 class="timeline-title">${localized.titulo || item.titulo}</h3>
                <div class="timeline-company">${localized.empresa || item.empresa}</div>
                <p class="timeline-desc">${localized.descricao || item.descricao}</p>
              </div>
              <div class="timeline-tags">
                ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  },
};

const Education = {
  async load() {
    try {
      state.education = await fetch("js/educacao.json").then((r) => r.json());
      this.render();
    } catch (error) {
      console.error(error);
    }
  },
  render() {
    const localizedItems = translations[state.lang]?.education?.items || [];
    DOM.education.innerHTML = state.education
      .map((item, index) => {
        const localized = localizedItems[index] || {};
        return `
          <article class="education-card glass-card spotlight-card">
            <div class="education-top">
              <img class="education-logo" src="${item.imagem}" alt="" loading="lazy" />
              <span class="education-year">${item.ano}</span>
            </div>
            <div>
              <h3>${localized.titulo || item.titulo}</h3>
              <h4>${localized.instituicao || item.instituicao}</h4>
              <p>${localized.descricao || item.descricao}</p>
            </div>
            <span class="education-badge">${localized.status ?? item.status}</span>
          </article>
        `;
      })
      .join("");
    bindSpotlights();
    UI.bindDynamicReveals();
  },
};

const Projects = {
  async load() {
    try {
      state.projects = await fetch("js/projetos.json").then((r) => r.json());
      this.render();
    } catch (error) {
      console.error(error);
    }
  },
  matches(project) {
    if (state.projectFilter === "all") return true;

    const tech =
      `${project.tecnologias?.join(" ")} ${project.titulo}`.toLowerCase();

    if (state.projectFilter === "mobile")
      return /react native|mobile|expo/.test(tech);

    if (state.projectFilter === "automation")
      return /uipath|rpa|autom/.test(tech);

    return !/react native|mobile|expo|uipath|rpa|autom/.test(tech);
  },
  render() {
    const visible = state.projects.filter((project) => this.matches(project));
    const localizedItems = translations[state.lang]?.projects?.items || {};
    DOM.projects.innerHTML = visible
      .map((project) => {
        const localized = localizedItems[project.id] || {};
        return `
          <article class="project-card glass-card spotlight-card" data-id="${project.id}" tabindex="0" aria-label="${localized.titulo || project.titulo}">
            <div class="project-image" style="background-image:url('${project.imagem}')"></div>
            <div class="project-overlay"></div>
            <div class="project-content">
              <h3>${localized.titulo || project.titulo}</h3>
              <p>${localized.descricao || project.descricao}</p>
              <div class="project-footer"><div class="project-tags">${(
                project.tecnologias?.[0] || ""
              )
                .split(/,\s*/)
                .slice(0, 3)
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("")}</div><span class="project-arrow">↗</span></div>
            </div>
          </article>
        `;
      })
      .join("");

    qsa(".project-card").forEach((card) => {
      card.addEventListener("click", () => Modal.open(card.dataset.id));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          Modal.open(card.dataset.id);
        }
      });
      bindTilt(card);
    });
    bindSpotlights();
  },
  initFilters() {
    DOM.projectFilter.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      state.projectFilter = button.dataset.filter;
      qsa(".filter-button").forEach((node) =>
        node.classList.toggle("active", node === button),
      );
      this.render();
    });
  },
};

const Modal = {
  open(id) {
    const project = state.projects.find((item) => item.id === id);
    if (!project) return;

    const localized = translations[state.lang]?.projects?.items?.[id] || {};
    DOM.modalImg.src = project.imagem;
    DOM.imageLightboxImg.src = project.imagem;
    DOM.modalTitle.textContent = localized.titulo || project.titulo;
    DOM.modalDesc.textContent = localized.descricao || project.descricao;
    DOM.modalTech.textContent = `${Translation.get("projects.technologies")} ${project.tecnologias?.[0] || ""}`;
    this.configure(
      DOM.modalGithub,
      project.github,
      Translation.get("modal.githubUnavailable"),
    );
    this.configure(
      DOM.modalSite,
      project.site,
      Translation.get("modal.siteUnavailable"),
    );
    DOM.modal.classList.add("active");
    DOM.modal.setAttribute("aria-hidden", "false");
    DOM.body.classList.add("modal-open");
  },
  configure(node, url, message) {
    node.onclick = null;
    if (!url || url === "#") {
      node.href = "#";
      node.onclick = (event) => {
        event.preventDefault();
        Alert.show(message);
      };
    } else {
      node.href = url;
    }
  },
  close() {
    DOM.modal.classList.remove("active");
    DOM.modal.setAttribute("aria-hidden", "true");
    DOM.body.classList.remove("modal-open");
  },
};

const ImageLightbox = {
  open() {
    if (!DOM.modalImg.src) return;
    DOM.imageLightboxImg.src = DOM.modalImg.src;
    DOM.imageLightbox.classList.add("active");
    DOM.imageLightbox.setAttribute("aria-hidden", "false");
    DOM.body.classList.add("modal-open");
  },
  close() {
    DOM.imageLightbox.classList.remove("active");
    DOM.imageLightbox.setAttribute("aria-hidden", "true");
    if (!DOM.modal.classList.contains("active"))
      DOM.body.classList.remove("modal-open");
  },
};

const Alert = {
  show(message) {
    DOM.alertMessage.textContent = message;
    DOM.alert.classList.add("active");
    DOM.alert.setAttribute("aria-hidden", "false");
  },
  hide() {
    DOM.alert.classList.remove("active");
    DOM.alert.setAttribute("aria-hidden", "true");
  },
};

function bindTilt(node) {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(hover: none)").matches
  )
    return;

  node.addEventListener("pointermove", (event) => {
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
    node.style.setProperty("--spot-x", `${(x + 0.5) * 100}%`);
    node.style.setProperty("--spot-y", `${(y + 0.5) * 100}%`);
  });
  node.addEventListener("pointerleave", () => {
    node.style.transform = "";
  });
}

function bindSpotlights() {
  qsa(".spotlight-card").forEach((node) => {
    if (node.dataset.spotlightBound) return;
    node.dataset.spotlightBound = "true";
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });
}

const UI = {
  lastScrollY: window.scrollY,
  scrollDirection: "down",
  revealObservers: [],
  updateDirection() {
    const current = window.scrollY;
    if (Math.abs(current - this.lastScrollY) > 2)
      this.scrollDirection = current >= this.lastScrollY ? "down" : "up";
    this.lastScrollY = current;
  },
  initReveal() {
    const nodes = qsa("main > .reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
          else if (this.scrollDirection === "up")
            entry.target.classList.remove("is-visible");
        }),
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    this.revealObservers.push(observer);
  },
  initStaggeredReveal(containerSelector, itemSelector) {
    const items = qsa(`${containerSelector} ${itemSelector}`);
    if (!("IntersectionObserver" in window)) {
      items.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    items.forEach((node, index) => {
      node.style.setProperty("--reveal-delay", `${index * 110}ms`);
      if (node.dataset.revealBound) return;
      node.dataset.revealBound = "true";
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("is-visible");
            else if (this.scrollDirection === "up")
              entry.target.classList.remove("is-visible");
          }),
        { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
      );
      observer.observe(node);
      this.revealObservers.push(observer);
    });
  },
  initTyping() {
    const node = qs(".typing-text");
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const original = node.textContent.trim();
    const text = original;
    node.dataset.fullText = text;
    node.textContent = "";
    let i = 0;
    const tick = () => {
      node.textContent = text.slice(0, i++);
      if (i <= text.length) window.setTimeout(tick, 17);
    };
    tick();
  },
  initCounters() {
    const counters = qsa(".metric-number");
    if (!counters.length) return;
    const run = (node) => {
      if (node.dataset.counted === "true" || node.dataset.counting === "true")
        return;
      const target = Number(node.dataset.target);
      node.dataset.counting = "true";
      const start = performance.now();
      const duration = 1200;
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        node.textContent = `${value}${target > 1 ? "+" : ""}`;
        if (progress < 1) requestAnimationFrame(step);
        else {
          node.dataset.counting = "false";
          node.dataset.counted = "true";
        }
      };
      requestAnimationFrame(step);
    };
    const section = qs("#about");
    if (!section || !("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          counters.forEach(run);
          observer.disconnect();
        }
      },
      { threshold: 0.28 },
    );
    observer.observe(section);
    this.revealObservers.push(observer);
  },
  initCursor() {
    if (
      !DOM.cursorGlow ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    window.addEventListener("pointermove", (event) => {
      DOM.cursorGlow.style.left = `${event.clientX}px`;
      DOM.cursorGlow.style.top = `${event.clientY}px`;
      DOM.cursorGlow.style.opacity = "1";
    });
  },
  initMagnetic() {
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    qsa(".magnetic").forEach((node) =>
      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.1;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.1;
        node.style.transform = `translate(${x}px, ${y}px)`;
      }),
    );
    qsa(".magnetic").forEach((node) =>
      node.addEventListener("pointerleave", () => {
        node.style.transform = "";
      }),
    );
  },
  initNavigation() {
    qsa(".nav-links a").forEach((link) =>
      link.addEventListener("click", () => Menu.close()),
    );
    const sections = qsa("main section[id]");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            qsa(".nav-links a").forEach((link) =>
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`,
              ),
            );
        }),
      { rootMargin: "-35% 0px -55%" },
    );
    sections.forEach((section) => observer.observe(section));
  },
  initScroll() {
    const onScroll = () => {
      this.updateDirection();
      const max = document.documentElement.scrollHeight - innerHeight;
      DOM.progress.style.width = `${Math.max(0, Math.min(100, (scrollY / max) * 100))}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  },
  bindDynamicReveals() {
    this.initStaggeredReveal("#experience-list", ".timeline-item");
    this.initStaggeredReveal("#education-list", ".education-card");
  },
};
const Events = {
  init() {
    DOM.themeButton.addEventListener("click", () => Theme.toggle());
    DOM.menuButton.addEventListener("click", () => Menu.toggle());
    DOM.modalClose.addEventListener("click", () => Modal.close());
    DOM.modalImageTrigger.addEventListener("click", () => ImageLightbox.open());
    DOM.imageLightboxClose.addEventListener("click", () =>
      ImageLightbox.close(),
    );
    DOM.alertClose.addEventListener("click", () => Alert.hide());
    window.addEventListener("click", (event) => {
      if (event.target === DOM.modal) Modal.close();
      if (event.target === DOM.alert) Alert.hide();
      if (event.target === DOM.imageLightbox) ImageLightbox.close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        ImageLightbox.close();
        Modal.close();
        Alert.hide();
        Language.close();
        Menu.close();
      }
    });
    window.addEventListener("resize", () => {
      if (innerWidth > CONFIG.desktop) Menu.close();
    });
  },
};

async function init() {
  Theme.init();
  Language.init();
  await loadLanguage(state.lang);
  Translation.apply();
  await Promise.all([
    Skills.load(),
    Projects.load(),
    Experience.load(),
    Education.load(),
  ]);
  Projects.initFilters();
  Events.init();
  UI.initReveal();
  UI.bindDynamicReveals();
  UI.initTyping();
  UI.initCounters();
  UI.initCursor();
  UI.initMagnetic();
  UI.initNavigation();
  UI.initScroll();
  bindSpotlights();
}

document.addEventListener("DOMContentLoaded", init);
