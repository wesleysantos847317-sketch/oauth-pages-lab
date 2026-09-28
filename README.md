# OAuth Pages Lab

Projeto simples e funcional para autenticação OAuth com GitHub em Cloudflare Pages.

## Estrutura do repositório

```text
oauth-pages-lab/
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── functions/
│   ├── _shared/
│   │   ├── cookies.js
│   │   ├── crypto.js
│   │   └── providers.js
│   ├── api/
│   │   ├── health.js
│   │   └── me.js
│   └── oauth/
│       ├── callback/
│       │   └── [provider].js
│       ├── login/
│       │   └── [provider].js
│       └── logout.js
├── .gitignore
├── package.json
├── README.md
├── wrangler.jsonc
└── package-lock.json
```

## O que cada pasta faz

- public/: interface do usuário e JavaScript do frontend
- functions/: rotas do Cloudflare Pages Functions
- functions/_shared/: utilitários compartilhados
- functions/api/: endpoints de API
- functions/oauth/: fluxo de login, callback e logout

## Como rodar

```bash
npm install
npm run dev
```

Ou em modo estático:

```bash
npm run start
```

## Configuração do GitHub

No painel do Cloudflare Pages, adicione estas variáveis de ambiente:

```bash
GITHUB_CLIENT_ID=seu_client_id
GITHUB_CLIENT_SECRET=seu_secret
APP_URL=https://seu-dominio.pages.dev
```

Callback registrado no GitHub:

```text
https://seu-dominio.pages.dev/oauth/callback/github
```

Sem essas variáveis, o projeto entra em modo demo e funciona localmente.
