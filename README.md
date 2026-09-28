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

## Configuração para Cloudflare Pages

Para usar o login real do GitHub em produção, defina estas variáveis de ambiente no painel do Cloudflare Pages:

```bash
GITHUB_CLIENT_ID=seu_client_id_do_github
GITHUB_CLIENT_SECRET=seu_client_secret_do_github
APP_URL=https://seu-dominio.pages.dev
```

No GitHub, crie um OAuth App com este callback:

```text
https://seu-dominio.pages.dev/oauth/callback/github
```

Se quiser testar em localhost, o projeto também usa valores demo automaticamente quando as variáveis não estiverem configuradas.

## Observação

Este projeto já está pronto para ser hospedado em Cloudflare Pages e para trocar facilmente as credenciais reais do provedor sem mexer na interface web.
