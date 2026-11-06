# Animando os Estados do Brasil — o gabarito

A atividade individual depois da Semana da Tecnologia:
`alunos/atividade-animacoes.md`.

## O ponto de partida serve para todo mundo

O `alunos/estados-ponto-de-partida` é o projeto dos estados **completo**, o
mesmo do gabarito do passo 9 da atividade de 04/11. Quem faltou não precisa
ter feito o projeto: a atividade é quase toda CSS. A introdução do enunciado
explica, em três linhas, as três coisas do JavaScript que os passos 5 e 6
usam (`criarCard` e `atualizarTela`, `regiaoEscolhida`, `mostrarMunicipios`).

Quem fez o projeto em 04/11 pode usar o próprio, se estiver completo. Mas,
para todo mundo partir do mesmo lugar, o ponto de partida é o mais seguro.

## O que mudou em relação ao ponto de partida

- `index.html`: o menu "Regiões ▾" no `<header>` e a seção "Sobre os dados"
  no fim do `<main>`. Os dois trechos são dados prontos no enunciado.
- `style.css`: um bloco no fim, com um comentário para cada passo.
- `script.js`:
  - na `mostrarMunicipios`, o `classList.add('buscando')` depois do
    "Buscando...", e o `classList.remove('buscando')` no `finally`;
  - o `querySelectorAll('.opcao-regiao')` e o evento de clique das opções do
    menu, que muda a `regiaoEscolhida`, chama a `atualizarTela` e tira o foco
    com `blur()`.

## O que é novo no enunciado (com explicação)

- o `:not(.esqueleto)`, no passo 3, para a entrada não valer para os cards
  cinza do carregando;
- o `blur()`, no passo 5, para o menu fechar depois do clique.

## As partes que mais vão travar

- **Passo 3:** com `.estado { animation: surgir ... }`, os cards cinza param
  de piscar e passam a "surgir", porque a regra nova vem depois da do
  `.esqueleto` e vence. É o motivo do `:not`.
- **Passo 4:** o `position: relative` vai no `.tem-submenu`, e não no
  `.menu-regioes` (senão a lista abre no canto errado).
- **Passo 6:** quem tirar a classe `buscando` só no `try` deixa o erro
  piscando para sempre. Tem que ser no `finally`.

## Testado

No navegador, com a lista de estados simulada:

- o ponto de partida carrega os 27 estados;
- no gabarito, os cards surgem e o esqueleto continua piscando;
- o card sobe 6px;
- o menu abre com o mouse;
- o Sul no menu dá 3 estados e destaca o botão Sul;
- o menu fecha quando o mouse sai;
- a mensagem dos municípios ganha e perde a classe `buscando`;
- a resposta da pergunta anima;
- com o "reduce", nada anima.
