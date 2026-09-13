const el = (id) => document.getElementById(id);
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

const DOM = {
  body: document.body,
  container: el("projects-container"),
  modal: el("modal"),
  modalImg: el("modal-img"),
  modalTitle: el("modal-title"),
  modalDesc: el("modal-desc"),
  modalTechnologies: el("modal-technologies"),
  modalGithub: el("modal-github"),
  modalSite: el("modal-site"),
  closeBtn: qs(".close"),
  menu: qs(".menu"),
  header: qs("header"),
  btnMenu: el("btn-menu"),
  btnClose: el("btn-close"),
  btnTheme: el("btn-theme"),
  langDropdown: el("lang-dropdown"),
  langDropdownBtn: el("lang-dropdown-btn"),
  langDropdownList: el("lang-dropdown-list"),
  langCurrentFlag: el("lang-current-flag"),
  langCurrentLabel: el("lang-current-label"),
  alertModal: el("alert-modal"),
  alertMessage: el("alert-message"),
  alertClose: el("alert-close"),
};

const state = {
  theme: localStorage.getItem("theme") || "dark",
  lang: localStorage.getItem("lang") || "pt",
  skills: {},
  projects: [],
};

const CONFIG = {
  DESKTOP_WIDTH: 768,
  MENU_HEIGHT: "92vh",
  SVG_ICONS: {
    light: `<path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5"/>`,
    dark: `<path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>`,
  },
  LANGUAGES: {
    pt: { label: "Português", country: "br" },
    en: { label: "English", country: "us" },
    es: { label: "Español", country: "es" },
    fr: { label: "Français", country: "fr" },
    de: { label: "Deutsch", country: "de" },
    ja: { label: "日本語", country: "jp" },
    it: { label: "Italiano", country: "it" },
  },
  FLAG_URL: (country) => `https://flagcdn.com/24x18/${country}.png`,
};

const translations = {};

async function loadLanguage(lang) {
  if (translations[lang]) return translations[lang];

  const res = await fetch(`js/lang/${lang}.json`);
  if (!res.ok) throw new Error(`Falha ao carregar idioma: ${lang}`);

  const data = await res.json();
  translations[lang] = data;
  return data;
}

const Translation = {
  get(key) {
    const keys = key.split(".");
    let value = translations[state.lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  },

  apply() {
    qsa("[data-translate]").forEach((el) => {
      const key = el.getAttribute("data-translate");
      const translation = this.get(key);

      if (el.tagName === "INPUT" && el.type === "text") {
        el.value = translation;
      } else {
        el.textContent = translation;
      }
    });

    qsa("[data-translate-title]").forEach((el) => {
      const key = el.getAttribute("data-translate-title");
      el.title = this.get(key);
    });

    qsa("[data-translate-alt]").forEach((el) => {
      const key = el.getAttribute("data-translate-alt");
      el.alt = this.get(key);
    });

    Theme.updateTitle();

    document.documentElement.lang = state.lang;
    Language.updateCurrentDisplay();

    const cvLink = qs('a[href*="cv"]');
    if (cvLink) {
      cvLink.href =
        state.lang === "pt" ? "imagens/cv.pdf" : "imagens/cv_EN.pdf";
    }

    document.title = `Paulo Henrique | ${this.get("home.role")}`;
  },
};

const Skills = {
  render() {
    const section = el("skills-section");
    section.innerHTML = "";

    Object.entries(state.skills).forEach(([categoria, itens]) => {
      const categoryTranslated =
        translations[state.lang].skills[categoria] || categoria;

      section.innerHTML += `
        <h3 class="knowledge-title">${categoryTranslated}</h3>
        <div class="knowledge-grid">
          ${itens.map((skill) => this.renderSkillItem(skill)).join("")}
        </div>
      `;
    });
  },

  renderSkillItem(skill) {
    return `
      <div class="knowledge-item">
        <img src="${skill.imagem}" alt="${skill.nome}" title="${skill.nome}" />
        <p>${skill.nome}</p>
      </div>
    `;
  },

  async load() {
    try {
      const response = await fetch("js/habilidades.json");
      if (!response.ok) throw new Error("Failed to load skills");

      state.skills = await response.json();
      this.render();
    } catch (error) {
      el("skills-section").innerHTML = "<p>Unable to load skills.</p>";
      console.error("Erro ao carregar habilidades:", error);
    }
  },
};

const Projects = {
  render() {
    const clickToSee = translations[state.lang].projects.clickToSee;

    DOM.container.innerHTML = state.projects
      .map(
        (project) => `
      <div class="galery-image" data-id="${project.id}" style="background-image:url('${project.imagem}')">
        <div class="overlay-text">${clickToSee}</div>
      </div>
    `,
      )
      .join("");

    qsa(".galery-image").forEach((img) => {
      img.addEventListener("click", () => Modal.open(img.dataset.id));
    });

    TiltEffect.bind(qsa(".galery-image"));
  },

  async load() {
    try {
      const response = await fetch("js/projetos.json");
      state.projects = await response.json();
      this.render();
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  },
};

const TiltEffect = {
  maxTilt: 8,

  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  bind(elements) {
    if (this.prefersReducedMotion() || window.matchMedia("(hover: none)").matches) {
      return;
    }

    elements.forEach((el) => {
      el.addEventListener("mousemove", (e) => this.handleMove(e, el));
      el.addEventListener("mouseleave", () => this.reset(el));
    });
  },

  handleMove(e, el) {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    const tiltY = (px - 0.5) * this.maxTilt * 2;
    const tiltX = (0.5 - py) * this.maxTilt * 2;

    el.style.setProperty("--tilt-x", `${tiltX}deg`);
    el.style.setProperty("--tilt-y", `${tiltY}deg`);
    el.style.setProperty("--spot-x", `${px * 100}%`);
    el.style.setProperty("--spot-y", `${py * 100}%`);
  },

  reset(el) {
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  },
};

const Modal = {
  open(id) {
    const project = state.projects.find((p) => p.id === id);
    if (!project) return;

    const projectTrans = translations[state.lang].projects.items[
      project.id
    ] || {
      titulo: project.titulo,
      descricao: project.descricao,
    };

    DOM.modalImg.src = project.imagem;
    DOM.modalImg.alt = `${translations[state.lang].modal.projectImageAlt}: ${projectTrans.titulo}`;
    DOM.modalTitle.textContent = projectTrans.titulo;
    DOM.modalDesc.textContent = projectTrans.descricao;
    DOM.modalTechnologies.textContent =
      translations[state.lang].projects.technologies + project.tecnologias[0];

    this.configureLink(
      DOM.modalGithub,
      project.github,
      translations[state.lang].modal.githubUnavailable,
    );

    this.configureLink(
      DOM.modalSite,
      project.site,
      translations[state.lang].modal.siteUnavailable,
    );

    DOM.modal.style.display = "flex";
    DOM.modal.classList.add("active");
  },

  close() {
    DOM.modal.classList.remove("active");
  },

  configureLink(element, url, message) {
    if (url === "#") {
      element.href = "#";
      element.onclick = (e) => {
        e.preventDefault();
        Alert.show(message);
      };
    } else {
      element.href = url;
      element.onclick = null;
    }
  },
};

const Alert = {
  show(message) {
    DOM.alertMessage.textContent = message;
    DOM.alertModal.style.display = "flex";
  },

  hide() {
    DOM.alertModal.style.display = "none";
  },
};

const Menu = {
  open() {
    DOM.menu.style.display = "flex";
    DOM.menu.style.height = "0";
    setTimeout(() => (DOM.menu.style.height = CONFIG.MENU_HEIGHT), 10);
    DOM.btnMenu.style.display = "none";
    DOM.btnClose.style.display = "inline";
  },

  close() {
    DOM.menu.style.height = "0";
    setTimeout(() => (DOM.menu.style.display = "none"), 400);
    DOM.btnMenu.style.display = "inline";
    DOM.btnClose.style.display = "none";
  },

  adjust() {
    const isDesktop = window.innerWidth >= CONFIG.DESKTOP_WIDTH;
    DOM.btnMenu.style.display = isDesktop ? "none" : "inline";
    DOM.btnClose.style.display = "none";
    DOM.menu.style.display = isDesktop ? "flex" : "none";
    DOM.menu.style.height = isDesktop ? "15vh" : "0";
    this.updateScroll();
  },

  updateScroll() {
    const isActive =
      window.scrollY > 0 && window.innerWidth >= CONFIG.DESKTOP_WIDTH;
    DOM.menu.classList.toggle("ativo", isActive);
    DOM.header.classList.toggle("ativo", isActive);
  },
};

const Theme = {
  toggle() {
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", state.theme);

    DOM.body.classList.toggle("light-theme", state.theme === "light");
    this.updateIcon();
    this.updateTitle();
  },

  updateIcon() {
    const svgIcon = DOM.btnTheme.querySelector("svg");
    svgIcon.innerHTML =
      state.theme === "light" ? CONFIG.SVG_ICONS.light : CONFIG.SVG_ICONS.dark;
  },

  updateTitle() {
    const key =
      state.theme === "light" ? "theme.toggleDark" : "theme.toggleLight";
    DOM.btnTheme.title = Translation.get(key);
  },

  init() {
    if (state.theme === "light") {
      DOM.body.classList.add("light-theme");
      this.updateIcon();
    }
  },
};

const Language = {
  async set(lang) {
    if (!CONFIG.LANGUAGES[lang] || lang === state.lang) return;
    await loadLanguage(lang);
    state.lang = lang;
    localStorage.setItem("lang", lang);
    Translation.apply();
    Skills.render();
    Projects.render();
  },

  updateCurrentDisplay() {
    const current = CONFIG.LANGUAGES[state.lang];
    if (!current || !DOM.langCurrentFlag || !DOM.langCurrentLabel) return;
    DOM.langCurrentFlag.src = CONFIG.FLAG_URL(current.country);
    DOM.langCurrentFlag.alt = current.label;
    DOM.langCurrentLabel.textContent = current.label;

    qsa("#lang-dropdown-list li").forEach((li) => {
      li.setAttribute("aria-selected", li.dataset.lang === state.lang);
    });
  },

  populateDropdown() {
    if (!DOM.langDropdownList) return;
    DOM.langDropdownList.innerHTML = "";

    Object.entries(CONFIG.LANGUAGES).forEach(([code, { label, country }]) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", code === state.lang);
      li.dataset.lang = code;
      li.innerHTML = `
        <img src="${CONFIG.FLAG_URL(country)}" alt="" />
        <span>${label}</span>
      `;
      li.addEventListener("click", () => {
        this.set(code);
        this.close();
      });
      DOM.langDropdownList.appendChild(li);
    });
  },

  open() {
    this.positionList();
    DOM.langDropdown.classList.add("open");
    DOM.langDropdownList.classList.add("open");
    DOM.langDropdownBtn.setAttribute("aria-expanded", "true");
  },

  positionList() {
    if (!DOM.langDropdownBtn || !DOM.langDropdownList) return;
    const rect = DOM.langDropdownBtn.getBoundingClientRect();
    DOM.langDropdownList.style.top = `${rect.bottom + 8}px`;
    DOM.langDropdownList.style.right = `${window.innerWidth - rect.right}px`;
    DOM.langDropdownList.style.left = "auto";
  },

  close() {
    DOM.langDropdown.classList.remove("open");
    DOM.langDropdownList.classList.remove("open");
    DOM.langDropdownBtn.setAttribute("aria-expanded", "false");
  },

  toggle() {
    DOM.langDropdown.classList.contains("open") ? this.close() : this.open();
  },

  initEvents() {
    DOM.langDropdownBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener("click", (e) => {
      const clickedInside =
        DOM.langDropdown?.contains(e.target) ||
        DOM.langDropdownList?.contains(e.target);
      if (!clickedInside) this.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });

    window.addEventListener("resize", () => this.close());
  },

  async init() {
    this.populateDropdown();
    if (DOM.langDropdownList) document.body.appendChild(DOM.langDropdownList);
    this.initEvents();
    await loadLanguage(state.lang);
    Translation.apply();
  },
};

const Navigation = {
  init() {
    qsa('.menu a[href^="#"]').forEach((link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        const target = qs(href);

        if (window.innerWidth < CONFIG.DESKTOP_WIDTH) Menu.close();

        if (target) {
          if (href === "#home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (href === "#contact" || href === "#knowledge") {
            window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
          } else {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      };
    });

    qsa(".voltar-inicio").forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  },
};

const Events = {
  init() {
    DOM.btnMenu.onclick = () => Menu.open();
    DOM.btnClose.onclick = () => Menu.close();
    DOM.btnTheme?.addEventListener("click", () => Theme.toggle());
    DOM.closeBtn.onclick = () => Modal.close();
    DOM.alertClose.onclick = () => Alert.hide();

    window.onclick = (e) => {
      if (e.target === DOM.modal) Modal.close();
      if (e.target === DOM.alertModal) Alert.hide();
    };

    window.onresize = () => Menu.adjust();
    window.onscroll = () => Menu.updateScroll();
  },
};

const App = {
  async init() {
    Theme.init();
    await Language.init();
    Navigation.init();
    Events.init();
    Menu.adjust();

    await Skills.load();
    await Projects.load();

    AOS.init();
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
