# Stellar Debut Invitation

Objetivo: Crie uma aplicação web interativa em React para um convite/anúncio de festa de 15 anos ("Save the Date") com tema astronômico/céu estrelado, seguindo estritamente a paleta de cores e a estética do material fornecido.

1. Paleta de Cores e Texturas de Fundo
Utilize exatamente esta paleta de cores fornecida na imagem de referência:

Azul Noturno Profundo / Azul Marinho: #171830 e #1c1d38 (usado para as áreas mais escuras das bordas e fundo).

Azul Índigo / Roxo Cósmico: #2d2f5a e #3b3e6d (usado para o brilho central do gradiente e transições no céu).

Ocre Dourado / Bege Pastel: #b89668 e #d2b38c (usado para detalhes dourados sutis e acentos).

Branco Puro e Prata: #ffffff e #f0f4f8 (usado para o texto, estrelas e brilhos).

Efeitos de Fundo (Textura e Atmosfera):

Gradiente Radial: Aplique um gradiente suave no fundo (radial-gradient(circle at center, #3b3e6d 0%, #2d2f5a 45%, #171830 100%)).

Ruído e Granulado (Grain/Noise Overlay): Adicione uma camada de textura de ruído/granulado sutil com baixa opacidade (opacity: 0.05 a 0.08) por cima do fundo para dar um aspecto elegante e impresso.

Névoa / Poeira Cósmica: Adicione um efeito de névoa brilhante e difusa no centro da tela para contrastar com as estrelas.

Campo de Estrelas: Animação de estrelas cintilantes e poeira estelar flutuante usando @tsparticles/react ou Canvas/Three.js.

Elemento Lua: Uma lua crescente com brilho suave (glow) posicionada no canto superior esquerdo da tela.

2. Tipografia Exata (Importar do Google Fonts)
Configure e aplique no CSS/Tailwind as três fontes do projeto:

Poiret One (font-family: 'Poiret One', cursive;): Usada para o nome da debutante "GABRIELA", números grandes e títulos principais.

Parisienne (font-family: 'Parisienne', cursive;): Usada para o estilo manuscrito nas palavras "Save The Date", o mês "Outubro" e a palavra "15".

Julius Sans One (font-family: 'Julius Sans One', sans-serif;): Usada para datas numéricas e frases de apoio em caixa alta.

3. Sequência de Cenas e Animações (Baseadas no Vídeo)
Crie uma sequência fluida de transições usando framer-motion:

Cena 1 - Abertura do Portão:

Dois portões de ferro trabalhado em estilo clássico/vitoriano se abrem do centro para as laterais com animação suave, revelando o fundo estrelado e granulado.

Cena 2 - Save the Date:

Partículas brilhantes formam um movimento espiral/circular, desenhando na tela o texto "Save The Date" em prata reluzente (fonte Parisienne).

Cena 3 - A Data:

Rastro de estrela cadente em espiral revelando em sequência:

O número grande "29" (fonte Poiret One).

O mês "Outubro" (fonte Parisienne).

O ano "2026" (fonte Julius Sans One).

Cena 4 - A Debutante e a Frase:

Galáxia em espiral giratória surge no centro.

No centro da espiral aparece o nome "GABRIELA" com a legenda "XV anos".

Transiciona para a frase:

"SOB UM CÉU DE SONHOS E ESTRELAS, UMA NOITE ESTRELADA NOS ESPERA!"

Finaliza com a chamada para ação (CTA):

"CONFIRME A SUA PRESENÇA PARA RECEBER O CONVITE OFICIAL!"

Adicione um botão interativo e elegante para confirmação de presença (RSVP).

4. Tecnologias e Bibliotecas
Framework: React com Tailwind CSS.

Animações de Interface: framer-motion.

Partículas / Estrelas: @tsparticles/react ou @react-three/fiber / @react-three/drei.

Ícones: lucide-react.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1c14f2fa-b0eb-42ec-90c3-0de8d903f683).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
