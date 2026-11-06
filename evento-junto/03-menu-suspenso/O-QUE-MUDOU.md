# Pedaço 3 · o menu suspenso

**O que é novo:**

- o `:hover` no pai mudando o filho (`.tem-submenu:hover .submenu`);
- o `position: relative` no item e o `absolute` na lista, que abre por cima
  da página, sem empurrar nada;
- a lista escondida com `opacity`, `visibility` e `transform: scaleY(0)`,
  porque o `display` não pode ser animado.

**Arquivos modificados**

- `style.css`:
  - a regra `.submenu { display: none; }` da parte do topo foi **apagada**;
  - o bloco "Pedaço 3", no fim do arquivo.
