const menu = $('.menu');
const header = $('header');

function abrirMenu() {
  menu.css({ display: 'flex', height: '0' }).animate({ height: '92vh' }, 400);
  $('#btn-menu').css('display', 'none');
  $('#btn-close').css('display', 'inline');
}

function fecharMenu() {
  menu.css({ height: '92vh' }).animate({ height: '0' }, 400);
  $('#btn-menu').css('display', 'inline');
  $('#btn-close').css('display', 'none');
}

function activeScroll() {
  if ($(window).width() >= 768) {
    menu.toggleClass('ativo', $(window).scrollTop() > 0);
    header.toggleClass('ativo', $(window).scrollTop() > 0);
  } else {
    menu.removeClass('ativo');
    header.removeClass('ativo');
  }
}

$(document).ready(() => {
  $('#btn-menu').click(abrirMenu);
  $('#btn-close').click(fecharMenu);
  
  $('.menu a').click(function(e) {
    if ($(window).width() < 768) {
      fecharMenu();
    }
  });

  function ajustarMenu() {
    if ($(window).width() >= 768) {
      $('#btn-menu').hide();
      $('#btn-close').hide();
      menu.css({ display: 'flex', height: '15vh' });
    } else {
      $('#btn-menu').show();
      $('#btn-close').hide();
      menu.css({ display: 'none', height: '0' });
    }

    activeScroll();
  }

  ajustarMenu();
  $(window).resize(ajustarMenu);
  $(window).on('scroll', activeScroll);
});

$('.menu a[href^="#"]').click(function(e) {
  e.preventDefault();
  
  const target = $($(this).attr('href'));
  if (target.length) {
    $('html, body').animate({ scrollTop: target.offset().top }, 600);
  }
});

const projects = ["One", "Two", "Three", "Four", "Five", "Six"];
projects.forEach((project) => {
  $(document).on('mouseenter', `#project${project}`, () => {
    $(`#btns-pjct${project}`).css('display', 'flex');
  }).on('mouseleave', `#project${project}`, () => {
    $(`#btns-pjct${project}`).css('display', 'none');
  });
});

$('.voltar-inicio').click(function (e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, 600);
});

AOS.init();