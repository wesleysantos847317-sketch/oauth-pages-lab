# OAuth Pages Lab

Projeto simples e funcional para autenticação OAuth em páginas estáticas, com login, callback e logout.

## Estrutura mínima

```text
oauth-pages-lab/
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── functions/
│   ├── _shared/
│   │   ├── crypto.js
│   │   ├── cookies.js
│   │   ├── providers.js
│   │   └── oidc.js
│   ├── api/
│   │   ├── health.js
│   │   └── me.js
│   └── oauth/
│       ├── login/
│       │   └── [provider].js
│       ├── callback/
│       │   └── [provider].js
│       └── logout.js
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── public/
```

## Como rodar

1. Abra a pasta no VS Code.
2. No terminal, execute:

```bash
npm install
npm run start
```

3. Para testar também as rotas das funções do projeto no ambiente Cloudflare Pages:

```bash
npm run dev
```

## O que ele faz

- página inicial com botões de login
- chamada para `/api/health`
- leitura do usuário autenticado em `/api/me`
- fluxo de login por provedor
- callback com validação simples
- logout limpando cookies

## Observação

É uma versão didática e enxuta, pensada para cumprir a proposta da avaliação sem arquivos extras desnecessários.
