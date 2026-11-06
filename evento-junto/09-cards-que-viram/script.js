/* ===========================================================
   Semana da Tecnologia — o JavaScript

   Quase tudo hoje é CSS. O JavaScript só entra no pedaço 7,
   para abrir e fechar o menu no celular, e no pedaço 10, para
   a inscrição.
   =========================================================== */


/* -----------------------------------------------------------
   Pedaço 7 — o menu no celular

   O JavaScript só decide QUANDO: coloca e tira a classe
   "aberto". COMO o menu abre é com o CSS (a transition).
   ----------------------------------------------------------- */

const botaoMenu = document.querySelector('.botao-menu');
const menu = document.querySelector('.menu');
const linksDoMenu = document.querySelectorAll('.menu a');

// toggle: se a classe está lá, tira; se não está, coloca.
// O aria-expanded avisa o leitor de tela se o menu está aberto.
function alternarMenu() {
    menu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', menu.classList.contains('aberto'));
}

function fecharMenu() {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
}

botaoMenu.addEventListener('click', alternarMenu);

// Escolheu um link: o menu fecha, e a página rola até a seção
linksDoMenu.forEach((link) => {
    link.addEventListener('click', fecharMenu);
});
