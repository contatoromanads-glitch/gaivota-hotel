

## Plano: Seção Histórica de Eldorado dos Carajás na Home

### O que será feito

Adicionar uma seção rica e imersiva sobre a história de Eldorado dos Carajás antes da seção CTA final na página Home. A seção terá conteúdo aprofundado sobre garimpos, mineração, Serra Pelada, a Província Mineral de Carajás e as bacias leiteiras, com animações interativas e criativas, projetada mobile-first.

### Estrutura da seção

A seção será dividida em blocos visuais distintos:

1. **Timeline Interativa** — Uma linha do tempo vertical (mobile) / horizontal (desktop) com marcos históricos:
   - Década de 1970: Descoberta dos minérios na Serra dos Carajás
   - 1980: Serra Pelada — o maior garimpo a céu aberto do mundo
   - 1991: Criação do município de Eldorado dos Carajás
   - Anos 2000+: Consolidação como polo agropecuário e bacias leiteiras
   - Atualidade: Projeto Carajás da Vale e economia diversificada

2. **Cards de Curiosidades** — Cards animados com dados curiosos:
   - Quantidade de ouro extraída de Serra Pelada
   - A Província Mineral de Carajás como maior reserva de ferro do mundo
   - Produção leiteira da região
   - Biodiversidade da Floresta Nacional de Carajás

3. **Contador Animado** — Números que "contam" ao entrar na viewport (ex: "18 bilhões de toneladas de ferro", "100+ toneladas de ouro", etc.)

### Animações inovadoras

- **Parallax suave** no background da seção com textura de terra/minério via CSS gradient
- **Reveal progressivo** na timeline: cada item aparece com stagger ao scroll
- **Cards com flip 3D** ao hover/tap nas curiosidades (frente = título, verso = detalhe)
- **Contadores numéricos animados** que incrementam de 0 ao valor final ao entrar na viewport
- **Gradiente animado** sutil no fundo da seção simulando camadas de terra

### Arquivos alterados

1. **`src/components/HistorySection.tsx`** (novo) — Componente completo com timeline, cards flip, contadores animados
2. **`src/pages/Index.tsx`** — Importar e inserir `<HistorySection />` antes da seção CTA
3. **`src/i18n/locales/pt.json`** — Adicionar todas as strings da seção histórica em `home.history.*`
4. **`src/i18n/locales/en.json`** — Traduções em inglês
5. **`src/i18n/locales/es.json`** — Traduções em espanhol
6. **`src/i18n/locales/zh.json`** — Traduções em mandarim
7. **`src/index.css`** — Keyframes para flip 3D, gradiente animado de terra, e parallax

### Mobile-first

- Timeline vertical empilhada no mobile, horizontal no desktop
- Cards de curiosidades em coluna única no mobile, grid 2x2 no desktop
- Contadores em grid 2x2 mobile, 4 colunas desktop
- Touch-friendly: cards flip funcionam com tap no mobile

