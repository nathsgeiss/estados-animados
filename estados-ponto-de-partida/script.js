/* ===========================================================
   Estados do Brasil — o projeto completo

   Estados da tela: carregando, estados na tela, erro.
   =========================================================== */


/* -----------------------------------------------------------
   1. Busca
   ----------------------------------------------------------- */

const URL_DOS_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

// Plano B, se o IBGE não responder (só pelo Live Server):
// const URL_DOS_ESTADOS = 'estados-brasil.json';

// O endereço da busca muda conforme a sigla, como o CEP na ViaCEP.
// montarUrlDosMunicipios('SC') → '.../localidades/estados/SC/municipios'
function montarUrlDosMunicipios(sigla) {
    return 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + sigla + '/municipios';
}

// Serve para as duas buscas: devolve os dados ou lança um erro
// com uma mensagem pronta.
async function buscarDados(url) {
    let resposta;
    try {
        resposta = await fetch(url);
    } catch (erro) {
        throw new Error('Não foi possível falar com o IBGE. Tente de novo.');
    }

    if (!resposta.ok) {
        throw new Error('O IBGE está com problemas. Tente mais tarde.');
    }

    return resposta.json();
}

// await contarMunicipios('SC') → 295
// A API devolve a lista de municípios; só precisamos do tamanho.
async function contarMunicipios(sigla) {
    const municipios = await buscarDados(montarUrlDosMunicipios(sigla));
    return municipios.length;
}


/* -----------------------------------------------------------
   2. Dados
   ----------------------------------------------------------- */

let estados = [];

// A região escolhida nos botões ('' quer dizer todas).
let regiaoEscolhida = '';

// Os favoritos: uma lista de siglas, salva no navegador.
const CHAVE_FAVORITOS = 'estados-favoritos';
let favoritos = carregarFavoritos();
let soFavoritos = false;

// simplificarTexto('Paraná') → 'parana'
function simplificarTexto(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filtrarPorNome(lista, texto) {
    const procurado = simplificarTexto(texto);
    return lista.filter((estado) => simplificarTexto(estado.nome).includes(procurado));
}

function filtrarPorRegiao(lista, regiao) {
    if (regiao === '') {
        return lista;
    }
    return lista.filter((estado) => estado.regiao.nome === regiao);
}

// contarPorRegiao(estados, 'Nordeste') → 9
// contarPorRegiao(estados, '')         → 27
function contarPorRegiao(lista, regiao) {
    return filtrarPorRegiao(lista, regiao).length;
}

function filtrarFavoritos(lista, ligado) {
    if (!ligado) {
        return lista;
    }
    return lista.filter((estado) => favoritos.includes(estado.sigla));
}

// Na primeira vez, ainda não há nada salvo: getItem devolve null.
function carregarFavoritos() {
    const salvos = localStorage.getItem(CHAVE_FAVORITOS);
    if (salvos === null) {
        return [];
    }
    return JSON.parse(salvos);
}

function salvarFavoritos() {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

// Se já é favorito, sai da lista; senão, entra.
function alternarFavorito(sigla) {
    if (favoritos.includes(sigla)) {
        favoritos = favoritos.filter((favorito) => favorito !== sigla);
    } else {
        favoritos.push(sigla);
    }
    salvarFavoritos();
}

// ordenarEstados(estados, 'nome')           → de Acre a Tocantins
// ordenarEstados(estados, 'nome-invertido') → de Tocantins a Acre
// ordenarEstados(estados, 'regiao')         → por região e, dentro dela, por nome
function ordenarEstados(lista, ordem) {
    if (ordem === 'nome-invertido') {
        return lista.toSorted((a, b) => b.nome.localeCompare(a.nome));
    }
    if (ordem === 'regiao') {
        return lista.toSorted((a, b) => {
            if (a.regiao.nome !== b.regiao.nome) {
                return a.regiao.nome.localeCompare(b.regiao.nome);
            }
            return a.nome.localeCompare(b.nome);
        });
    }
    return lista.toSorted((a, b) => a.nome.localeCompare(b.nome));
}


/* -----------------------------------------------------------
   3. Tela
   ----------------------------------------------------------- */

const formulario = document.querySelector('.filtros');
const campoBusca = document.querySelector('.campo-busca');
const campoOrdem = document.querySelector('.campo-ordem');
const botoesRegiao = document.querySelectorAll('.botao-regiao');
const botaoFavoritos = document.querySelector('.botao-favoritos');
const telaStatus = document.querySelector('.status');
const listaDeEstados = document.querySelector('.lista-de-estados');

function mostrarCarregando() {
    telaStatus.textContent = 'Carregando os estados...';
    telaStatus.classList.remove('erro');
    listaDeEstados.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const esqueleto = document.createElement('li');
        esqueleto.classList.add('estado');
        esqueleto.classList.add('esqueleto');
        listaDeEstados.appendChild(esqueleto);
    }
}

function mostrarErro(mensagem) {
    listaDeEstados.innerHTML = '';
    telaStatus.textContent = mensagem;
    telaStatus.classList.add('erro');
}

// A busca dos municípios tem os seus próprios estados da tela,
// dentro do card: buscando, a quantidade, ou o erro.
async function mostrarMunicipios(sigla, card) {
    const telaMunicipios = card.querySelector('.estado-municipios');
    const botao = card.querySelector('.botao-municipios');

    telaMunicipios.textContent = 'Buscando...';
    telaMunicipios.classList.remove('erro');
    botao.disabled = true;
    try {
        const quantidade = await contarMunicipios(sigla);
        telaMunicipios.textContent = quantidade + ' municípios';
    } catch (erro) {
        telaMunicipios.textContent = erro.message;
        telaMunicipios.classList.add('erro');
    } finally {
        botao.disabled = false;
    }
}

function criarCard(estado) {
    const card = document.createElement('li');
    card.classList.add('estado');
    // O CSS escolhe a cor pelo atributo: .estado[data-regiao="Sul"]
    card.dataset.regiao = estado.regiao.nome;

    const sigla = document.createElement('p');
    sigla.classList.add('estado-sigla');
    sigla.textContent = estado.sigla;

    const nome = document.createElement('h2');
    nome.classList.add('estado-nome');
    nome.textContent = estado.nome;

    const regiao = document.createElement('p');
    regiao.classList.add('estado-regiao');
    regiao.textContent = estado.regiao.nome;

    card.appendChild(sigla);
    card.appendChild(nome);
    card.appendChild(regiao);

    const municipios = document.createElement('p');
    municipios.classList.add('estado-municipios');

    const acoes = document.createElement('div');
    acoes.classList.add('estado-acoes');

    const botaoMunicipios = document.createElement('button');
    botaoMunicipios.type = 'button';
    botaoMunicipios.classList.add('botao-municipios');
    botaoMunicipios.textContent = 'Quantos municípios?';
    botaoMunicipios.addEventListener('click', () => {
        mostrarMunicipios(estado.sigla, card);
    });
    acoes.appendChild(botaoMunicipios);

    const botaoFavorito = document.createElement('button');
    botaoFavorito.type = 'button';
    botaoFavorito.classList.add('botao-favorito');
    botaoFavorito.setAttribute('aria-label', 'Favoritar ' + estado.nome);
    if (favoritos.includes(estado.sigla)) {
        botaoFavorito.classList.add('favorito');
        botaoFavorito.textContent = '★';
    } else {
        botaoFavorito.textContent = '☆';
    }
    botaoFavorito.addEventListener('click', () => {
        alternarFavorito(estado.sigla);
        atualizarTela();
    });
    acoes.appendChild(botaoFavorito);

    card.appendChild(municipios);
    card.appendChild(acoes);
    return card;
}

function renderizarEstados(lista) {
    listaDeEstados.innerHTML = '';
    lista.forEach((estado) => {
        listaDeEstados.appendChild(criarCard(estado));
    });
}

function mostrarContagem(quantidade) {
    telaStatus.classList.remove('erro');
    if (quantidade === 0) {
        telaStatus.textContent = 'Nenhum estado encontrado.';
    } else if (quantidade === 1) {
        telaStatus.textContent = '1 estado encontrado.';
    } else {
        telaStatus.textContent = quantidade + ' estados encontrados.';
    }
}

// Cada botão mostra quantos estados da sua região sobraram depois
// da busca (e dos favoritos). A região escolhida não entra na
// conta: senão, todos os outros botões dariam zero.
function atualizarBotoesRegiao(lista) {
    botoesRegiao.forEach((botao) => {
        if (botao.dataset.regiao === regiaoEscolhida) {
            botao.classList.add('ativo');
        } else {
            botao.classList.remove('ativo');
        }
        const quantidade = contarPorRegiao(lista, botao.dataset.regiao);
        botao.querySelector('.quantidade').textContent = '(' + quantidade + ')';
    });
}

// A tela é desenhada a partir da lista na memória, a cada mudança.
function atualizarTela() {
    const peloNome = filtrarPorNome(estados, campoBusca.value);
    const visiveis = filtrarFavoritos(peloNome, soFavoritos);
    const daRegiao = filtrarPorRegiao(visiveis, regiaoEscolhida);
    const encontrados = ordenarEstados(daRegiao, campoOrdem.value);
    renderizarEstados(encontrados);
    mostrarContagem(encontrados.length);
    atualizarBotoesRegiao(visiveis);
}


/* -----------------------------------------------------------
   4. Eventos
   ----------------------------------------------------------- */

async function carregarEstados() {
    mostrarCarregando();
    try {
        estados = await buscarDados(URL_DOS_ESTADOS);
        atualizarTela();
    } catch (erro) {
        mostrarErro(erro.message);
    }
}

campoBusca.addEventListener('input', atualizarTela);

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
});

campoOrdem.addEventListener('change', atualizarTela);

botoesRegiao.forEach((botao) => {
    botao.addEventListener('click', () => {
        regiaoEscolhida = botao.dataset.regiao;
        atualizarTela();
    });
});

botaoFavoritos.addEventListener('click', () => {
    soFavoritos = !soFavoritos;
    if (soFavoritos) {
        botaoFavoritos.classList.add('ativo');
    } else {
        botaoFavoritos.classList.remove('ativo');
    }
    atualizarTela();
});

carregarEstados();
