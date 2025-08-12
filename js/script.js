const el = id => document.getElementById(id);
const container = el("projects-container");
const modal = el("modal");
const modalImg = el("modal-img");
const modalTitle = el("modal-title");
const modalDesc = el("modal-desc");
const modalLanguages = el("modal-languages");
const modalGithub = el("modal-github");
const modalSite = el("modal-site");
const closeBtn = document.querySelector(".close");
const menu = document.querySelector(".menu");
const header = document.querySelector("header");
const btnMenu = el("btn-menu");
const btnClose = el("btn-close");

fetch("js/habilidades.json")
  .then(res => res.ok ? res.json() : Promise.reject())
  .then(data => {
    const section = el("skills-section");
    Object.entries(data).forEach(([categoria, itens]) => {
      section.innerHTML += `
        <h3 class="knowledge-title">${categoria}</h3>
        <div class="knowledge-grid">
          ${itens.map(h => `
            <div class="knowledge-item">
              <img src="${h.imagem}" alt="${h.nome}" title="${h.nome}" />
              <p>${h.nome}</p>
              <p class="description">${h.descricao}</p>
            </div>
          `).join("")}
        </div>`;
    });
  })
  .catch(() => {
    el("skills-section").innerHTML = "<p>Não foi possível carregar as habilidades.</p>";
  });

let projetosData = [];
fetch("js/projetos.json")
  .then(res => res.json())
  .then(data => {
    projetosData = data;
    container.innerHTML = data.map(p => `
      <div class="galery-image" data-id="${p.id}" style="background-image:url('${p.imagem}')">
        <div class="overlay-text">Clique para ver mais.</div>
      </div>
    `).join("");

    document.querySelectorAll(".galery-image").forEach(img => {
      img.addEventListener("click", () => abrirModal(img.dataset.id));
    });
  })
  .catch(() => console.error("Erro ao carregar projetos"));

function abrirModal(id) {
  const p = projetosData.find(proj => proj.id === (id));
  if (!p) return;

  modalImg.src = p.imagem;
  modalTitle.textContent = p.titulo;
  modalDesc.textContent = p.descricao;
  modalLanguages.textContent = "Linguagens: " + p.linguagens;

  configurarLink(modalGithub, p.github, "O link do GitHub está indisponível.");
  configurarLink(modalSite, p.site, "O link do site está indisponível.");

  modal.style.display = "flex";
  modal.classList.add("active");

  const alertModal = el("alert-modal");
  const alertClose = el("alert-close");
  alertClose.onclick = () => alertModal.style.display = "none";
  alertModal.onclick = e => { if (e.target === alertModal) alertModal.style.display = "none"; };
}

function configurarLink(elemento, url, msg) {
  const alertModal = el("alert-modal");
  const alertMsg = el("alert-message");

  if (url === "#") {
    elemento.href = "#";
    elemento.onclick = e => {
      e.preventDefault();
      alertMsg.textContent = msg;
      alertModal.style.display = "flex";
    };
  } else {
    elemento.href = url;
    elemento.onclick = null;
  }
}

closeBtn.onclick = () => {modal.classList.remove("active")}
window.onclick = e => {if (e.target === modal) modal.classList.remove("active")}

function abrirMenu() {
  menu.style.display = "flex";
  menu.style.height = "0";
  setTimeout(() => menu.style.height = "92vh", 10);
  btnMenu.style.display = "none";
  btnClose.style.display = "inline";
}

function fecharMenu() {
  menu.style.height = "0";
  setTimeout(() => menu.style.display = "none", 400);
  btnMenu.style.display = "inline";
  btnClose.style.display = "none";
}

function ajustarMenu() {
  const isDesktop = window.innerWidth >= 768;
  btnMenu.style.display = isDesktop ? "none" : "inline";
  btnClose.style.display = "none";
  menu.style.display = isDesktop ? "flex" : "none";
  menu.style.height = isDesktop ? "15vh" : "0";
  atualizarScroll();
}

function atualizarScroll() {
  const ativo = window.scrollY > 0 && window.innerWidth >= 768;
  menu.classList.toggle("ativo", ativo);
  header.classList.toggle("ativo", ativo);
}

document.addEventListener("DOMContentLoaded", () => {
  btnMenu.onclick = abrirMenu;
  btnClose.onclick = fecharMenu;

  document.querySelectorAll(".menu a").forEach(link => {
    link.onclick = () => { if (window.innerWidth < 768) fecharMenu(); };
  });

  ajustarMenu();
  window.onresize = ajustarMenu;
  window.onscroll = atualizarScroll;
});

document.querySelectorAll('.menu a[href^="#"]').forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  };
});

document.querySelectorAll(".voltar-inicio").forEach(btn => {
  btn.onclick = e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});

AOS.init();