# Estante Local

Biblioteca local-first para localizar, organizar, enriquecer e ler arquivos PDF
diretamente no navegador. O projeto foi pensado para oferecer uma experiência de
catálogo visual sem exigir upload dos documentos, conta de usuário ou backend.

## Privacidade por padrão

O Estante Local processa os PDFs no próprio dispositivo. O navegador recebe acesso
somente às pastas escolhidas explicitamente pelo usuário e os documentos não são
enviados para a aplicação, para a Open Library ou para um armazenamento em nuvem.

- O conteúdo binário dos PDFs permanece no dispositivo;
- Nenhum documento é copiado para LocalStorage ou IndexedDB;
- Somente o título normalizado é enviado à Open Library para pesquisar metadados;
- Capas são carregadas diretamente dos servidores da Open Library;
- Nome original, catálogo, correções manuais e preferências ficam no navegador;
- Não existe cadastro, autenticação, backend ou sincronização remota.

Essa abordagem reduz a exposição dos documentos, mas não torna a aplicação
completamente isolada da internet. A Open Library e o provedor de conexão podem
receber dados normais de uma requisição web, incluindo o título pesquisado e o
endereço IP.

## Principais funcionalidades

- Seleção e leitura recursiva de uma ou mais pastas;
- Catálogo exclusivo de arquivos PDF;
- Pesquisa por título, autor, nome do arquivo e caminho relativo;
- Filtros por pasta e disponibilidade de metadados;
- Normalização do nome do arquivo para pesquisa bibliográfica;
- Consulta de título, autores, ano e capa na Open Library;
- Validação das respostas externas com Zod;
- Verificação de similaridade antes de associar um resultado ao PDF;
- Preservação do nome original como fallback;
- Edição manual de título, autores, ano e URL da capa;
- Leitura de PDF dentro da aplicação ou em uma nova aba;
- Adição, substituição, remoção e releitura de pastas;
- Persistência local do catálogo e das preferências;
- Temas claro e escuro com preferência persistida;
- Redirecionamento automático para a biblioteca quando há pastas cadastradas.

## Como funciona

1. O usuário seleciona uma pasta;
2. A aplicação percorre suas subpastas e mantém somente arquivos `.pdf`;
3. O nome de cada arquivo é normalizado apenas para realizar a pesquisa;
4. A Open Library é consultada com até três requisições simultâneas;
5. O resultado só é utilizado quando possui similaridade suficiente com o título
   pesquisado;
6. Os metadados válidos são associados ao identificador local do PDF;
7. Sem resultado confiável, são mantidos o nome e as informações locais;
8. O catálogo é salvo no navegador em formato JSON.

O nome físico do arquivo nunca é renomeado ou modificado.

## Tecnologias

- React;
- TypeScript;
- Zod;
- Tailwind CSS;
- React Router;
- Vite;
- Biome;
- Open Library Search API;
- Open Library Covers API;
- File System Access API;
- LocalStorage e IndexedDB.

## Arquitetura

A lógica da aplicação segue orientação a objetos. Componentes React cuidam da
interface, enquanto entidades, serviços, políticas e repositórios encapsulam as
regras e integrações.

```text
src/
├── application/     # Casos de uso, filtros, temas e serviços de metadados
├── components/      # Componentes, modais, layout e proteção de rotas
├── config/          # Composição das dependências e ambiente
├── domain/          # Entidades e regras centrais da biblioteca
├── infrastructure/  # Navegador, HTTP, LocalStorage e IndexedDB
├── pages/           # Início, biblioteca e leitor
├── styles/          # Tema e estilos globais
├── App.tsx
└── main.tsx
```

As integrações externas são acessadas por abstrações, permitindo substituir o
provedor de metadados ou os mecanismos de armazenamento sem alterar as entidades.

## Persistência

### LocalStorage

Armazena em JSON:

- Pastas cadastradas;
- Identificadores dos PDFs;
- Nomes e caminhos relativos;
- Metadados da Open Library;
- Alterações manuais;
- Preferência de tema.

### IndexedDB

Armazena os identificadores de acesso às pastas quando o navegador oferece suporte
à File System Access API. Isso permite tentar reler os diretórios após recarregar a
página.

O conteúdo binário dos PDFs não é salvo no LocalStorage nem no IndexedDB.

## Requisitos

- Node.js 20.19 ou superior;
- npm;
- Navegador moderno com suporte a JavaScript, IndexedDB e visualização de PDF.

Chrome e Edge oferecem a experiência mais completa por implementarem a File System
Access API. Firefox utiliza o seletor de diretório compatível como fallback.

## Instalação

```bash
git clone git@github.com:Jpmasr3r/estante-local.git
cd estante-local
npm install
npm run dev
```

A aplicação estará disponível, por padrão, em:

```text
http://localhost:5173
```

Existe uma variável de ambiente opcional:

```bash
cp .env.example .env
```

```env
VITE_APP_NAME=Estante Local
```

## Scripts

| Comando             | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Inicia o servidor de desenvolvimento               |
| `npm run build`     | Valida os tipos e gera a versão de produção        |
| `npm run preview`   | Visualiza localmente a versão de produção          |
| `npm run check`     | Verifica formatação, imports e qualidade do código |
| `npm run check:fix` | Corrige automaticamente problemas compatíveis      |
| `npm run format`    | Formata os arquivos com Biome                      |
| `npm run lint`      | Executa somente as regras de lint                  |

## Uso

1. Abra a aplicação em um navegador compatível;
2. Clique em **Selecionar pasta**;
3. Autorize o acesso ao diretório que contém os PDFs;
4. Aguarde a leitura local e a consulta opcional de metadados;
5. Clique na capa de um PDF para abri-lo no leitor;
6. Use **Editar** para corrigir informações bibliográficas;
7. Use **Configurações** para gerenciar outras pastas;
8. Use **Reler pastas** para detectar alterações nos diretórios.

## Limitações conhecidas

### Segurança e restrições do navegador

Aplicações web são executadas dentro da área isolada de segurança do navegador. Por
isso, o Estante Local não possui acesso livre ao sistema de arquivos, mesmo quando
os dados da biblioteca estão persistidos.

- Navegadores não permitem que uma aplicação web exiba o caminho absoluto de uma
  pasta. Somente nomes e caminhos relativos ficam disponíveis;
- Toda pasta precisa ser escolhida ou autorizada explicitamente pelo usuário;
- Permissões podem expirar ou ser revogadas pelo navegador;
- Identificadores guardados no IndexedDB não ignoram permissões nem concedem acesso
  permanente ao diretório;
- Firefox e navegadores sem File System Access API não preservam o acesso à pasta.
  Após recarregar, pode ser necessário selecionar novamente o mesmo diretório;
- A releitura automática depende da permissão e dos identificadores armazenados no
  IndexedDB;
- A File System Access API exige um contexto seguro, normalmente HTTPS ou
  `localhost`;
- LocalStorage não é um cofre criptografado. Ele guarda somente metadados e pode ser
  lido por scripts executados na mesma origem;
- Extensões, políticas corporativas, modo privado e configurações de segurança podem
  bloquear seleção, persistência ou leitura de arquivos;
- Seleção de diretórios pode ser limitada em navegadores móveis;
- Os arquivos não ficam disponíveis quando são movidos, removidos ou renomeados fora
  da aplicação.

### Leitor de PDF

- A renderização utiliza o visualizador nativo do navegador;
- Aparência, controles e compatibilidade variam entre navegadores;
- PDFs protegidos por senha, corrompidos ou com recursos não suportados podem não
  abrir corretamente;
- O projeto não possui anotações, marcações ou sincronização de progresso.

### Metadados e capas

- A Open Library depende de conexão com a internet;
- Algumas obras não possuem resultados, autores, ano ou capa;
- Nomes de arquivos incompletos podem gerar resultados ausentes ou incorretos;
- A comparação reduz associações incorretas, mas não garante precisão absoluta;
- A API pode aplicar limites de uso, ficar indisponível ou alterar respostas;
- Capas externas podem falhar, ser removidas ou bloquear carregamento;
- Correções manuais substituem os dados apresentados, mas não alteram o PDF.

### Persistência

- Dados ficam vinculados ao navegador e à origem usada para acessar a aplicação;
- Limpar os dados do site remove catálogo, tema e permissões salvas;
- LocalStorage não sincroniza informações entre dispositivos ou navegadores;
- Modo privado e políticas corporativas podem bloquear armazenamento local;
- Não existe backup automático ou conta de usuário.

### Escopo

- Somente PDF é suportado;
- Não existe backend, autenticação ou sincronização em nuvem;
- A aplicação não altera, move, exclui ou renomeia arquivos no dispositivo;
- Não há extração interna de ISBN ou metadados incorporados ao PDF;
- Não há descrição bibliográfica ou página separada de detalhes; a modal de edição
  concentra essas informações.
