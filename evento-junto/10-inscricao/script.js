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


/* -----------------------------------------------------------
   Pedaço 10 — a inscrição

   De novo: o JavaScript decide QUANDO (coloca e tira as
   classes); o CSS decide COMO (o girando e o tremendo).
   ----------------------------------------------------------- */

const formInscricao = document.querySelector('.form-inscricao');
const campoEmail = document.querySelector('.campo-email');
const botaoEnviar = document.querySelector('.botao-enviar');
const mensagemInscricao = document.querySelector('.mensagem-inscricao');

// A mesma esperar de 30/10: não temos um servidor de verdade,
// então fingimos que o envio demora.
function esperar(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function mostrarMensagem(texto, tipo) {
    mensagemInscricao.textContent = texto;
    mensagemInscricao.classList.remove('erro');
    mensagemInscricao.classList.remove('sucesso');
    if (tipo !== '') {
        mensagemInscricao.classList.add(tipo);
    }
}

// Quando o tremor termina, a classe sai. Assim, num próximo erro,
// ela entra de novo, e o campo treme de novo.
campoEmail.addEventListener('animationend', () => {
    campoEmail.classList.remove('tremendo');
});

formInscricao.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // checkValidity pergunta ao navegador se o campo passa nas
    // regras do HTML: o required e o type="email".
    if (!campoEmail.checkValidity()) {
        mostrarMensagem('Digite um e-mail válido.', 'erro');
        campoEmail.classList.add('tremendo');
        return;
    }

    mostrarMensagem('', '');
    botaoEnviar.classList.add('enviando');
    botaoEnviar.disabled = true;

    await esperar(2000);

    botaoEnviar.classList.remove('enviando');
    botaoEnviar.disabled = false;
    mostrarMensagem('Pronto! A sua vaga está garantida.', 'sucesso');
    formInscricao.reset();
});
