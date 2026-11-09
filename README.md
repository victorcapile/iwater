# iWater

Aplicativo para registrar o consumo de água da casa, acompanhar o histórico e descobrir
curiosidades sobre a água. O projeto original é de 2013/2014; esta versão mantém a
identidade visual — o azul, a tipografia Open Sans, os blocos de ícones, o boneco que
enche d'água e a gota das curiosidades — com uma base técnica atual.

## O que mudou

- **React 19 + TypeScript + Vite** no lugar de páginas HTML estáticas, jQuery e Modernizr.
- **Tailwind CSS 4** para um layout responsivo, com a paleta e os componentes visuais do
  iWater original.
- **React Router** com rotas em hash, sem depender de configuração de servidor.
- **Recharts** para a evolução dos últimos 7 dias, mantendo o gráfico do boneco d'água
  como elemento principal.
- **Lucide** para os ícones e **Sonner** para as mensagens de sucesso/erro.
- **date-fns** para datas em português, com o dia local correto (o original usava UTC).
- **PWA** com `vite-plugin-pwa`: dá para instalar na tela de início e usar offline.
- **Backup em JSON** para exportar e importar os registros.
- **Validação e testes** com Vitest para o cálculo de consumo e o armazenamento.
- Acessibilidade: navegação por teclado, foco visível, textos alternativos, contraste e
  respeito a `prefers-reduced-motion`.

## Rodando o projeto

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

O Vite mostra o endereço local (normalmente `http://localhost:5173`).

Outros comandos:

```bash
npm run build    # checagem de tipos + build de produção em dist/
npm run preview  # serve o build de produção
npm test         # roda os testes
```

## Estrutura

```text
src/
  components/       AppShell, cabeçalho, gráfico do boneco, ícones, diálogos...
  data/             atividades e curiosidades preservadas do projeto original
  hooks/            leitura reativa do histórico
  lib/              cálculo de consumo, armazenamento e formatação
  pages/            início, novo consumo, histórico, gráficos, curiosidades e sobre
  App.tsx           rotas
  index.css         tema, identidade visual e componentes
public/
  img/              imagens do gráfico do boneco
  icon-192.png      ícones do PWA
  icon-512.png
```

## Dados e privacidade

Os registros ficam no `localStorage` do navegador, com a mesma estrutura da versão
original: uma chave por dia no formato `AAAA-MM-DD` e uma lista de consumos
(`tipo`, `gasto`, `duracao` etc.). Nada é enviado para servidores.

Na página **Histórico** é possível:

- remover um consumo individual (com opção de desfazer);
- excluir um dia inteiro;
- exportar um backup `iwater-backup-AAAA-MM-DD.json`;
- importar um backup e mesclar os registros sem duplicar consumos idênticos;
- apagar todos os dados locais.

## Deploy

O build gera arquivos estáticos em `dist/`. Como as rotas usam `HashRouter`, o app
funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, S3 etc.) sem
precisar de regra de fallback no servidor.

O `base` do Vite está configurado como `./`, então o build também funciona em subpastas.
O service worker e o manifesto do PWA são gerados automaticamente.

## Créditos

Projeto original: **iWater**, coordenado e programado por **Victor Capilé**, com projeto
visual de **Igor Baptista, Luiza Provenzano, Pedro Borges e Victor Capilé**, e pesquisa
de conteúdo da equipe listada na página **Sobre**. Apresentado na Comunicar 2013, da
escola Garriga de Menezes.

A versão original continua disponível no histórico do Git deste repositório.
