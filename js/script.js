$(document).ready(() => {
    $(window).resize(() => {
        if ($(window).width() >= 768) {
            $('#btn-menu').css('display', 'none');
            $('#btn-close').css('display', 'none');
            $('.menu').css('display', 'flex');
        } else {
            $('#btn-menu').css('display', 'inline');
            $('#btn-close').css('display', 'none');
            $('.menu').css('display', 'none');
        }
    });

    $('#btn-menu').click(() => {
        $('#btn-menu').css('display', 'none');
        $('#btn-close').css('display', 'inline');
        $('.menu').css('display', 'flex');
    });

    $('#btn-close').click(() => {
        $('#btn-menu').css('display', 'inline');
        $('#btn-close').css('display', 'none');
        $('.menu').css('display', 'none');
    });
});


const menuDesktop = $('.menu');
function activeScroll() {
  menuDesktop.toggleClass('ativo', $(window).scrollTop() > 0);
}
$(window).scroll(activeScroll);


const projects = ["One", "Two", "Three", "Four", "Five", "Six"];
projects.forEach((project) => {
  $(document).on('mouseenter', `#project${project}`, () => {
    $(`#btns-pjct${project}`).css('display', 'flex');
  }).on('mouseleave', `#project${project}`, () => {
    $(`#btns-pjct${project}`).css('display', 'none');
  });
});


AOS.init();