const el = id => document.getElementById(id);
const qs = selector => document.querySelector(selector);
const qsa = selector => document.querySelectorAll(selector);

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
  btnTranslate: el("btn-translate"),
  alertModal: el("alert-modal"),
  alertMessage: el("alert-message"),
  alertClose: el("alert-close")
};

const state = {
  theme: localStorage.getItem("theme") || "dark",
  lang: localStorage.getItem("lang") || "pt",
  skills: {},
  projects: []
};

const CONFIG = {
  DESKTOP_WIDTH: 768,
  MENU_HEIGHT: "92vh",
  SVG_ICONS: {
    light: `<path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5"/>`,
    dark: `<path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>`
  }
};

const translations = {
  pt: {
    nav: { home: "Início", about: "Sobre", skills: "Habilidades", projects: "Projetos", contact: "Contato" },
    home: {
      welcome: "Bem Vindo ao meu Portfólio, eu sou o",
      role: "Desenvolvedor Full Stack",
      github: "Meu GitHub",
      linkedin: "Meu Linkedin",
      email: "Meu E-mail"
    },
    about: {
      title: "Sobre",
      text: "Meu nome é Paulo Henrique, tenho 20 anos, e sou apaixonado por tecnologia, adoro desafios, aprender novas tecnologias e trabalhar em equipe. Sou Desenvolvedor Full Stack com formação técnica em Informática para Internet, trabalho com front-end, back-end, banco de dados e desenvolvimento mobile. Minha jornada começou com projetos pessoais como o \"Oishi\" e o \"SuperPizza\", onde aprendi a criar interfaces intuitivas e boas práticas de código, buscando sempre melhorar a experiência do usuário e garantir o funcionamento da aplicação. Fora do código, você me encontra jogando, assistindo filmes, lendo livros ou escutando música. Quer conhecer meu trabalho? Veja meus projetos abaixo ou",
      download: "baixe meu currículo!"
    },
    skills: {
      title: "Habilidades",
      "Front-end": "Front-end",
      "Back-end": "Back-end",
      "Mobile": "Mobile",
      "Banco de Dados": "Banco de Dados",
      descriptions: {
        "Estrutura de páginas.": "Estrutura de páginas.",
        "Estilo e layout.": "Estilo e layout.",
        "Interatividade em aplicações.": "Interatividade em aplicações.",
        "Tipagem para JavaScript.": "Tipagem para JavaScript.",
        "Manipulação de DOM.": "Manipulação de DOM.",
        "Construção de interfaces.": "Construção de interfaces.",
        "Framework para SPAs.": "Framework para SPAs.",
        "Execução de JS no servidor.": "Execução de JS no servidor.",
        "Desenvolvimento de APIs.": "Desenvolvimento de APIs.",
        "APIs escaláveis e performáticas.": "APIs escaláveis e performáticas.",
        "Conteinerização de ambientes.": "Conteinerização de ambientes.",
        "Aplicações móveis nativas.": "Aplicações móveis nativas.",
        "Desenvolvimento com React Native.": "Desenvolvimento com React Native.",
        "Desenvolvimento Android.": "Desenvolvimento Android.",
        "Banco de dados relacional.": "Banco de dados relacional.",
        "Banco de dados não relacional.": "Banco de dados não relacional."
      }
    },
    projects: {
      title: "Projetos",
      clickToSee: "Clique para ver mais",
      technologies: "Tecnologias: ",
      items: {
        project1: { titulo: "InvestCalcula", descricao: "Calculadora de juros compostos." },
        project2: { titulo: "Lista de Tarefas", descricao: "Aplicação simples para gerenciar tarefas diárias." },
        project3: { titulo: "Galleria", descricao: "Galeria de imagens online com layout moderno." },
        project4: { titulo: "ERP Soul", descricao: "Software de ERP corporativo." },
        project5: { titulo: "Seven Plus", descricao: "Site para exibição de conteúdos." },
        project6: { titulo: "Seven Plus (Mobile)", descricao: "Aplicativo para exibição de conteúdos." },
        project7: { titulo: "Viajados", descricao: "Aplicativo de viagens." },
        project8: { titulo: "Oishi", descricao: "Site de restaurante japonês." },
        project9: { titulo: "Mario Runs", descricao: "Jogo de navegador do Mario." },
        project10: { titulo: "Super Pizza", descricao: "Site para pizzaria." },
        project11: { titulo: "Calculadora", descricao: "Calculadora simples." },
        project12: { titulo: "Minhas Conquistas", descricao: "Um website simples e elegante para guardar suas conquistas, elogios, aprendizados e momentos felizes." }
      }
    },
    modal: {
      close: "Fechar",
      github: "GitHub",
      site: "Site",
      githubUnavailable: "O link do GitHub está indisponível.",
      siteUnavailable: "O link do site está indisponível."
    },
    contact: { title: "Contato", email: "E-mail:", back: "Voltar ao Início" }
  },
  en: {
    nav: { home: "Home", about: "About", skills: "Skills", projects: "Projects", contact: "Contact" },
    home: {
      welcome: "Welcome to my Portfolio, I am",
      role: "Full Stack Developer",
      github: "My GitHub",
      linkedin: "My Linkedin",
      email: "My E-mail"
    },
    about: {
      title: "About",
      text: "My name is Paulo Henrique, I'm 20 years old, and I'm passionate about technology, I love challenges, learning new technologies and working in a team. I'm a Full Stack Developer with a technical degree in Internet Computing, I work with front-end, back-end, databases and mobile development. My journey started with personal projects like \"Oishi\" and \"SuperPizza\", where I learned to create intuitive interfaces and good code practices, always seeking to improve the user experience and ensure the application works. Outside of code, you can find me gaming, watching movies, reading books or listening to music. Want to see my work? Check out my projects below or",
      download: "download my resume!"
    },
    skills: {
      title: "Skills",
      "Front-end": "Front-end",
      "Back-end": "Back-end",
      "Mobile": "Mobile",
      "Banco de Dados": "Database",
      descriptions: {
        "Estrutura de páginas.": "Page structure.",
        "Estilo e layout.": "Style and layout.",
        "Interatividade em aplicações.": "Interactivity in applications.",
        "Tipagem para JavaScript.": "Typing for JavaScript.",
        "Manipulação de DOM.": "DOM manipulation.",
        "Construção de interfaces.": "Interface building.",
        "Framework para SPAs.": "Framework for SPAs.",
        "Execução de JS no servidor.": "Server-side JS execution.",
        "Desenvolvimento de APIs.": "API development.",
        "APIs escaláveis e performáticas.": "Scalable and performant APIs.",
        "Conteinerização de ambientes.": "Environment containerization.",
        "Aplicações móveis nativas.": "Native mobile applications.",
        "Desenvolvimento com React Native.": "React Native development.",
        "Desenvolvimento Android.": "Android development.",
        "Banco de dados relacional.": "Relational database.",
        "Banco de dados não relacional.": "Non-relational database."
      }
    },
    projects: {
      title: "Projects",
      clickToSee: "Click to see more",
      technologies: "Technologies: ",
      items: {
        project1: { titulo: "InvestCalcula", descricao: "Compound interest calculator." },
        project2: { titulo: "To-Do List", descricao: "Simple application to manage daily tasks." },
        project3: { titulo: "Galleria", descricao: "Online image gallery with modern layout." },
        project4: { titulo: "ERP Soul", descricao: "Corporate ERP software." },
        project5: { titulo: "Seven Plus", descricao: "Content streaming website." },
        project6: { titulo: "Seven Plus (Mobile)", descricao: "Content streaming app." },
        project7: { titulo: "Viajados", descricao: "Travel tracking app." },
        project8: { titulo: "Oishi", descricao: "Japanese restaurant website." },
        project9: { titulo: "Mario Runs", descricao: "Browser-based Mario game." },
        project10: { titulo: "Super Pizza", descricao: "Pizzeria website." },
        project11: { titulo: "Calculator", descricao: "Simple calculator." },
        project12: { titulo: "My Achievements", descricao: "A simple and elegant website to save your achievements, compliments, learnings, and happy moments." }
      }
    },
    modal: {
      close: "Close",
      github: "GitHub",
      site: "Site",
      githubUnavailable: "The GitHub link is unavailable.",
      siteUnavailable: "The site link is unavailable."
    },
    contact: { title: "Contact", email: "Email:", back: "Back to Top" }
  }
};

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
    qsa("[data-translate]").forEach(el => {
      const key = el.getAttribute("data-translate");
      const translation = this.get(key);

      if (el.tagName === "INPUT" && el.type === "text") {
        el.value = translation;
      } else {
        el.textContent = translation;
      }
    });

    qsa("[data-translate-title]").forEach(el => {
      const key = el.getAttribute("data-translate-title");
      el.title = this.get(key);
    });

    document.documentElement.lang = state.lang;
    DOM.btnTranslate.title = state.lang === "pt"
      ? "Translate to English"
      : "Traduzir para Português";

    const cvLink = qs('a[href*="cv"]');
    if (cvLink) {
      cvLink.href = state.lang === "pt" ? "imagens/cv.pdf" : "imagens/cv_EN.pdf";
    }

    document.title = state.lang === "pt"
      ? "Paulo Henrique | Desenvolvedor Full Stack"
      : "Paulo Henrique | Full Stack Developer";
  }
};

const Skills = {
  render() {
    const section = el("skills-section");
    section.innerHTML = "";

    Object.entries(state.skills).forEach(([categoria, itens]) => {
      const categoryTranslated = translations[state.lang].skills[categoria] || categoria;

      section.innerHTML += `
        <h3 class="knowledge-title">${categoryTranslated}</h3>
        <div class="knowledge-grid">
          ${itens.map(skill => this.renderSkillItem(skill)).join("")}
        </div>
      `;
    });
  },

  renderSkillItem(skill) {
    const descTranslated = translations[state.lang].skills.descriptions[skill.descricao] || skill.descricao;
    return `
      <div class="knowledge-item">
        <img src="${skill.imagem}" alt="${skill.nome}" title="${skill.nome}" />
        <p>${skill.nome}</p>
        <p class="description">${descTranslated}</p>
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
      el("skills-section").innerHTML = "<p>Não foi possível carregar as habilidades.</p>";
      console.error("Erro ao carregar habilidades:", error);
    }
  }
};

const Projects = {
  render() {
    const clickToSee = translations[state.lang].projects.clickToSee;

    DOM.container.innerHTML = state.projects.map(project => `
      <div class="galery-image" data-id="${project.id}" style="background-image:url('${project.imagem}')">
        <div class="overlay-text">${clickToSee}</div>
      </div>
    `).join("");

    qsa(".galery-image").forEach(img => {
      img.addEventListener("click", () => Modal.open(img.dataset.id));
    });
  },

  async load() {
    try {
      const response = await fetch("js/projetos.json");
      state.projects = await response.json();
      this.render();
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }
};

const Modal = {
  open(id) {
    const project = state.projects.find(p => p.id === id);
    if (!project) return;

    const projectTrans = translations[state.lang].projects.items[project.id] || {
      titulo: project.titulo,
      descricao: project.descricao
    };

    DOM.modalImg.src = project.imagem;
    DOM.modalTitle.textContent = projectTrans.titulo;
    DOM.modalDesc.textContent = projectTrans.descricao;
    DOM.modalTechnologies.textContent = translations[state.lang].projects.technologies + project.tecnologias[0];

    this.configureLink(
      DOM.modalGithub,
      project.github,
      translations[state.lang].modal.githubUnavailable
    );

    this.configureLink(
      DOM.modalSite,
      project.site,
      translations[state.lang].modal.siteUnavailable
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
      element.onclick = e => {
        e.preventDefault();
        Alert.show(message);
      };
    } else {
      element.href = url;
      element.onclick = null;
    }
  }
};

const Alert = {
  show(message) {
    DOM.alertMessage.textContent = message;
    DOM.alertModal.style.display = "flex";
  },

  hide() {
    DOM.alertModal.style.display = "none";
  }
};

const Menu = {
  open() {
    DOM.menu.style.display = "flex";
    DOM.menu.style.height = "0";
    setTimeout(() => DOM.menu.style.height = CONFIG.MENU_HEIGHT, 10);
    DOM.btnMenu.style.display = "none";
    DOM.btnClose.style.display = "inline";
  },

  close() {
    DOM.menu.style.height = "0";
    setTimeout(() => DOM.menu.style.display = "none", 400);
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
    const isActive = window.scrollY > 0 && window.innerWidth >= CONFIG.DESKTOP_WIDTH;
    DOM.menu.classList.toggle("ativo", isActive);
    DOM.header.classList.toggle("ativo", isActive);
  }
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
    svgIcon.innerHTML = state.theme === "light"
      ? CONFIG.SVG_ICONS.light
      : CONFIG.SVG_ICONS.dark;
  },

  updateTitle() {
    DOM.btnTheme.title = state.theme === "light"
      ? "Toggle Dark Theme"
      : "Toggle Light Theme";
  },

  init() {
    if (state.theme === "light") {
      DOM.body.classList.add("light-theme");
      this.updateIcon();
    }
    this.updateTitle();
  }
};

const Language = {
  toggle() {
    state.lang = state.lang === "pt" ? "en" : "pt";
    localStorage.setItem("lang", state.lang);
    Translation.apply();
    Skills.render();
    Projects.render();
  }
};

const Navigation = {
  init() {
    qsa('.menu a[href^="#"]').forEach(link => {
      link.onclick = e => {
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

    qsa(".voltar-inicio").forEach(btn => {
      btn.onclick = e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  }
};

const Events = {
  init() {
    DOM.btnMenu.onclick = () => Menu.open();
    DOM.btnClose.onclick = () => Menu.close();
    DOM.btnTheme?.addEventListener("click", () => Theme.toggle());
    DOM.btnTranslate?.addEventListener("click", () => Language.toggle());
    DOM.closeBtn.onclick = () => Modal.close();
    DOM.alertClose.onclick = () => Alert.hide();

    window.onclick = e => {
      if (e.target === DOM.modal) Modal.close();
      if (e.target === DOM.alertModal) Alert.hide();
    };

    window.onresize = () => Menu.adjust();
    window.onscroll = () => Menu.updateScroll();
  }
};

const App = {
  async init() {
    Theme.init();
    Translation.apply();
    Navigation.init();
    Events.init();
    Menu.adjust();

    await Skills.load();
    await Projects.load();

    AOS.init();
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());