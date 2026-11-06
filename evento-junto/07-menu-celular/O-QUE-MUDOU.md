# Pedaço 7 · o menu no celular

**O que é novo:**

- o `@media (max-width: 699px)`, que vale até 699px, o contrário do
  `min-width`;
- o menu fechado com `max-height: 0`, que abre com `transition` quando
  ganha a classe `aberto`;
- no JavaScript, o `classList.toggle` e o `aria-expanded`.

No celular, aparece o botão ☰. Ele abre e fecha o menu, deslizando. A lista
de dentro fica sempre aberta, porque não existe "mouse em cima" no toque.

**Arquivos modificados**

- `style.css`: o bloco "Pedaço 7", no fim do arquivo.
- `script.js`: o código inteiro, pela primeira vez. O botão abre e fecha o
  menu, e qualquer link do menu o fecha.
