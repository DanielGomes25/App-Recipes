# App Recipes

Aplicação web em React para busca, visualização e acompanhamento de receitas de comidas e bebidas.

Este documento descreve o projeto de forma completa no nível de arquitetura e fluxo (incluindo estilização e testes), sem entrar em explicação função por função.

## 1. Objetivo do projeto

O App Recipes permite que a pessoa usuária:

- faça login e acesse o catálogo de receitas;
- navegue entre receitas de `Meals` e `Drinks`;
- filtre por categorias e pesquise por ingrediente, nome ou primeira letra;
- veja detalhes da receita (ingredientes, instruções, imagem);
- marque receitas como favoritas;
- acompanhe preparo em andamento com checklist de ingredientes;
- finalize receitas e consulte histórico em `Done Recipes`.

## 2. Stack e bibliotecas

- `React 18`
- `react-router-dom 5`
- `Context API` para estado compartilhado
- `CSS global + CSS Modules`
- `Jest + Testing Library` para testes unitários/integrados
- `Cypress` configurado no projeto (sem specs E2E versionadas atualmente)
- Utilitários: `clipboard-copy`, `sweetalert2`, `bootstrap/react-bootstrap`

## 3. Como executar

Pré-requisitos:

- Node.js `>= 14`

Instalação e execução:

```bash
npm install
npm start
```

A aplicação sobe em `http://localhost:3000`.

## 4. Scripts disponíveis

- `npm start`: ambiente de desenvolvimento
- `npm run build`: build de produção
- `npm test`: testes com Jest
- `npm run test-coverage`: cobertura de testes
- `npm run lint`: lint de JavaScript
- `npm run lint:styles`: lint de CSS
- `npm run cy` e `npm run cy:open`: execução do Cypress

## 5. Estrutura de pastas

```text
src/
  components/       # Componentes visuais e blocos de funcionalidade
  context/          # Contexto global (Provider + Context)
  hooks/            # Hook customizado (persistência em localStorage)
  images/           # Ícones e imagens do app
  pages/            # Páginas de rota
  services/         # APIs, mocks e utilitários de teste
  styles/           # CSS global e módulos CSS de páginas
  tests/            # Testes da aplicação
  App.js            # Mapeamento principal de rotas
  App.css           # Estilos globais/base
  index.js          # Entrada da aplicação
```

## 6. Arquitetura da aplicação

### 6.1 Entrada e composição

- `src/index.js` monta a árvore principal:
  - `Provider` (estado global)
  - `BrowserRouter` (roteamento)
  - `App` (rotas)
- `serviceWorker` está configurado e permanece com `unregister()` no boot.

### 6.2 Roteamento (`src/App.js`)

Rotas principais:

- `/` -> `Login`
- `/meals` -> catálogo de comidas
- `/drinks` -> catálogo de bebidas
- `/meals/:id` e `/drinks/:id` -> detalhes da receita
- `/meals/:id/in-progress` e `/drinks/:id/in-progress` -> preparo em andamento
- `/profile` -> perfil
- `/done-recipes` -> receitas finalizadas
- `/favorite-recipes` -> receitas favoritas

### 6.3 Estado global (`Context API`)

`Provider` compartilha os estados:

- `titleHeader`: título da página no topo
- `loadingSearch`: habilita/desabilita botão de busca no header
- `textSearch`: texto digitado na busca
- `recipesSearch`: coleção auxiliar de busca
- `recipesData`: lista principal de cards exibidos em `Meals/Drinks`

### 6.4 Camada de dados (`src/services/APIsFetch.js`)

A aplicação consome duas APIs públicas:

- `TheMealDB`
- `TheCocktailDB`

Principais operações:

- busca por ingrediente, nome e primeira letra;
- busca por ID (detalhes);
- listagem de categorias;
- filtro por categoria.

Observação importante de comportamento atual:

- em `Drinks`, a função `allDrinks()` usa endpoint `random.php`, então a listagem inicial depende de receita aleatória retornada pela API.

## 7. Fluxos funcionais

### 7.1 Login

- Captura `email` e `password`.
- Habilita o botão com validação básica.
- Salva em `localStorage` a chave `user` com `{ email }`.
- Redireciona para `/meals`.

### 7.2 Listagem, filtro e busca

- Páginas `Meals` e `Drinks` definem contexto do header e renderizam:
  - `Header`
  - `Recipes`
  - `Footer`
- `Recipes`:
  - carrega lista inicial;
  - carrega até 5 categorias;
  - aplica filtro por categoria;
  - renderiza cards com links para detalhes.
- `SearchBar`:
  - escolhe tipo de busca por rádio (`ingredient`, `name`, `first-letter`);
  - chama API conforme a página atual;
  - trata casos de erro/sem resultado;
  - quando retorno tem 1 item, redireciona direto para detalhes.

### 7.3 Detalhes da receita

`RecipeDetails`:

- identifica se é `meal` ou `drink` pela rota;
- busca receita por ID;
- monta lista de ingredientes + medidas;
- permite copiar link;
- permite favoritar/desfavoritar;
- botão `Start Recipe` abre fluxo `in-progress`.

### 7.4 Receita em andamento

`RecipeInProgress`:

- busca dados da receita pela rota;
- exibe checklist de ingredientes;
- persiste progresso no `localStorage` por tipo (`meals`/`drinks`);
- habilita `Finalizar Receita` quando todos ingredientes estão marcados;
- ao finalizar, adiciona item em `doneRecipes` e redireciona.

### 7.5 Favoritas e concluídas

- `FavoriteRecipes`:
  - lê `favoriteRecipes` do `localStorage`;
  - filtra por `All`, `Meals` e `Drinks`;
  - compartilha link;
  - remove item dos favoritos.
- `DoneRecipes`:
  - lê `doneRecipes`;
  - filtra por tipo;
  - compartilha link;
  - mostra data de conclusão e tags.

### 7.6 Perfil

`Profile`:

- exibe email salvo;
- navega para `Done Recipes` e `Favorite Recipes`;
- botão `Logout` limpa `localStorage` e retorna para `/`.

## 8. Persistência em localStorage

Chaves utilizadas no projeto:

- `user`: dados do login
- `favoriteRecipes`: lista de receitas favoritas
- `doneRecipes`: lista de receitas finalizadas
- `meals`: progresso de checklist por ID de refeição
- `drinks`: progresso de checklist por ID de bebida

Hook de apoio:

- `src/hooks/useLocalStorage.js` encapsula leitura/escrita sincronizada com estado React.

## 9. Estilização

A estilização está dividida em duas camadas:

- Base global:
  - `src/styles/tokens.css` com design tokens (cores, tipografia, espaçamento, sombras)
  - `src/App.css` com reset leve, layout base e estilos globais
- Módulos por componente/página:
  - `Header.module.css`
  - `RecipeDetails.module.css`
  - `RecipeInProgress.module.css`
  - `DoneRecipes.module.css`
  - `FavoritesRecipes.module.css`
  - `styles/Recipes.css` (cards e filtros da listagem)

Padrão visual adotado:

- layout responsivo com foco mobile;
- cards com borda/sombra suaves;
- uso consistente de variáveis CSS para manter identidade visual.

## 10. Testes

A suíte de testes está em `src/tests` e cobre os fluxos principais:

- `Login.test.js`
- `Header.test.js`
- `Footer.test.js`
- `SearchBar.test.js`
- `Profile.test.js`
- `DoneRecipes.test.js`
- `FavoriteRecipes.test.js`
- `RecipeInProgress.test.js`
- `RecipeDetails.test.js`

Infra de testes:

- `renderWithRouter` para renderizar componentes com histórico de navegação;
- mocks de API e dados em `src/services/Mocks.js` e `src/services/MockLocalStorageDone.js`;
- `setupTests.js` com `@testing-library/jest-dom`.

## 11. Qualidade de código

- ESLint configurado com `@trybe/eslint-config-frontend`.
- Stylelint configurado em `.stylelintrc.json`.
- Scripts dedicados para lint de JS e CSS.

## 12. Resumo técnico

O App Recipes é organizado por responsabilidade (páginas, componentes, serviços, estado global e testes), com persistência local no navegador e consumo de APIs públicas de receitas. A estrutura atual facilita manutenção incremental e evolução por fluxo de tela.
