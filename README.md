# Estante Local

Aplicação web 100% front-end para organizar e visualizar livros digitais
armazenados no dispositivo do usuário.

## Tecnologias

- React
- TypeScript
- Zod
- Tailwind CSS
- Vite
- Biome
- Open Library API

## Como executar

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: inicia o ambiente de desenvolvimento.
- `npm run build`: valida os tipos e gera a versão de produção.
- `npm run check`: verifica formatação e qualidade do código com Biome.
- `npm run check:fix`: corrige automaticamente os problemas encontrados.
- `npm run format`: formata o projeto com Biome.
- `npm run lint`: executa apenas a análise estática do código.
- `npm run preview`: visualiza localmente a versão de produção.

## Estrutura inicial

```text
src/
├── components/  # Componentes reutilizáveis
├── config/      # Configurações e validações globais
├── pages/       # Páginas da aplicação
├── styles/      # Estilos globais
├── App.tsx
└── main.tsx
```

O processamento dos arquivos será realizado localmente. Nenhum back-end faz parte
do escopo do projeto. Apenas os metadados da biblioteca são persistidos no
`localStorage` em formato JSON. As permissões das pastas são mantidas no IndexedDB
para permitir a releitura. O conteúdo dos livros nunca é armazenado ou enviado.
Somente títulos normalizados são enviados à Open Library para consultar metadados e
capas. O nome original de cada arquivo é preservado como fallback.
